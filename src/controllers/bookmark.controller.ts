import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { ApiResponse } from '@utils/ApiResponse';
import { HTTP_STATUS } from '@constants/http.constants';
import * as bookmarkService from '@services/bookmark.service';

/**
 * @swagger
 * /bookmarks/toggle:
 *   post:
 *     summary: Toggle bookmark status for a problem
 *     tags: [Bookmarks]
 *     security:
 *       - cookieAuth: []
 */
export const toggleBookmark = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await bookmarkService.toggleBookmark(
    (req.user!._id as { toString(): string }).toString(),
    req.body as { problemId: string },
  );

  const message = result.bookmarked ? 'Problem bookmarked' : 'Bookmark removed';

  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, message, result));
});

/**
 * @swagger
 * /bookmarks/me:
 *   get:
 *     summary: Get all bookmarked problems for the authenticated user
 *     tags: [Bookmarks]
 *     security:
 *       - cookieAuth: []
 */
export const getMyBookmarks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const bookmarks = await bookmarkService.getUserBookmarks(
    (req.user!._id as { toString(): string }).toString(),
  );

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Bookmarks fetched successfully', {
      bookmarks,
      count: bookmarks.length,
    }),
  );
});
