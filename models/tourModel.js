import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import slugify from 'slugify';
// import User from './userModel.js';

// eslint-disable-next-line import/no-extraneous-dependencies
// import validator from 'validator';

// validator.isAlpha('foo@bar.com'); //=> true

//Validators:
//Required is validator for all the type
// unique is not validator
//String: maxlength and minlength

//Defining the Schema for model
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour must have >=40 chracters'],
      minlength: [10, 'A tour must have <=10 chracters'],
      // validate: [validator.isAlpha, 'Tour name must only contains characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be either easy,medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0!'],
      max: [5, 'Rating must be below 5.0!'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a Price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //"this" keyword only  to the NEW document creation (will not work for update)
          return val < this.price;
        },
        message: 'Entered discount is greater than base  ({Value})',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, //This will not be shown in the output
    },
    startDates: [Date],
    secreteTour: {
      type: Boolean,
      default: false,
      select: false, //This will not be shown in the output
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true }, //This will include virtual properties in the output
    toObject: { virtuals: true }, //This will include virtual properties in the output
  },
);

//Indexing
// tourSchema.index({ price: 1 }); //1 -> Ascending order and -1 -> Descending order
tourSchema.index({ price: 1, ratingsAverage: -1 }); // Copound Index.
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

//Virtual properties are not stored in the database, but can be used to calculate values on the fly.
tourSchema.virtual('durationWeeks').get(function () {
  //We used regular function here because we need 'this' keyword to refer to the current document.
  //Arrow functions do not have 'this' context.
  //'this' refers to the current document in the context of mongoose.
  return this.duration / 7;
});

//Virtual Populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// This middleware is used to perform some operations before saving the document to the database.
// Will not run for insertMany, updateOne and deleteOne operations.

tourSchema.pre('save', function (next) {
  // 'this' refers to the current document being
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Embedding user in tours Document using pre middleware
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
// });

// tourSchema.pre('save', function (next) {
//   // 'this' refers to the current document being
//   console.log("Will save document...");
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   //This middleware runs after the document is saved to the database.
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE: runs before .find(), .findOne(), .findById() etc.

tourSchema.pre(/^find/, function (next) {
  // All the string starts with find. /^find/ - it is reguler expression.
  // tourSchema.pre('find', function (next) {

  this.find({ secreteTour: { $ne: true } }); //This will not return the secrete tours
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  // eslint-disable-next-line prefer-template
  console.log('Query took ' + (Date.now() - this.start) + ' milliseconds!');
  // console.log(docs);
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});

//AGGREGATION MIDDLEWARE:

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secreteTour: { $ne: true } } });
  next();
});

//Creating Model, Variable name is in capital to distinguish it is schema.
const Tour = mongoose.model('Tour', tourSchema);
export default Tour;
