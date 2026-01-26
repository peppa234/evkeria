import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@lib/db/mongodb';
import { User } from '@lib/db/models';
import { getTokenByType } from '@lib/auth';
import { handleApiError, createSuccessResponse, createErrorResponse } from '@lib/errors/api-error';
import { logger } from '@lib/errors/logger';
import { handleCors, corsHeaders } from '@lib/middleware/cors';
import { updateInterestsSchema } from '@lib/validation/schemas';

// PUT - Update user interests
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Handle CORS
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    const payload = await getTokenByType('user');
    const { id } = await params;

    if (!payload || payload.id !== id) {
      return NextResponse.json(
        createErrorResponse(401, 'Unauthorized', 'UNAUTHORIZED'),
        { status: 401, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    await connectDB();

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        createErrorResponse(400, 'Invalid JSON in request body', 'BAD_REQUEST'),
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    // Validate input with Zod
    const validationResult = updateInterestsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        createErrorResponse(422, 'Validation failed', 'VALIDATION_ERROR', validationResult.error.issues),
        { status: 422, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    const { interests } = validationResult.data;

    const user = await User.findByIdAndUpdate(
      id,
      { interests },
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        createErrorResponse(404, 'User not found', 'NOT_FOUND'),
        { status: 404, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    return NextResponse.json(
      createSuccessResponse(
        {
          interests: user.interests,
        },
        'Interests updated successfully'
      ),
      { headers: corsHeaders(request.headers.get('origin')) }
    );
  } catch (error) {
    logger.error('Update interests error', error as Error);
    const { statusCode, response } = handleApiError(error);
    return NextResponse.json(response, {
      status: statusCode,
      headers: corsHeaders(request.headers.get('origin')),
    });
  }
}

