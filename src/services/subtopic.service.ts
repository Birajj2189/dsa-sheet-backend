import { Subtopic } from '@models/Subtopic.model';
import { ISubtopicDocument } from '@models/Subtopic.model';
import { ApiError } from '@utils/ApiError';
import { HTTP_STATUS } from '@constants/http.constants';

export async function getSubtopicsByTopic(topicId: string): Promise<ISubtopicDocument[]> {
  const subtopics = await Subtopic.find({ topicId }).sort({ order: 1 });

  if (!subtopics.length) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'No subtopics found for this topic');
  }

  return subtopics;
}
