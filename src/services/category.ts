import { BadRequestError } from '../configs/errors';
import {
  createCategoryDB,
  getCategoryByUserIdAndName,
  updateCategoryDB,
} from '../models/category';
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
