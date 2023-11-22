/*
  Warnings:

  - You are about to drop the column `Area` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `BRNNo` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `Bacloney` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `BalconySize` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `Bathrooms` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `Bedrooms` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `DEDNo` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `PermitNumber` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `Price` on the `Property` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "Area",
DROP COLUMN "BRNNo",
DROP COLUMN "Bacloney",
DROP COLUMN "BalconySize",
DROP COLUMN "Bathrooms",
DROP COLUMN "Bedrooms",
DROP COLUMN "DEDNo",
DROP COLUMN "PermitNumber",
DROP COLUMN "Price";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "BRNNo" TEXT;

-- CreateTable
CREATE TABLE "propertyUnits" (
    "id" TEXT NOT NULL,
    "Size" DOUBLE PRECISION,
    "Price" DOUBLE PRECISION NOT NULL,
    "Bedrooms" INTEGER NOT NULL,
    "Bacloney" BOOLEAN NOT NULL DEFAULT false,
    "BalconySize" DOUBLE PRECISION,
    "Bathrooms" INTEGER,
    "EstimatedRent" DOUBLE PRECISION,
    "PricePerSQFT" DOUBLE PRECISION,
    "PermitNumber" TEXT NOT NULL,
    "DEDNo" TEXT NOT NULL,
    "propertyId" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "propertyUnits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentPlan" (
    "id" TEXT NOT NULL,
    "DownPayemnt" DOUBLE PRECISION NOT NULL,
    "TotalMonths" INTEGER NOT NULL,
    "Posthandover" BOOLEAN NOT NULL DEFAULT false,
    "NoOfPosthandoverMonths" INTEGER,
    "PosthandoverPercentage" DOUBLE PRECISION,
    "OnHandoverPercentage" DOUBLE PRECISION,
    "DuringConstructionMonths" INTEGER NOT NULL,
    "DuringConstructionPercentage" DOUBLE PRECISION NOT NULL,
    "HandoverDate" TIMESTAMP(3) NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "propertyUnitsId" TEXT,

    CONSTRAINT "PaymentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Installments" (
    "id" TEXT NOT NULL,
    "Number" INTEGER NOT NULL,
    "PercentageOfPayment" DOUBLE PRECISION NOT NULL,
    "Amount" DOUBLE PRECISION NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "paymentPlanId" TEXT,

    CONSTRAINT "Installments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Installments_Translation" (
    "id" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "languagesId" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "installmentsId" TEXT,

    CONSTRAINT "Installments_Translation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "propertyUnits" ADD CONSTRAINT "propertyUnits_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentPlan" ADD CONSTRAINT "PaymentPlan_propertyUnitsId_fkey" FOREIGN KEY ("propertyUnitsId") REFERENCES "propertyUnits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Installments" ADD CONSTRAINT "Installments_paymentPlanId_fkey" FOREIGN KEY ("paymentPlanId") REFERENCES "PaymentPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Installments_Translation" ADD CONSTRAINT "Installments_Translation_languagesId_fkey" FOREIGN KEY ("languagesId") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Installments_Translation" ADD CONSTRAINT "Installments_Translation_installmentsId_fkey" FOREIGN KEY ("installmentsId") REFERENCES "Installments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
