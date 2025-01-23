import { NextFunction, Request, Response } from 'express';
import { getCurrenciesDB } from '../models/currency';

export async function getCurrencies(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const currencies = await getCurrenciesDB();
    res.json(currencies);
  } catch (error) {
    next(error);
  }
}
