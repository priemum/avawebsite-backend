-- AlterTable
ALTER TABLE "Articles" ADD COLUMN     "imagesId" TEXT;

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_imagesId_fkey" FOREIGN KEY ("imagesId") REFERENCES "Images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
