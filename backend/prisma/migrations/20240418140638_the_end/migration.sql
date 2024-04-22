/*
  Warnings:

  - You are about to drop the column `productId` on the `Trader` table. All the data in the column will be lost.
  - Added the required column `traderId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `ProductsSwiper` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Trader_productId_key";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "traderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductsSwiper" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Trader" DROP COLUMN "productId";

-- CreateTable
CREATE TABLE "Addresses" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Addresses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Addresses" ADD CONSTRAINT "Addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_traderId_fkey" FOREIGN KEY ("traderId") REFERENCES "Trader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
