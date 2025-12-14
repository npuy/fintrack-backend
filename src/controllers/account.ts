import { NextFunction, Request, Response } from 'express';

import { getUserIdFromRequest } from '../services/session';
import {
  createAccountService,
  deleteAccountService,
  getAccountByIdService,
  getAccountsByUserService,
  getAccountsByUserWithBalanceService,
  updateAccountService,
} from '../services/account';

export async function createAccount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { name, currencyId } = req.body;
  const userId = getUserIdFromRequest(req);

  try {
    const account = await createAccountService({
      name,
      currencyId,
      userId,
    });
    res.json(account);
  } catch (error) {
    next(error);
  }
}

export async function getAccounts(req: Request, res: Response) {
  const userId = getUserIdFromRequest(req);

  const accounts = await getAccountsByUserService(userId);

  res.json(accounts);
}

export async function getAccountsWithBalance(req: Request, res: Response) {
  const userId = getUserIdFromRequest(req);

  const accountsWithBalance = await getAccountsByUserWithBalanceService(userId);

  res.json(accountsWithBalance);
}

export async function getAccountById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const accountId = req.params.id;

  try {
    const account = await getAccountByIdService(accountId, userId);
    res.json(account);
  } catch (error) {
    next(error);
  }
}

export async function updateAccount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const accountId = req.params.id;
  const { name, currencyId } = req.body;

  try {
    const updatedAccount = await updateAccountService(
      accountId,
      name,
      currencyId,
      userId,
    );
    res.json(updatedAccount);
  } catch (error) {
    next(error);
  }
}

export async function deleteAccount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const accountId = req.params.id;

  try {
    await deleteAccountService(accountId, userId);
    res.json({ message: 'Account deleted' });
  } catch (error) {
    next(error);
  }
}
