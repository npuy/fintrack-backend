import { NextFunction, Request, Response } from 'express';

import { getUserIdFromRequest } from '../services/session';
import {
  createTransactionService,
  deleteTransactionService,
  formatGetTransactionsFilters,
  getTransactionByIdService,
  getTransactionsByAccountService,
  getTransactionsByCategoryService,
  getTransactionsFullService,
  getTransactionsService,
  updateTransactionService,
} from '../services/transaction';

export async function createTransaction(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const {
    amount,
    description,
    date: dateString,
    accountId,
    categoryId,
    type,
  }: {
    amount: number;
    description: string;
    date: string;
    accountId: string;
    categoryId: string;
    type: number;
  } = req.body;

  const date = new Date(dateString);

  try {
    const transaction = await createTransactionService(
      {
        amount,
        description,
        date,
        accountId,
        categoryId,
        type,
      },
      userId,
    );
    res.json(transaction);
  } catch (error) {
    next(error);
  }
}

export async function getTransactions(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);

  try {
    const transactions = await getTransactionsService(userId);
    res.json(transactions);
  } catch (error) {
    next(error);
  }
}

export async function getTransactionsFull(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);

  try {
    const filters = await formatGetTransactionsFilters(req.query, userId);
    const { transactions, total } = await getTransactionsFullService(
      userId,
      filters,
    );

    res.json({ data: transactions, total });
  } catch (error) {
    next(error);
  }
}

export async function getTransactionById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const transactionId = req.params.transactionId;

  try {
    const transactions = await getTransactionByIdService(transactionId, userId);
    res.json(transactions);
  } catch (error) {
    next(error);
  }
}

export async function getTransactionsByAccount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const accountId = req.params.accountId;

  try {
    const transactions = await getTransactionsByAccountService(
      userId,
      accountId,
    );
    res.json(transactions);
  } catch (error) {
    next(error);
  }
}

export async function getTransactionsByCategory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const categoryId = req.params.categoryId;

  try {
    const transactions = await getTransactionsByCategoryService(
      userId,
      categoryId,
    );
    res.json(transactions);
  } catch (error) {
    next(error);
  }
}

export async function updateTransaction(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const transactionId = req.params.transactionId;
  const {
    amount,
    description,
    date: dateString,
    accountId,
    categoryId,
    type,
  }: {
    amount: number;
    description: string;
    date: string;
    accountId: string;
    categoryId: string;
    type: number;
  } = req.body;

  const date = new Date(dateString);

  try {
    const transaction = await updateTransactionService(
      {
        id: transactionId,
        amount,
        description,
        date,
        accountId,
        categoryId,
        type,
      },
      userId,
    );
    res.json(transaction);
  } catch (error) {
    next(error);
  }
}

export async function deleteTransaction(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const transactionId = req.params.transactionId;

  try {
    await deleteTransactionService(transactionId, userId);
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    next(error);
  }
}
