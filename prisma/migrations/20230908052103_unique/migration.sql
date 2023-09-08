/*
  Warnings:

  - A unique constraint covering the columns `[Title]` on the table `Articles_Translation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Name]` on the table `Resources` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Title]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Email]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Articles_Translation_Title_key" ON "Articles_Translation"("Title");

-- CreateIndex
CREATE UNIQUE INDEX "Resources_Name_key" ON "Resources"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_Name_key" ON "Role"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_Title_key" ON "Team"("Title");

-- CreateIndex
CREATE UNIQUE INDEX "Users_Email_key" ON "Users"("Email");
