import express from 'express';
import * as applicationController from '../controllers/applicationController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Public routes - submit applications
router.post(
  '/guide-applications',
  applicationController.uploadResume,
  applicationController.saveResume,
  applicationController.createGuideApplication,
);

router.post(
  '/job-applications',
  applicationController.uploadResume,
  applicationController.saveResume,
  applicationController.createJobApplication,
);

// Protected admin routes
router.use(authController.protect, authController.restrictTo('admin'));

router.get(
  '/guide-applications',
  applicationController.getAllGuideApplications,
);
router
  .route('/guide-applications/:id')
  .get(applicationController.getGuideApplication)
  .patch(applicationController.updateGuideApplication)
  .delete(applicationController.deleteGuideApplication);

router.get('/job-applications', applicationController.getAllJobApplications);
router
  .route('/job-applications/:id')
  .get(applicationController.getJobApplication)
  .patch(applicationController.updateJobApplication)
  .delete(applicationController.deleteJobApplication);

export default router;
