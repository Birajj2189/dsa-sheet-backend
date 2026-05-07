import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { ApiResponse } from '@utils/ApiResponse';
import { HTTP_STATUS } from '@constants/http.constants';
import * as dashboardService from '@services/dashboard.service';

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get comprehensive dashboard statistics for the authenticated user
 *     tags: [Dashboard]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats including solved counts, streak, XP, topic completion
 */
export const getDashboardStats = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const stats = await dashboardService.getDashboardStats(
      (req.user!._id as { toString(): string }).toString(),
    );

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, 'Dashboard stats fetched successfully', { stats }),
    );
  },
);
