/*
  Warnings:

  - Added the required column `Description` to the `Announcements_Translation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Title` to the `Announcements_Translation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Description` to the `Category_Translation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Name` to the `Category_Translation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Name` to the `Developer_Translation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Description` to the `Property_Translation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Name` to the `Property_Translation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Announcements_Translation" ADD COLUMN     "ButtonName" TEXT,
ADD COLUMN     "Description" TEXT NOT NULL,
ADD COLUMN     "Title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Category_Translation" ADD COLUMN     "Description" TEXT NOT NULL,
ADD COLUMN     "Name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Developer_Translation" ADD COLUMN     "Name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Property_Translation" ADD COLUMN     "Description" TEXT NOT NULL,
ADD COLUMN     "Name" TEXT NOT NULL;
