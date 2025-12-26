import mongoose from 'mongoose';

const guideApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
  },
  experience: {
    type: Number,
    required: [true, 'Please provide years of experience'],
    min: 0,
  },
  languages: {
    type: String,
    required: [true, 'Please list languages you speak'],
  },
  specialization: {
    type: String,
    required: [true, 'Please provide your area of specialization'],
  },
  resume: {
    type: String,
    required: [true, 'Please upload your resume'],
  },
  coverLetter: {
    type: String,
    required: [true, 'Please provide a cover letter'],
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
  },
});

const GuideApplication = mongoose.model(
  'GuideApplication',
  guideApplicationSchema,
);

export default GuideApplication;
