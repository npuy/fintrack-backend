import { NextFunction, Request, Response } from 'express';
import { getCurrenciesDB, getCurrencyByIdDB } from '../repository/currency';
import { ValueNotFoundError } from '../configs/errors';

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

export async function getCurrency(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { currencyId } = req.params;
  try {
    const currency = await getCurrencyByIdDB(Number(currencyId));
    if (!currency) {
      next(new ValueNotFoundError('Currency: ' + currencyId));
      return;
    }
    res.json(currency);
  } catch (error) {
    next(error);
  }
}
