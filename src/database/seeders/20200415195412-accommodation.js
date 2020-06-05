module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('accommodations', [{
      accommodationName: 'uno',
      accommodationAddress: 'giseyi',
      currency: 'dollar',
      createdBy: 1,
      createdAt: '2020-03-15',
      updatedAt: '2020-03-15',
    },
    {
      accommodationName: 'kehda',
      accommodationAddress: 'kamembe',
      currency: 'dollar',
      createdBy: 1,
      createdAt: '2020-03-15',
      updatedAt: '2020-03-15',
    },
    {
      accommodationName: 'serena',
      accommodationAddress: 'kigali',
      currency: 'dollar',
      createdBy: 1,
      createdAt: '2020-03-15',
      updatedAt: '2020-03-15',
    }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('accommodations', null, {})
};
