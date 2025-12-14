import { NextFunction, Request, Response } from 'express';

import { getUserIdFromRequest } from '../services/session';
import {
  createCategoryService,
  deleteCategoryService,
  getCategoriesByUserService,
  getCategoriesByUserWithBalance,
  getCategoryByIdService,
  updateCategoryService,
} from '../services/category';

export async function createCategory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { name } = req.body;
  const userId = getUserIdFromRequest(req);

  try {
    const category = await createCategoryService({
      name,
      userId,
    });
    res.json(category);
  } catch (error) {
    next(error);
  }
}

export async function getCategories(req: Request, res: Response) {
  const userId = getUserIdFromRequest(req);

  const categories = await getCategoriesByUserService(userId);

  res.json(categories);
}

export async function getCategoriesWithBalance(req: Request, res: Response) {
  const userId = getUserIdFromRequest(req);
  const { startDate, endDate } = req.query;

  const categoriesWithBalance = await getCategoriesByUserWithBalance(
    userId,
    startDate ? new Date(startDate as string) : undefined,
    endDate ? new Date(endDate as string) : undefined,
  );

  res.json(categoriesWithBalance);
}

export async function getCategoryById(req: Request, res: Response) {
  const userId = getUserIdFromRequest(req);
  const categoryId = req.params.id;

  const category = await getCategoryByIdService(categoryId, userId);

  res.json(category);
}

export async function updateCategory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const categoryId = req.params.id;
  const { name } = req.body;

  try {
    const updatedCategory = await updateCategoryService(
      categoryId,
      name,
      userId,
    );
    res.json(updatedCategory);
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const categoryId = req.params.id;

  try {
    await deleteCategoryService(categoryId, userId);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
}
