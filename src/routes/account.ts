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
import { validateBody } from '../middlewares/validate';
import {
  createAccountBodySchema,
  updateAccountBodySchema,
} from '../middlewares/validation_schemas/account';

const router = Router();

router.post(
  '/',
  verifyToken,
  validateBody(createAccountBodySchema),
  createAccount,
);
router.get('/', verifyToken, getAccounts);
router.get('/balance', verifyToken, getAccountsWithBalance);
router.get('/:id', verifyToken, getAccountById);
router.put(
  '/:id',
  verifyToken,
  validateBody(updateAccountBodySchema),
  updateAccount,
);
router.delete('/:id', verifyToken, deleteAccount);

export default router;
