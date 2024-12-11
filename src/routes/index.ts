import { Router } from 'express';
import { healthCheck } from '../controllers/index';
import { verifyToken } from '../middlewares/auth';

const router = Router();

router.get('/health_check', verifyToken, healthCheck);

export default router;
