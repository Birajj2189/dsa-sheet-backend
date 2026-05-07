import { Progress } from '@models/Progress.model';
import { IProgressDocument } from '@models/Progress.model';
import { Problem } from '@models/Problem.model';
import { User } from '@models/User.model';
import { ApiError } from '@utils/ApiError';
import { HTTP_STATUS } from '@constants/http.constants';
import { XP_VALUES, DIFFICULTY, Difficulty } from '@constants/app.constants';
import { ToggleProgressInput, UpdateNotesInput } from '@validations/progress.validation';
import { redis, getCacheKey, isCacheAvailable } from '@utils/redis';

export interface ToggleProgressResult {
  progress: IProgressDocument;
  completed: boolean;
}

export async function toggleProgress(
  userId: string,
  data: ToggleProgressInput,
): Promise<ToggleProgressResult> {
  const problem = await Problem.findById(data.problemId);
  if (!problem) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Problem not found');
  }

  const existingProgress = await Progress.findOne({ userId, problemId: data.problemId });
  const nowCompleted = existingProgress ? !existingProgress.completed : true;

  const progress = await Progress.findOneAndUpdate(
    { userId, problemId: data.problemId },
    { $set: { completed: nowCompleted, completedAt: nowCompleted ? new Date() : undefined } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  const xpChange = XP_VALUES[problem.difficulty as Difficulty] ?? XP_VALUES[DIFFICULTY.EASY];

  await User.findByIdAndUpdate(userId, {
    $inc: { xp: nowCompleted ? xpChange : -xpChange },
    $set: { lastActiveDate: new Date() },
  });

  // Invalidate dashboard cache
  if (isCacheAvailable()) {
    await redis.del(getCacheKey.dashboard(userId));
  }

  return { progress, completed: nowCompleted };
}

export async function getUserProgress(userId: string): Promise<IProgressDocument[]> {
  return Progress.find({ userId })
    .populate('problemId', 'title slug difficulty topicId')
    .sort({ updatedAt: -1 });
}

export async function updateNotes(
  userId: string,
  data: UpdateNotesInput,
): Promise<IProgressDocument> {
  const problem = await Problem.findById(data.problemId);
  if (!problem) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Problem not found');
  }

  const progress = await Progress.findOneAndUpdate(
    { userId, problemId: data.problemId },
    { $set: { notes: data.notes } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return progress;
}
