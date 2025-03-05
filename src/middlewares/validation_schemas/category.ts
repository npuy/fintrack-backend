import { z } from 'zod';

export const createCategoryBodySchema = z.object({
  name: z.string(),
});

export const updateCategoryBodySchema = z.object({
  name: z.string(),
});

export const getCategoryQuerySchema = z.object({
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
});
