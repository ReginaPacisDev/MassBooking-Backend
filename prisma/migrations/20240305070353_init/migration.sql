/*
  Warnings:

  - Made the column `email` on table `Booking` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Booking` MODIFY `email` VARCHAR(191) NOT NULL;
