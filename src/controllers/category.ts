import { NextFunction, Request, Response } from 'express';
import { getUserIdFromRequest } from '../services/session';
import { ForbiddenAccessError, ValueNotFoundError } from '../configs/errors';
import { CreateCategoryInput } from '../types/category';
import {
  deleteCategoryDB,
  getCategoriesByUserDB,
  getCategoriesByUserWithBalanceDB,
  getCategoryByIdDB,
} from '../models/category';
import {
  createCategoryService,
  updateCategoryService,
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

  const categoriesWithBalance = await getCategoriesByUserWithBalanceDB(userId);

  res.json(categoriesWithBalance);
}

export async function getCategoryById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserIdFromRequest(req);
  const categoryId = req.params.id;

  const category = await getCategoryByIdDB(categoryId);

  if (!category) {
    next(new ValueNotFoundError('Category not found'));
    return;
  }

  if (category.userId !== userId) {
    next(new ForbiddenAccessError('Forbidden'));
    return;
  }

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

  const category = await getCategoryByIdDB(categoryId);

  if (!category) {
    next(new ValueNotFoundError('Category not found'));
    return;
  }

  if (category.userId !== userId) {
    next(new ForbiddenAccessError('Forbidden'));
    return;
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

  const category = await getCategoryByIdDB(categoryId);

  if (!category) {
    next(new ValueNotFoundError('Category not found'));
    return;
  }

  if (category.userId !== userId) {
    next(new ForbiddenAccessError('Forbidden'));
    return;
  }

  await deleteCategoryDB(categoryId);

  res.json({ message: 'Category deleted' });
}
