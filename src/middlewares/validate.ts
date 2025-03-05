import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { BadRequestError } from '../configs/errors';

export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      console.error(result.error.format());
      next(new BadRequestError('Invalid request body'));
      return;
    }
    req.body = result.data; // Replace req.body with the parsed data

    next(); // Proceed if validation passed
  };
};

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      console.error(result.error.format());
      next(new BadRequestError('Invalid query parameters'));
      return;
    }
    req.query = result.data; // Replace req.query with the parsed data

    next(); // Proceed if validation passed
  };
};
