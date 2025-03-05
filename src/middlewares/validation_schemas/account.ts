import { z } from 'zod';

export const createAccountBodySchema = z.object({
  name: z.string(),
  currencyId: z.number(),
});

export const updateAccountBodySchema = z.object({
  name: z.string(),
  currencyId: z.number(),
});
