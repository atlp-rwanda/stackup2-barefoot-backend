
module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.changeColumn(
      'users',
      'lineManager',
      {
        allowNull: true,
        type: 'INTEGER USING CAST("lineManager" as INTEGER)',
      }
    ),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.changeColumn(
      'users',
      'lineManager',
      {
        allowNull: true,
        type: Sequelize.STRING,
      }
    ),
  ])
};
