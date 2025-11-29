import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRES_IN = '24h';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// Convert secret to Uint8Array for jose
const secret = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload: JWTPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secret);
  return token;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    // Validate that payload has required fields
    if (!payload.userId || !payload.email || !payload.role) {
      return null;
    }
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}
