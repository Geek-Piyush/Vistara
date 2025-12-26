import multer from 'multer';
import fs from 'fs/promises';
import GuideApplication from '../models/guideApplicationModel.js';
import JobApplication from '../models/jobApplicationModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import * as factory from './handlerFactory.js';

// Multer configuration for resume uploads
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  // Accept PDF and Word documents
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    cb(null, true);
  } else {
    cb(
      new AppError('Please upload only PDF or Word documents for resume.', 400),
      false,
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export const uploadResume = upload.single('resume');

// Save resume to disk
export const saveResume = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const timestamp = Date.now();
  const fileExtension =
    req.file.mimetype === 'application/pdf' ? 'pdf' : 'docx';
  const filename = `resume-${timestamp}.${fileExtension}`;

  // Save to public/resumes directory
  await fs.mkdir('public/resumes', { recursive: true });
  await fs.writeFile(`public/resumes/${filename}`, req.file.buffer);

  req.body.resume = filename;
  next();
});

// Guide Application Controllers
export const createGuideApplication = catchAsync(async (req, res, next) => {
  const application = await GuideApplication.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    experience: req.body.experience,
    languages: req.body.languages,
    specialization: req.body.specialization,
    resume: req.body.resume,
    coverLetter: req.body.coverLetter,
  });

  res.status(201).json({
    status: 'success',
    data: {
      application,
    },
  });
});

export const getAllGuideApplications = factory.getAll(GuideApplication);
export const getGuideApplication = factory.getOne(GuideApplication);
export const updateGuideApplication = factory.updateOne(GuideApplication);
export const deleteGuideApplication = factory.deleteOne(GuideApplication);

// Job Application Controllers
export const createJobApplication = catchAsync(async (req, res, next) => {
  const application = await JobApplication.create({
    position: req.body.position,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    experience: req.body.experience,
    education: req.body.education,
    resume: req.body.resume,
    coverLetter: req.body.coverLetter,
    portfolio: req.body.portfolio || undefined,
  });

  res.status(201).json({
    status: 'success',
    data: {
      application,
    },
  });
});

export const getAllJobApplications = factory.getAll(JobApplication);
export const getJobApplication = factory.getOne(JobApplication);
export const updateJobApplication = factory.updateOne(JobApplication);
export const deleteJobApplication = factory.deleteOne(JobApplication);
