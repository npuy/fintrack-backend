export enum TransactionType {
  Income = 1,
  Expense,
  Transfer,
  TaxRefund,
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
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
  accountId: string;
  categoryId: string;
  type: TransactionType;
}
