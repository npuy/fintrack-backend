import { NextFunction, Request, Response } from 'express';

import { UnauthorizedError } from '../configs/errors';
import { CustomJwtPayload } from '../types/jwt';

import { createToken } from '../services/session';
import {
  createUserService,
  getUserPublicData,
  validateEmailAndPassword,
} from '../services/user';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { name, email, password } = req.body;

  try {
    const user = await createUserService(name, email, password);

    const token = createToken({ userId: user.id });
    res.header('Authorization', token);

    res.json(getUserPublicData(user));
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  const user = await validateEmailAndPassword(email, password);
  if (!user) {
    next(new UnauthorizedError('Invalid email or password'));
    return;
  }

  const payload: CustomJwtPayload = {
    userId: user.id,
  };
  const token = createToken(payload);
  res.header('Authorization', token);

  res.json(getUserPublicData(user));
}
