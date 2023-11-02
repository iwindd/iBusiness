/*
  Warnings:

  - You are about to drop the column `products` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "products";

-- CreateTable
CREATE TABLE "OrderProduct" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "serial" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "OrderProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderProduct" ADD CONSTRAINT "OrderProduct_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
