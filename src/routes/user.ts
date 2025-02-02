import { Router } from 'express';
import { updateUserData } from '../controllers/user';
import { verifyToken } from '../middlewares/auth';
import { validateBody } from '../middlewares/validate';
import { updateUserBodySchema } from '../middlewares/validation_schemas/user';

const router = Router();

router.put(
  '/',
  verifyToken,
  validateBody(updateUserBodySchema),
  updateUserData,
);

export default router;
