import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import topicRoutes from './topic.routes';
import subtopicRoutes from './subtopic.routes';
import problemRoutes from './problem.routes';
import progressRoutes from './progress.routes';
import bookmarkRoutes from './bookmark.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/topics', topicRoutes);
router.use('/subtopics', subtopicRoutes);
router.use('/problems', problemRoutes);
router.use('/progress', progressRoutes);
router.use('/bookmarks', bookmarkRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
