import jwt from 'jsonwebtoken';
import { CustomJwtPayload } from '../types/jwt';
import { Request } from 'express';
import { env } from '../configs/config';

export function getUserIdFromRequest(req: Request): string {
  const token = req.header('Authorization');
  if (!token) {
    throw new Error('No token, authorization denied');
  }
  const payload = jwt.verify(token, env.JWT_SECRET);
  const { userId } = payload as CustomJwtPayload;
  return userId;
}

export function createToken(payload: CustomJwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '1h' });
}
