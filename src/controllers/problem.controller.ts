import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { ApiResponse } from '@utils/ApiResponse';
import { HTTP_STATUS } from '@constants/http.constants';
import * as problemService from '@services/problem.service';

/**
 * @swagger
 * /problems:
 *   get:
 *     summary: Get all problems with optional filtering and pagination
 *     tags: [Problems]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: difficulty
 *         schema: { type: string, enum: [easy, medium, hard] }
 *       - in: query
 *         name: tags
 *         schema: { type: string }
 *         description: Comma-separated list of tags
 */
export const getProblems = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const query = {
    page: req.query['page'] ? Number(req.query['page']) : undefined,
    limit: req.query['limit'] ? Number(req.query['limit']) : undefined,
    difficulty: req.query['difficulty'] ? String(req.query['difficulty']) : undefined,
    tags: req.query['tags'] ? String(req.query['tags']) : undefined,
  };

  const result = await problemService.getAllProblems(query);

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, 'Problems fetched successfully', result),
  );
});

/**
 * @swagger
 * /problems/{slug}:
 *   get:
 *     summary: Get a problem by slug
 *     tags: [Problems]
 */
export const getProblemBySlug = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const problem = await problemService.getProblemBySlug(String(req.params['slug']));

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, 'Problem fetched successfully', { problem }),
    );
  },
);

/**
 * @swagger
 * /problems/topic/{topicId}:
 *   get:
 *     summary: Get all problems for a specific topic
 *     tags: [Problems]
 */
export const getProblemsByTopic = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const query = {
      page: req.query['page'] ? Number(req.query['page']) : undefined,
      limit: req.query['limit'] ? Number(req.query['limit']) : undefined,
      difficulty: req.query['difficulty'] ? String(req.query['difficulty']) : undefined,
    };

    const result = await problemService.getProblemsByTopic(String(req.params['topicId']), query);

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, 'Problems fetched successfully', result),
    );
  },
);
