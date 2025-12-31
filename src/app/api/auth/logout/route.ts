import { NextRequest, NextResponse } from 'next/server';
import { removeTokenCookie, removeTokenByType, getAllTokens } from '@lib/auth';
import { handleApiError, createSuccessResponse, createErrorResponse } from '@lib/errors/api-error';
import { logger } from '@lib/errors/logger';
import { handleCors, corsHeaders } from '@lib/middleware/cors';

export async function POST(request: NextRequest) {
  // Handle CORS
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    let body: { type?: 'user' | 'organization' } | null = null;
    try {
      body = await request.json();
    } catch {
      // No body provided, logout all
    }

    // If type is specified, logout only that type
    if (body?.type) {
      await removeTokenByType(body.type);
      return NextResponse.json(
        createSuccessResponse(null, `Logged out from ${body.type} account successfully`),
        { headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    // Otherwise, logout from all accounts
    await removeTokenCookie();

    return NextResponse.json(
      createSuccessResponse(null, 'Logged out successfully'),
      { headers: corsHeaders(request.headers.get('origin')) }
    );
  } catch (error) {
    logger.error('Logout error', error as Error);
    const { statusCode, response } = handleApiError(error);
    return NextResponse.json(response, {
      status: statusCode,
      headers: corsHeaders(request.headers.get('origin')),
    });
  }
}

