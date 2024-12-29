import { NextFunction, Request, Response } from 'express';
import { getUserIdFromRequest } from '../services/session';
import { validateAccountId } from '../models/account';
import { validateCategoryId } from '../models/category';
import { createTransactionService } from '../services/transaction';
import { CreateTransactionInput, TransactionType } from '../types/transaction';

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
