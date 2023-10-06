/*
  Warnings:

  - You are about to drop the column `ArabicLevel` on the `Applicantion` table. All the data in the column will be lost.
  - The `EnglishLvl` column on the `Applicantion` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "LanguageLvl" AS ENUM ('None', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2');

-- AlterTable
ALTER TABLE "Applicantion" DROP COLUMN "ArabicLevel",
ADD COLUMN     "ArabicLvl" "LanguageLvl",
ALTER COLUMN "Message" DROP NOT NULL,
DROP COLUMN "EnglishLvl",
ADD COLUMN     "EnglishLvl" "LanguageLvl";
