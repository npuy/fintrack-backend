import { NextFunction, Request, Response } from 'express';

import { ValueNotFoundError } from '../configs/errors';

import { getCurrenciesService, getCurrencyService } from '../services/currency';

export async function getCurrencies(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const currencies = await getCurrenciesService();
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
    const currency = await getCurrencyService(Number(currencyId));
    if (!currency) {
      next(new ValueNotFoundError('Currency: ' + currencyId));
      return;
    }
    res.json(currency);
  } catch (error) {
    next(error);
  }
}
