import { NextFunction, Request, Response } from 'express';
import { getUserIdFromRequest } from '../services/session';
import { CreateBudgetGroupInput } from '../types/budget';
import { createBudgetGroupService } from '../services/budget';

export async function createBudgetGroup(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const { name, limit, currencyId, categoriesId } = req.body;

  const createBudgetGroupInput: CreateBudgetGroupInput = {
    name,
    limit,
    currencyId,
    userId,
    categoriesId,
  };

  try {
    const budgetGroup = await createBudgetGroupService(createBudgetGroupInput);
    res.json(budgetGroup);
  } catch (error) {
    next(error);
  }
}
