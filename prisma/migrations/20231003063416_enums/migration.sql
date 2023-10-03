/*
  Warnings:

  - The `Type` column on the `Announcements` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `Purpose` column on the `Property` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Purpose" AS ENUM ('Rent', 'Buy');

-- CreateEnum
CREATE TYPE "RentFrequency" AS ENUM ('Yearly', 'Monthly', 'Weekly', 'Daily');

-- CreateEnum
CREATE TYPE "CompletionStatus" AS ENUM ('Ready', 'OffPlan');

-- CreateEnum
CREATE TYPE "AnnouncementType" AS ENUM ('Normal', 'Popup');

-- AlterTable
ALTER TABLE "Announcements" DROP COLUMN "Type",
ADD COLUMN     "Type" "AnnouncementType";

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "CompletionStatus" "CompletionStatus",
ADD COLUMN     "RentFrequency" "RentFrequency",
DROP COLUMN "Purpose",
ADD COLUMN     "Purpose" "Purpose";
