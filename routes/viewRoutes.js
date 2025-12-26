import express from 'express';
import * as viewController from '../controllers/viewsController.js';
import {
  protect,
  isLoggedIn,
  restrictTo,
} from '../controllers/authController.js';
import * as bookingController from '../controllers/bookingController.js';
import * as tourController from '../controllers/tourController.js';

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  isLoggedIn,
  viewController.getOverviews,
);
router.get('/signup', isLoggedIn, viewController.getSignUpForm);
router.get('/tour/:slug', isLoggedIn, viewController.getTour);
router.get('/login', isLoggedIn, viewController.getLoginForm);
router.get(
  '/forgot-password',
  isLoggedIn,
  viewController.getForgotPasswordForm,
);
router.get(
  '/reset-password/:token',
  isLoggedIn,
  viewController.getResetPasswordForm,
);

// Protected routes
router.get('/me', protect, viewController.getAccounts);
router.get('/my-tours', protect, viewController.getMyTours);
router.get('/my-reviews', protect, viewController.getMyReviews);
router.post('/submit-user-data', protect, viewController.updateUserData);

// Admin routes
router.get(
  '/manage-tours',
  protect,
  restrictTo('admin'),
  viewController.getManageTours,
);
router.get(
  '/create-tour',
  protect,
  restrictTo('admin'),
  viewController.getCreateTour,
);
router.get(
  '/edit-tour/:tourId',
  protect,
  restrictTo('admin'),
  viewController.getEditTour,
);
router.get(
  '/manage-users',
  protect,
  restrictTo('admin'),
  viewController.getManageUsers,
);
router.get(
  '/edit-user/:userId',
  protect,
  restrictTo('admin'),
  viewController.getEditUser,
);
router.get(
  '/manage-reviews',
  protect,
  restrictTo('admin'),
  viewController.getManageReviews,
);
router.get(
  '/manage-bookings',
  protect,
  restrictTo('admin'),
  viewController.getManageBookings,
);
router.get(
  '/manage-guide-applications',
  protect,
  restrictTo('admin'),
  viewController.getManageGuideApplications,
);

// Public pages
router.get('/about', isLoggedIn, viewController.getAbout);
router.get('/privacy', isLoggedIn, viewController.getPrivacy);
router.get('/contact', isLoggedIn, viewController.getContact);
router.get('/become-guide', isLoggedIn, viewController.getBecomeGuide);
router.get('/careers', isLoggedIn, viewController.getCareers);

export default router;
