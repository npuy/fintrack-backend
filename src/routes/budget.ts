import { Router } from 'express';
import { verifyToken } from '../middlewares/auth';
import {
  createBudgetGroup,
  deleteBudgetGroup,
  getBudgetGroupById,
  getBudgetGroups,
  updateBudgetGroup,
} from '../controllers/budget';
import { validateBody } from '../middlewares/validate';
import { createBudgetGroupBodySchema } from '../middlewares/validation_schemas/budget';

const router = Router();

router.post(
  '/',
  verifyToken,
  validateBody(createBudgetGroupBodySchema),
  createBudgetGroup,
);
router.get('/', verifyToken, getBudgetGroups);
router.get('/:id', verifyToken, getBudgetGroupById);
router.put('/:id', verifyToken, updateBudgetGroup);
router.delete('/:id', verifyToken, deleteBudgetGroup);

export default router;
