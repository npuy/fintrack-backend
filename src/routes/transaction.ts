import { Router } from 'express';
import {
  createTransaction,
  getTransactionById,
  getTransactions,
  getTransactionsByAccount,
  getTransactionsByCategory,
} from '../controllers/transaction';
import { verifyToken } from '../middlewares/auth';

const router = Router();

router.post('/', verifyToken, createTransaction);
router.get('/', verifyToken, getTransactions);
router.get('/acc/:accountId', verifyToken, getTransactionsByAccount);
router.get('/cat/:categoryId', verifyToken, getTransactionsByCategory);
router.get('/:transactionId', verifyToken, getTransactionById);

export default router;
