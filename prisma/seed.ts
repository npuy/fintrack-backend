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
        { id: 3, name: 'Transfer' },
        { id: 4, name: 'Tax Refund' },
      ],
    });
    console.log('Transaction types seeded.');
  } else {
    console.log('Transaction types already seeded.');
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
