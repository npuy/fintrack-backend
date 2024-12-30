import {
  BadRequestError,
  ForbiddenAccessError,
  ValueNotFoundError,
} from '../configs/errors';
import {
  createAccountDB,
  deleteAccountDB,
  getAccountByIdDB,
  getAccountByUserIdAndName,
  updateAccountDB,
} from '../models/account';
import { getTransactionsDB } from '../models/transaction';
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

export async function validateAccountId(
  accountId: string,
  userId: string,
): Promise<void> {
  const account = await getAccountByIdDB(accountId);

  if (!account) {
    throw new ValueNotFoundError('Account not found');
  }

  if (account.userId !== userId) {
    throw new ForbiddenAccessError('Forbidden');
  }
}

export async function deleteAccountService(accountId: string): Promise<void> {
  const transactions = await getTransactionsDB({ accountId });
  if (transactions.length > 0) {
    throw new BadRequestError('Account has transactions');
  }
  await deleteAccountDB(accountId);
}
