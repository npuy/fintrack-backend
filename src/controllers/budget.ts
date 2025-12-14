import { NextFunction, Request, Response } from 'express';

import { getUserIdFromRequest } from '../services/session';
import {
  createBudgetGroupService,
  deleteBudgetGroupService,
  getBudgetGroupByIdService,
  getBudgetGroupsService,
  updateBudgetGroupService,
} from '../services/budget';

export async function createBudgetGroup(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const { name, limit, currencyId, categoriesId } = req.body;

  try {
    const budgetGroup = await createBudgetGroupService({
      name,
      limit,
      currencyId,
      userId,
      categoriesId,
    });
    res.json(budgetGroup);
  } catch (error) {
    next(error);
  }
}

export async function getBudgetGroups(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);

  try {
    const budgetGroup = await getBudgetGroupsService(userId);
    res.json(budgetGroup);
  } catch (error) {
    next(error);
  }
}

export async function getBudgetGroupById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const budgetGroupId = req.params.id;

  try {
    const budgetGroup = await getBudgetGroupByIdService(userId, budgetGroupId);
    res.json(budgetGroup);
  } catch (error) {
    next(error);
  }
}

export async function updateBudgetGroup(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const budgetGroupId = req.params.id;
  const { name, limit, currencyId, categoriesId } = req.body;

  try {
    const budgetGroup = await updateBudgetGroupService({
      id: budgetGroupId,
      name,
      limit,
      currencyId,
      userId,
      categoriesId,
    });
    res.json(budgetGroup);
  } catch (error) {
    next(error);
  }
}

export async function deleteBudgetGroup(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const budgetGroupId = req.params.id;

  try {
    await deleteBudgetGroupService(userId, budgetGroupId);
    res.json({ message: 'Budget group deleted' });
  } catch (error) {
    next(error);
  }
}
