import { ForbiddenAccessError, ValueNotFoundError } from '../configs/errors';
import { getAccountByIdDB } from '../models/account';
import {
  createTransactionDB,
  getTransactionByIdDB,
} from '../models/transaction';
import { CreateTransactionInput } from '../types/transaction';

export async function createTransactionService(
  createTransactionInput: CreateTransactionInput,
) {
  const transaction = await createTransactionDB(createTransactionInput);

  return transaction;
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
