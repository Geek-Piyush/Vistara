import express from 'express';
import * as userController from '../controllers/userController.js';
import { protect, restrictTo } from '../controllers/authController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//router is kind of mini application hence we can use the middleware using .use() method
// And this will be executed first in the applicatoin, protecting all the routes below
router.use(protect);

router.patch('/updateMyPassword', authController.updatePassword);

router.get(
  '/me',

  userController.getMe,
  userController.getUser,
);

router.patch(
  '/updateMyDetail',

  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);

router.delete(
  '/deleteMyProfile',

  userController.deleteMe,
);

router.use(restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
