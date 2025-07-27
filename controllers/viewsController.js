import Booking from '../models/bookingModel.js';
import Tour from '../models/tourModel.js';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getOverviews = catchAsync(async (req, res) => {
  // 1) get tour data From the Collection
  const tours = await Tour.find();

  // 2) Build Template

  // 3) Render that template using tour data from (1)

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

export const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    next(new AppError(`No tour found with that name`, 404));
  }

  try {
    res.status(200).render('tour', {
      title: `${tour.name} tour`,
      tour,
    });
  } catch (err) {
    console.error('❌ Error rendering overview.pug:', err.message);
    return next(new AppError('Error rendering overview page', 500));
  }
});

export const getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'log into your account',
  });
};

export const getSignUpForm = (req, res) => {
  res.status(200).render('signup', {
    title: `Create New Account`,
  });
};

export const getAccounts = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account',
    user: res.locals.user,
  });
};

export const getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  // $in operator to find all tours with IDs in tourIDs
  // $in is used to match any of the values in the array

  const tours = await Tour.find({ _id: { $in: tourIDs } });

  // 3) Render template with that data
  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

export const updateUserData = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).render('account', {
    title: 'log into your account',
    user: updatedUser,
  });
});
