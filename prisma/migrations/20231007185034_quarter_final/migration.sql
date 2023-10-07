/*
  Warnings:

  - You are about to drop the column `languagesId` on the `ListWithUs_Translation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ListWithUs_Translation" DROP CONSTRAINT "ListWithUs_Translation_languagesId_fkey";

-- AlterTable
ALTER TABLE "ListWithUs_Translation" DROP COLUMN "languagesId";

-- AddForeignKey
ALTER TABLE "ListWithUs_Translation" ADD CONSTRAINT "ListWithUs_Translation_languagesID_fkey" FOREIGN KEY ("languagesID") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
