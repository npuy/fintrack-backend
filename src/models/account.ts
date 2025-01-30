import {
  Account,
  AccountWithBalance,
  CreateAccountInput,
} from '../types/account';
import { prisma } from '../../prisma/client';

export async function createAccountDB(
  account: CreateAccountInput,
): Promise<Account> {
  const newAccount = await prisma.account.create({
    data: {
      name: account.name,
      userId: account.userId,
      currencyId: account.currencyId,
    },
    include: {
      currency: true,
    },
  });
  const res: Account = {
    id: newAccount.id,
    name: newAccount.name,
    currencyId: newAccount.currencyId,
    currency: newAccount.currency,
    userId: newAccount.userId,
    createdAt: newAccount.createdAt,
    updatedAt: newAccount.updatedAt,
  };
  return res;
}

export async function getAccountsByUserDB(userId: string): Promise<Account[]> {
  const accounts = await prisma.account.findMany({
    where: {
      userId,
    },
    include: {
      currency: true,
    },
  });
  return accounts.map((account) => ({
    id: account.id,
    name: account.name,
    currencyId: account.currencyId,
    currency: account.currency,
    userId: account.userId,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  }));
}

export async function getAccountsByUserWithBalanceDB(
  userId: string,
): Promise<AccountWithBalance[]> {
  const accountsWithBalance = await prisma.$queryRaw<
    {
      id: string;
      name: string;
      currencyId: number;
      userId: string;
      createdAt: Date;
      updatedAt: Date;
      balance: number;
      currencyName: string;
      currencySymbol: string;
      currencyMultiplier: number;
      currencyCreatedAt: Date;
      currencyUpdatedAt: Date;
    }[]
  >`
    SELECT
      a.id,
      a.name,
      a.currencyId,
      a.userId,
      a.createdAt,
      a.updatedAt,
      ac.name as currencyName,
      ac.symbol as currencySymbol,
      ac.multiplier as currencyMultiplier,
      ac.createdAt as currencyCreatedAt,
      ac.updatedAt as currencyUpdatedAt,
      CAST(COALESCE(SUM(
        CASE
          WHEN t.typeId = 1 THEN t.amount
          WHEN t.typeId = 2 THEN -t.amount
          ELSE 0
        END
      ), 0) as REAL) AS balance
    FROM
      Account a
    LEFT JOIN
      "Transaction" t
    ON
      a.id = t.accountId
    LEFT JOIN
      "AccountCurrency" ac
    ON
      a.currencyId = ac.id
    WHERE
      a.userId = ${userId}
    GROUP BY
      a.id;
  `;
  return accountsWithBalance.map((account) => ({
    id: account.id,
    name: account.name,
    currencyId: account.currencyId,
    userId: account.userId,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
    balance: account.balance,
    currency: {
      id: account.currencyId,
      name: account.currencyName,
      symbol: account.currencySymbol,
      multiplier: account.currencyMultiplier,
      createdAt: account.currencyCreatedAt,
      updatedAt: account.currencyUpdatedAt,
    },
  }));
}

export async function getAccountByIdDB(
  accountId: string,
): Promise<Account | null> {
  const account = await prisma.account.findFirst({
    where: {
      id: accountId,
    },
    include: {
      currency: true,
    },
  });
  if (!account) {
    return null;
  }
  return {
    id: account.id,
    name: account.name,
    currencyId: account.currencyId,
    currency: account.currency,
    userId: account.userId,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}

export async function updateAccountDB(
  accountId: string,
  name: string,
  currencyId: number,
): Promise<Account | null> {
  const account = await prisma.account.update({
    where: {
      id: accountId,
    },
    data: {
      name,
      currencyId,
    },
    include: {
      currency: true,
    },
  });
  return {
    id: account.id,
    name: account.name,
    currencyId: account.currencyId,
    currency: account.currency,
    userId: account.userId,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}

export async function deleteAccountDB(accountId: string): Promise<void> {
  await prisma.account.delete({
    where: {
      id: accountId,
    },
  });
}

export async function getAccountByUserIdAndName(
  userId: string,
  name: string,
): Promise<Account | null> {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      name,
    },
    include: {
      currency: true,
    },
  });
  if (!account) {
    return null;
  }
  return {
    id: account.id,
    name: account.name,
    currencyId: account.currencyId,
    currency: account.currency,
    userId: account.userId,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}
