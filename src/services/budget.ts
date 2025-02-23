import { BudgetGroup, Prisma } from '@prisma/client';
import { BadRequestError } from '../configs/errors';
import {
  createBudgetGroupDB,
  deleteBudgetGroupDB,
  getBudgetGroupByIdDB,
  getBudgetGroupByNameAndUserId,
  getBudgetGroupsDB,
  updateBudgetGroupDB,
} from '../models/budget';
import { getCurrencyByIdDB } from '../models/currency';
import {
  BudgetGroupWithCategories,
  CreateBudgetGroupInput,
  UpdateBudgetGroupInput,
} from '../types/budget';

export async function createBudgetGroupService(
  createBudgetGroupInput: CreateBudgetGroupInput,
): Promise<BudgetGroup> {
  if (
    await getBudgetGroupByNameAndUserId(
      createBudgetGroupInput.name,
      createBudgetGroupInput.userId,
    )
  ) {
    throw new BadRequestError('Budget group name already exists');
  }
  if (!(await getCurrencyByIdDB(createBudgetGroupInput.currencyId))) {
    throw new BadRequestError('Currency not found');
  }
  const budgetGroup = await createBudgetGroupDB(createBudgetGroupInput);
  return budgetGroup;
}

export async function getBudgetGroupsService(
  userId: string,
): Promise<BudgetGroupWithCategories[]> {
  const budgetGroups = await getBudgetGroupsDB(userId);
  return budgetGroups;
}

export async function getBudgetGroupByIdService(
  userId: string,
  budgetGroupId: string,
): Promise<BudgetGroupWithCategories | {}> {
  const budgetGroup = await getBudgetGroupByIdDB(userId, budgetGroupId);
  return budgetGroup || {};
}

export async function updateBudgetGroupService(
  updateBudgetGroupInput: UpdateBudgetGroupInput,
): Promise<BudgetGroup> {
  const budgetGroupRepeated = await getBudgetGroupByNameAndUserId(
    updateBudgetGroupInput.name,
    updateBudgetGroupInput.userId,
  );
  if (
    budgetGroupRepeated &&
    budgetGroupRepeated.id !== updateBudgetGroupInput.id
  ) {
    throw new BadRequestError('Budget group name already exists');
  }
  if (!(await getCurrencyByIdDB(updateBudgetGroupInput.currencyId))) {
    throw new BadRequestError('Currency not found');
  }
  const budgetGroup = await updateBudgetGroupDB(updateBudgetGroupInput);
  return budgetGroup;
}

export async function deleteBudgetGroupService(
  userId: string,
  budgetGroupId: string,
) {
  await deleteBudgetGroupDB(userId, budgetGroupId);
}
