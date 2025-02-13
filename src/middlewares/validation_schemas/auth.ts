import { z } from 'zod';

export const registerBodySchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  })
  .strict();

export const loginBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .strict();
