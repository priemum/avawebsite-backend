-- DropForeignKey
ALTER TABLE "MetaData" DROP CONSTRAINT "MetaData_articlesId_fkey";

-- DropForeignKey
ALTER TABLE "MetaData" DROP CONSTRAINT "MetaData_propertyId_fkey";

-- AlterTable
ALTER TABLE "MetaData" ALTER COLUMN "propertyId" DROP NOT NULL,
ALTER COLUMN "articlesId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "MetaData" ADD CONSTRAINT "MetaData_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetaData" ADD CONSTRAINT "MetaData_articlesId_fkey" FOREIGN KEY ("articlesId") REFERENCES "Articles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
