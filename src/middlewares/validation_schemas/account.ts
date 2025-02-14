import { z } from 'zod';

export const createAccountBodySchema = z
  .object({
    name: z.string(),
    currencyId: z.number(),
  })
  .strict();

export const updateAccountBodySchema = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    currencyId: z.number(),
  })
  .strict();
