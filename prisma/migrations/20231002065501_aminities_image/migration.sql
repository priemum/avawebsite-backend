/*
  Warnings:

  - Added the required column `imagesId` to the `Aminities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Aminities" ADD COLUMN     "imagesId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Aminities" ADD CONSTRAINT "Aminities_imagesId_fkey" FOREIGN KEY ("imagesId") REFERENCES "Images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
