import { z } from 'zod';

export const createCategoryBodySchema = z.object({
  name: z.string(),
  enabled: z.boolean().optional(),
});

export const updateCategoryBodySchema = z.object({
  name: z.string(),
  enabled: z.boolean().optional(),
});

export const getCategoryQuerySchema = z.object({
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
});
