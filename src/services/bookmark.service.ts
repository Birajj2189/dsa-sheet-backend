import { Progress } from '@models/Progress.model';
import { IProgressDocument } from '@models/Progress.model';
import { Problem } from '@models/Problem.model';
import { ApiError } from '@utils/ApiError';
import { HTTP_STATUS } from '@constants/http.constants';
import { ToggleBookmarkInput } from '@validations/progress.validation';

export interface ToggleBookmarkResult {
  progress: IProgressDocument;
  bookmarked: boolean;
}

export async function toggleBookmark(
  userId: string,
  data: ToggleBookmarkInput,
): Promise<ToggleBookmarkResult> {
  const problem = await Problem.findById(data.problemId);
  if (!problem) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Problem not found');
  }

  const existingProgress = await Progress.findOne({ userId, problemId: data.problemId });
  const nowBookmarked = existingProgress ? !existingProgress.bookmarked : true;

  const progress = await Progress.findOneAndUpdate(
    { userId, problemId: data.problemId },
    { $set: { bookmarked: nowBookmarked } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return { progress, bookmarked: nowBookmarked };
}

export async function getUserBookmarks(userId: string): Promise<IProgressDocument[]> {
  return Progress.find({ userId, bookmarked: true })
    .populate({
      path: 'problemId',
      select: 'title slug difficulty topicId tags estimatedTime leetcodeLink',
      populate: { path: 'topicId', select: 'title slug' },
    })
    .sort({ updatedAt: -1 });
}
