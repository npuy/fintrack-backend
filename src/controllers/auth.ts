import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = jwt.sign({ userId: user.id }, 'supersecretsecret');

  res.header('Authorization', token);

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    res.status(400).json({ message: 'Invalid credentials' });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(400).json({ message: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign({ userId: user.id }, 'supersecretsecret');

  res.header('Authorization', token);

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
}
