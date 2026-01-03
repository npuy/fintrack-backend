import { Currency } from './account';

export interface Category {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  enabled: boolean;
  sortOrder: number;
}

export interface CreateCategoryInput {
  name: string;
  userId: string;
  enabled?: boolean;
}

export interface CategoryWithBalance extends Category {
  balance: number;
}

export interface CategoryWithBalanceFilters {
  userId: string;
  startDate: Date;
  endDate: Date;
  currency: Currency;
}
