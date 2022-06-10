/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "profileId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Image_profileId_key" ON "Image"("profileId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
