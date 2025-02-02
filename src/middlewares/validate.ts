import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { BadRequestError } from '../configs/errors';

export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      console.error(JSON.stringify(result.error));
      next(new BadRequestError('Invalid request body'));
      return;
    }

    next(); // Proceed if validation passed
  };
};

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      console.error(JSON.stringify(result.error));
      next(new BadRequestError('Invalid query parameters'));
      return;
    }

    next(); // Proceed if validation passed
  };
};
