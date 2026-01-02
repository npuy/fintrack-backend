import { getCurrenciesDB, getCurrencyByIdDB } from '../repository/currency';

export async function getCurrenciesService() {
  return await getCurrenciesDB();
}

export async function getCurrencyService(currencyId: number) {
  return await getCurrencyByIdDB(currencyId);
}
