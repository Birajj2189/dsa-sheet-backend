import { Router } from 'express';
import { getTopics, getTopicBySlug } from '@controllers/topic.controller';

const router = Router();

router.get('/', getTopics);
router.get('/:slug', getTopicBySlug);

export default router;
