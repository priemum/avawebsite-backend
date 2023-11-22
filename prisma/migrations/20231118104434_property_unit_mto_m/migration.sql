-- DropForeignKey
ALTER TABLE "PaymentPlan" DROP CONSTRAINT "PaymentPlan_propertyUnitsId_fkey";

-- CreateTable
CREATE TABLE "_PaymentPlanTopropertyUnits" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PaymentPlanTopropertyUnits_AB_unique" ON "_PaymentPlanTopropertyUnits"("A", "B");

-- CreateIndex
CREATE INDEX "_PaymentPlanTopropertyUnits_B_index" ON "_PaymentPlanTopropertyUnits"("B");

-- AddForeignKey
ALTER TABLE "_PaymentPlanTopropertyUnits" ADD CONSTRAINT "_PaymentPlanTopropertyUnits_A_fkey" FOREIGN KEY ("A") REFERENCES "PaymentPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaymentPlanTopropertyUnits" ADD CONSTRAINT "_PaymentPlanTopropertyUnits_B_fkey" FOREIGN KEY ("B") REFERENCES "propertyUnits"("id") ON DELETE CASCADE ON UPDATE CASCADE;
