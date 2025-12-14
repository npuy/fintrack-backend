import { BadRequestError, ValueNotFoundError } from '../configs/errors';
import {
  createBudgetGroupDB,
  deleteBudgetGroupDB,
  getBudgetGroupByIdDB,
  getBudgetGroupByNameAndUserId,
  getBudgetGroupsDB,
  updateBudgetGroupDB,
} from '../repository/budget';
import { getCurrenciesDB, getCurrencyByIdDB } from '../repository/currency';
import {
  BudgetGroup,
  BudgetGroupWithCategories,
  BudgetGroupWithCategoriesAndAmount,
  CreateBudgetGroupInput,
  UpdateBudgetGroupInput,
} from '../types/budget';
import { getCategoriesByUserWithBalance } from './category';
import { getUserByIdDB } from '../repository/user';

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

async function getBudgetGroupWithAmount(
  budgetGroups: BudgetGroupWithCategories[],
  userId: string,
): Promise<BudgetGroupWithCategoriesAndAmount[]> {
  // Get all categories with balance
  const categories = await getCategoriesByUserWithBalance(
    userId,
    undefined,
    undefined,
  );
  const currencies = await getCurrenciesDB();

  // Get user currency to change the currency of the amount
  const user = await getUserByIdDB(userId);
  if (!user) {
    throw new ValueNotFoundError('User not found');
  }
  const currency = await getCurrencyByIdDB(user.currencyId);
  if (!currency) {
    throw new ValueNotFoundError('Currency not found');
  }

  const budgetGroupsWithAmount = budgetGroups.map((budgetGroup) => {
    const categoriesIdsFormGroup = new Set(
      budgetGroup.categories.map((category) => category.id),
    );

    // Calculate the amount of the budget group (in user currency)
    let amount = categories
      .filter((category) => categoriesIdsFormGroup.has(category.id))
      .reduce((add, category) => add + category.balance, 0);

    // Change the currency of the amount to the budget group currency
    const budgetGroupCurrency = currencies.find(
      (currency) => currency.id == budgetGroup.currencyId,
    );
    if (!budgetGroupCurrency) {
      throw new ValueNotFoundError('Currency not found');
    }
    amount = (amount * budgetGroupCurrency.multiplier) / currency.multiplier;

    return {
      ...budgetGroup,
      amount,
    };
  });

  return budgetGroupsWithAmount;
}

export async function getBudgetGroupsService(
  userId: string,
): Promise<BudgetGroupWithCategoriesAndAmount[]> {
  const budgetGroups = await getBudgetGroupsDB(userId);

  return await getBudgetGroupWithAmount(budgetGroups, userId);
}

export async function getBudgetGroupByIdService(
  userId: string,
  budgetGroupId: string,
): Promise<BudgetGroupWithCategoriesAndAmount> {
  const budgetGroup = await getBudgetGroupByIdDB(userId, budgetGroupId);

  if (!budgetGroup) {
    throw new ValueNotFoundError('Budget group not found');
  }

  return (await getBudgetGroupWithAmount([budgetGroup], userId))[0];
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
