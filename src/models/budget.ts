import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';
import {
  BudgetGroup,
  BudgetGroupWithCategories,
  CreateBudgetGroupInput,
  UpdateBudgetGroupInput,
} from '../types/budget';
import { BadRequestError } from '../configs/errors';

export async function getBudgetGroupByNameAndUserId(
  name: string,
  userId: string,
): Promise<BudgetGroup | null> {
  const budgetGroup = await prisma.budgetGroup.findFirst({
    where: {
      name,
      userId,
    },
  });
  return budgetGroup;
}

export async function createBudgetGroupDB(
  createBudgetGroupInput: CreateBudgetGroupInput,
): Promise<BudgetGroup> {
  try {
    const budgetGroup = await prisma.budgetGroup.create({
      data: {
        name: createBudgetGroupInput.name,
        limit: createBudgetGroupInput.limit,
        currencyId: createBudgetGroupInput.currencyId,
        userId: createBudgetGroupInput.userId,
        categories: {
          connect: createBudgetGroupInput.categoriesId.map((id) => ({ id })),
        },
      },
    });
    return budgetGroup;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new BadRequestError('One or more category IDs do not exist.');
      }
    }
    throw error;
  }
}

export async function getBudgetGroupsDB(
  userId: string,
): Promise<BudgetGroupWithCategories[]> {
  const budgetGroups = await prisma.budgetGroup.findMany({
    where: {
      userId,
    },
    include: {
      categories: true,
    },
  });
  return budgetGroups;
}

export async function getBudgetGroupByIdDB(
  userId: string,
  budgetGroupId: string,
): Promise<BudgetGroupWithCategories | null> {
  const budgetGroup = await prisma.budgetGroup.findFirst({
    where: {
      id: budgetGroupId,
      userId,
    },
    include: {
      categories: true,
    },
  });
  return budgetGroup;
}

export async function updateBudgetGroupDB(
  updateBudgetGroupInput: UpdateBudgetGroupInput,
): Promise<BudgetGroup> {
  try {
    const budgetGroup = await prisma.budgetGroup.update({
      where: {
        id: updateBudgetGroupInput.id,
      },
      data: {
        name: updateBudgetGroupInput.name,
        limit: updateBudgetGroupInput.limit,
        currencyId: updateBudgetGroupInput.currencyId,
        categories: {
          set: updateBudgetGroupInput.categoriesId.map((id) => ({ id })),
        },
      },
    });
    return budgetGroup;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new BadRequestError(
          'Register not found. Budget group ID do not exist or one or more category IDs do not exist.',
        );
      }
    }
    throw error;
  }
}

export async function deleteBudgetGroupDB(
  userId: string,
  budgetGroupId: string,
) {
  try {
    await prisma.budgetGroup.delete({
      where: {
        id: budgetGroupId,
        userId,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return;
      }
    }
    throw error;
  }
}
