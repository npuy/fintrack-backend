import { Request, Response } from 'express';
import { CreateAccountInput } from '../types/account';
import { createAccountDB } from '../models/account';
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
