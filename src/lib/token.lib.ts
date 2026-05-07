import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { env } from '@config/env';
import { ApiError } from '@utils/ApiError';
import { HTTP_STATUS } from '@constants/http.constants';

export interface AccessTokenPayload extends JwtPayload {
  _id: string;
  email: string;
  role: string;
}

export interface RefreshTokenPayload extends JwtPayload {
  _id: string;
}

export function signAccessToken(payload: { _id: string; email: string; role: string }): string {
  const options: SignOptions = { expiresIn: env.ACCESS_TOKEN_EXPIRY as SignOptions['expiresIn'] };
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, options);
}

export function signRefreshToken(payload: { _id: string }): string {
  const options: SignOptions = { expiresIn: env.REFRESH_TOKEN_EXPIRY as SignOptions['expiresIn'] };
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, options);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as AccessTokenPayload;
  } catch {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired access token');
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
  } catch {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired refresh token');
  }
}
