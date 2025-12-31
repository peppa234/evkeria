import { NextResponse } from 'next/server';
import connectDB from '@lib/db/mongodb';
import { User, Organization } from '@lib/db/models';
import { getAllTokens } from '@lib/auth';
import { handleApiError, createSuccessResponse, createErrorResponse } from '@lib/errors/api-error';
import { logger } from '@lib/errors/logger';
import { corsHeaders } from '@lib/middleware/cors';

export async function GET(request: Request) {
  try {
    // Get all tokens (both user and org if both are logged in)
    const tokens = await getAllTokens();

    if (!tokens.user && !tokens.organization) {
      return NextResponse.json(
        createErrorResponse(401, 'Not authenticated', 'UNAUTHORIZED'),
        { status: 401, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    await connectDB();

    interface UserData {
      id: string;
      email: string;
      name: string;
      phone?: string;
      bio?: string;
      portfolioUrl?: string;
      avatarUrl?: string;
      skills: string[];
      interests: string[];
      savedEvents: string[];
      createdAt: Date;
      updatedAt: Date;
    }

    interface OrganizationData {
      id: string;
      email: string;
      name: string;
      type?: string;
      description?: string;
      logoUrl?: string;
      websiteUrl?: string;
      fields: string[];
      opportunities: string[];
      createdAt: Date;
      updatedAt: Date;
    }

    const result: {
      type?: string;
      user?: UserData;
      organization?: OrganizationData;
    } = {};

    // Fetch user data if user token exists
    if (tokens.user) {
      const user = await User.findById(tokens.user.id).select('-password');
      if (user) {
        result.type = 'user';
        result.user = {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          phone: user.phone,
          bio: user.bio,
          portfolioUrl: user.portfolioUrl,
          avatarUrl: user.avatarUrl,
          skills: user.skills,
          interests: user.interests,
          savedEvents: user.savedEvents.map(id => id.toString()),
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      }
    }

    // Fetch organization data if org token exists
    if (tokens.organization) {
      const org = await Organization.findById(tokens.organization.id).select('-password');
      if (org) {
        // If both exist, set type to 'both', otherwise set to 'organization'
        if (result.type === 'user') {
          result.type = 'both';
        } else {
          result.type = 'organization';
        }
        result.organization = {
          id: org._id.toString(),
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
        };
      }
    }

    // If we have at least one valid session, return the data
    if (result.user || result.organization) {
      return NextResponse.json(
        createSuccessResponse(result),
        { headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    // If tokens exist but users not found in DB
    return NextResponse.json(
      createErrorResponse(404, 'User or organization not found', 'NOT_FOUND'),
      { status: 404, headers: corsHeaders(request.headers.get('origin')) }
    );
  } catch (error) {
    logger.error('Get current user error', error as Error);
    const { statusCode, response } = handleApiError(error);
    return NextResponse.json(response, {
      status: statusCode,
      headers: corsHeaders(request.headers.get('origin')),
    });
  }
}
