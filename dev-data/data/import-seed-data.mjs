/* eslint-disable no-console */
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import Tour from '../../models/tourModel.js';
import User from '../../models/userModel.js';
import Review from '../../models/reviewModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB Connection Successful'));

// READ JSON FILE - Using new seed data files
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-new.json`, 'utf-8'),
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/users-new.json`, 'utf-8'),
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews-new.json`, 'utf-8'),
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully loaded!');
    console.log(`✓ ${tours.length} tours imported`);
    console.log(`✓ ${users.length} users imported`);
    console.log(`✓ ${reviews.length} reviews imported`);
  } catch (err) {
    console.log(`Error : ${err}`);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
    console.log('✓ All tours deleted');
    console.log('✓ All users deleted');
    console.log('✓ All reviews deleted');
  } catch (err) {
    console.log(`Error : ${err}`);
  }
  process.exit();
};

// RESET: Delete all and import new data
const resetData = async () => {
  try {
    console.log('--- Deleting existing data ---');
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('✓ All existing data deleted');

    console.log('\n--- Importing new data ---');
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('✓ Data successfully imported!');
    console.log(`  → ${tours.length} tours`);
    console.log(`  → ${users.length} users`);
    console.log(`  → ${reviews.length} reviews`);

    console.log('\n--- Admin Accounts ---');
    console.log('  → admin@gmail.com (password: admin123)');
    console.log('  → piyushnas74@gmail.com (password: admin123)');
  } catch (err) {
    console.log(`Error : ${err}`);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else if (process.argv[2] === '--reset') {
  resetData();
} else {
  console.log('Usage:');
  console.log('  node import-seed-data.mjs --import   Import new data');
  console.log('  node import-seed-data.mjs --delete   Delete all data');
  console.log('  node import-seed-data.mjs --reset    Delete and reimport');
  process.exit();
}
