import { Router } from 'express';
import { updateUserData } from '../controllers/user';
import { verifyToken } from '../middlewares/auth';

const router = Router();

router.put('/', verifyToken, updateUserData);

export default router;
