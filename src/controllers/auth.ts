import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { createToken } from '../utils/session';
import { CustomJwtPayload } from '../types/jwt';
import { CreateUserInput } from '../types/user';
import { createUserDB, validateEmailAndPassword } from '../models/user';

const prisma = new PrismaClient();

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  const createUserInput: CreateUserInput = {
    name,
    email,
    password,
  };
  const user = await createUserDB(createUserInput);

  const payload: CustomJwtPayload = {
    userId: user.id,
  };
  const token = createToken(payload);
  res.header('Authorization', token);

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await validateEmailAndPassword(email, password);
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const payload: CustomJwtPayload = {
    userId: user.id,
  };
  const token = createToken(payload);
  res.header('Authorization', token);

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
}
