import { z } from 'zod';

export const updateUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  payDay: z.number().int().min(1).max(31),
  currencyId: z.number(),
});
