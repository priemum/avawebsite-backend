-- AlterTable
ALTER TABLE "Developer" ADD COLUMN     "imagesId" TEXT;

-- AddForeignKey
ALTER TABLE "Developer" ADD CONSTRAINT "Developer_imagesId_fkey" FOREIGN KEY ("imagesId") REFERENCES "Images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
