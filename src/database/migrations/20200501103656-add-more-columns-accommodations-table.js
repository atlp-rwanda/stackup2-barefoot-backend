module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.renameColumn('accommodations', 'name', 'accommodationName'),
    queryInterface.addColumn(
      'accommodations',
      'createdBy',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        references: {
          model: 'users',
          key: 'id'
        },
      }
    ),
    queryInterface.addColumn('accommodations', 'accommodationImage', Sequelize.STRING),
    queryInterface.addColumn('accommodations', 'accommodationAddress', Sequelize.STRING),
    queryInterface.addColumn('accommodations', 'accommodationDescription', Sequelize.TEXT),
    queryInterface.addColumn('accommodations', 'cost', Sequelize.INTEGER),
    queryInterface.addColumn('accommodations', 'currency', Sequelize.STRING),
    queryInterface.addColumn('accommodations', 'services', Sequelize.ARRAY(Sequelize.STRING)),
    queryInterface.addColumn('accommodations', 'amenities', Sequelize.ARRAY(Sequelize.STRING)),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('accommodations', 'amenities'),
    queryInterface.removeColumn('accommodations', 'services'),
    queryInterface.removeColumn('accommodations', 'currency'),
    queryInterface.removeColumn('accommodations', 'cost'),
    queryInterface.removeColumn('accommodations', 'accommodationDescription'),
    queryInterface.removeColumn('accommodations', 'accommodationAddress'),
    queryInterface.removeColumn('accommodations', 'accommodationImage'),
    queryInterface.removeColumn('accommodations', 'createdBy'),
    queryInterface.renameColumn('accommodations', 'accommodationName', 'name'),
  ])
};
