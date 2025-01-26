import { prisma } from '../../prisma/client';
import { Currency } from '../types/account';

export async function getCurrenciesDB(): Promise<Currency[]> {
  const currencies = await prisma.accountCurrency.findMany();
  return currencies;
}

export async function getCurrencyByIdDB(id: number): Promise<Currency | null> {
  const currency = await prisma.accountCurrency.findUnique({
    where: {
      id,
    },
  });
  return currency;
}
