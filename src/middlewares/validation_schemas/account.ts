import { z } from 'zod';

export const createAccountBodySchema = z
  .object({
    name: z.string(),
    currencyId: z.number(),
  })
  .strict();

export const updateAccountBodySchema = z
  .object({
    name: z.string(),
    currencyId: z.number(),
  })
  .strict();
