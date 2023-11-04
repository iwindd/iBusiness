/*
  Warnings:

  - Added the required column `cost` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profit` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "cost" INTEGER NOT NULL,
ADD COLUMN     "profit" INTEGER NOT NULL;
