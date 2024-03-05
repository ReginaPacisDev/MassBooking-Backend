/*
  Warnings:

  - Added the required column `uniqueBookingID` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Booking` ADD COLUMN `uniqueBookingID` VARCHAR(191) NOT NULL;
