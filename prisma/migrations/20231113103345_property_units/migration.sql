/*
  Warnings:

  - You are about to drop the `propertyUnits` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PaymentPlan" DROP CONSTRAINT "PaymentPlan_propertyUnitsId_fkey";

-- DropForeignKey
ALTER TABLE "propertyUnits" DROP CONSTRAINT "propertyUnits_propertyId_fkey";

-- DropTable
DROP TABLE "propertyUnits";

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

-- AddForeignKey
ALTER TABLE "propertyUnits" ADD CONSTRAINT "propertyUnits_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentPlan" ADD CONSTRAINT "PaymentPlan_propertyUnitsId_fkey" FOREIGN KEY ("propertyUnitsId") REFERENCES "propertyUnits"("id") ON DELETE SET NULL ON UPDATE CASCADE;
