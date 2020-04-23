
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tripRequestId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      accommodationId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      arrivalDate: {
        type: Sequelize.DATEONLY
      },
      departureDate: {
        type: Sequelize.DATEONLY
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      uniqueKeys: {
        tripRequestId: {
          fields: ['tripRequestId'],
        },
      },
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('bookings')
};
