/*
  Warnings:

  - Added the required column `name` to the `Color` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Color" ADD COLUMN     "name" TEXT NOT NULL;
