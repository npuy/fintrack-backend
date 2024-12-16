import { Request, Response, NextFunction } from 'express';
import {
  ForbiddenAccessError,
  UnauthorizedError,
  ValueNotFoundError,
} from './errors';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  switch (true) {
    case err instanceof ValueNotFoundError:
      res.status(404).send(err.message);
      return;

    case err instanceof ForbiddenAccessError:
      res.status(403).send(err.message);
      return;

    case err instanceof UnauthorizedError:
      res.status(401).send(err.message);
      return;

    default:
      console.error(err.stack);
      res.status(500).send('Something broke!');
      return;
  }
}
