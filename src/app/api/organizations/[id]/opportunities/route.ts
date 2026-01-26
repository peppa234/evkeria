import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@lib/db/mongodb';
import { Organization } from '@lib/db/models';
import { getTokenByType } from '@lib/auth';
import { handleApiError, createSuccessResponse, createErrorResponse } from '@lib/errors/api-error';
import { logger } from '@lib/errors/logger';
import { handleCors, corsHeaders } from '@lib/middleware/cors';
import { updateOpportunitiesSchema } from '@lib/validation/schemas';

// PUT - Update organization opportunities
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Handle CORS
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    const payload = await getTokenByType('organization');
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
    const validationResult = updateOpportunitiesSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        createErrorResponse(422, 'Validation failed', 'VALIDATION_ERROR', validationResult.error.issues),
        { status: 422, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    const { opportunities } = validationResult.data;

    const org = await Organization.findByIdAndUpdate(
      id,
      { opportunities },
      { new: true }
    ).select('-password');

    if (!org) {
      return NextResponse.json(
        createErrorResponse(404, 'Organization not found', 'NOT_FOUND'),
        { status: 404, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    return NextResponse.json(
      createSuccessResponse(
        {
          opportunities: org.opportunities,
        },
        'Opportunities updated successfully'
      ),
      { headers: corsHeaders(request.headers.get('origin')) }
    );
  } catch (error) {
    logger.error('Update opportunities error', error as Error);
    const { statusCode, response } = handleApiError(error);
    return NextResponse.json(response, {
      status: statusCode,
      headers: corsHeaders(request.headers.get('origin')),
    });
  }
}

