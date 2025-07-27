import express from 'express';
import * as viewController from '../controllers/viewsController.js';
import { protect, isLoggedIn } from '../controllers/authController.js';
import * as bookingController from '../controllers/bookingController.js';

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
router.get('/me', protect, viewController.getAccounts);
router.get('/my-tours', protect, viewController.getMyTours);
router.post('/submit-user-data', protect, viewController.updateUserData);
export default router;
