import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcryptjs';

validator.isEmail('foo@bar.com'); //=> true

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Enter the name'],
  },
  email: {
    type: String,
    required: [true, 'Please Enter the email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please Enter the Valid Email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please Enter the Confirm Password'],
    validate: {
      // This only works on Create And Save!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Confirm Password does not match Entered Password',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre('save', async function (next) {
  // Run this function only when the Password is modified
  if (!this.isModified('password')) return next();

  //Hashing will be done using bcrypt:
  //cost parameter: It is somethong like how much CPU intensive encryption should be.
  //
  this.password = await bcrypt.hash(this.password, 12);
  //Delete the password confirm field.
  //We dont need to Persist data even if it is required
  //instead we just want data to be inputed.
  this.passwordConfirm = undefined;
  next();
});

//Show only those which has active $ne: false
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// Defines an instance method available on all documents created from this schema.
// This method compares a provided password with the stored hashed password.
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//JWTTimestamp is the time token was issued
//changedTimestamp is the time at token was changed.
//JWTTimestamp comes from decode.iat
//changedTimestamp comes from Schema (current document)
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    // console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
export default User;
