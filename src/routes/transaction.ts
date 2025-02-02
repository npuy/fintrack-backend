import { Router } from 'express';
import {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  getTransactions,
  getTransactionsByAccount,
  getTransactionsByCategory,
  getTransactionsFull,
  updateTransaction,
} from '../controllers/transaction';
import { verifyToken } from '../middlewares/auth';
import { validateBody } from '../middlewares/validate';
import {
  createTransactionBodySchema,
  updateTransactionBodySchema,
} from '../middlewares/validation_schemas/transaction';

const router = Router();

router.post(
  '/',
  verifyToken,
  validateBody(createTransactionBodySchema),
  createTransaction,
);
router.get('/', verifyToken, getTransactions);
router.get('/full', verifyToken, getTransactionsFull);
router.get('/acc/:accountId', verifyToken, getTransactionsByAccount);
router.get('/cat/:categoryId', verifyToken, getTransactionsByCategory);
router.get('/:transactionId', verifyToken, getTransactionById);
router.put(
  '/:transactionId',
  verifyToken,
  validateBody(updateTransactionBodySchema),
  updateTransaction,
);
router.delete('/:transactionId', verifyToken, deleteTransaction);

export default router;
