/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-useless-path-segments */
import { promisify } from 'util';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Email from '../utils/email.js';

// Function to generate a signed JWT token
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
// Cookie options for sending JWT in a cookie
const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000,
  ),

  httpOnly: true,
  sameSite: 'Lax',
  secure: false,
};

// Use secure cookies in production
if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

// Function to create and send token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, cookieOptions);

  // Only removing password from the output object, not the DB
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// Signup Controller
export const signup = catchAsync(async (req, res, next) => {
  // Safer way of accepting input fields explicitly
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  // Determine redirect URL based on environment
  let url;
  if (process.env.NODE_ENV === 'development') {
    url = `${req.protocol}://localhost:${process.env.PORT || 3000}/me`;
  } else {
    url = `${req.protocol}://${req.get('host')}/me`;
  }

  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

// Login Controller
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Validate input
  if (!email || !password) {
    console.warn('[login] Email or password not provided');
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check user and password
  const user = await User.findOne({ email }).select('+password');
  if (!user) console.warn('[login] No user found for email:', email);

  const passwordCorrect =
    user && (await user.correctPassword(password, user.password));
  if (!user || !passwordCorrect) {
    console.warn(
      '[login] Incorrect email or password attempt for email:',
      email,
    );
    return next(new AppError('Incorrect email or password', 401));
  }

  console.log('[login] User authenticated successfully:', user.email);

  // 3) Send token
  createSendToken(user, 200, res);
});

// Logout Controller
export const logout = catchAsync(async (req, res, next) => {
  console.log('[logout] Logging out user');
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    sameSite: 'Lax',
    secure: false,
  });

  res.status(200).json({ status: 'success' });
});

// Protect middleware for route guarding
export const protect = catchAsync(async (req, res, next) => {
  let token;

  console.log('[protect] Checking for token in header or cookie');

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    console.log('[protect] Token found in header');
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
    console.log('[protect] Token found in cookies');
  }

  if (!token) {
    console.warn('[protect] No token found');
    return next(new AppError('You are not logged in. Please login', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log('[protect] Decoded JWT payload:', decoded);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    console.warn('[protect] No user found for decoded token ID');
    return next(
      new AppError('The user belonging to this token no longer exists.', 401),
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    console.warn('[protect] Password was changed after token was issued');
    return next(
      new AppError('User recently changed password. Please log in again.', 401),
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// Restrict routes to specific user roles
export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    console.log('[restrictTo] Allowed roles:', roles);
    if (!roles.includes(req.user.role)) {
      console.warn('[restrictTo] Access denied for role:', req.user.role);
      return next(
        new AppError('You do not have permission perform this action', 403),
      );
    }
    next();
  };

// Forgot Password Controller
export const forgotPassword = catchAsync(async (req, res, next) => {
  console.log(
    '[forgotPassword] Password reset requested for email:',
    req.body.email,
  );

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    console.warn('[forgotPassword] No user found with email:', req.body.email);
    return next(
      new AppError('No user to be found with provided email address!'),
    );
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/users/resetPassword/${resetToken}`;
    console.log('[forgotPassword] Sending reset URL:', resetURL);

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'Success',
      message: 'Token sent to email',
    });
  } catch (err) {
    console.error('[forgotPassword] Error sending reset email:', err);

    user.createPasswordResetToken = undefined;
    user.createPasswordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        `There was an error sending the email. Try again later!. Error : ${err}`,
        500,
      ),
    );
  }
});

// Reset Password Controller
export const resetPassword = catchAsync(async (req, res, next) => {
  console.log('[resetPassword] Token received:', req.params.token);

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    console.warn('[resetPassword] Token expired or invalid');
    return next(new AppError('Token has expired or invalid', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  console.log('[resetPassword] Password reset successful for:', user.email);

  createSendToken(user, 200, res);
});

// Update Password Controller
export const updatePassword = catchAsync(async (req, res, next) => {
  console.log('[updatePassword] Updating password for user:', req.user.id);

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    console.warn('[updatePassword] Current password incorrect');
    return next(new AppError('Your current password is wrong', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  console.log('[updatePassword] Password updated successfully');

  createSendToken(user, 200, res);
});

// Middleware to check if user is logged in (for rendered views)
export const isLoggedIn = async (req, res, next) => {
  if (!req.cookies.jwt) {
    console.log('[isLoggedIn] No JWT cookie found');
    return next();
  }

  try {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET,
    );
    console.log('[isLoggedIn] JWT decoded:', decoded);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      console.warn('[isLoggedIn] No user found from decoded token');
      return next();
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      console.warn('[isLoggedIn] Password changed after token issued');
      return next();
    }

    res.locals.user = currentUser;
    console.log('[isLoggedIn] User is logged in:', currentUser.email);
  } catch (err) {
    console.error('[isLoggedIn] JWT error:', err.message);
    return next();
  }

  next();
};
