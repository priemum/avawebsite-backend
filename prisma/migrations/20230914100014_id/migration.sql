/*
  Warnings:

  - The primary key for the `Address` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Address` table. All the data in the column will be lost.
  - The primary key for the `Articles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Articles` table. All the data in the column will be lost.
  - The primary key for the `Articles_Translation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Articles_Translation` table. All the data in the column will be lost.
  - The primary key for the `Currency` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Currency` table. All the data in the column will be lost.
  - The primary key for the `Currency_Translation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Currency_Translation` table. All the data in the column will be lost.
  - The primary key for the `Images` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Images` table. All the data in the column will be lost.
  - The primary key for the `Languages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Languages` table. All the data in the column will be lost.
  - The primary key for the `Resources` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Resources` table. All the data in the column will be lost.
  - The primary key for the `Role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Role` table. All the data in the column will be lost.
  - The primary key for the `Role_Resources` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Role_Resources` table. All the data in the column will be lost.
  - The primary key for the `Team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Team` table. All the data in the column will be lost.
  - The primary key for the `Unit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Unit` table. All the data in the column will be lost.
  - The primary key for the `Unit_Translation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Unit_Translation` table. All the data in the column will be lost.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Users` table. All the data in the column will be lost.
  - The required column `id` was added to the `Address` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Articles` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Articles_Translation` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Currency` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Currency_Translation` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Images` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Languages` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Resources` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Role` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Role_Resources` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Team` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Unit` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Unit_Translation` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_addressID_fkey";

-- DropForeignKey
ALTER TABLE "Address_Translation" DROP CONSTRAINT "Address_Translation_addressID_fkey";

-- DropForeignKey
ALTER TABLE "Address_Translation" DROP CONSTRAINT "Address_Translation_languagesID_fkey";

-- DropForeignKey
ALTER TABLE "Articles" DROP CONSTRAINT "Articles_usersID_fkey";

-- DropForeignKey
ALTER TABLE "Articles_Translation" DROP CONSTRAINT "Articles_Translation_languagesID_fkey";

-- DropForeignKey
ALTER TABLE "Currency_Translation" DROP CONSTRAINT "Currency_Translation_currencyID_fkey";

-- DropForeignKey
ALTER TABLE "Currency_Translation" DROP CONSTRAINT "Currency_Translation_languagesID_fkey";

-- DropForeignKey
ALTER TABLE "Images" DROP CONSTRAINT "Images_teamID_fkey";

-- DropForeignKey
ALTER TABLE "Images" DROP CONSTRAINT "Images_usersID_fkey";

-- DropForeignKey
ALTER TABLE "Role_Resources" DROP CONSTRAINT "Role_Resources_resourcesID_fkey";

-- DropForeignKey
ALTER TABLE "Role_Resources" DROP CONSTRAINT "Role_Resources_roleID_fkey";

-- DropForeignKey
ALTER TABLE "Unit_Translation" DROP CONSTRAINT "Unit_Translation_languagesID_fkey";

-- DropForeignKey
ALTER TABLE "Unit_Translation" DROP CONSTRAINT "Unit_Translation_unitID_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_roleID_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_teamID_fkey";

-- AlterTable
ALTER TABLE "Address" DROP CONSTRAINT "Address_pkey",
DROP COLUMN "ID",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Address_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Articles" DROP CONSTRAINT "Articles_pkey",
DROP COLUMN "ID",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Articles_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Articles_Translation" DROP CONSTRAINT "Articles_Translation_pkey",
DROP COLUMN "ID",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Articles_Translation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Currency" DROP CONSTRAINT "Currency_pkey",
DROP COLUMN "ID",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Currency_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Currency_Translation" DROP CONSTRAINT "Currency_Translation_pkey",
DROP COLUMN "ID",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Currency_Translation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Images" DROP CONSTRAINT "Images_pkey",
DROP COLUMN "ID",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Images_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Languages" DROP CONSTRAINT "Languages_pkey",
DROP COLUMN "ID",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Languages_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Resources" DROP CONSTRAINT "Resources_pkey",
DROP COLUMN "ID",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Resources_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Role" DROP CONSTRAINT "Role_pkey",
DROP COLUMN "ID",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Role_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Role_Resources" DROP CONSTRAINT "Role_Resources_pkey",
DROP COLUMN "ID",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Role_Resources_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Team" DROP CONSTRAINT "Team_pkey",
DROP COLUMN "ID",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Team_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Unit" DROP CONSTRAINT "Unit_pkey",
DROP COLUMN "ID",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Unit_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Unit_Translation" DROP CONSTRAINT "Unit_Translation_pkey",
DROP COLUMN "ID",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Unit_Translation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Users" DROP CONSTRAINT "Users_pkey",
DROP COLUMN "ID",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_teamID_fkey" FOREIGN KEY ("teamID") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_roleID_fkey" FOREIGN KEY ("roleID") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role_Resources" ADD CONSTRAINT "Role_Resources_roleID_fkey" FOREIGN KEY ("roleID") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role_Resources" ADD CONSTRAINT "Role_Resources_resourcesID_fkey" FOREIGN KEY ("resourcesID") REFERENCES "Resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_usersID_fkey" FOREIGN KEY ("usersID") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_teamID_fkey" FOREIGN KEY ("teamID") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_usersID_fkey" FOREIGN KEY ("usersID") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_addressID_fkey" FOREIGN KEY ("addressID") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Articles_Translation" ADD CONSTRAINT "Articles_Translation_languagesID_fkey" FOREIGN KEY ("languagesID") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address_Translation" ADD CONSTRAINT "Address_Translation_languagesID_fkey" FOREIGN KEY ("languagesID") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address_Translation" ADD CONSTRAINT "Address_Translation_addressID_fkey" FOREIGN KEY ("addressID") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit_Translation" ADD CONSTRAINT "Unit_Translation_languagesID_fkey" FOREIGN KEY ("languagesID") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit_Translation" ADD CONSTRAINT "Unit_Translation_unitID_fkey" FOREIGN KEY ("unitID") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Currency_Translation" ADD CONSTRAINT "Currency_Translation_languagesID_fkey" FOREIGN KEY ("languagesID") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Currency_Translation" ADD CONSTRAINT "Currency_Translation_currencyID_fkey" FOREIGN KEY ("currencyID") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
