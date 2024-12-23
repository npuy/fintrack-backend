export interface Account {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccountInput {
  name: string;
  userId: string;
}

export interface AccountWithBalance extends Account {
  balance: number;
}
