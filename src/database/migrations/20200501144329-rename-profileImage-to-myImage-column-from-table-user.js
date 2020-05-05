module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.renameColumn('users', 'profileImage', 'myImage'),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.renameColumn('users', 'myImage', 'profileImage'),
  ])
};
