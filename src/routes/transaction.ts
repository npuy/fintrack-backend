import { Router } from 'express';
import { createTransaction } from '../controllers/transaction';

const router = Router();

router.post('/', createTransaction);

export default router;
