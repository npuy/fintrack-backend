import jwt from 'jsonwebtoken';
import { CustomJwtPayload } from '../types/jwt';
import { Request } from 'express';

export function getUserIdFromRequest(req: Request): string {
  const token = req.header('Authorization');
  if (!token) {
    throw new Error('No token, authorization denied');
  }
  const payload = jwt.verify(token, 'supersecretsecret');
  const { userId } = payload as CustomJwtPayload;
  return userId;
}

export function createToken(payload: CustomJwtPayload): string {
  return jwt.sign(payload, 'supersecretsecret', { expiresIn: '1h' });
}
