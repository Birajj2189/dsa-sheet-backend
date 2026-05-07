import { Response } from 'express';
import { env } from '@config/env';
import { COOKIE_NAMES } from '@constants/app.constants';

const isProduction = env.NODE_ENV === 'production';
const sameSite = isProduction ? env.COOKIE_SAME_SITE : 'lax';

export const cookieOptions = {
  httpOnly: true,
  secure: isProduction || sameSite === 'none',
  sameSite,
  ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
  path: '/',
};

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
): void {
  res.cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, cookieOptions);
  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, cookieOptions);
}
