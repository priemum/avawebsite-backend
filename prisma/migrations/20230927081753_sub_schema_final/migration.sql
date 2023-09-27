/*
  Warnings:

  - Added the required column `Description` to the `Jobs_Translation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Title` to the `Jobs_Translation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Jobs_Translation" ADD COLUMN     "Description" TEXT NOT NULL,
ADD COLUMN     "Title" TEXT NOT NULL;
