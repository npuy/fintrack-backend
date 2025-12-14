import {
  BadRequestError,
  ForbiddenAccessError,
  ValueNotFoundError,
} from '../configs/errors';

import {
  CreateCategoryInput,
  Category,
  CategoryWithBalance,
} from '../types/category';

import {
  createCategoryDB,
  deleteCategoryDB,
  getCategoriesByUserDB,
  getCategoriesByUserWithBalanceDB,
  getCategoryByIdDB,
  getCategoryByUserIdAndName,
  updateCategoryDB,
} from '../repository/category';
import { getCurrencyByIdDB } from '../repository/currency';
import { getTransactionsDB } from '../repository/transaction';
import { getUserByIdDB } from '../repository/user';

import { getLastPayDay, getNextPayDay } from './user';

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
  // Validate category existence and ownership
  await validateCategoryId(categoryId, userId);

  // Check if another category with the same name exists for the user
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

export async function deleteCategoryService(
  categoryId: string,
  userId: string,
): Promise<void> {
  // Validate category existence and ownership
  await validateCategoryId(categoryId, userId);

  // Check for associated transactions
  const transactions = await getTransactionsDB({ categoryId });
  if (transactions.length > 0) {
    throw new BadRequestError('Category has transactions');
  }

  return await deleteCategoryDB(categoryId);
}

export async function getCategoriesByUserWithBalance(
  userId: string,
  startDate: Date | undefined,
  endDate: Date | undefined,
): Promise<CategoryWithBalance[]> {
  const user = await getUserByIdDB(userId);
  if (!user) {
    throw new ValueNotFoundError('User not found');
  }
  const currency = await getCurrencyByIdDB(user.currencyId);
  if (!currency) {
    throw new ValueNotFoundError('Currency not found');
  }

  const payDay = user.payDay;
  const lastPayDay = getLastPayDay(payDay);
  const nextPayDay = getNextPayDay(payDay);

  return await getCategoriesByUserWithBalanceDB({
    userId,
    startDate: startDate ? startDate : lastPayDay,
    endDate: endDate ? endDate : nextPayDay,
    currency: currency,
  });
}

export async function getCategoriesByUserService(
  userId: string,
): Promise<Category[]> {
  return await getCategoriesByUserDB(userId);
}

export async function getCategoryByIdService(
  categoryId: string,
  userId: string,
): Promise<Category | null> {
  const category = await getCategoryByIdDB(categoryId);

  if (!category) {
    throw new ValueNotFoundError('Category not found');
  }

  if (category.userId !== userId) {
    throw new ForbiddenAccessError('Forbidden');
  }
  return category;
}
