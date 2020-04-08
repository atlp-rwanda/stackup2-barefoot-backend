module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.renameTable('accommodation', 'accommodations'),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.renameTable('accommodations', 'accommodation'),
  ])
};
