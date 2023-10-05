/*
  Warnings:

  - Changed the type of `Purpose` on the `ListWithUs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ListWithUs" DROP COLUMN "Purpose",
ADD COLUMN     "Purpose" "Purpose" NOT NULL;
