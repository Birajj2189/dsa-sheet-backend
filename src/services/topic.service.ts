import { Topic } from '@models/Topic.model';
import { ITopicDocument } from '@models/Topic.model';
import { ApiError } from '@utils/ApiError';
import { HTTP_STATUS } from '@constants/http.constants';

export async function getAllTopics(): Promise<ITopicDocument[]> {
  return Topic.find({ isActive: true }).sort({ order: 1 });
}

export async function getTopicBySlug(slug: string): Promise<ITopicDocument> {
  const topic = await Topic.findOne({ slug, isActive: true });
  if (!topic) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, `Topic '${slug}' not found`);
  }
  return topic;
}

export async function getTopicById(id: string): Promise<ITopicDocument> {
  const topic = await Topic.findById(id);
  if (!topic) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Topic not found');
  }
  return topic;
}
