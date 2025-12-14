import { NextFunction, Request, Response } from 'express';
import { createToken } from '../services/session';
import { CustomJwtPayload } from '../types/jwt';
import { CreateUserInput } from '../types/user';
import { createUserDB, findUserByEmail } from '../repository/user';
import { UnauthorizedError } from '../configs/errors';
import { getUserPublicData, validateEmailAndPassword } from '../services/user';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { name, email, password } = req.body;

  if (await findUserByEmail(email)) {
    next(new UnauthorizedError('Email already exists'));
    return;
  }

  const createUserInput: CreateUserInput = {
    name,
    email,
    password,
  };
  const user = await createUserDB(createUserInput);

  const payload: CustomJwtPayload = {
    userId: user.id,
  };
  const token = createToken(payload);
  res.header('Authorization', token);

  res.json(getUserPublicData(user));
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  const user = await validateEmailAndPassword(email, password);
  if (!user) {
    next(new UnauthorizedError('Invalid email or password'));
    return;
  }

  const payload: CustomJwtPayload = {
    userId: user.id,
  };
  const token = createToken(payload);
  res.header('Authorization', token);

  res.json(getUserPublicData(user));
}
