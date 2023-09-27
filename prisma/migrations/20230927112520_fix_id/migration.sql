/*
  Warnings:

  - You are about to drop the column `aminitiesId` on the `Aminities_Translation` table. All the data in the column will be lost.
  - You are about to drop the column `languagesId` on the `Aminities_Translation` table. All the data in the column will be lost.
  - You are about to drop the column `announcementsId` on the `Announcements_Translation` table. All the data in the column will be lost.
  - You are about to drop the column `languagesId` on the `Announcements_Translation` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Category_Translation` table. All the data in the column will be lost.
  - You are about to drop the column `languagesId` on the `Category_Translation` table. All the data in the column will be lost.
  - You are about to drop the column `developerId` on the `Developer_Translation` table. All the data in the column will be lost.
  - You are about to drop the column `languagesId` on the `Developer_Translation` table. All the data in the column will be lost.
  - You are about to drop the column `languagesId` on the `Jobs_Translation` table. All the data in the column will be lost.
  - You are about to drop the column `languagesId` on the `Property_Translation` table. All the data in the column will be lost.
  - You are about to drop the column `propertyId` on the `Property_Translation` table. All the data in the column will be lost.
  - Added the required column `aminitiesID` to the `Aminities_Translation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `languagesID` to the `Aminities_Translation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `announcementsID` to the `Announcements_Translation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `languagesID` to the `Announcements_Translation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryID` to the `Category_Translation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `languagesID` to the `Category_Translation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `developerID` to the `Developer_Translation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `languagesID` to the `Developer_Translation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `languagesID` to the `Jobs_Translation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `languagesID` to the `Property_Translation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyID` to the `Property_Translation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Aminities_Translation" DROP CONSTRAINT "Aminities_Translation_aminitiesId_fkey";

-- DropForeignKey
ALTER TABLE "Aminities_Translation" DROP CONSTRAINT "Aminities_Translation_languagesId_fkey";

-- DropForeignKey
ALTER TABLE "Announcements_Translation" DROP CONSTRAINT "Announcements_Translation_announcementsId_fkey";

-- DropForeignKey
ALTER TABLE "Announcements_Translation" DROP CONSTRAINT "Announcements_Translation_languagesId_fkey";

-- DropForeignKey
ALTER TABLE "Category_Translation" DROP CONSTRAINT "Category_Translation_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Category_Translation" DROP CONSTRAINT "Category_Translation_languagesId_fkey";

-- DropForeignKey
ALTER TABLE "Developer_Translation" DROP CONSTRAINT "Developer_Translation_developerId_fkey";

-- DropForeignKey
ALTER TABLE "Developer_Translation" DROP CONSTRAINT "Developer_Translation_languagesId_fkey";

-- DropForeignKey
ALTER TABLE "Jobs_Translation" DROP CONSTRAINT "Jobs_Translation_languagesId_fkey";

-- DropForeignKey
ALTER TABLE "Property_Translation" DROP CONSTRAINT "Property_Translation_languagesId_fkey";

-- DropForeignKey
ALTER TABLE "Property_Translation" DROP CONSTRAINT "Property_Translation_propertyId_fkey";

-- AlterTable
ALTER TABLE "Aminities_Translation" DROP COLUMN "aminitiesId",
DROP COLUMN "languagesId",
ADD COLUMN     "aminitiesID" TEXT NOT NULL,
ADD COLUMN     "languagesID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Announcements_Translation" DROP COLUMN "announcementsId",
DROP COLUMN "languagesId",
ADD COLUMN     "announcementsID" TEXT NOT NULL,
ADD COLUMN     "languagesID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Category_Translation" DROP COLUMN "categoryId",
DROP COLUMN "languagesId",
ADD COLUMN     "categoryID" TEXT NOT NULL,
ADD COLUMN     "languagesID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Developer_Translation" DROP COLUMN "developerId",
DROP COLUMN "languagesId",
ADD COLUMN     "developerID" TEXT NOT NULL,
ADD COLUMN     "languagesID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Jobs_Translation" DROP COLUMN "languagesId",
ADD COLUMN     "languagesID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Property_Translation" DROP COLUMN "languagesId",
DROP COLUMN "propertyId",
ADD COLUMN     "languagesID" TEXT NOT NULL,
ADD COLUMN     "propertyID" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Developer_Translation" ADD CONSTRAINT "Developer_Translation_languagesID_fkey" FOREIGN KEY ("languagesID") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Developer_Translation" ADD CONSTRAINT "Developer_Translation_developerID_fkey" FOREIGN KEY ("developerID") REFERENCES "Developer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category_Translation" ADD CONSTRAINT "Category_Translation_languagesID_fkey" FOREIGN KEY ("languagesID") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category_Translation" ADD CONSTRAINT "Category_Translation_categoryID_fkey" FOREIGN KEY ("categoryID") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property_Translation" ADD CONSTRAINT "Property_Translation_languagesID_fkey" FOREIGN KEY ("languagesID") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property_Translation" ADD CONSTRAINT "Property_Translation_propertyID_fkey" FOREIGN KEY ("propertyID") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcements_Translation" ADD CONSTRAINT "Announcements_Translation_languagesID_fkey" FOREIGN KEY ("languagesID") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcements_Translation" ADD CONSTRAINT "Announcements_Translation_announcementsID_fkey" FOREIGN KEY ("announcementsID") REFERENCES "Announcements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jobs_Translation" ADD CONSTRAINT "Jobs_Translation_languagesID_fkey" FOREIGN KEY ("languagesID") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aminities_Translation" ADD CONSTRAINT "Aminities_Translation_aminitiesID_fkey" FOREIGN KEY ("aminitiesID") REFERENCES "Aminities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aminities_Translation" ADD CONSTRAINT "Aminities_Translation_languagesID_fkey" FOREIGN KEY ("languagesID") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
