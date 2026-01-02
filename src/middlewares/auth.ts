import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../configs/config';
import { UnauthorizedError } from '../configs/errors';

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization');

  if (!token) {
    next(new UnauthorizedError('Access denied'));
    return;
  }

  try {
    jwt.verify(token, env.JWT_SECRET);
  } catch {
    next(new UnauthorizedError('Access denied'));
    return;
  }

  next();
}
