import { Router } from 'express';
import { register, login, logout, refreshToken, getMe } from '@controllers/auth.controller';
import { validate } from '@middleware/validate.middleware';
import { authenticateUser } from '@middleware/auth.middleware';
import { authLimiter } from '@middleware/rateLimit.middleware';
import { registerSchema, loginSchema } from '@validations/auth.validation';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/logout', authenticateUser, logout);
router.post('/refresh', refreshToken);
router.get('/me', authenticateUser, getMe);

export default router;
