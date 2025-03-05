export interface User {
  id: string;
  name: string;
  email: string;
  payDay: number;
  currencyId: number;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserInput {
  id: string;
  name: string;
  email: string;
  payDay: number;
  currencyId: number;
}

export interface UserPublicData {
  id: string;
  name: string;
  email: string;
  payDay: number;
  currencyId: number;
}
