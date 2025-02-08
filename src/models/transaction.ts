import { prisma } from '../../prisma/client';
import {
  CreateTransactionInput,
  FilterTransactionsInput,
  Transaction,
  TransactionFull,
} from '../types/transaction';

export async function createTransactionDB(
  createTransactionInput: CreateTransactionInput,
): Promise<Transaction> {
  const { amount, description, date, accountId, categoryId, type } =
    createTransactionInput;
  const transaction = await prisma.transaction.create({
    data: {
      amount,
      description,
      date,
      accountId,
      categoryId,
      typeId: type,
    },
  });

  return {
    id: transaction.id,
    amount: transaction.amount,
    description: transaction.description,
    date: transaction.date,
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
    date: transaction.date,
    accountId: transaction.accountId,
    categoryId: transaction.categoryId,
    type: transaction.typeId,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
  }));
}

export async function getTransactionsFullDB({
  userId,
  filters,
}: {
  userId: string;
  filters: FilterTransactionsInput;
}): Promise<TransactionFull[]> {
  const transactions = await prisma.transaction.findMany({
    skip: filters.offset,
    take: filters.limit,
    where: {
      date: {
        gte: new Date(filters.startDate ? filters.startDate : '1970-01-01'),
        lte: new Date(filters.endDate ? filters.endDate : '2100-01-01'),
      },
      typeId: filters.type,
      accountId: filters.accountId,
      categoryId: filters.categoryId,
      account: {
        userId,
      },
    },
    orderBy: filters.orderBy
      ? filters.orderBy.map((clause) => ({
          [clause.field]: clause.direction,
        }))
      : undefined,
    include: {
      account: {
        include: {
          currency: true,
        },
      },
      category: true,
    },
  });

  return transactions.map((transaction) => ({
    id: transaction.id,
    amount: transaction.amount,
    description: transaction.description,
    date: transaction.date,
    accountId: transaction.accountId,
    categoryId: transaction.categoryId,
    type: transaction.typeId,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
    account: {
      id: transaction.account.id,
      name: transaction.account.name,
      currencyId: transaction.account.currencyId,
      currency: transaction.account.currency,
      userId: transaction.account.userId,
      createdAt: transaction.account.createdAt,
      updatedAt: transaction.account.updatedAt,
    },
    category: {
      id: transaction.category.id,
      name: transaction.category.name,
      userId: transaction.category.userId,
      createdAt: transaction.category.createdAt,
      updatedAt: transaction.category.updatedAt,
    },
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
    date: transaction.date,
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
    date: transaction.date,
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
