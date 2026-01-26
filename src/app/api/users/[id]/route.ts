import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@lib/db/mongodb';
import { User } from '@lib/db/models';
import { getTokenByType } from '@lib/auth';
import { handleApiError, createSuccessResponse, createErrorResponse } from '@lib/errors/api-error';
import { logger } from '@lib/errors/logger';
import { handleCors, corsHeaders } from '@lib/middleware/cors';
import { sanitizeText, sanitizeUrl } from '@lib/utils/sanitize';
import { updateUserSchema } from '@lib/validation/schemas';

// GET - Get user profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Handle CORS
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    await connectDB();
    const { id } = await params;

    const user = await User.findById(id).select('-password');

    if (!user) {
      return NextResponse.json(
        createErrorResponse(404, 'User not found', 'NOT_FOUND'),
        { status: 404, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    return NextResponse.json(
      createSuccessResponse({
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        bio: user.bio,
        portfolioUrl: user.portfolioUrl,
        avatarUrl: user.avatarUrl,
        skills: user.skills,
        interests: user.interests,
        savedEvents: user.savedEvents,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }),
      { headers: corsHeaders(request.headers.get('origin')) }
    );
  } catch (error) {
    logger.error('Get user error', error as Error);
    const { statusCode, response } = handleApiError(error);
    return NextResponse.json(response, {
      status: statusCode,
      headers: corsHeaders(request.headers.get('origin')),
    });
  }
}

// PUT - Update user profile
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
    const validationResult = updateUserSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        createErrorResponse(422, 'Validation failed', 'VALIDATION_ERROR', validationResult.error.issues),
        { status: 422, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    const validatedData = validationResult.data;

    // Sanitize text inputs
    const updateData: Record<string, unknown> = {};
    if (validatedData.name !== undefined) {
      updateData.name = sanitizeText(validatedData.name);
    }
    if (validatedData.phone !== undefined) {
      updateData.phone = validatedData.phone;
    }
    if (validatedData.bio !== undefined) {
      updateData.bio = validatedData.bio ? sanitizeText(validatedData.bio) : '';
    }
    if (validatedData.portfolioUrl !== undefined) {
      updateData.portfolioUrl = validatedData.portfolioUrl ? sanitizeUrl(validatedData.portfolioUrl) : '';
    }
    if (validatedData.avatarUrl !== undefined) {
      updateData.avatarUrl = validatedData.avatarUrl || '';
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');

    if (!user) {
      return NextResponse.json(
        createErrorResponse(404, 'User not found', 'NOT_FOUND'),
        { status: 404, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    return NextResponse.json(
      createSuccessResponse(
        {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            bio: user.bio,
            portfolioUrl: user.portfolioUrl,
            avatarUrl: user.avatarUrl,
            skills: user.skills,
            interests: user.interests,
          },
        },
        'Profile updated successfully'
      ),
      { headers: corsHeaders(request.headers.get('origin')) }
    );
  } catch (error) {
    logger.error('Update user error', error as Error);
    const { statusCode, response } = handleApiError(error);
    return NextResponse.json(response, {
      status: statusCode,
      headers: corsHeaders(request.headers.get('origin')),
    });
  }
}

