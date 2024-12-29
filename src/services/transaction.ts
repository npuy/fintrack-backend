import { createTransactionDB } from '../models/transaction';
import { CreateTransactionInput } from '../types/transaction';

export async function createTransactionService(
  createTransactionInput: CreateTransactionInput,
) {
  const transaction = await createTransactionDB(createTransactionInput);

  return transaction;
}
