import { ForbiddenAccessError, ValueNotFoundError } from '../configs/errors';
import { getAccountByIdDB } from '../models/account';
import {
  createTransactionDB,
  getTransactionByIdDB,
  updateTransactionDB,
} from '../models/transaction';
import { CreateTransactionInput } from '../types/transaction';

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
