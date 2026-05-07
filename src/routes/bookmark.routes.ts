import { Router } from 'express';
import { toggleBookmark, getMyBookmarks } from '@controllers/bookmark.controller';
import { authenticateUser } from '@middleware/auth.middleware';
import { validate } from '@middleware/validate.middleware';
import { toggleBookmarkSchema } from '@validations/progress.validation';

const router = Router();

router.use(authenticateUser);

router.post('/toggle', validate(toggleBookmarkSchema), toggleBookmark);
router.get('/me', getMyBookmarks);

export default router;
