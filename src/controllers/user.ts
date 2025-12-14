import { NextFunction, Request, Response } from 'express';
import { getUserIdFromRequest } from '../services/session';
import { getCurrencyByIdDB } from '../models/currency';
import { BadRequestError } from '../configs/errors';
import { findUserByEmail, updateUserDB } from '../models/user';
import { UpdateUserInput } from '../types/user';
import { getUserPublicData } from '../services/user';

export async function updateUserData(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const { name, email, currencyId, payDay } = req.body;

  const user = await findUserByEmail(email);

  if (user && user.id !== userId) {
    next(new BadRequestError('Email already in use'));
    return;
  }

  const currency = await getCurrencyByIdDB(currencyId);

  if (!currency) {
    next(new BadRequestError('Currency not found'));
    return;
  }

  const updateUserData: UpdateUserInput = {
    id: userId,
    name,
    email,
    currencyId,
    payDay,
  };
  const updatedUser = await updateUserDB(updateUserData);

  res.json(getUserPublicData(updatedUser));
}
