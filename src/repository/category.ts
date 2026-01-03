import {
  Category,
  CategoryWithBalance,
  CategoryWithBalanceFilters,
  CreateCategoryInput,
} from '../types/category';
import { prisma } from '../../prisma/client';

export async function createCategoryDB(
  category: CreateCategoryInput,
): Promise<Category> {
  const newCategory = await prisma.category.create({
    data: {
      name: category.name,
      enabled: category.enabled,
      userId: category.userId,
    },
  });
  const res: Category = {
    id: newCategory.id,
    name: newCategory.name,
    userId: newCategory.userId,
    createdAt: newCategory.createdAt,
    updatedAt: newCategory.updatedAt,
    enabled: newCategory.enabled,
    sortOrder: newCategory.sortOrder,
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
    orderBy: {
      sortOrder: 'desc',
    },
  });
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    userId: category.userId,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    enabled: category.enabled,
    sortOrder: category.sortOrder,
  }));
}

export async function getCategoriesByUserWithBalanceDB({
  userId,
  startDate,
  endDate,
  currency,
}: CategoryWithBalanceFilters): Promise<CategoryWithBalance[]> {
  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(0, 0, 0, 0);

  const categoriesWithBalance = await prisma.$queryRaw<CategoryWithBalance[]>`
    SELECT
      c.id,
      c.name,
      c.userId,
      c.createdAt,
      c.updatedAt,
      c.enabled,
      c.sortOrder,
      CAST(COALESCE(SUM(
        CASE
          WHEN t.typeId = 1 THEN t.amount * (${currency.multiplier} / ac.multiplier)
          WHEN t.typeId = 2 THEN -t.amount * (${currency.multiplier} / ac.multiplier)
          ELSE 0
        END
      ), 0) as REAL) AS balance
    FROM
      Category c
    LEFT JOIN
      "Transaction" t
    ON
      c.id = t.categoryId
      AND t.date >= ${startDate}
      AND t.date < ${endDate}
    LEFT JOIN
      "Account" a
    ON
      t.accountId = a.id
    LEFT JOIN
      "AccountCurrency" ac
    ON
      a.currencyId = ac.id
    WHERE
      c.userId = ${userId}
    GROUP BY
      c.id
    ORDER BY 
      c.sortOrder DESC;
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
    enabled: category.enabled,
    sortOrder: category.sortOrder,
  };
}

export async function updateCategoryDB(
  categoryId: string,
  name: string,
  enabled?: boolean,
): Promise<Category | null> {
  const category = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      name,
      enabled,
    },
  });
  return {
    id: category.id,
    name: category.name,
    userId: category.userId,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    enabled: category.enabled,
    sortOrder: category.sortOrder,
  };
}

export async function deleteCategoryDB(categoryId: string): Promise<void> {
  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
}

export async function getCategoryByUserIdAndName(userId: string, name: string) {
  const category = await prisma.category.findFirst({
    where: {
      userId,
      name,
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

export async function orderCategoriesDB(
  userId: string,
  orderedCategoryIds: string[],
): Promise<void> {
  const updates = orderedCategoryIds.map((categoryId, index) => {
    return prisma.category.updateMany({
      where: {
        id: categoryId,
        userId,
      },
      data: {
        sortOrder: orderedCategoryIds.length - index,
      },
    });
  });

  await prisma.$transaction(updates);
}
