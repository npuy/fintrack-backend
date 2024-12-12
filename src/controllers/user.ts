import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function createUser(req: Request, res: Response) {
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

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
}

export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  res.json(user);
}

export async function updateUser(req: Request, res: Response) {
  const { id } = req.params;
  const { name, email } = req.body;

  const user = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      name,
      email,
    },
  });

  res.json(user);
}
