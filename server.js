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

// Check if DATABASE is set
if (!process.env.DATABASE) {
  console.error('❌ DATABASE environment variable is not set!');
  process.exit(1);
}

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

// Trim any whitespace
DB = DB.trim();

console.log('🔌 Connecting to MongoDB...');
console.log('📝 Connection string length:', DB.length);
console.log('📝 Database URL starts with:', `${DB.substring(0, 30)}...`);
console.log('📝 Database URL ends with:', `...${DB.substring(DB.length - 30)}`);
console.log('📝 Contains @cluster0:', DB.includes('@cluster0'));
console.log('📝 Contains /natours:', DB.includes('/natours'));

mongoose
  .connect(DB, {
    serverSelectionTimeoutMS: 30000, // 30 seconds timeout
    socketTimeoutMS: 45000, // 45 seconds socket timeout
  })
  .then(() => console.log('✅ DB Connection Successful'))
  .catch((err) => {
    console.error('❌ DB Connection Error:', err.message);
    console.error('💡 Check: 1) MongoDB Atlas Network Access allows 0.0.0.0/0');
    console.error('💡 Check: 2) DATABASE env variable is correct');
    console.error('💡 Check: 3) MongoDB cluster is running');
  });

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
