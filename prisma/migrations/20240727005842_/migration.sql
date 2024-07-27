/*
  Warnings:

  - Added the required column `mass` to the `Bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Bookings` ADD COLUMN `mass` VARCHAR(191) NOT NULL;
