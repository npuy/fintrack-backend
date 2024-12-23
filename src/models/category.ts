import {
  Category,
  CategoryWithBalance,
  CreateCategoryInput,
} from '../types/category';
import { prisma } from '../../prisma/client';

export async function createCategoryDB(
  category: CreateCategoryInput,
): Promise<Category> {
  const newCategory = await prisma.category.create({
    data: {
      name: category.name,
      userId: category.userId,
    },
  });
  const res: Category = {
    id: newCategory.id,
    name: newCategory.name,
    userId: newCategory.userId,
    createdAt: newCategory.createdAt,
    updatedAt: newCategory.updatedAt,
  };
  return res;
}

export async function getCategoriesByUserDB(
  userId: string,
): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    where: {
      userId,
    },
  });
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    userId: category.userId,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  }));
}

export async function getCategoriesByUserWithBalanceDB(
  userId: string,
): Promise<CategoryWithBalance[]> {
  const categoriesWithBalance = await prisma.$queryRaw<CategoryWithBalance[]>`
    SELECT
      c.id,
      c.name,
      c.userId,
      c.createdAt,
      c.updatedAt,
      CAST(COALESCE(SUM(t.amount), 0) as REAL) AS balance
    FROM
      Category c
    LEFT JOIN
      "Transaction" t
    ON
      a.id = t.categoryId
    WHERE
      a.userId = ${userId}
    GROUP BY
      a.id;
  `;
  return categoriesWithBalance;
}

export async function getCategoryByIdDB(
  categoryId: string,
): Promise<Category | null> {
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
    },
  });
  if (!category) {
    return null;
  }
  return {
    id: category.id,
    name: category.name,
    userId: category.userId,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

export async function updateCategoryDB(
  categoryId: string,
  name: string,
): Promise<Category | null> {
  const category = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      name,
    },
  });
  return {
    id: category.id,
    name: category.name,
    userId: category.userId,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

export async function deleteCategoryDB(categoryId: string): Promise<void> {
  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
}
