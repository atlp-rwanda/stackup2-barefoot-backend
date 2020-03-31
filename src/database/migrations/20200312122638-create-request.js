
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('requests', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    travelFrom: {
      allowNull: false,
      type: Sequelize.STRING
    },
    travelTo: {
      allowNull: false,
      type: Sequelize.STRING
    },
    travelDate: {
      allowNull: false,
      type: Sequelize.DATEONLY
    },
    returnDate: {
      allowNull: true,
      type: Sequelize.DATEONLY
    },
    travelReason: {
      allowNull: false,
      type: Sequelize.STRING
    },
    travelType: {
      allowNull: false,
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: 'pending'
    },
    accommodation: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
    },
    handledBy: {
      allowNull: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
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
      userIdDate: {
          fields: ['userId', 'travelDate']
      }
  } }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('requests')
};
