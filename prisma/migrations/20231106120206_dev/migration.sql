/*
  Warnings:

  - You are about to drop the column `paragraph` on the `OrderReceiptDesign` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `OrderReceiptDesign` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderReceiptDesign" DROP COLUMN "paragraph",
DROP COLUMN "subtitle";
