import { Router } from 'express';
import {
  createAccount,
  deleteAccount,
  getAccountById,
  getAccounts,
  updateAccount,
  getAccountsWithBalance,
} from '../controllers/account';

const router = Router();

router.post('/', createAccount);
router.get('/', getAccounts);
router.get('/balance', getAccountsWithBalance);
router.get('/:id', getAccountById);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);

export default router;
