import { BudgetGroup, Prisma } from '@prisma/client';
import { BadRequestError } from '../configs/errors';
import {
  createBudgetGroupDB,
  getBudgetGroupByNameAndUserId,
} from '../models/budget';
import { getCurrencyByIdDB } from '../models/currency';
import { CreateBudgetGroupInput } from '../types/budget';

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
