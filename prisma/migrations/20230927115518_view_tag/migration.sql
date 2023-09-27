/*
  Warnings:

  - The `ViewTag` column on the `Developer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Developer" DROP COLUMN "ViewTag",
ADD COLUMN     "ViewTag" BOOLEAN NOT NULL DEFAULT true;
