import { Account } from './account';
import { Category } from './category';

export enum TransactionType {
  Income = 1,
  Expense,
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date;
  accountId: string;
  categoryId: string;
  type: TransactionType;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionInput {
  id?: string;
  amount: number;
  description: string;
  date: Date;
  accountId: string;
  categoryId: string;
  type: TransactionType;
}

export interface TransactionFull extends Transaction {
  account: Account;
  category: Category;
}
