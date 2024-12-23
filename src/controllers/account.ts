import { NextFunction, Request, Response } from 'express';
import { CreateAccountInput } from '../types/account';
import {
  createAccountDB,
  deleteAccountDB,
  getAccountByIdDB,
  getAccountsByUserDB,
  getAccountsByUserWithBalanceDB,
  updateAccountDB,
} from '../models/account';
import { getUserIdFromRequest } from '../services/session';
import { ForbiddenAccessError, ValueNotFoundError } from '../configs/errors';

export async function createAccount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { name } = req.body;
  const userId = getUserIdFromRequest(req);

  const createAccountInput: CreateAccountInput = {
    name,
    userId,
  };
  const account = await createAccountDB(createAccountInput);

  res.json(account);
}

export async function getAccounts(req: Request, res: Response) {
  const userId = getUserIdFromRequest(req);

  const accounts = await getAccountsByUserDB(userId);

  res.json(accounts);
}

export async function getAccountsWithBalance(req: Request, res: Response) {
  const userId = getUserIdFromRequest(req);

  const accountsWithBalance = await getAccountsByUserWithBalanceDB(userId);

  res.json(accountsWithBalance);
}

export async function getAccountById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const accountId = req.params.id;

  const account = await getAccountByIdDB(accountId);

  if (!account) {
    next(new ValueNotFoundError('Account not found'));
    return;
  }

  if (account.userId !== userId) {
    next(new ForbiddenAccessError('Forbidden'));
    return;
  }

  res.json(account);
}

export async function updateAccount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const accountId = req.params.id;
  const { name } = req.body;

  const account = await getAccountByIdDB(accountId);

  if (!account) {
    next(new ValueNotFoundError('Account not found'));
    return;
  }

  if (account.userId !== userId) {
    next(new ForbiddenAccessError('Forbidden'));
    return;
  }

  const updatedAccount = await updateAccountDB(accountId, name);

  res.json(updatedAccount);
}

export async function deleteAccount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const accountId = req.params.id;

  const account = await getAccountByIdDB(accountId);

  if (!account) {
    next(new ValueNotFoundError('Account not found'));
    return;
  }

  if (account.userId !== userId) {
    next(new ForbiddenAccessError('Forbidden'));
    return;
  }

  await deleteAccountDB(accountId);

  res.json({ message: 'Account deleted' });
}
