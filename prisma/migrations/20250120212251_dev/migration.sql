/*
  Warnings:

  - Added the required column `multiplier` to the `AccountCurrency` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AccountCurrency" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "multiplier" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AccountCurrency" ("createdAt", "id", "name", "symbol", "updatedAt") SELECT "createdAt", "id", "name", "symbol", "updatedAt" FROM "AccountCurrency";
DROP TABLE "AccountCurrency";
ALTER TABLE "new_AccountCurrency" RENAME TO "AccountCurrency";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
