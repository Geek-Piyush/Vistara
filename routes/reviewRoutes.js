import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(restrictTo('admin', 'user'), reviewController.updateReview)
  .delete(restrictTo('admin', 'user'), reviewController.deleteReview);

export default router;
