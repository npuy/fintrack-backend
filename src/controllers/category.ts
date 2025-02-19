import { NextFunction, Request, Response } from 'express';
import { getUserIdFromRequest } from '../services/session';
import { CreateCategoryInput } from '../types/category';
import { getCategoriesByUserDB, getCategoryByIdDB } from '../models/category';
import {
  createCategoryService,
  deleteCategoryService,
  getCategoriesByUserWithBalance,
  updateCategoryService,
  validateCategoryId,
} from '../services/category';

export async function createCategory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { name } = req.body;
  const userId = getUserIdFromRequest(req);

  const createCategoryInput: CreateCategoryInput = {
    name,
    userId,
  };
  try {
    const category = await createCategoryService(createCategoryInput);
    res.json(category);
  } catch (error) {
    next(error);
  }
}

export async function getCategories(req: Request, res: Response) {
  const userId = getUserIdFromRequest(req);

  const categories = await getCategoriesByUserDB(userId);

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

export async function getCategoryById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const categoryId = req.params.id;

  try {
    await validateCategoryId(categoryId, userId);
  } catch (error) {
    next(error);
  }

  const category = await getCategoryByIdDB(categoryId);

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
    await validateCategoryId(categoryId, userId);
  } catch (error) {
    next(error);
  }

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
    await validateCategoryId(categoryId, userId);
  } catch (error) {
    next(error);
  }

  try {
    await deleteCategoryService(categoryId);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
}
