/*
  Warnings:

  - A unique constraint covering the columns `[Name,ID]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Role_Name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Role_Name_ID_key" ON "Role"("Name", "ID");
