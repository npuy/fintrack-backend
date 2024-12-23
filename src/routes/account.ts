import { Router } from 'express';
import {
  createAccount,
  deleteAccount,
  getAccountById,
  getAccounts,
  updateAccount,
  getAccountsWithBalance,
} from '../controllers/account';
import { verifyToken } from '../middlewares/auth';

const router = Router();

router.post('/', verifyToken, createAccount);
router.get('/', verifyToken, getAccounts);
router.get('/balance', verifyToken, getAccountsWithBalance);
router.get('/:id', verifyToken, getAccountById);
router.put('/:id', verifyToken, updateAccount);
router.delete('/:id', verifyToken, deleteAccount);

export default router;
