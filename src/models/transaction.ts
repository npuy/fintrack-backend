import { prisma } from '../../prisma/client';
import { CreateTransactionInput, Transaction } from '../types/transaction';

export async function createTransactionDB(
  createTransactionInput: CreateTransactionInput,
): Promise<Transaction> {
  const { amount, description, accountId, categoryId, type } =
    createTransactionInput;
  const transaction = await prisma.transaction.create({
    data: {
      amount,
      description,
      accountId,
      categoryId,
      typeId: type,
    },
  });

  return {
    id: transaction.id,
    amount: transaction.amount,
    description: transaction.description,
    accountId: transaction.accountId,
    categoryId: transaction.categoryId,
    type: transaction.typeId,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
  };
}
