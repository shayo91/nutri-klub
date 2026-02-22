import jwt from "jsonwebtoken";
import type { User } from "@shared/schema-sqlite"; // Will work for both SQLite and PG

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d"; // 7 days
const JWT_REFRESH_EXPIRES_IN = "30d"; // 30 days

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

/**
 * Generate an access token for a user
 */
export function generateAccessToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Generate a refresh token for a user
 */
export function generateRefreshToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
}

/**
 * Verify a JWT token and return the payload
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Generate both access and refresh tokens
 */
export function generateTokens(user: User): { accessToken: string; refreshToken: string } {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
}
