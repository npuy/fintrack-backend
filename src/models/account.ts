import { Account, CreateAccountInput } from '../types/account';
import { prisma } from '../../prisma/client';

export async function createAccountDB(
  account: CreateAccountInput,
): Promise<Account> {
  const newAccount = await prisma.account.create({
    data: {
      name: account.name,
      userId: account.userId,
    },
  });
  const res: Account = {
    id: newAccount.id,
    name: newAccount.name,
    userId: newAccount.userId,
    createdAt: newAccount.createdAt,
    updatedAt: newAccount.updatedAt,
  };
  return res;
}
