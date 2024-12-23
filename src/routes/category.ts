import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategories,
  updateCategory,
  getCategoriesWithBalance,
} from '../controllers/category';
import { verifyToken } from '../middlewares/auth';

const router = Router();

router.post('/', verifyToken, createCategory);
router.get('/', verifyToken, getCategories);
router.get('/balance', verifyToken, getCategoriesWithBalance);
router.get('/:id', verifyToken, getCategoryById);
router.put('/:id', verifyToken, updateCategory);
router.delete('/:id', verifyToken, deleteCategory);

export default router;
