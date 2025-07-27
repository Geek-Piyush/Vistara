/* eslint-disable import/no-useless-path-segments */
/* eslint-disable import/extensions */
import multer from 'multer';
import sharp from 'sharp';
import User from './../models/userModel.js';
import AppError from './../utils/appError.js';
import catchAsync from './../utils/catchAsync.js';
import * as factory from './handlerFactory.js';

// Multer Configuration:

// To store the image in disk
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only image', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single('photo');

// Configuring more multer
export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFeilds) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFeilds.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// exports.getAllUsers = catchAsync(async (req, res) => {
//   const users = await User.find();

//   res.status(200).json({
//     status: 'success',
//     result: users.length,
//     data: { users },
//   });
// });

export const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Route is not defined and please use signup instead',
  });
};

export const getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create an Error if user post password data.
  console.log(req.file);
  console.log(req.body);
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This Route is not for password update. Please use /updatePassword',
        400,
      ),
    );
  }
  // 2) If not then filter out not allowed feilds
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) update the user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidator: true,
  });

  res.status(200).json({
    status: 'success',
    user: updatedUser,
  });
});

//We Are technically not deleting user we are just not showing them in find method
//It is done by query middleware

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// exports.getUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This Route is not defined yet',
//   });
// };

// exports.updateUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This Route is not defined yet',
//   });
// };

// exports.deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This Route is not defined yet',
//   });
// };

export const getAllUsers = factory.getAll(User);
export const getUser = factory.getOne(User);
//Don't Update the password using this.
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);
