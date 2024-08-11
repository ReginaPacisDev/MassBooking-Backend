const TABLE_NAME = 'Bookings';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addIndex(TABLE_NAME, ['startDate', 'endDate'], {
        transaction,
      });

      await queryInterface.addIndex(TABLE_NAME, ['id'], {
        transaction,
      });

      await queryInterface.addIndex(TABLE_NAME, ['createdAt'], {
        transaction,
      });

      await queryInterface.addIndex(TABLE_NAME, ['bookedBy'], {
        transaction,
      });

      await queryInterface.addIndex(TABLE_NAME, ['name'], {
        transaction,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeIndex(TABLE_NAME, ['startDate', 'endDate'], {
        transaction,
      });

      await queryInterface.removeIndex(TABLE_NAME, ['id'], {
        transaction,
      });

      await queryInterface.removeIndex(TABLE_NAME, ['createdAt'], {
        transaction,
      });

      await queryInterface.removeIndex(TABLE_NAME, ['bookedBy'], {
        transaction,
      });

      await queryInterface.removeIndex(TABLE_NAME, ['name'], {
        transaction,
      });
    });
  },
};
