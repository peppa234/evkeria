import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * CORS configuration
 * In production, ALLOWED_ORIGINS must be set
 */
function getAllowedOrigins(): string[] {
  const envOrigins = process.env.ALLOWED_ORIGINS;
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction && !envOrigins) {
    throw new Error('ALLOWED_ORIGINS environment variable is required in production');
  }
  
  if (envOrigins) {
    return envOrigins.split(',').map(origin => origin.trim());
  }
  
  // Development defaults
  return ['http://localhost:3000', 'http://localhost:3001'];
}

const allowedOrigins = getAllowedOrigins();

export function corsHeaders(origin: string | null | undefined): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  };

  // Never use '*' with credentials - it's a security risk
  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = 'true';
  } else if (!origin || origin === 'null') {
    // Same-origin request - allow it but don't set credentials
    // In production, this should rarely happen
    headers['Access-Control-Allow-Origin'] = origin || 'null';
    // Don't set credentials for same-origin or null origin
  }
  // If origin doesn't match, don't set CORS headers (browser will block)

  return headers;
}

/**
 * Handle CORS preflight requests
 */
export function handleCors(request: NextRequest): NextResponse | null {
  try {
    const origin = request.headers.get('origin');

    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: corsHeaders(origin),
      });
    }
  } catch (error) {
    // If CORS handling fails, continue with request
    // Error is non-critical, fail silently
  }

  return null;
}

