import { Category } from './category';

export interface BudgetGroup {
  id: string;
  name: string;
  limit: number;
  currencyId: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBudgetGroupInput {
  name: string;
  limit: number;
  currencyId: number;
  userId: string;
  categoriesId: string[];
}

export interface UpdateBudgetGroupInput {
  id: string;
  name: string;
  limit: number;
  userId: string;
  currencyId: number;
  categoriesId: string[];
}

export interface BudgetGroupWithCategories extends BudgetGroup {
  categories: Category[];
}
