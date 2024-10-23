import { Router } from 'express';
import { healthCheck } from '../controllers/index';

const router = Router();

router.get('/health_check', healthCheck);

export default router;
