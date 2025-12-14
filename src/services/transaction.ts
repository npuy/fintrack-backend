import { ParsedQs } from 'qs';

import { ForbiddenAccessError, ValueNotFoundError } from '../configs/errors';

import {
  CreateTransactionInput,
  FilterTransactionsInput,
  OrderByDirections,
  OrderByFields,
  OrderByItem,
} from '../types/transaction';

import { getAccountByIdDB } from '../repository/account';
import {
  createTransactionDB,
  deleteTransactionDB,
  getTotalNumberTransactionsFullDB,
  getTransactionByIdDB,
  getTransactionsDB,
  getTransactionsFullDB,
  updateTransactionDB,
} from '../repository/transaction';
import { getUserByIdDB } from '../repository/user';

import { getLastPayDay, getNextPayDay } from './user';
import { validateAccountId } from './account';
import { validateCategoryId } from './category';

import { formatDateToUTCMidnight } from '../utils/date';

export async function createTransactionService(
  createTransactionInput: CreateTransactionInput,
  userId: string,
) {
  const { accountId, categoryId } = createTransactionInput;
  await validateAccountId(accountId, userId);
  await validateCategoryId(categoryId, userId);

  createTransactionInput.date = formatDateToUTCMidnight(
    createTransactionInput.date,
  );

  const transaction = await createTransactionDB(createTransactionInput);

  return transaction;
}

export async function updateTransactionService(
  updateTransactionInput: CreateTransactionInput,
  userId: string,
) {
  const { id: transactionId, accountId, categoryId } = updateTransactionInput;
  await validateAccountId(accountId, userId);
  await validateCategoryId(categoryId, userId);
  await validateTransactionId(transactionId!, userId);

  updateTransactionInput.date = formatDateToUTCMidnight(
    updateTransactionInput.date,
  );

  const updatedTransaction = await updateTransactionDB(updateTransactionInput);

  return updatedTransaction;
}

export async function getTransactionByIdService(
  transactionId: string,
  userId: string,
) {
  const transaction = await getTransactionByIdDB(transactionId);
  if (!transaction) {
    throw new ValueNotFoundError('Transaction not found');
  }

  const account = await getAccountByIdDB(transaction.accountId);
  if (!account) {
    throw new ValueNotFoundError('Account not found');
  }

  if (account.userId !== userId) {
    throw new ForbiddenAccessError(
      'You do not have access to this transaction',
    );
  }

  return transaction;
}

export async function validateTransactionId(
  transactionId: string,
  userId: string,
) {
  const transaction = await getTransactionByIdService(transactionId, userId);
  if (!transaction) {
    throw new ValueNotFoundError('Transaction not found');
  }
  const account = await getAccountByIdDB(transaction.accountId);
  if (!account) {
    throw new ValueNotFoundError('Account not found');
  }
  if (account.userId !== userId) {
    throw new ForbiddenAccessError('Forbidden');
  }
}

export async function formatGetTransactionsFilters(
  query: ParsedQs,
  userId: string,
): Promise<FilterTransactionsInput> {
  const {
    startDate,
    endDate,
    type,
    accountId,
    categoryId,
    orderBy,
    limit,
    offset,
  } = query;

  const user = await getUserByIdDB(userId);
  if (!user) {
    throw new ValueNotFoundError('User not found');
  }
  const payDay = user.payDay;
  const defaultFilters: FilterTransactionsInput = {
    startDate: getLastPayDay(payDay),
    endDate: getNextPayDay(payDay),
    orderBy: [
      {
        field: OrderByFields.Date,
        direction: OrderByDirections.Desc,
      },
    ],
    limit: 20,
    offset: 0,
  };

  return {
    startDate: startDate
      ? new Date(startDate as string)
      : defaultFilters.startDate,
    endDate: endDate ? new Date(endDate as string) : defaultFilters.endDate,
    type: type ? Number(type as string) : defaultFilters.type,
    accountId: accountId ? (accountId as string) : defaultFilters.accountId,
    categoryId: categoryId ? (categoryId as string) : defaultFilters.categoryId,
    orderBy:
      orderBy && String(orderBy) !== ''
        ? String(orderBy)
            .split(',')
            .map((clause) => {
              const [field, direction] = clause.split(':');
              return { field, direction } as OrderByItem;
            })
        : defaultFilters.orderBy,
    limit: limit ? Number(limit) : defaultFilters.limit,
    offset: offset ? Number(offset) : defaultFilters.offset,
  };
}

export async function deleteTransactionService(
  transactionId: string,
  userId: string,
): Promise<void> {
  await validateTransactionId(transactionId, userId);

  await deleteTransactionDB(transactionId);
}

export async function getTransactionsFullService(
  userId: string,
  filters: FilterTransactionsInput,
) {
  const transactions = await getTransactionsFullDB({ userId, filters });
  const total = await getTotalNumberTransactionsFullDB({ userId, filters });

  return { transactions, total };
}

export async function getTransactionsService(userId: string) {
  return getTransactionsDB({ userId });
}

export async function getTransactionsByAccountService(
  userId: string,
  accountId: string,
) {
  await validateAccountId(accountId, userId);

  return getTransactionsDB({ userId, accountId });
}

export async function getTransactionsByCategoryService(
  userId: string,
  categoryId: string,
) {
  await validateCategoryId(categoryId, userId);

  return getTransactionsDB({ userId, categoryId });
}
