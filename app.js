/* eslint-disable import/no-duplicates */
/* eslint-disable import/first */
/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */

import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path'; // ✅ Correct import
import dotenv from 'dotenv';

// Required to use __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: './config.env' });

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';

import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';

import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import viewRouter from './routes/viewRoutes.js';

const app = express();

// Trust proxies for secure cookies in production (Heroku, Render, etc.)
app.set('trust proxy', 1);

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL || true
      : 'http://localhost:8000',
  credentials: true,
};
app.use(cors(corsOptions));

// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-eval'",
          "'unsafe-inline'",
          'https://unpkg.com',
          'https://cdnjs.cloudflare.com',
          'https://js.stripe.com',
          'blob:',
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://unpkg.com',
          'https://fonts.googleapis.com',
        ],
        imgSrc: ["'self'", 'data:', 'blob:'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        connectSrc: [
          "'self'",
          'https://*.cartocdn.com',
          'https://unpkg.com',
          'http://127.0.0.1:8000',
          'https://js.stripe.com',
          'https://api.stripe.com',
          'ws://localhost:*',
          'ws://127.0.0.1:*',
        ],
        workerSrc: ["'self'", 'blob:'],
        frameSrc: ['https://js.stripe.com'],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
      },
    },
  }),
);

// Setting up the View Engine
app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views')); // Your views folder stays the same

// Serving Static file
app.use(express.static(path.join(__dirname, 'public')));

// Compression middleware - compress all responses
app.use(compression());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Production logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')); // More detailed logs for production
}

// Limit the request from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Body Parser, reading data from body to req.body
app.use(
  express.json({
    limit: '10kb',
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '10kb',
  }),
);

app.use(cookieParser());

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingAverage',
      'ratingQuntity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// Test middleware
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   console.log(req.cookies);
//   next();
// });
// app.use((req, res, next) => {
//   console.log('🍪 Cookies:', req.cookies); // Will log JWT if sent
//   next();
// });

// Mount Routers
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/booking', bookingRouter);

// Handle unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
