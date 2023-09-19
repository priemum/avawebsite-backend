/*
  Warnings:

  - Added the required column `articlesId` to the `Articles_Translation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Articles_Translation" ADD COLUMN     "articlesId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Articles_Translation" ADD CONSTRAINT "Articles_Translation_articlesId_fkey" FOREIGN KEY ("articlesId") REFERENCES "Articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
