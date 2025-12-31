import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { TOKEN_MAX_AGE } from '@lib/constants';

const USER_TOKEN_NAME = 'evkeria_user_token';
const ORG_TOKEN_NAME = 'evkeria_org_token';

import { env } from '@lib/config/env';

function getJwtSecret(): string {
  try {
    return env.JWT_SECRET;
  } catch (error) {
    throw new Error('JWT_SECRET not configured. Please check your .env.local file.');
  }
}

export interface TokenPayload {
  id: string;
  email: string;
  type: 'user' | 'organization';
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as TokenPayload;
  } catch {
    return null;
  }
}

export async function setTokenCookie(payload: TokenPayload): Promise<void> {
  const token = signToken(payload);
  const cookieStore = await cookies();
  
  // Use different cookie names based on type
  const cookieName = payload.type === 'user' ? USER_TOKEN_NAME : ORG_TOKEN_NAME;
  
  // Set cookie - allow both user and org cookies to coexist
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_MAX_AGE,
    path: '/',
  });
}

/**
 * Get all valid tokens from cookies
 * Returns both user and org tokens if both are logged in
 */
export async function getAllTokens(): Promise<{
  user: TokenPayload | null;
  organization: TokenPayload | null;
}> {
  const cookieStore = await cookies();
  
  const userToken = cookieStore.get(USER_TOKEN_NAME)?.value;
  const orgToken = cookieStore.get(ORG_TOKEN_NAME)?.value;
  
  return {
    user: userToken ? verifyToken(userToken) : null,
    organization: orgToken ? verifyToken(orgToken) : null,
  };
}

/**
 * Get token from cookie - checks both cookies and returns the first valid one
 * For type-specific checks, use getTokenByType() instead
 * @deprecated Consider using getAllTokens() or getTokenByType() for clarity
 */
export async function getTokenFromCookie(): Promise<TokenPayload | null> {
  const tokens = await getAllTokens();
  
  // Return user token if available, otherwise org token
  return tokens.user || tokens.organization;
}

/**
 * Get token by specific type - ensures we get the right account type
 * Use this in API routes that require a specific account type
 */
export async function getTokenByType(
  type: 'user' | 'organization'
): Promise<TokenPayload | null> {
  try {
    const tokens = await getAllTokens();
    return type === 'user' ? tokens.user : tokens.organization;
  } catch (error) {
    // If cookies() fails (e.g., in middleware context), return null
    // Error is expected in some contexts (middleware), so we don't log it
    return null;
  }
}

/**
 * Remove token cookie by type
 */
export async function removeTokenByType(type: 'user' | 'organization'): Promise<void> {
  const cookieStore = await cookies();
  const cookieName = type === 'user' ? USER_TOKEN_NAME : ORG_TOKEN_NAME;
  
  cookieStore.delete(cookieName);
  
  // Also set it to empty with expired date for extra safety
  cookieStore.set(cookieName, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
    expires: new Date(0),
  });
}

/**
 * Remove all token cookies (both user and org)
 */
export async function removeTokenCookie(): Promise<void> {
  await removeTokenByType('user');
  await removeTokenByType('organization');
}
