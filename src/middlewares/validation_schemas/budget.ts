import { z } from 'zod';

export const createBudgetGroupBodySchema = z.object({
  name: z.string(),
  limit: z.number(),
  currencyId: z.number(),
  categoriesId: z.array(z.string()),
});

export const updateBudgetGroupBodySchema = z.object({
  name: z.string(),
  limit: z.number(),
  currencyId: z.number(),
  categoriesId: z.array(z.string()),
});
