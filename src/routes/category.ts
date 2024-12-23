import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategories,
  updateCategory,
  getCategoriesWithBalance,
} from '../controllers/category';

const router = Router();

router.post('/', createCategory);
router.get('/', getCategories);
router.get('/balance', getCategoriesWithBalance);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
