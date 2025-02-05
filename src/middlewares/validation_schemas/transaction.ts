import { z } from 'zod';
import {
  OrderByDirections,
  OrderByFields,
  TransactionType,
} from '../../types/transaction';

export const createTransactionBodySchema = z
  .object({
    amount: z.number(),
    description: z.string(),
    date: z.string(),
    accountId: z.string(),
    categoryId: z.string(),
    type: z.number(),
  })
  .strict();

export const updateTransactionBodySchema = z
  .object({
    amount: z.number(),
    description: z.string(),
    date: z.string(),
    accountId: z.string(),
    categoryId: z.string(),
    type: z.number(),
  })
  .strict();

const orderBySchema = z.object({
  field: z.nativeEnum(OrderByFields),
  direction: z.nativeEnum(OrderByDirections),
});

export const getTransactionQuerySchema = z
  .object({
    startDate: z.string().date().optional(),
    endDate: z.string().date().optional(),
    type: z
      .string()
      .refine(
        (val) =>
          !isNaN(Number(val)) &&
          Object.values(TransactionType).includes(Number(val)),
        {
          message: 'String must be parseable to a valid number',
        },
      )
      .optional(),
    accountId: z.string().optional(),
    categoryId: z.string().optional(),
    orderBy: z
      .string()
      .optional()
      .transform((val) => {
        if (!val) return [];
        return val.split(',').map((clause) => {
          const [field, direction] = clause.split(':');
          return { field, direction };
        });
      })
      .pipe(z.array(orderBySchema)),
  })
  .strict();
