/*
  Warnings:

  - You are about to drop the column `mass` on the `Bookings` table. All the data in the column will be lost.
  - Added the required column `sundayMassTime` to the `Bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekdayMassTime` to the `Bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Bookings` DROP COLUMN `mass`,
    ADD COLUMN `sundayMassTime` VARCHAR(191) NOT NULL,
    ADD COLUMN `weekdayMassTime` VARCHAR(191) NOT NULL;
