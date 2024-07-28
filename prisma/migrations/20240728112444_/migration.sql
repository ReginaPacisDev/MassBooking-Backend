-- CreateTable
CREATE TABLE `Bookings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `startDate` INTEGER NOT NULL,
    `endDate` INTEGER NOT NULL,
    `amountPaid` DECIMAL(65, 30) NOT NULL,
    `massIntention` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `bookedBy` VARCHAR(191) NOT NULL,
    `uniqueBookingID` VARCHAR(191) NOT NULL,
    `sundayMassTime` VARCHAR(191) NULL,
    `weekdayMassTime` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
