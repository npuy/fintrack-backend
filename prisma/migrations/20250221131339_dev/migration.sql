-- CreateTable
CREATE TABLE "BudgetGroups" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "limit" REAL NOT NULL,
    "currencyId" INTEGER NOT NULL DEFAULT 1,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BudgetGroups_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "AccountCurrency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BudgetGroups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_BudgetGroupsToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_BudgetGroupsToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "BudgetGroups" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BudgetGroupsToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "BudgetGroups_name_userId_key" ON "BudgetGroups"("name", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "_BudgetGroupsToCategory_AB_unique" ON "_BudgetGroupsToCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_BudgetGroupsToCategory_B_index" ON "_BudgetGroupsToCategory"("B");
