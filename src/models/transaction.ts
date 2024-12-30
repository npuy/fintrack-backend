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

export async function getTransactionsDB({
  userId,
  accountId,
  categoryId,
}: {
  userId?: string;
  accountId?: string;
  categoryId?: string;
}): Promise<Transaction[]> {
  let transactions;
  if (!accountId && !categoryId) {
    transactions = await prisma.transaction.findMany({
      where: {
        account: {
          userId,
        },
      },
    });
  } else if (accountId && !categoryId) {
    transactions = await prisma.transaction.findMany({
      where: {
        accountId,
      },
    });
  } else if (!accountId && categoryId) {
    transactions = await prisma.transaction.findMany({
      where: {
        categoryId,
      },
    });
  } else {
    transactions = await prisma.transaction.findMany({
      where: {
        accountId,
        categoryId,
      },
    });
  }

  return transactions.map((transaction) => ({
    id: transaction.id,
    amount: transaction.amount,
    description: transaction.description,
    accountId: transaction.accountId,
    categoryId: transaction.categoryId,
    type: transaction.typeId,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
  }));
}

export async function getTransactionByIdDB(
  transactionId: string,
): Promise<Transaction | null> {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
    },
  });
  if (!transaction) {
    return null;
  }
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

export async function updateTransactionDB(
  updateTransactionInput: CreateTransactionInput,
): Promise<Transaction> {
  const { id, amount, description, accountId, categoryId, type } =
    updateTransactionInput;
  if (!id) {
    throw new Error('Transaction ID is required');
  }
  const transaction = await prisma.transaction.update({
    where: {
      id,
    },
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

export async function deleteTransactionDB(transactionId: string) {
  await prisma.transaction.delete({
    where: {
      id: transactionId,
    },
  });
}
