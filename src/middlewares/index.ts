import express from 'express';
import cors from 'cors';
import { Application } from 'express';
import { env } from '../configs/config';
import { getCurrenciesDB } from '../models/currency';
import { prisma } from '../../prisma/client';

export function preRoutesMiddleware(app: Application) {
  app.use(express.json());
  app.use(cors());

  // set update currencies function
  const DAY_IN_MS = 1000 * 60 * 60 * 24;
  setInterval(updateCurrenciesFromAPI, DAY_IN_MS);
}

async function updateCurrenciesFromAPI() {
  try {
    // fetch currencies from API
    const url = new URL(env.CURRENCY_API_URL);
    const params = new URLSearchParams();
    params.append('access_key', env.CURRENCY_API_KEY);
    url.search = params.toString();
    const result = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await result.json();
    // update currencies in database
    const currencies = await getCurrenciesDB();
    const transactions = await prisma.$transaction(
      currencies.map((currency) =>
        prisma.accountCurrency.update({
          where: { id: currency.id },
          data: {
            multiplier: data.rates[currency.name],
          },
        }),
      ),
    );
    // log the result
    console.log(transactions);
    console.log('Currencies updated');
  } catch (error) {
    console.error('Error updating currencies', error);
  }
}
