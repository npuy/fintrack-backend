import { Router } from 'express';
import { login, register } from '../controllers/auth';
import { validateBody } from '../middlewares/validate';
import {
  loginBodySchema,
  registerBodySchema,
} from '../middlewares/validation_schemas/auth';

const router = Router();

router.post('/login', validateBody(registerBodySchema), login);
router.post('/register', validateBody(loginBodySchema), register);

export default router;
