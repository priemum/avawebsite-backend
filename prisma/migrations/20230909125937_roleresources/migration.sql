/*
  Warnings:

  - A unique constraint covering the columns `[roleID,resourcesID]` on the table `Role_Resources` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Role_Resources_roleID_resourcesID_key" ON "Role_Resources"("roleID", "resourcesID");
