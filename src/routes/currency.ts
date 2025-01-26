import { Router } from 'express';
import { getCurrencies, getCurrency } from '../controllers/currency';
import { verifyToken } from '../middlewares/auth';

const router = Router();

router.get('/', verifyToken, getCurrencies);
router.get('/:currencyId', verifyToken, getCurrency);

export default router;
