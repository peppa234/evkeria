import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET must be at least 8 characters'),
  PORT: z.coerce.number().int().positive().optional(),
  ALLOWED_ORIGINS: z.string().optional(), // Required in production, optional in development
}).refine(
  (data) => {
    // In production, ALLOWED_ORIGINS must be set
    if (data.NODE_ENV === 'production' && !data.ALLOWED_ORIGINS) {
      return false;
    }
    return true;
  },
  {
    message: 'ALLOWED_ORIGINS is required in production',
    path: ['ALLOWED_ORIGINS'],
  }
);

type Env = z.infer<typeof envSchema>;

let validatedEnv: Env | null = null;
let validationError: Error | null = null;

function validateEnv(): Env {
  if (validatedEnv) {
    return validatedEnv;
  }

  if (validationError) {
    throw validationError;
  }

  try {
    validatedEnv = envSchema.parse(process.env);
    return validatedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((e) => `${e.path.join('.')}: ${e.message}`);
      validationError = new Error(
        `❌ Invalid environment variables:\n${missingVars.join('\n')}\n\n` +
        'Please check your .env.local file.'
      );
      throw validationError;
    }
    throw error;
  }
}

// Lazy validation - only validates when accessed
export const env = {
  get NODE_ENV() {
    return validateEnv().NODE_ENV;
  },
  get MONGODB_URI() {
    return validateEnv().MONGODB_URI;
  },
  get JWT_SECRET() {
    return validateEnv().JWT_SECRET;
  },
  get PORT() {
    return validateEnv().PORT;
  },
  get ALLOWED_ORIGINS() {
    return validateEnv().ALLOWED_ORIGINS;
  },
};
