import { Problem } from '@models/Problem.model';
import { IProblemDocument } from '@models/Problem.model';
import { ApiError } from '@utils/ApiError';
import { HTTP_STATUS } from '@constants/http.constants';
import { PAGINATION } from '@constants/app.constants';

export interface ProblemQuery {
  page?: number;
  limit?: number;
  difficulty?: string;
  tags?: string;
  topicId?: string;
}

export interface PaginatedProblems {
  problems: IProblemDocument[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getAllProblems(query: ProblemQuery): Promise<PaginatedProblems> {
  const page = Math.max(1, query.page ?? PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(query.limit ?? PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = { isActive: true };

  if (query.difficulty) {
    filter.difficulty = query.difficulty;
  }

  if (query.tags) {
    filter.tags = { $in: query.tags.split(',').map((t) => t.trim()) };
  }

  if (query.topicId) {
    filter.topicId = query.topicId;
  }

  const [problems, total] = await Promise.all([
    Problem.find(filter)
      .sort({ topicId: 1, order: 1 })
      .skip(skip)
      .limit(limit)
      .populate('topicId', 'title slug')
      .populate('subtopicId', 'title slug'),
    Problem.countDocuments(filter),
  ]);

  return {
    problems,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProblemBySlug(slug: string): Promise<IProblemDocument> {
  const problem = await Problem.findOne({ slug, isActive: true })
    .populate('topicId', 'title slug')
    .populate('subtopicId', 'title slug');

  if (!problem) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, `Problem '${slug}' not found`);
  }

  return problem;
}

export async function getProblemsByTopic(
  topicId: string,
  query: ProblemQuery,
): Promise<PaginatedProblems> {
  return getAllProblems({ ...query, topicId });
}
