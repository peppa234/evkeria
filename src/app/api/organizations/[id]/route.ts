import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@lib/db/mongodb';
import { Organization } from '@lib/db/models';
import { getTokenByType } from '@lib/auth';
import { handleApiError, createSuccessResponse, createErrorResponse } from '@lib/errors/api-error';
import { logger } from '@lib/errors/logger';
import { handleCors, corsHeaders } from '@lib/middleware/cors';
import { sanitizeText, sanitizeUrl } from '@lib/utils/sanitize';
import { updateOrganizationSchema } from '@lib/validation/schemas';

// GET - Get organization profile
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

    const org = await Organization.findById(id).select('-password');

    if (!org) {
      return NextResponse.json(
        createErrorResponse(404, 'Organization not found', 'NOT_FOUND'),
        { status: 404, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    return NextResponse.json(
      createSuccessResponse({
        organization: {
          id: org._id,
          email: org.email,
          name: org.name,
          type: org.type,
          description: org.description,
          logoUrl: org.logoUrl,
          websiteUrl: org.websiteUrl,
          fields: org.fields,
          opportunities: org.opportunities,
          createdAt: org.createdAt,
          updatedAt: org.updatedAt,
        },
      }),
      { headers: corsHeaders(request.headers.get('origin')) }
    );
  } catch (error) {
    logger.error('Get organization error', error as Error);
    const { statusCode, response } = handleApiError(error);
    return NextResponse.json(response, {
      status: statusCode,
      headers: corsHeaders(request.headers.get('origin')),
    });
  }
}

// PUT - Update organization profile
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

    if (!payload) {
      logger.error('Organization update: No valid token found', undefined, {
        organizationId: id,
        hasParams: !!id,
      });
      return NextResponse.json(
        createErrorResponse(401, 'Unauthorized - Please log in', 'UNAUTHORIZED'),
        { status: 401, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    if (payload.id !== id) {
      logger.error('Organization update: ID mismatch', undefined, {
        tokenId: payload.id,
        requestedId: id,
      });
      return NextResponse.json(
        createErrorResponse(403, 'Forbidden - Cannot update other organization', 'FORBIDDEN'),
        { status: 403, headers: corsHeaders(request.headers.get('origin')) }
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
    const validationResult = updateOrganizationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        createErrorResponse(422, 'Validation failed', 'VALIDATION_ERROR', validationResult.error.issues),
        { status: 422, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    const validatedData = validationResult.data;

    // Check if email is being updated and if it's already taken
    if (validatedData.email !== undefined) {
      const existingOrg = await Organization.findOne({ email: validatedData.email });
      if (existingOrg && existingOrg._id.toString() !== id) {
        return NextResponse.json(
          createErrorResponse(409, 'Email already in use', 'CONFLICT'),
          { status: 409, headers: corsHeaders(request.headers.get('origin')) }
        );
      }
    }

    // Sanitize text inputs
    const updateData: Record<string, unknown> = {};
    if (validatedData.name !== undefined) {
      updateData.name = sanitizeText(validatedData.name);
    }
    if (validatedData.email !== undefined) {
      updateData.email = validatedData.email.toLowerCase().trim();
    }
    if (validatedData.type !== undefined) {
      updateData.type = validatedData.type ? sanitizeText(validatedData.type) : '';
    }
    if (validatedData.description !== undefined) {
      updateData.description = validatedData.description ? sanitizeText(validatedData.description) : '';
    }
    if (validatedData.logoUrl !== undefined) {
      updateData.logoUrl = validatedData.logoUrl || '';
    }
    if (validatedData.websiteUrl !== undefined) {
      updateData.websiteUrl = validatedData.websiteUrl ? sanitizeUrl(validatedData.websiteUrl) : '';
    }

    const org = await Organization.findByIdAndUpdate(id, updateData, { new: true }).select('-password');

    if (!org) {
      return NextResponse.json(
        createErrorResponse(404, 'Organization not found', 'NOT_FOUND'),
        { status: 404, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    return NextResponse.json(
      createSuccessResponse(
        {
          organization: {
            id: org._id,
            email: org.email,
            name: org.name,
            type: org.type,
            description: org.description,
            logoUrl: org.logoUrl,
            websiteUrl: org.websiteUrl,
            fields: org.fields,
            opportunities: org.opportunities,
          },
        },
        'Organization updated successfully'
      ),
      { headers: corsHeaders(request.headers.get('origin')) }
    );
  } catch (error) {
    logger.error('Update organization error', error as Error);
    const { statusCode, response } = handleApiError(error);
    return NextResponse.json(response, {
      status: statusCode,
      headers: corsHeaders(request.headers.get('origin')),
    });
  }
}

