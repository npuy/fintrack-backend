import { Router } from 'express';
import { updateUserData } from '../controllers/user';
import { verifyToken } from '../middlewares/auth';

const router = Router();

router.put('/update', verifyToken, updateUserData);
