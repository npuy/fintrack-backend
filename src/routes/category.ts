import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategories,
  updateCategory,
  getCategoriesWithBalance,
  orderCategories,
} from '../controllers/category';
import { verifyToken } from '../middlewares/auth';
import { validateBody } from '../middlewares/validate';
import {
  createCategoryBodySchema,
  orderCategoriesBodySchema,
  updateCategoryBodySchema,
} from '../middlewares/validation_schemas/category';

const router = Router();

router.post(
  '/',
  verifyToken,
  validateBody(createCategoryBodySchema),
  createCategory,
);
router.get('/', verifyToken, getCategories);
router.get('/balance', verifyToken, getCategoriesWithBalance);
router.get('/:id', verifyToken, getCategoryById);
router.put(
  '/:id',
  verifyToken,
  validateBody(updateCategoryBodySchema),
  updateCategory,
);
router.delete('/:id', verifyToken, deleteCategory);
router.post(
  '/order',
  verifyToken,
  validateBody(orderCategoriesBodySchema),
  orderCategories,
);

export default router;
