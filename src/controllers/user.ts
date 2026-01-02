import { NextFunction, Request, Response } from 'express';

import { getUserIdFromRequest } from '../services/session';
import { getUserPublicData, updateUserService } from '../services/user';

export async function updateUserData(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const { name, email, currencyId, payDay } = req.body;

  try {
    const updatedUser = await updateUserService({
      id: userId,
      name,
      email,
      currencyId,
      payDay,
    });
    res.json(getUserPublicData(updatedUser));
  } catch (error) {
    next(error);
  }
}
