-- DropForeignKey
ALTER TABLE "Images" DROP CONSTRAINT "Images_usersID_fkey";

-- AlterTable
ALTER TABLE "Images" ALTER COLUMN "usersID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_usersID_fkey" FOREIGN KEY ("usersID") REFERENCES "Users"("ID") ON DELETE SET NULL ON UPDATE CASCADE;
