import { z } from 'zod';

export const updateUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  currencyId: z.number(),
});
