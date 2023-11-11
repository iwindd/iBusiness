/*
  Warnings:

  - You are about to drop the column `desc` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Activity` table. All the data in the column will be lost.
  - Added the required column `category` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payload` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "desc",
DROP COLUMN "title",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "payload" JSONB NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
