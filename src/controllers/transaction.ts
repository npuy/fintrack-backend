import { NextFunction, Request, Response } from 'express';
import { getUserIdFromRequest } from '../services/session';
import { validateAccountId } from '../models/account';
import { validateCategoryId } from '../models/category';
import {
  createTransactionService,
  getTransactionByIdService,
} from '../services/transaction';
import { CreateTransactionInput, TransactionType } from '../types/transaction';
import { getTransactionsDB } from '../models/transaction';

export async function createTransaction(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const {
    amount,
    description,
    accountId,
    categoryId,
    type,
  }: {
    amount: number;
    description: string;
    accountId: string;
    categoryId: string;
    type: number;
  } = req.body;

  try {
    await validateAccountId(accountId, userId);
  } catch (error) {
    next(error);
    return;
  }

  try {
    await validateCategoryId(categoryId, userId);
  } catch (error) {
    next(error);
    return;
  }

  try {
    const createTransactionInput: CreateTransactionInput = {
      amount,
      description,
      accountId,
      categoryId,
      type: type as TransactionType,
    };
    const transaction = await createTransactionService(createTransactionInput);
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
    const transactions = await getTransactionsDB({ userId });
    res.json(transactions);
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
    await validateAccountId(accountId, userId);
  } catch (error) {
    next(error);
    return;
  }

  try {
    const transactions = await getTransactionsDB({ userId, accountId });
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
    await validateCategoryId(categoryId, userId);
  } catch (error) {
    next(error);
    return;
  }

  try {
    const transactions = await getTransactionsDB({ userId, categoryId });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
}
