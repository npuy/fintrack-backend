import { prisma } from '../../prisma/client';
import { Currency } from '../types/account';

export async function getCurrenciesDB(): Promise<Currency[]> {
  const currencies = await prisma.accountCurrency.findMany();
  return currencies;
}
