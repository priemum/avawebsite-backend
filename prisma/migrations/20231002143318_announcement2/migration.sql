/*
  Warnings:

  - You are about to drop the column `announcementsId` on the `Images` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[announcementsID]` on the table `Images` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Images" DROP CONSTRAINT "Images_announcementsId_fkey";

-- DropIndex
DROP INDEX "Images_announcementsId_key";

-- AlterTable
ALTER TABLE "Images" DROP COLUMN "announcementsId",
ADD COLUMN     "announcementsID" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Images_announcementsID_key" ON "Images"("announcementsID");

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_announcementsID_fkey" FOREIGN KEY ("announcementsID") REFERENCES "Announcements"("id") ON DELETE SET NULL ON UPDATE CASCADE;
