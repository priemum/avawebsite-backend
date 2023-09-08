/*
  Warnings:

  - A unique constraint covering the columns `[Name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Role_Name_key" ON "Role"("Name");
