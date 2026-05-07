import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { ApiResponse } from '@utils/ApiResponse';
import { HTTP_STATUS } from '@constants/http.constants';
import * as subtopicService from '@services/subtopic.service';

/**
 * @swagger
 * /subtopics/{topicId}:
 *   get:
 *     summary: Get all subtopics for a topic
 *     tags: [Subtopics]
 */
export const getSubtopicsByTopic = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const subtopics = await subtopicService.getSubtopicsByTopic(String(req.params['topicId']));

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, 'Subtopics fetched successfully', {
        subtopics,
        count: subtopics.length,
      }),
    );
  },
);
