import { Router } from 'express';
import { verifyToken } from '../middlewares/auth';
import { createBudgetGroup } from '../controllers/budget';
import { validateBody } from '../middlewares/validate';
import { createBudgetGroupBodySchema } from '../middlewares/validation_schemas/budget';

const router = Router();

router.post(
  '/',
  verifyToken,
  validateBody(createBudgetGroupBodySchema),
  createBudgetGroup,
);

export default router;
