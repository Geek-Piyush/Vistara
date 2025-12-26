/* eslint-disable no-console */
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import app from './app.js';

process.on('uncaughtException', (err) => {
  console.log('Unhadled Rejection');
  const error = Object.create(err);
  console.log(error.name, error.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

// Handle both connection string formats
let DB;
if (
  process.env.DATABASE.includes('<PASSWORD>') &&
  process.env.DATABASE_PASSWORD
) {
  DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD,
  );
} else {
  DB = process.env.DATABASE;
}

console.log('🔌 Connecting to MongoDB...');

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB Connection Successful'));

// Start Server
const port = process.env.PORT || 8000;
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server is running on port ${port}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhadled Rejection');
  const error = Object.create(err);
  console.log(error.name, error.message);

  server.close(() => {
    process.exit(1);
  });
});
