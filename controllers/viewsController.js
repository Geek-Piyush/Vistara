import Booking from '../models/bookingModel.js';
import Tour from '../models/tourModel.js';
import User from '../models/userModel.js';
import Review from '../models/reviewModel.js';
import GuideApplication from '../models/guideApplicationModel.js';
import JobApplication from '../models/jobApplicationModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getOverviews = catchAsync(async (req, res) => {
  // Build query with search support
  let query = {};

  // Search by name
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' };
  }

  // Filter by difficulty
  if (req.query.difficulty) {
    query.difficulty = req.query.difficulty;
  }

  // Filter by price range
  if (req.query.maxPrice) {
    query.price = { $lte: parseInt(req.query.maxPrice) };
  }

  // Build sort option
  let sortOption = '-ratingsAverage'; // Default sort
  if (req.query.sort) {
    sortOption = req.query.sort;
  }

  const tours = await Tour.find(query).sort(sortOption);

  res.status(200).render('overview', {
    title: req.query.search ? `Search: ${req.query.search}` : 'All Tours',
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

// Forgot Password Page
export const getForgotPasswordForm = (req, res) => {
  res.status(200).render('forgotPassword', {
    title: 'Forgot Password',
  });
};

// Reset Password Page
export const getResetPasswordForm = (req, res) => {
  res.status(200).render('resetPassword', {
    title: 'Reset Password',
    token: req.params.token,
  });
};

// My Reviews Page
export const getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id }).populate({
    path: 'tour',
    select: 'name imageCover slug',
  });

  res.status(200).render('myReviews', {
    title: 'My Reviews',
    reviews,
  });
});

// Admin: Manage Tours
export const getManageTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('manageTours', {
    title: 'Manage Tours',
    tours,
  });
});

// Admin: Manage Users
export const getManageUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).render('manageUsers', {
    title: 'Manage Users',
    users,
  });
});

// Admin: Manage Reviews
export const getManageReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find().populate([
    { path: 'user', select: 'name photo' },
    { path: 'tour', select: 'name' },
  ]);

  // Filter out reviews with null user (deleted users)
  const validReviews = reviews.filter((review) => review.user !== null);

  res.status(200).render('manageReviews', {
    title: 'Manage Reviews',
    reviews: validReviews,
  });
});

// Admin: Manage Bookings
export const getManageBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find().populate([
    { path: 'user', select: 'name photo' },
    { path: 'tour', select: 'name' },
  ]);

  // Filter out bookings with null user or tour
  const validBookings = bookings.filter(
    (booking) => booking.user !== null && booking.tour !== null,
  );

  res.status(200).render('manageBookings', {
    title: 'Manage Bookings',
    bookings: validBookings,
  });
});

// Admin: Create Tour Page
export const getCreateTour = (req, res) => {
  res.status(200).render('createTour', {
    title: 'Create New Tour',
  });
};

// Admin: Edit Tour Page
export const getEditTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).render('editTour', {
    title: `Edit ${tour.name}`,
    tour,
  });
});

// Admin: Edit User Page
export const getEditUser = catchAsync(async (req, res, next) => {
  const editUser = await User.findById(req.params.userId).select('+active');

  if (!editUser) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).render('editUser', {
    title: `Edit ${editUser.name}`,
    editUser,
  });
});

// Generic Pages
export const getAbout = (req, res) => {
  res.status(200).render('about', {
    title: 'About Us',
  });
};

export const getPrivacy = (req, res) => {
  res.status(200).render('privacy', {
    title: 'Privacy Policy',
  });
};

export const getContact = (req, res) => {
  res.status(200).render('contact', {
    title: 'Contact Us',
  });
};

export const getBecomeGuide = (req, res) => {
  res.status(200).render('become-guide', {
    title: 'Become a Guide',
  });
};

export const getCareers = (req, res) => {
  res.status(200).render('careers', {
    title: 'Careers',
  });
};

// Admin: Manage Guide Applications
export const getManageGuideApplications = catchAsync(async (req, res, next) => {
  const applications = await GuideApplication.find().sort('-appliedAt');

  res.status(200).render('manageGuideApplications', {
    title: 'Manage Guide Applications',
    applications,
  });
});

// Admin: Manage Job Applications
export const getManageJobApplications = catchAsync(async (req, res, next) => {
  const applications = await JobApplication.find().sort('-appliedAt');

  res.status(200).render('manageJobApplications', {
    title: 'Manage Job Applications',
    applications,
  });
});
