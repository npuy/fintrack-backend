import { Router } from 'express';
import { getCurrencies } from '../controllers/currency';
import { verifyToken } from '../middlewares/auth';

const router = Router();

router.get('/', verifyToken, getCurrencies);

export default router;
