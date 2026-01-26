import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromCookie, getTokenByType, getAllTokens } from '@lib/auth';
import { uploadFile, UploadType } from '@lib/upload';
import { handleApiError, createSuccessResponse, createErrorResponse } from '@lib/errors/api-error';
import { logger } from '@lib/errors/logger';
import { handleCors, corsHeaders } from '@lib/middleware/cors';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from '@lib/constants';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

// POST - Upload file to local storage
export async function POST(request: NextRequest) {
  // Handle CORS
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    // Parse form data first to determine which token type we need
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as UploadType | null;
    const entityId = formData.get('entityId') as string | null;

    // Validate inputs with detailed logging
    if (!file) {
      logger.error('Upload: No file provided', undefined, {
        hasFormData: !!formData,
        formDataKeys: Array.from(formData.keys()),
      });
      return NextResponse.json(
        createErrorResponse(400, 'No file provided', 'BAD_REQUEST'),
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    if (!type || !['avatar', 'logo', 'banner', 'event'].includes(type)) {
      logger.error('Upload: Invalid type', undefined, {
        type,
        allowedTypes: ['avatar', 'logo', 'banner', 'event'],
      });
      return NextResponse.json(
        createErrorResponse(400, `Invalid type. Must be avatar, logo, banner, or event. Received: ${type}`, 'BAD_REQUEST'),
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    if (!entityId) {
      logger.error('Upload: No entityId provided', undefined, {
        hasType: !!type,
        hasFile: !!file,
      });
      return NextResponse.json(
        createErrorResponse(400, 'Entity ID is required', 'BAD_REQUEST'),
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    // Get the appropriate token based on upload type
    let payload;
    if (type === 'avatar') {
      payload = await getTokenByType('user');
    } else if (type === 'logo' || type === 'banner' || type === 'event') {
      payload = await getTokenByType('organization');
    } else {
      payload = await getTokenFromCookie();
    }

    if (!payload) {
      return NextResponse.json(
        createErrorResponse(401, 'Unauthorized', 'UNAUTHORIZED'),
        { status: 401, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    // Validate permissions
    if (type === 'avatar' && (payload.type !== 'user' || payload.id !== entityId)) {
      return NextResponse.json(
        createErrorResponse(403, 'Unauthorized - Can only upload your own avatar', 'FORBIDDEN'),
        { status: 403, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    if (type === 'logo' && (payload.type !== 'organization' || payload.id !== entityId)) {
      return NextResponse.json(
        createErrorResponse(403, 'Unauthorized - Can only upload your own logo', 'FORBIDDEN'),
        { status: 403, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    // For banner/event, just check if it's an organization
    if ((type === 'banner' || type === 'event') && payload.type !== 'organization') {
      return NextResponse.json(
        createErrorResponse(403, 'Unauthorized - Only organizations can upload event images', 'FORBIDDEN'),
        { status: 403, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      logger.error('Upload: Invalid file type', undefined, {
        fileType: file.type,
        fileName: file.name,
        allowedTypes: ALLOWED_MIME_TYPES,
      });
      return NextResponse.json(
        createErrorResponse(400, `Invalid file type: ${file.type}. Allowed: JPEG, PNG, GIF, WebP, SVG`, 'BAD_REQUEST'),
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      logger.error('Upload: File too large', undefined, {
        fileSize: file.size,
        maxSize: MAX_FILE_SIZE,
        fileName: file.name,
      });
      return NextResponse.json(
        createErrorResponse(400, `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is ${MAX_FILE_SIZE_MB}MB`, 'BAD_REQUEST'),
        { status: 400, headers: corsHeaders(request.headers.get('origin')) }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to local storage (async, with unique filename)
    const url = await uploadFile(buffer, type, entityId, file.name, file.type);

    return NextResponse.json(
      createSuccessResponse({ url }, 'File uploaded successfully'),
      { headers: corsHeaders(request.headers.get('origin')) }
    );
  } catch (error) {
    logger.error('Upload error', error as Error);
    const { statusCode, response } = handleApiError(error);
    return NextResponse.json(response, {
      status: statusCode,
      headers: corsHeaders(request.headers.get('origin')),
    });
  }
}
