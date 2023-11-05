-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "retail" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "retail" BOOLEAN NOT NULL DEFAULT true;
