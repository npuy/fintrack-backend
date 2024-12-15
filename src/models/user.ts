import { prisma } from '../../prisma/client';
import { CreateUserInput, User } from '../types/user';
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
    hashedPassword: newUser.password,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
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
    hashedPassword: user.password,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  return res;
}

export async function validateEmailAndPassword(
  email: string,
  password: string,
): Promise<User | null> {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }
  const isMatch = await bcrypt.compare(password, user.hashedPassword);
  if (!isMatch) {
    return null;
  }
  return user;
}
