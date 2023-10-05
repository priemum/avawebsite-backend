/*
  Warnings:

  - Changed the type of `Purpose` on the `EnquiryForm` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "EnquiryForm" DROP COLUMN "Purpose",
ADD COLUMN     "Purpose" "Purpose" NOT NULL;
