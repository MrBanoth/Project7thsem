import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { appLogger } from './logger.js';

dotenv.config();

export async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set. Please provide it in .env');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DBNAME || undefined,
  });
  appLogger.info('Connected to MongoDB');
}


