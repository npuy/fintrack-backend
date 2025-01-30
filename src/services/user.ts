import { findUserByEmail } from '../models/user';
import { User } from '../types/user';
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
