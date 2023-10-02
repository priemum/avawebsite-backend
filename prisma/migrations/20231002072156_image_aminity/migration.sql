-- DropForeignKey
ALTER TABLE "Aminities" DROP CONSTRAINT "Aminities_imagesId_fkey";

-- AlterTable
ALTER TABLE "Aminities" ALTER COLUMN "imagesId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Aminities" ADD CONSTRAINT "Aminities_imagesId_fkey" FOREIGN KEY ("imagesId") REFERENCES "Images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
