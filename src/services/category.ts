import {
  BadRequestError,
  ForbiddenAccessError,
  ValueNotFoundError,
} from '../configs/errors';
import {
  createCategoryDB,
  deleteCategoryDB,
  getCategoryByIdDB,
  getCategoryByUserIdAndName,
  updateCategoryDB,
} from '../models/category';
import { getTransactionsDB } from '../models/transaction';
import { CreateCategoryInput, Category } from '../types/category';

export async function createCategoryService(
  createCategoryInput: CreateCategoryInput,
): Promise<Category> {
  const categoryFound = await getCategoryByUserIdAndName(
    createCategoryInput.userId,
    createCategoryInput.name,
  );
  if (categoryFound) {
    throw new BadRequestError('Category name already exists');
  }
  return await createCategoryDB(createCategoryInput);
}

export async function updateCategoryService(
  categoryId: string,
  name: string,
  userId: string,
): Promise<Category | null> {
  const categoryFound = await getCategoryByUserIdAndName(userId, name);
  if (categoryFound && categoryFound.id !== categoryId) {
    throw new BadRequestError('Category name already exists');
  }
  return await updateCategoryDB(categoryId, name);
}

export async function validateCategoryId(categoryId: string, userId: string) {
  const category = await getCategoryByIdDB(categoryId);

  if (!category) {
    throw new ValueNotFoundError('Category not found');
  }

  if (category.userId !== userId) {
    throw new ForbiddenAccessError('Forbidden');
  }
}

export async function deleteCategoryService(categoryId: string): Promise<void> {
  const transactions = await getTransactionsDB({ categoryId });
  if (transactions.length > 0) {
    throw new BadRequestError('Category has transactions');
  }
  return await deleteCategoryDB(categoryId);
}
