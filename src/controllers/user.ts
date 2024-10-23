import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';

const prisma = new PrismaClient();

export const createUser: RequestHandler = async (req, res) => {
  const { name, email } = req.body;

  const user = await prisma.user.create({
    data: {
      name,
      email,
    },
  });

  res.json(user);
};

export const getUserById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  res.json(user);
};

export const updateUser: RequestHandler = async (req, res) => {
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
};
