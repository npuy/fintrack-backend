import { RequestHandler } from 'express';

export const healthCheck: RequestHandler = (req, res) => {
  res.send('Helo World!');
};
