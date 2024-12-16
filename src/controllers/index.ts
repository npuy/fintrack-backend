import { NextFunction, Request, Response } from 'express';

export async function healthCheck(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.send('Hello World!');
}
