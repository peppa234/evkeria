import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@lib/db/mongodb';
import { Event, Organization } from '@lib/db/models';
import { getTokenByType } from '@lib/auth';
import { updateEventSchema, idParamSchema } from '@lib/validation/schemas';
import { handleApiError, createSuccessResponse, createErrorResponse } from '@lib/errors/api-error';
import { logger } from '@lib/errors/logger';
import { sanitizeText, sanitizeUrl } from '@lib/utils/sanitize';
import mongoose from 'mongoose';
import { handleCors, corsHeaders } from '@lib/middleware/cors';

// GET - Get single event
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

    // Validate ID format
    const idValidation = idParamSchema.safeParse({ id });
    if (!idValidation.success) {
      return NextResponse.json(
        createErrorResponse(400, 'Invalid event ID format', 'BAD_REQUEST'),
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    const event = await Event.findById(id).populate({
      path: 'organizationId',
      model: Organization,
      select: 'name logoUrl email websiteUrl description',
    });

    if (!event) {
      return NextResponse.json(
        createErrorResponse(404, 'Event not found', 'NOT_FOUND'),
        { status: 404, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    return NextResponse.json(
      createSuccessResponse({
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
        updatedAt: event.updatedAt,
      }),
      { headers: corsHeaders(request.headers.get('origin')) }
    );
  } catch (error) {
    logger.error('Get event error', error as Error);
    const { statusCode, response } = handleApiError(error);
    return NextResponse.json(response, {
      status: statusCode,
      headers: corsHeaders(request.headers.get('origin')),
    });
  }
}

// PUT - Update event (organization owner only)
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
      return NextResponse.json(
        createErrorResponse(401, 'Unauthorized - Organizations only', 'UNAUTHORIZED'),
        { status: 401, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    // Validate ID format
    const idValidation = idParamSchema.safeParse({ id });
    if (!idValidation.success) {
      return NextResponse.json(
        createErrorResponse(400, 'Invalid event ID format', 'BAD_REQUEST'),
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    await connectDB();

    // Check ownership
    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return NextResponse.json(
        createErrorResponse(404, 'Event not found', 'NOT_FOUND'),
        { status: 404, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    // Compare ObjectIds properly
    const eventOrgId = existingEvent.organizationId;
    const payloadOrgId = new mongoose.Types.ObjectId(payload.id);

    if (!eventOrgId.equals(payloadOrgId)) {
      logger.warn('Update event authorization failed', {
        eventOrgId: eventOrgId.toString(),
        payloadOrgId: payloadOrgId.toString(),
        eventId: id,
      });
      return NextResponse.json(
        createErrorResponse(403, 'Unauthorized - Not your event', 'FORBIDDEN'),
        { status: 403, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    const body = await request.json();

    // Validate input with Zod
    const validationResult = updateEventSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        createErrorResponse(422, 'Validation failed', 'VALIDATION_ERROR', validationResult.error.issues),
        { status: 422, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    const validatedData = validationResult.data;

    // Sanitize text inputs
    const updateData: Record<string, unknown> = {};
    if (validatedData.title) updateData.title = sanitizeText(validatedData.title);
    if (validatedData.description !== undefined) {
      updateData.description = validatedData.description ? sanitizeText(validatedData.description) : null;
    }
    if (validatedData.location !== undefined) {
      updateData.location = validatedData.location ? sanitizeText(validatedData.location) : null;
    }
    if (validatedData.applicationLink !== undefined) {
      updateData.applicationLink = validatedData.applicationLink ? sanitizeUrl(validatedData.applicationLink) : null;
    }
    if (validatedData.imageUrl !== undefined) updateData.imageUrl = validatedData.imageUrl;
    if (validatedData.date) updateData.date = new Date(validatedData.date);
    if (validatedData.registrationDeadline !== undefined) {
      updateData.registrationDeadline = validatedData.registrationDeadline
        ? new Date(validatedData.registrationDeadline)
        : null;
    }
    if (validatedData.startTime !== undefined) updateData.startTime = validatedData.startTime;
    if (validatedData.endTime !== undefined) updateData.endTime = validatedData.endTime;
    if (validatedData.category) updateData.category = validatedData.category;
    if (validatedData.status) updateData.status = validatedData.status;
    if (validatedData.maxAttendees !== undefined) updateData.maxAttendees = validatedData.maxAttendees;
    if (validatedData.price !== undefined) updateData.price = validatedData.price;

    const event = await Event.findByIdAndUpdate(id, updateData, { new: true });

    if (!event) {
      return NextResponse.json(
        createErrorResponse(404, 'Event not found', 'NOT_FOUND'),
        { status: 404, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    return NextResponse.json(
      createSuccessResponse(
        {
          id: event._id,
          title: event.title,
          date: event.date,
          status: event.status,
        },
        'Event updated successfully'
      ),
      { headers: corsHeaders(request.headers.get('origin')) }
    );
  } catch (error) {
    logger.error('Update event error', error as Error);
    const { statusCode, response } = handleApiError(error);
    return NextResponse.json(response, {
      status: statusCode,
      headers: corsHeaders(request.headers.get('origin')),
    });
  }
}

// DELETE - Delete event (organization owner only)
export async function DELETE(
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
      return NextResponse.json(
        createErrorResponse(401, 'Unauthorized - Organizations only', 'UNAUTHORIZED'),
        { status: 401, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    // Validate ID format
    const idValidation = idParamSchema.safeParse({ id });
    if (!idValidation.success) {
      return NextResponse.json(
        createErrorResponse(400, 'Invalid event ID format', 'BAD_REQUEST'),
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    await connectDB();

    // Check ownership
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        createErrorResponse(404, 'Event not found', 'NOT_FOUND'),
        { status: 404, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    // Compare ObjectIds properly
    const eventOrgId = event.organizationId;
    const payloadOrgId = new mongoose.Types.ObjectId(payload.id);

    if (!eventOrgId.equals(payloadOrgId)) {
      logger.warn('Delete event authorization failed', {
        eventOrgId: eventOrgId.toString(),
        payloadOrgId: payloadOrgId.toString(),
        eventId: id,
      });
      return NextResponse.json(
        createErrorResponse(403, 'Unauthorized - Not your event', 'FORBIDDEN'),
        { status: 403, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    await Event.findByIdAndDelete(id);

    return NextResponse.json(
      createSuccessResponse(null, 'Event deleted successfully'),
      { headers: corsHeaders(request.headers.get('origin')) }
    );
  } catch (error) {
    logger.error('Delete event error', error as Error);
    const { statusCode, response } = handleApiError(error);
    return NextResponse.json(response, {
      status: statusCode,
      headers: corsHeaders(request.headers.get('origin')),
    });
  }
}
