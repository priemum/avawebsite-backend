/*
  Warnings:

  - A unique constraint covering the columns `[teamID]` on the table `Images` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Images" ADD COLUMN     "teamID" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Images_teamID_key" ON "Images"("teamID");

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_teamID_fkey" FOREIGN KEY ("teamID") REFERENCES "Team"("ID") ON DELETE SET NULL ON UPDATE CASCADE;
