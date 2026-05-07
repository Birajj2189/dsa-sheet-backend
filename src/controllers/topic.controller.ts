import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { ApiResponse } from '@utils/ApiResponse';
import { HTTP_STATUS } from '@constants/http.constants';
import * as topicService from '@services/topic.service';

/**
 * @swagger
 * /topics:
 *   get:
 *     summary: Get all active topics
 *     tags: [Topics]
 */
export const getTopics = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const topics = await topicService.getAllTopics();

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Topics fetched successfully', {
      topics,
      count: topics.length,
    }),
  );
});

/**
 * @swagger
 * /topics/{slug}:
 *   get:
 *     summary: Get a single topic by slug
 *     tags: [Topics]
 */
export const getTopicBySlug = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const topic = await topicService.getTopicBySlug(String(req.params['slug']));

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Topic fetched successfully', { topic }),
  );
});
