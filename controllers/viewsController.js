const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverviews = catchAsync(async (req, res) => {
  // 1) get tour data From the Collection
  const tours = await Tour.find();

  // 2) Build Template

  // 3) Render that template using tour data from (1)

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

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

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'log into your account',
  });
};
