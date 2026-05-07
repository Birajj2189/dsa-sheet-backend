import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { ApiResponse } from '@utils/ApiResponse';
import { HTTP_STATUS } from '@constants/http.constants';
import * as userService from '@services/user.service';

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 */
export const getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await userService.getUserProfile(
    (req.user!._id as { toString(): string }).toString(),
  );

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Profile fetched successfully', { user }),
  );
});

/**
 * @swagger
 * /users/profile:
 *   patch:
 *     summary: Update the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await userService.updateUserProfile(
    (req.user!._id as { toString(): string }).toString(),
    req.body as { name?: string; avatar?: string },
  );

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Profile updated successfully', { user }),
  );
});
