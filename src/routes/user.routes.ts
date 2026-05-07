import { Router } from 'express';
import { getProfile, updateProfile } from '@controllers/user.controller';
import { authenticateUser } from '@middleware/auth.middleware';
import { validate } from '@middleware/validate.middleware';
import { updateProfileSchema } from '@validations/user.validation';

const router = Router();

router.use(authenticateUser);

router.get('/profile', getProfile);
router.patch('/profile', validate(updateProfileSchema), updateProfile);

export default router;
