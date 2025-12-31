import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@lib/db/mongodb';
import { Organization } from '@lib/db/models';
import { handleApiError, createSuccessResponse } from '@lib/errors/api-error';
import { logger } from '@lib/errors/logger';
import { handleCors, corsHeaders } from '@lib/middleware/cors';

// GET - List all organizations
export async function GET(request: NextRequest) {
  // Handle CORS
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    await connectDB();

    const organizations = await Organization.find()
      .select('-password')
      .sort({ name: 1 });

    return NextResponse.json(
      createSuccessResponse({
        organizations: organizations.map((org) => ({
          id: org._id,
          name: org.name,
          type: org.type,
          description: org.description,
          logoUrl: org.logoUrl,
          websiteUrl: org.websiteUrl,
          fields: org.fields,
          opportunities: org.opportunities,
        })),
      }),
      { headers: corsHeaders(request.headers.get('origin')) }
    );
  } catch (error) {
    logger.error('Get organizations error', error as Error);
    const { statusCode, response } = handleApiError(error);
    return NextResponse.json(response, {
      status: statusCode,
      headers: corsHeaders(request.headers.get('origin')),
    });
  }
}

