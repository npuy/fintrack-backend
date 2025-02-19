import {
  Category,
  CategoryWithBalance,
  CreateCategoryInput,
} from '../types/category';
import { prisma } from '../../prisma/client';
import { getUserByIdDB } from './user';
import { getCurrencyByIdDB } from './currency';

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

function getLastPayDay(payDay: number): Date {
  const today = new Date();
  let lastPayDay = new Date(today.getFullYear(), today.getMonth(), payDay);

  if (today < lastPayDay) {
    lastPayDay.setMonth(lastPayDay.getMonth() - 1);
  }

  // Handle months with less than 31 days
  while (lastPayDay.getDate() !== payDay) {
    lastPayDay.setDate(lastPayDay.getDate() - 1);
  }

  return lastPayDay;
}

function getNextPayDay(payDay: number): Date {
  const today = new Date();
  let nextPayDay = new Date(today.getFullYear(), today.getMonth(), payDay);

  if (today >= nextPayDay) {
    nextPayDay.setMonth(nextPayDay.getMonth() + 1);
  }

  // Handle months with less than 31 days
  while (nextPayDay.getDate() !== payDay) {
    nextPayDay.setDate(nextPayDay.getDate() - 1);
  }

  return nextPayDay;
}

export async function getCategoriesByUserWithBalanceDB(
  userId: string,
): Promise<CategoryWithBalance[]> {
  const user = await getUserByIdDB(userId);
  if (!user) {
    throw new Error('User not found');
  }
  const currency = await getCurrencyByIdDB(user.currencyId);
  if (!currency) {
    throw new Error('Currency not found');
  }

  const payDay = user.payDay;
  const lastPayDay = getLastPayDay(payDay);
  const nextPayDay = getNextPayDay(payDay);

  const categoriesWithBalance = await prisma.$queryRaw<CategoryWithBalance[]>`
    SELECT
      c.id,
      c.name,
      c.userId,
      c.createdAt,
      c.updatedAt,
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
    LEFT JOIN
      "Account" a
    ON
      t.accountId = a.id
    LEFT JOIN
      "AccountCurrency" ac
    ON
      a.currencyId = ac.id
    WHERE
      c.userId = ${userId} AND 
      ((t.date >= ${lastPayDay} AND t.date < ${nextPayDay}) OR t.date IS NULL)
    GROUP BY
      c.id;
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
