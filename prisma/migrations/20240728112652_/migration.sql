/*
  Warnings:

  - Added the required column `createdBy` to the `Bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Bookings` ADD COLUMN `createdBy` ENUM('User', 'Admin') NOT NULL;
