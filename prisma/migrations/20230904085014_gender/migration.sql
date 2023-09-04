/*
  Warnings:

  - The `Gender` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "Gender",
ADD COLUMN     "Gender" "Gender";
