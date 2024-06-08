-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_application_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_application_fkey";

-- DropForeignKey
ALTER TABLE "OrderReceiptDesign" DROP CONSTRAINT "OrderReceiptDesign_application_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_application_fkey";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_application_fkey" FOREIGN KEY ("application") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_application_fkey" FOREIGN KEY ("application") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderReceiptDesign" ADD CONSTRAINT "OrderReceiptDesign_application_fkey" FOREIGN KEY ("application") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_application_fkey" FOREIGN KEY ("application") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
