import { Router } from 'express';
import {
  getProblems,
  getProblemBySlug,
  getProblemsByTopic,
} from '@controllers/problem.controller';

const router = Router();

router.get('/', getProblems);
router.get('/topic/:topicId', getProblemsByTopic);
router.get('/:slug', getProblemBySlug);

export default router;
