import { z } from 'zod';

export const createCategoryBodySchema = z
  .object({
    name: z.string(),
  })
  .strict();

export const updateCategoryBodySchema = z
  .object({
    id: z.string().optional(),
    name: z.string(),
  })
  .strict();
