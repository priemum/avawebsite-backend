/*
  Warnings:

  - You are about to drop the `_ImagesToListWithUs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ImagesToListWithUs" DROP CONSTRAINT "_ImagesToListWithUs_A_fkey";

-- DropForeignKey
ALTER TABLE "_ImagesToListWithUs" DROP CONSTRAINT "_ImagesToListWithUs_B_fkey";

-- AlterTable
ALTER TABLE "Images" ADD COLUMN     "listWithUsId" TEXT;

-- DropTable
DROP TABLE "_ImagesToListWithUs";

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_listWithUsId_fkey" FOREIGN KEY ("listWithUsId") REFERENCES "ListWithUs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
