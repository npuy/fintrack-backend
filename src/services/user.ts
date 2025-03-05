import { findUserByEmail } from '../models/user';
import { User, UserPublicData } from '../types/user';
import bcrypt from 'bcrypt';

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
  let lastPayDay = new Date(today.getFullYear(), today.getMonth(), payDay);

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
  let nextPayDay = new Date(today.getFullYear(), today.getMonth(), payDay);

  if (today >= nextPayDay) {
    nextPayDay.setMonth(nextPayDay.getMonth() + 1);
  }

  // Handle months with less than 31 days
  while (nextPayDay.getDate() !== payDay) {
    nextPayDay.setDate(nextPayDay.getDate() - 1);
  }

  return nextPayDay;
}
