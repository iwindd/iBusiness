/*
  Warnings:

  - Added the required column `latlng` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `line` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `short` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "latlng" JSONB NOT NULL,
ADD COLUMN     "line" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "short" TEXT NOT NULL,
ADD COLUMN     "time" JSONB NOT NULL;
