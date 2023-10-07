/*
  Warnings:

  - You are about to drop the column `imagesId` on the `ListWithUs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ListWithUs" DROP CONSTRAINT "ListWithUs_imagesId_fkey";

-- AlterTable
ALTER TABLE "ListWithUs" DROP COLUMN "imagesId";

-- CreateTable
CREATE TABLE "_ImagesToListWithUs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ImagesToListWithUs_AB_unique" ON "_ImagesToListWithUs"("A", "B");

-- CreateIndex
CREATE INDEX "_ImagesToListWithUs_B_index" ON "_ImagesToListWithUs"("B");

-- AddForeignKey
ALTER TABLE "_ImagesToListWithUs" ADD CONSTRAINT "_ImagesToListWithUs_A_fkey" FOREIGN KEY ("A") REFERENCES "Images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImagesToListWithUs" ADD CONSTRAINT "_ImagesToListWithUs_B_fkey" FOREIGN KEY ("B") REFERENCES "ListWithUs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
