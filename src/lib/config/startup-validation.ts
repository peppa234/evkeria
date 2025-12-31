/**
 * Startup validation for environment variables
 * Validates all required environment variables on app startup
 * This ensures the app fails fast if configuration is invalid
 */

import { env } from './env';
import { logger } from '@lib/errors/logger';

/**
 * Validate all environment variables on startup
 * This is called once when the app starts to ensure configuration is valid
 * @throws Error if any required environment variables are missing or invalid
 */
export function validateStartupEnv(): void {
  try {
    // Access all environment variables to trigger validation
    const nodeEnv = env.NODE_ENV;
    const mongoUri = env.MONGODB_URI;
    const jwtSecret = env.JWT_SECRET;
    const port = env.PORT;
    const allowedOrigins = env.ALLOWED_ORIGINS;

    // Log successful validation (without exposing secrets)
    logger.info('Environment variables validated successfully', {
      NODE_ENV: nodeEnv,
      MONGODB_URI: mongoUri ? '✓ Set' : '✗ Missing',
      JWT_SECRET: jwtSecret ? '✓ Set' : '✗ Missing',
      PORT: port || 'Not set (using default)',
      ALLOWED_ORIGINS: allowedOrigins ? '✓ Set' : nodeEnv === 'production' ? '✗ Required in production' : 'Optional in development',
    });
  } catch (error) {
    // If validation fails, log and rethrow
    logger.error('Environment variable validation failed', error as Error);
    throw error;
  }
}

