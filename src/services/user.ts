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
