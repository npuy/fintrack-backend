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

export const getTransactionQuerySchema = z
  .object({
    startDate: z.string().date().optional(),
    endDate: z.string().date().optional(),
    type: z.number().optional(),
    accountId: z.string().optional(),
    categoryId: z.string().optional(),
  })
  .strict();
