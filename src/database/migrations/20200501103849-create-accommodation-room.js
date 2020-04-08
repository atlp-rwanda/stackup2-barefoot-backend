export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('accommodationRooms', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    accommodationId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      onUpdate: 'CASCADE',
      references: {
        model: 'accommodations',
        key: 'id'
      },
    },
    roomNumber: {
      type: Sequelize.STRING
    },
    roomType: {
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('accommodationRooms')
};
