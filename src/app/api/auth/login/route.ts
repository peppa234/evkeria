import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@lib/db/mongodb';
import { User, Organization } from '@lib/db/models';
import { comparePassword, setTokenCookie } from '@lib/auth';
import { loginSchema } from '@lib/validation/schemas';
import { handleApiError, createSuccessResponse, createErrorResponse } from '@lib/errors/api-error';
import { logger } from '@lib/errors/logger';
import { handleCors, corsHeaders } from '@lib/middleware/cors';

export async function POST(request: NextRequest) {
  try {
    // Handle CORS
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

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
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        createErrorResponse(422, 'Validation failed', 'VALIDATION_ERROR', validationResult.error.issues),
        { status: 422, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    const { type, email, password } = validationResult.data;

    if (type === 'user') {
      // Find user
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return NextResponse.json(
          createErrorResponse(401, 'Invalid email or password', 'UNAUTHORIZED'),
          { status: 401, headers: corsHeaders(request.headers.get('origin')) }
        );
      }

      // Verify password
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return NextResponse.json(
          createErrorResponse(401, 'Invalid email or password', 'UNAUTHORIZED'),
          { status: 401, headers: corsHeaders(request.headers.get('origin')) }
        );
      }

      // Set auth cookie
      await setTokenCookie({
        id: user._id.toString(),
        email: user.email,
        type: 'user',
      });

      return NextResponse.json(
        createSuccessResponse(
          {
            id: user._id,
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl,
          },
          'Login successful'
        ),
        { headers: corsHeaders(request.headers.get('origin')) }
      );
    } else {
      // Find organization
      const org = await Organization.findOne({ email: email.toLowerCase() });
      if (!org) {
        return NextResponse.json(
          createErrorResponse(401, 'Invalid email or password', 'UNAUTHORIZED'),
          { status: 401, headers: corsHeaders(request.headers.get('origin')) }
        );
      }

      // Verify password
      const isValidPassword = await comparePassword(password, org.password);
      if (!isValidPassword) {
        return NextResponse.json(
          createErrorResponse(401, 'Invalid email or password', 'UNAUTHORIZED'),
          { status: 401, headers: corsHeaders(request.headers.get('origin')) }
        );
      }

      // Set auth cookie
      await setTokenCookie({
        id: org._id.toString(),
        email: org.email,
        type: 'organization',
      });

      return NextResponse.json(
        createSuccessResponse(
          {
            id: org._id,
            email: org.email,
            name: org.name,
            logoUrl: org.logoUrl,
          },
          'Login successful'
        ),
        { headers: corsHeaders(request.headers.get('origin')) }
      );
    }
  } catch (error) {
    
    try {
      logger.error('Login error', error as Error);
    } catch (logError) {
      
    }
    
    try {
      const { statusCode, response } = handleApiError(error);
      return NextResponse.json(response, {
        status: statusCode,
        headers: corsHeaders(request.headers.get('origin')),
      });
    } catch (handlerError) {
      // Fallback if error handler fails
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: error instanceof Error ? error.message : 'An unexpected error occurred',
          },
        },
        {
          status: 500,
          headers: corsHeaders(request.headers.get('origin')),
        }
      );
    }
  }
}
