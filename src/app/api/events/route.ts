import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@lib/db/mongodb';
import { Event, Organization } from '@lib/db/models';
import { getTokenByType } from '@lib/auth';
import { createEventSchema, eventQuerySchema } from '@lib/validation/schemas';
import { handleApiError, createSuccessResponse, createErrorResponse } from '@lib/errors/api-error';
import { logger } from '@lib/errors/logger';
import { sanitizeText, sanitizeUrl } from '@lib/utils/sanitize';
import { handleCors, corsHeaders } from '@lib/middleware/cors';

// GET - List events with filters
export async function GET(request: NextRequest) {
  // Handle CORS
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    
    // Validate query parameters - only include params that exist
    const queryData: Record<string, string> = {};
    
    const searchParam = searchParams.get('search');
    const categoryParam = searchParams.get('category');
    const locationParam = searchParams.get('location');
    const statusParam = searchParams.get('status');
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    
    if (searchParam) queryData.search = searchParam;
    if (categoryParam) queryData.category = categoryParam;
    if (locationParam) queryData.location = locationParam;
    if (statusParam) queryData.status = statusParam;
    if (pageParam) queryData.page = pageParam;
    if (limitParam) queryData.limit = limitParam;
    
    const queryValidation = eventQuerySchema.safeParse(queryData);

    if (!queryValidation.success) {
      logger.error('Query validation failed', undefined, { issues: queryValidation.error.issues, queryData });
      return NextResponse.json(
        createErrorResponse(400, 'Invalid query parameters', 'BAD_REQUEST', queryValidation.error.issues),
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    const { search, category, location, status, page, limit } = queryValidation.data;

    // Build query
    const query: Record<string, unknown> = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      Event.find(query)
        .populate({
          path: 'organizationId',
          model: Organization,
          select: 'name logoUrl',
        })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      Event.countDocuments(query),
    ]);

    return NextResponse.json(
      createSuccessResponse({
        events: events.map((event) => ({
          id: event._id,
          title: event.title,
          description: event.description,
          imageUrl: event.imageUrl,
          date: event.date,
          registrationDeadline: event.registrationDeadline,
          startTime: event.startTime,
          endTime: event.endTime,
          location: event.location,
          category: event.category,
          status: event.status,
          maxAttendees: event.maxAttendees,
          price: event.price,
          applicationLink: event.applicationLink,
          organization: event.organizationId,
          createdAt: event.createdAt,
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      }),
      { headers: corsHeaders(request.headers.get('origin')) }
    );
  } catch (error) {
    logger.error('Get events error', error as Error);
    const { statusCode, response } = handleApiError(error);
    return NextResponse.json(response, {
      status: statusCode,
      headers: corsHeaders(request.headers.get('origin')),
    });
  }
}

// POST - Create event (for organizations)
export async function POST(request: NextRequest) {
  // Handle CORS
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    const payload = await getTokenByType('organization');

    if (!payload) {
      return NextResponse.json(
        createErrorResponse(401, 'Unauthorized - Organizations only', 'UNAUTHORIZED'),
        { status: 401, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    await connectDB();

    // Verify organization exists
    const organization = await Organization.findById(payload.id);
    if (!organization) {
      return NextResponse.json(
        createErrorResponse(404, 'Organization not found', 'NOT_FOUND'),
        { status: 404, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    const body = await request.json();

    // Validate input with Zod
    const validationResult = createEventSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        createErrorResponse(422, 'Validation failed', 'VALIDATION_ERROR', validationResult.error.issues),
        { status: 422, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    const validatedData = validationResult.data;

    // Sanitize text inputs
    const sanitizedData: Record<string, unknown> = {
      title: sanitizeText(validatedData.title),
      category: validatedData.category,
      status: validatedData.status,
      price: validatedData.price,
      date: new Date(validatedData.date),
    };

    // Add optional fields only if they exist
    if (validatedData.description) {
      sanitizedData.description = sanitizeText(validatedData.description);
    }
    if (validatedData.location) {
      sanitizedData.location = sanitizeText(validatedData.location);
    }
    if (validatedData.applicationLink) {
      sanitizedData.applicationLink = sanitizeUrl(validatedData.applicationLink);
    }
    if (validatedData.imageUrl) {
      sanitizedData.imageUrl = validatedData.imageUrl;
    }
    if (validatedData.startTime) {
      sanitizedData.startTime = validatedData.startTime;
    }
    if (validatedData.endTime) {
      sanitizedData.endTime = validatedData.endTime;
    }
    if (validatedData.registrationDeadline) {
      sanitizedData.registrationDeadline = new Date(validatedData.registrationDeadline);
    }
    if (validatedData.maxAttendees !== null && validatedData.maxAttendees !== undefined) {
      sanitizedData.maxAttendees = validatedData.maxAttendees;
    }

    // Create event with error handling
    // Note: If file upload was done before this, cleanup would be handled in upload route
    // For now, we just create the event - file cleanup is handled separately
    let event;
    try {
      event = await Event.create({
        organizationId: payload.id,
        ...sanitizedData,
      });
    } catch (createError) {
      // If event creation fails, log and return error
      logger.error('Event creation failed', createError as Error);
      throw createError;
    }

    return NextResponse.json(
      createSuccessResponse(
        {
          id: event._id.toString(),
          title: event.title,
          date: event.date,
          status: event.status,
        },
        'Event created successfully'
      ),
      { status: 201, headers: corsHeaders(request.headers.get('origin')) }
    );
  } catch (error) {
    logger.error('Create event error', error as Error);
    const { statusCode, response } = handleApiError(error);
    return NextResponse.json(response, {
      status: statusCode,
      headers: corsHeaders(request.headers.get('origin')),
    });
  }
}
