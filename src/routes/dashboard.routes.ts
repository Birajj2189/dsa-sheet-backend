import { Router } from 'express';
import { getDashboardStats } from '@controllers/dashboard.controller';
import { authenticateUser } from '@middleware/auth.middleware';

const router = Router();

router.use(authenticateUser);

router.get('/stats', getDashboardStats);

export default router;
