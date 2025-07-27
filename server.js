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
console.log('[Stripe Init] Key:', process.env.STRIPE_SECRET_KEY);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB Connection Successful'));

// console.log(process.env);
// Start Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhadled Rejection');
  const error = Object.create(err);
  console.log(error.name, error.message);

  server.close(() => {
    process.exit(1);
  });
});
