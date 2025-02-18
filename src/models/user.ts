import { prisma } from '../../prisma/client';
import { CreateUserInput, UpdateUserInput, User } from '../types/user';
import bcrypt from 'bcrypt';

export async function createUserDB(user: CreateUserInput): Promise<User> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);

  const newUser = await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      password: hashedPassword,
    },
  });
  const res: User = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    payDay: newUser.payDay,
    currencyId: newUser.currencyId,
    hashedPassword: newUser.password,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  };
  return res;
}

export async function updateUserDB(user: UpdateUserInput): Promise<User> {
  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name: user.name,
      email: user.email,
      currencyId: user.currencyId,
    },
  });
  const res: User = {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    payDay: user.payDay,
    currencyId: updatedUser.currencyId,
    hashedPassword: updatedUser.password,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  };
  return res;
}

export async function getUserByIdDB(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    return null;
  }
  const res: User = {
    id: user.id,
    name: user.name,
    email: user.email,
    payDay: user.payDay,
    currencyId: user.currencyId,
    hashedPassword: user.password,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  return res;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return null;
  }
  const res: User = {
    id: user.id,
    name: user.name,
    email: user.email,
    payDay: user.payDay,
    currencyId: user.currencyId,
    hashedPassword: user.password,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  return res;
}
