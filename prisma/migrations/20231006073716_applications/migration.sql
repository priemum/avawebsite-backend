/*
  Warnings:

  - Added the required column `CVFileName` to the `Applicantion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CVFileSize` to the `Applicantion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Applicantion" ADD COLUMN     "CVFileName" TEXT NOT NULL,
ADD COLUMN     "CVFileSize" TEXT NOT NULL;
