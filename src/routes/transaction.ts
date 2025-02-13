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
import { validateBody, validateQuery } from '../middlewares/validate';
import {
  createTransactionBodySchema,
  getTransactionQuerySchema,
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
router.get(
  '/full',
  verifyToken,
  validateQuery(getTransactionQuerySchema),
  getTransactionsFull,
);
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
