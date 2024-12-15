import { Request, Response } from 'express';
import { CreateAccountInput } from '../types/account';
import {
  createAccountDB,
  deleteAccountDB,
  getAccountByIdDB,
  getAccountsByUserDB,
  updateAccountDB,
} from '../models/account';
import { getUserIdFromRequest } from '../utils/session';

export async function createAccount(req: Request, res: Response) {
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

export async function getAccountById(req: Request, res: Response) {
  const userId = getUserIdFromRequest(req);
  const accountId = req.params.id;

  const account = await getAccountByIdDB(accountId);

  if (!account) {
    res.status(404).json({ message: 'Account not found' });
    return;
  }

  if (account.userId !== userId) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  res.json(account);
}

export async function updateAccount(req: Request, res: Response) {
  const userId = getUserIdFromRequest(req);
  const accountId = req.params.id;
  const { name } = req.body;

  const account = await getAccountByIdDB(accountId);

  if (!account) {
    res.status(404).json({ message: 'Account not found' });
    return;
  }

  if (account.userId !== userId) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  const updatedAccount = await updateAccountDB(accountId, name);

  res.json(updatedAccount);
}

export async function deleteAccount(req: Request, res: Response) {
  const userId = getUserIdFromRequest(req);
  const accountId = req.params.id;

  const account = await getAccountByIdDB(accountId);

  if (!account) {
    res.status(404).json({ message: 'Account not found' });
    return;
  }

  if (account.userId !== userId) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  await deleteAccountDB(accountId);

  res.json({ message: 'Account deleted' });
}
