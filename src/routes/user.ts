import { Router } from 'express';
import { createUser, getUserById, updateUser } from '../controllers/user';

const router = Router();

router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);

export default router;
