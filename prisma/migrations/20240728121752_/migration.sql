-- CreateIndex
CREATE INDEX `Bookings_startDate_endDate_id_idx` ON `Bookings`(`startDate`, `endDate`, `id`);
