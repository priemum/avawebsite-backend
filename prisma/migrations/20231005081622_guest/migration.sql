/*
  Warnings:

  - A unique constraint covering the columns `[Email]` on the table `GuestInformation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GuestInformation_Email_key" ON "GuestInformation"("Email");
