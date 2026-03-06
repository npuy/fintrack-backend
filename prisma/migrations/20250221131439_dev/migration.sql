/*
  Warnings:

  - You are about to drop the `BudgetGroups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BudgetGroupsToCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BudgetGroups";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_BudgetGroupsToCategory";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "BudgetGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "limit" REAL NOT NULL,
    "currencyId" INTEGER NOT NULL DEFAULT 1,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BudgetGroup_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "AccountCurrency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BudgetGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_BudgetGroupToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_BudgetGroupToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "BudgetGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BudgetGroupToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "BudgetGroup_name_userId_key" ON "BudgetGroup"("name", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "_BudgetGroupToCategory_AB_unique" ON "_BudgetGroupToCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_BudgetGroupToCategory_B_index" ON "_BudgetGroupToCategory"("B");
