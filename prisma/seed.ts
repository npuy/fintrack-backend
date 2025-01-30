import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existingTransactionType = await prisma.transactionType.findFirst({
    where: { name: 'Income' },
  });

  if (!existingTransactionType) {
    await prisma.transactionType.createMany({
      data: [
        { id: 1, name: 'Income' },
        { id: 2, name: 'Expense' },
      ],
    });
    console.log('Transaction types seeded.');
  } else {
    console.log('Transaction types already seeded.');
  }

  const existingAccountCurrency = await prisma.accountCurrency.findFirst({
    where: { id: 1 },
  });

  if (!existingAccountCurrency) {
    await prisma.accountCurrency.createMany({
      data: [
        { id: 1, name: 'USD', symbol: '$', multiplier: 1 },
        { id: 2, name: 'UYU', symbol: '$U', multiplier: 43.5 },
      ],
    });
    console.log('Account currencies seeded.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
