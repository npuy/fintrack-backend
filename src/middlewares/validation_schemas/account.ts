import { z } from 'zod';

export const createAccountBodySchema = z.object({
  name: z.string(),
  currencyId: z.number(),
  enabled: z.boolean().optional(),
});

export const updateAccountBodySchema = z.object({
  name: z.string(),
  currencyId: z.number(),
  enabled: z.boolean().optional(),
});

export const orderAccountsBodySchema = z.object({
  orderedAccountIds: z.array(z.string()),
});
