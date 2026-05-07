import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { ApiResponse } from '@utils/ApiResponse';
import { HTTP_STATUS } from '@constants/http.constants';
import * as progressService from '@services/progress.service';

// Service controller for progress tracking

/**
 * @swagger
 * /progress/toggle:
 *   post:
 *     summary: Toggle completion status for a problem
 *     tags: [Progress]
 *     security:
 *       - cookieAuth: []
 */
export const toggleProgress = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await progressService.toggleProgress(
    (req.user!._id as { toString(): string }).toString(),
    req.body as { problemId: string },
  );

  const message = result.completed ? 'Problem marked as completed' : 'Problem marked as incomplete';

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, message, result));
});

/**
 * @swagger
 * /progress/me:
 *   get:
 *     summary: Get all progress records for the authenticated user
 *     tags: [Progress]
 *     security:
 *       - cookieAuth: []
 */
export const getMyProgress = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const progress = await progressService.getUserProgress(
    (req.user!._id as { toString(): string }).toString(),
  );

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Progress fetched successfully', {
      progress,
      count: progress.length,
    }),
  );
});

/**
 * @swagger
 * /progress/notes:
 *   patch:
 *     summary: Update notes for a specific problem
 *     tags: [Progress]
 *     security:
 *       - cookieAuth: []
 */
export const updateNotes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const progress = await progressService.updateNotes(
    (req.user!._id as { toString(): string }).toString(),
    req.body as { problemId: string; notes: string },
  );

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Notes updated successfully', { progress }),
  );
});
