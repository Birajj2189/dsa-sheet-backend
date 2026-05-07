import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { ApiResponse } from '@utils/ApiResponse';
import { ApiError } from '@utils/ApiError';
import { setAuthCookies, clearAuthCookies } from '@utils/cookie.utils';
import { HTTP_STATUS } from '@constants/http.constants';
import { COOKIE_NAMES } from '@constants/app.constants';
import * as authService from '@services/auth.service';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already exists
 */
export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { accessToken, refreshToken, user } = await authService.registerUser(
    req.body as { name: string; email: string; password: string },
  );

  setAuthCookies(res, accessToken, refreshToken);

  res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(HTTP_STATUS.CREATED, 'Account created successfully', { user }),
  );
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 */
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { accessToken, refreshToken, user } = await authService.loginUser(
    req.body as { email: string; password: string },
  );

  setAuthCookies(res, accessToken, refreshToken);

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Logged in successfully', { user }),
  );
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout the current user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 */
export const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  await authService.logoutUser((req.user!._id as { toString(): string }).toString());
  clearAuthCookies(res);

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Logged out successfully', null),
  );
});

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token using refresh token cookie
 *     tags: [Auth]
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const incomingRefreshToken = (req.cookies as Record<string, string>)[
    COOKIE_NAMES.REFRESH_TOKEN
  ];

  if (!incomingRefreshToken) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Refresh token not found');
  }

  const { accessToken, refreshToken: newRefreshToken, user } =
    await authService.refreshAccessToken(incomingRefreshToken);

  setAuthCookies(res, accessToken, newRefreshToken);

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Token refreshed successfully', { user }),
  );
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 */
export const getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'User fetched successfully', { user: req.user }),
  );
});
