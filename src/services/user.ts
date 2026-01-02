import bcrypt from 'bcrypt';

import { BadRequestError } from '../configs/errors';

import {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserPublicData,
} from '../types/user';

import {
  createUserDB,
  findUserByEmail,
  updateUserDB,
} from '../repository/user';

import { getCurrencyService } from './currency';

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

export function getUserPublicData(user: User): UserPublicData {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    payDay: user.payDay,
    currencyId: user.currencyId,
  };
}

export function getLastPayDay(payDay: number): Date {
  const today = new Date();
  const lastPayDay = new Date(today.getFullYear(), today.getMonth(), payDay);

  if (today < lastPayDay) {
    lastPayDay.setMonth(lastPayDay.getMonth() - 1);
  }

  // Handle months with less than 31 days
  while (lastPayDay.getDate() !== payDay) {
    lastPayDay.setDate(lastPayDay.getDate() - 1);
  }

  return lastPayDay;
}

export function getNextPayDay(payDay: number): Date {
  const today = new Date();
  const nextPayDay = new Date(today.getFullYear(), today.getMonth(), payDay);

  if (today >= nextPayDay) {
    nextPayDay.setMonth(nextPayDay.getMonth() + 1);
  }

  // Handle months with less than 31 days
  while (nextPayDay.getDate() !== payDay) {
    nextPayDay.setDate(nextPayDay.getDate() - 1);
  }

  return nextPayDay;
}

export async function createUserService(
  name: string,
  email: string,
  password: string,
): Promise<User> {
  if (await findUserByEmail(email)) {
    throw new BadRequestError('Email already exists');
  }

  const createUserInput: CreateUserInput = {
    name,
    email,
    password,
  };
  const user = await createUserDB(createUserInput);

  return user;
}

export async function getUserByEmailService(
  email: string,
): Promise<User | null> {
  const user = await findUserByEmail(email);
  return user;
}

export async function updateUserService(
  updateData: UpdateUserInput,
): Promise<User> {
  const { email, id: userId, currencyId } = updateData;

  const user = await getUserByEmailService(email);
  if (user && user.id !== userId) {
    throw new BadRequestError('Email already in use');
  }

  const currency = await getCurrencyService(currencyId);
  if (!currency) {
    throw new BadRequestError('Currency not found');
  }

  const updatedUser = await updateUserDB(updateData);
  return updatedUser;
}
