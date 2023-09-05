-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "ActiveStatus" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "Description" DROP NOT NULL;
