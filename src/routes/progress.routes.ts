import { Router } from 'express';
import { toggleProgress, getMyProgress, updateNotes } from '@controllers/progress.controller';
import { authenticateUser } from '@middleware/auth.middleware';
import { validate } from '@middleware/validate.middleware';
import { toggleProgressSchema, updateNotesSchema } from '@validations/progress.validation';

const router = Router();

router.use(authenticateUser);

router.post('/toggle', validate(toggleProgressSchema), toggleProgress);
router.get('/me', getMyProgress);
router.patch('/notes', validate(updateNotesSchema), updateNotes);

export default router;
