/*
  Warnings:

  - A unique constraint covering the columns `[announcementsId]` on the table `Images` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Images_announcementsId_key" ON "Images"("announcementsId");
