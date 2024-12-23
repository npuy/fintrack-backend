import { BadRequestError } from '../configs/errors';
import {
  createAccountDB,
  getAccountByUserIdAndName,
  updateAccountDB,
} from '../models/account';
import { CreateAccountInput, Account } from '../types/account';

export async function createAccountService(
  createAccountInput: CreateAccountInput,
): Promise<Account> {
  const accountFound = await getAccountByUserIdAndName(
    createAccountInput.userId,
    createAccountInput.name,
  );
  if (accountFound) {
    throw new BadRequestError('Account name already exists');
  }
  return await createAccountDB(createAccountInput);
}

export async function updateAccountService(
  accountId: string,
  name: string,
  userId: string,
): Promise<Account | null> {
  const accountFound = await getAccountByUserIdAndName(userId, name);
  if (accountFound && accountFound.id !== accountId) {
    throw new BadRequestError('Account name already exists');
  }
  return await updateAccountDB(accountId, name);
}
