import { z } from 'zod';

export const createTransactionBodySchema = z
  .object({
    amount: z.number(),
    description: z.string(),
    date: z.string(),
    accountId: z.string(),
    categoryId: z.string(),
    type: z.number(),
  })
  .strict();

export const updateTransactionBodySchema = z
  .object({
    amount: z.number(),
    description: z.string(),
    date: z.string(),
    accountId: z.string(),
    categoryId: z.string(),
    type: z.number(),
  })
  .strict();
