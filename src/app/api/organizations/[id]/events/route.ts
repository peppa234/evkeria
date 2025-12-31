import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@lib/db/mongodb';
import { Event } from '@lib/db/models';
import { idParamSchema } from '@lib/validation/schemas';
import { handleApiError, createSuccessResponse, createErrorResponse } from '@lib/errors/api-error';
import { logger } from '@lib/errors/logger';
import { handleCors, corsHeaders } from '@lib/middleware/cors';

// GET - Get organization's events
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
        createErrorResponse(400, 'Invalid organization ID format', 'BAD_REQUEST'),
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query: Record<string, unknown> = { organizationId: id };
    if (status) {
      query.status = status;
    }

    const events = await Event.find(query).sort({ date: -1 });

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
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
        })),
      }),
      { headers: corsHeaders(request.headers.get('origin')) }
    );
  } catch (error) {
    logger.error('Get organization events error', error as Error);
    const { statusCode, response } = handleApiError(error);
    return NextResponse.json(response, {
      status: statusCode,
      headers: corsHeaders(request.headers.get('origin')),
    });
  }
}
