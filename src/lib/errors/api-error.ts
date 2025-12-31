/**
 * Custom API Error class for structured error handling
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Standard error response format
 * Used by both backend and frontend for type safety
 */
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Standard success response format
 * Used by both backend and frontend for type safety
 */
export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Union type for API responses
 * Used by both backend and frontend for type safety
 */
export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

/**
 * Create standardized error response
 */
export function createErrorResponse(
  statusCode: number,
  message: string,
  code?: string,
  details?: unknown
): ErrorResponse {
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: code || getErrorCode(statusCode),
      message,
    },
  };
  
  if (details) {
    errorResponse.error.details = details;
  }
  
  return errorResponse;
}

/**
 * Create standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string
): SuccessResponse<T> {
  return {
    success: true,
    data,
    ...(message && { message }),
  };
}

/**
 * Get error code from status code
 */
function getErrorCode(statusCode: number): string {
  const codes: Record<number, string> = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'VALIDATION_ERROR',
    429: 'TOO_MANY_REQUESTS',
    500: 'INTERNAL_SERVER_ERROR',
    503: 'SERVICE_UNAVAILABLE',
  };
  return codes[statusCode] || 'UNKNOWN_ERROR';
}

/**
 * Handle errors and return appropriate response
 */
export function handleApiError(error: unknown): {
  statusCode: number;
  response: ErrorResponse;
} {
  // Known API errors
  if (error instanceof ApiError) {
    return {
      statusCode: error.statusCode,
      response: createErrorResponse(
        error.statusCode,
        error.message,
        error.code,
        error.details
      ),
    };
  }

  // Zod validation errors
  if (error && typeof error === 'object' && 'issues' in error) {
    const zodError = error as { issues: Array<{ path: (string | number)[]; message: string }> };
    return {
      statusCode: 422,
      response: createErrorResponse(
        422,
        'Validation failed',
        'VALIDATION_ERROR',
        zodError.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }))
      ),
    };
  }

  // Mongoose errors
  if (error && typeof error === 'object' && 'name' in error) {
    const mongooseError = error as { name: string; code?: number; message: string };
    
    if (mongooseError.name === 'ValidationError') {
      return {
        statusCode: 422,
        response: createErrorResponse(422, 'Validation failed', 'VALIDATION_ERROR'),
      };
    }
    
    if (mongooseError.name === 'CastError') {
      return {
        statusCode: 400,
        response: createErrorResponse(400, 'Invalid ID format', 'BAD_REQUEST'),
      };
    }
    
    if (mongooseError.code === 11000) {
      return {
        statusCode: 409,
        response: createErrorResponse(409, 'Duplicate entry', 'CONFLICT'),
      };
    }
  }

  // Default to 500 for unknown errors
  return {
    statusCode: 500,
    response: createErrorResponse(
      500,
      'An unexpected error occurred',
      'INTERNAL_SERVER_ERROR'
    ),
  };
}

