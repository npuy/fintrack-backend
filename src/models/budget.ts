import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { BudgetGroup, CreateBudgetGroupInput } from '../types/budget';
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
