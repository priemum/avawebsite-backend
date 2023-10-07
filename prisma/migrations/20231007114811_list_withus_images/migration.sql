-- AlterTable
ALTER TABLE "ListWithUs" ADD COLUMN     "imagesId" TEXT;

-- AddForeignKey
ALTER TABLE "ListWithUs" ADD CONSTRAINT "ListWithUs_imagesId_fkey" FOREIGN KEY ("imagesId") REFERENCES "Images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
