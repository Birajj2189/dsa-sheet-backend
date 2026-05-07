import { Router } from 'express';
import { getSubtopicsByTopic } from '@controllers/subtopic.controller';

const router = Router();

router.get('/:topicId', getSubtopicsByTopic);

export default router;
