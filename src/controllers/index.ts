import { Request, Response } from 'express';

export async function healthCheck(req: Request, res: Response) {
  res.send('Hello World!');
}
