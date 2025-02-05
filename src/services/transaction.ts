import { ForbiddenAccessError, ValueNotFoundError } from '../configs/errors';
import { getAccountByIdDB } from '../models/account';
import {
  createTransactionDB,
  getTransactionByIdDB,
  updateTransactionDB,
} from '../models/transaction';
import {
  CreateTransactionInput,
  FilterTransactionsInput,
  OrderByDirections,
  OrderByFields,
  OrderByItem,
} from '../types/transaction';
import { ParsedQs } from 'qs';

export async function createTransactionService(
  createTransactionInput: CreateTransactionInput,
) {
  const transaction = await createTransactionDB(createTransactionInput);

  return transaction;
}

export async function updateTransactionService(
  updateTransactionInput: CreateTransactionInput,
) {
  if (!updateTransactionInput.id) {
    throw new Error('Transaction ID is required');
  }

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

export function formatGetTransactionsFilters(
  query: ParsedQs,
): FilterTransactionsInput {
  const { startDate, endDate, type, accountId, categoryId, orderBy } = query;
  return {
    startDate: startDate ? new Date(startDate as string) : undefined,
    endDate: endDate ? new Date(endDate as string) : undefined,
    type: type ? Number(type as string) : undefined,
    accountId: accountId ? (accountId as string) : undefined,
    categoryId: categoryId ? (categoryId as string) : undefined,
    orderBy: orderBy
      ? String(orderBy)
          .split(',')
          .map((clause) => {
            const [field, direction] = clause.split(':');
            return { field, direction } as OrderByItem;
          })
      : [
          {
            field: OrderByFields.Date,
            direction: OrderByDirections.Desc,
          },
        ],
  };
}
