/* eslint-disable import/no-useless-path-segments */
/* eslint-disable import/extensions */

import multer from 'multer';
import sharp from 'sharp';
import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import * as factory from './handlerFactory.js';
// import APIFeatures from './../utils/apiFeatures.js';

// Multer Configuration:
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

export const uploadTourImages = upload.fields([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 3,
  },
]);

// upload.single()  -> for Single
// upload.array(`images`, 5); -> single fields and multiple images

export const resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  // Generate a unique tour ID for new tours (use timestamp as fallback)
  const tourId = req.params.id || `new-${Date.now()}`;

  // 1. Image Cover:
  if (req.files.imageCover) {
    req.body.imageCover = `tour-${tourId}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${req.body.imageCover}`);
  }

  // 2. Images
  if (req.files.images) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `tour-${tourId}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(req.files.images[i].buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/tours/${filename}`);

        req.body.images.push(filename);
      }),
    );
  }

  // Parse startLocation if it's a JSON string
  if (req.body.startLocation && typeof req.body.startLocation === 'string') {
    try {
      req.body.startLocation = JSON.parse(req.body.startLocation);
    } catch (err) {
      // Leave as is if parsing fails
    }
  }

  // Parse startDates if it's a string
  if (req.body.startDates && typeof req.body.startDates === 'string') {
    req.body.startDates = [req.body.startDates];
  }

  next();
});

// Middleware to alias top tours
export const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,difficulty';
  next();
};

// Handlers:
export const getAllTours = factory.getAll(Tour);
export const getTour = factory.getOne(Tour, { path: 'reviews' });
export const createTour = factory.createOne(Tour);
export const updateTour = factory.updateOne(Tour);
export const deleteTour = factory.deleteOne(Tour);

export const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: null, -all documents in one group
        _id: '$difficulty', //- group by difficulty
        // _id: '$ratingsAverage',
        numRatings: { $sum: '$ratingsQuantity' },
        numTours: { $sum: 1 },
        averageRating: { $avg: '$ratingsAverage' },
        averagePrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { averagePrice: 1 }, // 1 for ascending, -1 for descending
    },
    // {
    //   $match: { _id: { $ne: 'easy' } }, // Exclude tours with average rating of 4.5
    // },
  ]);

  res.status(200).json({
    status: 'Success',
    data: {
      stats,
    },
  });
});

export const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          $month: '$startDates', // Group by month
        },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id', // Add a new field 'month' with the value of '_id'
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 }, // Sort by number of tour starts in descending order
    },
    {
      $limit: 12, //Limit to 12 months
    },
  ]);
  res.status(200).json({
    status: 'Success',
    result: plan.length,
    data: {
      plan,
    },
  });
});

// Route: /tours-within/:distance/center/:latlng/unit/:unit
export const getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please Provide latitude and longitude in the format lat,lng',
        400,
      ),
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

export const getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please Provide latitude and longitude in the format lat,lng',
        400,
      ),
    );
  }

  const distances = await Tour.collection
    .aggregate([
      {
        // For geoSpatial Data $geoNear should be the first stage in the pipeline
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [lng * 1, lat * 1],
          },
          distanceField: 'distance',
          distanceMultiplier: multiplier,
        },
      },
      {
        $project: {
          distance: 1,
          name: 1,
        },
      },
    ])
    .toArray();

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});
