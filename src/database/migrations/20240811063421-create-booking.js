'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Bookings', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      startDate: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      amountPaid: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      massIntention: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bookedBy: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      uniqueBookingID: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sundayMassTime: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      weekdayMassTime: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdBy: {
        type: Sequelize.ENUM('User', 'Admin'),
        allowNull: false,
      },
      createdAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updatedAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        ),
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('Bookings');
  },
};
