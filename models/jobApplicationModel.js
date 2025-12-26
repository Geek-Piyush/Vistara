import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  position: {
    type: String,
    required: [true, 'Please specify the position you are applying for'],
    enum: [
      'tour-guide',
      'developer',
      'tester',
      'admin-staff',
      'crm-specialist',
      'marketing',
      'operations',
    ],
  },
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
  education: {
    type: String,
    required: [true, 'Please provide your education background'],
  },
  resume: {
    type: String,
    required: [true, 'Please upload your resume'],
  },
  coverLetter: {
    type: String,
    required: [true, 'Please provide a cover letter'],
  },
  portfolio: {
    type: String, // Optional portfolio link
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
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

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;
