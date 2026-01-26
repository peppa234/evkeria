import mongoose from 'mongoose';
import { env } from '@lib/config/env';
import { logger } from '@lib/errors/logger';
import { validateStartupEnv } from '@lib/config/startup-validation';

// Validate environment variables on module load
validateStartupEnv();

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectWithRetry(retries = MAX_RETRIES): Promise<typeof mongoose> {
  const opts = {
    bufferCommands: false,
  };

  try {
    // Access env with error handling
    let mongoUri: string;
    try {
      mongoUri = env.MONGODB_URI;
    } catch (envError) {
      logger.error('Environment validation failed', envError as Error);
      throw new Error('MongoDB URI not configured. Please check your .env.local file.');
    }

    const connection = await mongoose.connect(mongoUri, opts);
    logger.info('✅ MongoDB connected successfully');
    return connection;
  } catch (error) {
    if (retries > 0) {
      logger.warn(`MongoDB connection failed. Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await sleep(RETRY_DELAY * (MAX_RETRIES - retries + 1)); // Exponential backoff
      return connectWithRetry(retries - 1);
    }
    logger.error('MongoDB connection failed after retries', error as Error);
    throw error;
  }
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = connectWithRetry();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
