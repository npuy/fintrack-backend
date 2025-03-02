import { BadRequestError, ValueNotFoundError } from '../configs/errors';
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
  BudgetGroup,
  BudgetGroupWithCategories,
  BudgetGroupWithCategoriesAndAmount,
  CreateBudgetGroupInput,
  UpdateBudgetGroupInput,
} from '../types/budget';
import { getCategoriesByUserWithBalance } from './category';
import { CategoryWithBalance } from '../types/category';

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

function getBudgetGroupWithAmount(
  budgetGroup: BudgetGroupWithCategories,
  categories: CategoryWithBalance[],
): BudgetGroupWithCategoriesAndAmount {
  const categoriesIdsFormGroup = new Set(
    budgetGroup.categories.map((category) => category.id),
  );

  const amount = categories
    .filter((category) => categoriesIdsFormGroup.has(category.id))
    .reduce((add, category) => add + category.balance, 0);

  return {
    ...budgetGroup,
    amount,
  };
}

export async function getBudgetGroupsService(
  userId: string,
): Promise<BudgetGroupWithCategoriesAndAmount[]> {
  const budgetGroups = await getBudgetGroupsDB(userId);
  const categories = await getCategoriesByUserWithBalance(
    userId,
    undefined,
    undefined,
  );

  const budgetGroupsWithAmount = budgetGroups.map((budgetGroup) => {
    return getBudgetGroupWithAmount(budgetGroup, categories);
  });

  return budgetGroupsWithAmount;
}

export async function getBudgetGroupByIdService(
  userId: string,
  budgetGroupId: string,
): Promise<BudgetGroupWithCategoriesAndAmount> {
  const budgetGroup = await getBudgetGroupByIdDB(userId, budgetGroupId);

  if (!budgetGroup) {
    throw new ValueNotFoundError('Budget group not found');
  }

  const categories = await getCategoriesByUserWithBalance(
    userId,
    undefined,
    undefined,
  );
  return getBudgetGroupWithAmount(budgetGroup, categories);
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
