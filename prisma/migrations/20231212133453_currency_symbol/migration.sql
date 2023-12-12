/*
  Warnings:

  - Made the column `Symbol` on table `Currency_Translation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Currency_Translation" ALTER COLUMN "Symbol" SET NOT NULL,
ALTER COLUMN "Symbol" SET DEFAULT '';
