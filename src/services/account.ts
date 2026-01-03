import {
  BadRequestError,
  ForbiddenAccessError,
  ValueNotFoundError,
} from '../configs/errors';

import { CreateAccountInput, Account } from '../types/account';

import {
  createAccountDB,
  deleteAccountDB,
  getAccountByIdDB,
  getAccountByUserIdAndName,
  getAccountsByUserDB,
  getAccountsByUserWithBalanceDB,
  reorderAccountsDB,
  updateAccountDB,
} from '../repository/account';
import { getTransactionsDB } from '../repository/transaction';

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
  currencyId: number,
  userId: string,
  enabled?: boolean,
): Promise<Account | null> {
  // Validate account ownership
  await validateAccountId(accountId, userId);

  // Check for duplicate account name
  const accountFound = await getAccountByUserIdAndName(userId, name);
  if (accountFound && accountFound.id !== accountId) {
    throw new BadRequestError('Account name already exists');
  }

  return await updateAccountDB(accountId, name, currencyId, enabled);
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

export async function deleteAccountService(
  accountId: string,
  userId: string,
): Promise<void> {
  // Validate account ownership
  await validateAccountId(accountId, userId);

  // Check for existing transactions
  const transactions = await getTransactionsDB({ accountId });
  if (transactions.length > 0) {
    throw new BadRequestError('Account has transactions');
  }

  await deleteAccountDB(accountId);
}

export async function getAccountByIdService(
  accountId: string,
  userId: string,
): Promise<Account> {
  const account = await getAccountByIdDB(accountId);

  if (!account) {
    throw new ValueNotFoundError('Account not found');
  }

  if (account.userId !== userId) {
    throw new ForbiddenAccessError('Forbidden');
  }

  return account;
}

export async function getAccountsByUserService(
  userId: string,
): Promise<Account[]> {
  return await getAccountsByUserDB(userId);
}

export async function getAccountsByUserWithBalanceService(
  userId: string,
): Promise<Account[]> {
  return await getAccountsByUserWithBalanceDB(userId);
}

export async function orderAccountsService(
  userId: string,
  orderedAccountIds: string[],
): Promise<void> {
  const accounts = await getAccountsByUserDB(userId);
  const accountIds = accounts.map((account) => account.id);

  // Validate that all provided IDs belong to the user
  for (const id of orderedAccountIds) {
    if (!accountIds.includes(id)) {
      throw new ForbiddenAccessError(
        `Account ID ${id} does not belong to the user`,
      );
    }
  }

  // Validate that no IDs are missing
  const uniqueIds = new Set(orderedAccountIds);
  if (uniqueIds.size !== accountIds.length) {
    throw new BadRequestError('Some account IDs are missing or duplicated');
  }

  // Update the order of accounts
  try {
    await reorderAccountsDB(userId, orderedAccountIds);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to reorder accounts');
  }
}
