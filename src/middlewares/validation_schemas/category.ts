import { z } from 'zod';

export const createCategoryBodySchema = z
  .object({
    name: z.string(),
  })
  .strict();

export const updateCategoryBodySchema = z
  .object({
    name: z.string(),
  })
  .strict();
