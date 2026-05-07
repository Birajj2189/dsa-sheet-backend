import { Progress } from '@models/Progress.model';
import { Problem } from '@models/Problem.model';
import { Topic } from '@models/Topic.model';
import { User } from '@models/User.model';
import { ApiError } from '@utils/ApiError';
import { HTTP_STATUS } from '@constants/http.constants';
import { DIFFICULTY } from '@constants/app.constants';
import mongoose from 'mongoose';

export interface TopicCompletion {
  topicId: string;
  title: string;
  slug: string;
  total: number;
  completed: number;
  percentage: number;
}

export interface RecentlySolved {
  problemId: string;
  title: string;
  slug: string;
  difficulty: string;
  completedAt: Date;
}

export interface DashboardStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalProblems: number;
  easyTotal: number;
  mediumTotal: number;
  hardTotal: number;
  streak: number;
  xp: number;
  topicCompletion: TopicCompletion[];
  recentlySolved: RecentlySolved[];
}

import { redis, getCacheKey, CACHE_TTL, isCacheAvailable } from '@utils/redis';

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  // Try to get from cache first
  const cacheKey = getCacheKey.dashboard(userId);
  if (isCacheAvailable()) {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  // Optimized parallel queries using aggregation
  const [statsData, allProblems, allTopics] = await Promise.all([
    Progress.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), completed: true } },
      {
        $lookup: {
          from: 'problems',
          localField: 'problemId',
          foreignField: '_id',
          as: 'problem',
        },
      },
      { $unwind: '$problem' },
      {
        $facet: {
          difficultyCounts: [
            { $group: { _id: '$problem.difficulty', count: { $sum: 1 } } },
          ],
          topicCounts: [
            { $group: { _id: '$problem.topicId', count: { $sum: 1 } } },
          ],
          recent: [
            { $sort: { completedAt: -1 } },
            { $limit: 10 },
            {
              $project: {
                problemId: '$problem._id',
                title: '$problem.title',
                slug: '$problem.slug',
                difficulty: '$problem.difficulty',
                completedAt: 1,
              },
            },
          ],
        },
      },
    ]),
    Problem.find({ isActive: true }, 'difficulty topicId'),
    Topic.find({ isActive: true }, 'title slug _id').sort({ order: 1 }),
  ]);

  const stats = statsData[0] || { difficultyCounts: [], topicCounts: [], recent: [] };

  // Calculate difficulty solved counts
  const solvedDiffs = stats.difficultyCounts.reduce((acc: any, curr: any) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});

  const easySolved = solvedDiffs[DIFFICULTY.EASY] ?? 0;
  const mediumSolved = solvedDiffs[DIFFICULTY.MEDIUM] ?? 0;
  const hardSolved = solvedDiffs[DIFFICULTY.HARD] ?? 0;
  const totalSolved = easySolved + mediumSolved + hardSolved;

  // Calculate difficulty totals
  const easyTotal = allProblems.filter((p) => p.difficulty === DIFFICULTY.EASY).length;
  const mediumTotal = allProblems.filter((p) => p.difficulty === DIFFICULTY.MEDIUM).length;
  const hardTotal = allProblems.filter((p) => p.difficulty === DIFFICULTY.HARD).length;

  // Map topic completion
  const solvedByTopic = stats.topicCounts.reduce((acc: any, curr: any) => {
    acc[curr._id.toString()] = curr.count;
    return acc;
  }, {});

  const totalByTopic = allProblems.reduce((acc: any, curr: any) => {
    const topicId = curr.topicId?.toString();
    if (topicId) acc[topicId] = (acc[topicId] ?? 0) + 1;
    return acc;
  }, {});

  const topicCompletion: TopicCompletion[] = allTopics.map((topic) => {
    const topicId = (topic._id as any).toString();
    const total = totalByTopic[topicId] ?? 0;
    const completed = solvedByTopic[topicId] ?? 0;
    return {
      topicId,
      title: topic.title,
      slug: topic.slug,
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  const result = {
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    totalProblems: allProblems.length,
    easyTotal,
    mediumTotal,
    hardTotal,
    streak: user.streak,
    xp: user.xp,
    topicCompletion,
    recentlySolved: stats.recent,
  };

  // Cache the result
  if (isCacheAvailable()) {
    await redis.set(cacheKey, JSON.stringify(result), 'EX', CACHE_TTL.DASHBOARD);
  }

  return result;
}
