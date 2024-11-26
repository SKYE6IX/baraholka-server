/*
  Warnings:

  - You are about to drop the column `imageId` on the `Image` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[adId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_imageId_fkey";

-- DropIndex
DROP INDEX "Image_imageId_key";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "imageId",
ADD COLUMN     "adId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Image_adId_key" ON "Image"("adId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
