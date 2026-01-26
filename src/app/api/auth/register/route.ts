import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@lib/db/mongodb';
import { User, Organization } from '@lib/db/models';
import { hashPassword, setTokenCookie } from '@lib/auth';
import { registerSchema } from '@lib/validation/schemas';
import { handleApiError, createSuccessResponse, createErrorResponse } from '@lib/errors/api-error';
import { logger } from '@lib/errors/logger';
import { sanitizeText } from '@lib/utils/sanitize';
import { handleCors, corsHeaders } from '@lib/middleware/cors';

export async function POST(request: NextRequest) {
  // Handle CORS
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    await connectDB();

    const body = await request.json();
    
    // Validate input with Zod
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        createErrorResponse(422, 'Validation failed', 'VALIDATION_ERROR', validationResult.error.issues),
        { status: 422, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    const { type, email, password, name, description } = validationResult.data;

    // Hash password
    const hashedPassword = await hashPassword(password);

    if (type === 'user') {
      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return NextResponse.json(
          createErrorResponse(409, 'Email already registered', 'CONFLICT'),
          { status: 409, headers: corsHeaders(request.headers.get('origin')) }
        );
      }

      // Create user
      const user = await User.create({
        email: email.toLowerCase(),
        password: hashedPassword,
        name: sanitizeText(name),
        skills: [],
        interests: [],
        savedEvents: [],
      });

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
          },
          'User registered successfully'
        ),
        { status: 201, headers: corsHeaders(request.headers.get('origin')) }
      );
    } else {
      // Check if organization already exists
      const existingOrg = await Organization.findOne({ email: email.toLowerCase() });
      if (existingOrg) {
        return NextResponse.json(
          createErrorResponse(409, 'Email already registered', 'CONFLICT'),
          { status: 409, headers: corsHeaders(request.headers.get('origin')) }
        );
      }

      // Create organization
      const org = await Organization.create({
        email: email.toLowerCase(),
        password: hashedPassword,
        name: sanitizeText(name),
        description: description ? sanitizeText(description) : '',
        fields: [],
        opportunities: [],
      });

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
          },
          'Organization registered successfully'
        ),
        { status: 201, headers: corsHeaders(request.headers.get('origin')) }
      );
    }
  } catch (error) {
    logger.error('Registration error', error as Error);
    const { statusCode, response } = handleApiError(error);
    return NextResponse.json(response, {
      status: statusCode,
      headers: corsHeaders(request.headers.get('origin')),
    });
  }
}
