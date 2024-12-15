import { Router } from 'express';
import { createAccount } from '../controllers/account';

const router = Router();

router.post('/', createAccount);

export default router;
