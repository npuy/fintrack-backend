import { Router } from 'express';
import {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  getTransactions,
  getTransactionsByAccount,
  getTransactionsByCategory,
  updateTransaction,
} from '../controllers/transaction';
import { verifyToken } from '../middlewares/auth';

const router = Router();

router.post('/', verifyToken, createTransaction);
router.get('/', verifyToken, getTransactions);
router.get('/acc/:accountId', verifyToken, getTransactionsByAccount);
router.get('/cat/:categoryId', verifyToken, getTransactionsByCategory);
router.get('/:transactionId', verifyToken, getTransactionById);
router.put('/:transactionId', verifyToken, updateTransaction);
router.delete('/:transactionId', verifyToken, deleteTransaction);

export default router;
