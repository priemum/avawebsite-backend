-- CreateEnum
CREATE TYPE "direction" AS ENUM ('ltr', 'rtl');

-- AlterTable
ALTER TABLE "Languages" ADD COLUMN     "Direction" "direction" NOT NULL DEFAULT 'ltr';

-- CreateTable
CREATE TABLE "ListWithUs_Translation" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "languagesID" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "languagesId" TEXT NOT NULL,
    "listWithUsId" TEXT NOT NULL,

    CONSTRAINT "ListWithUs_Translation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ListWithUs_Translation" ADD CONSTRAINT "ListWithUs_Translation_languagesId_fkey" FOREIGN KEY ("languagesId") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListWithUs_Translation" ADD CONSTRAINT "ListWithUs_Translation_listWithUsId_fkey" FOREIGN KEY ("listWithUsId") REFERENCES "ListWithUs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
