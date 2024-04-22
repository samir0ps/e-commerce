/*
  Warnings:

  - Added the required column `countInStock` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "countInStock" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "SuggestedCategories" (
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "SuggestedCategories_pkey" PRIMARY KEY ("categoryId")
);

-- AddForeignKey
ALTER TABLE "SuggestedCategories" ADD CONSTRAINT "SuggestedCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
