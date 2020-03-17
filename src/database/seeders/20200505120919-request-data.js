
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('requests', [{
    userId: 1,
    travelReason: 'business',
    travelType: 'return-trip',
    status: 'pending',
    accommodation: true,
    handledBy: 1,
    createdAt: new Date(),
    updatedAt: new Date()
      }], {});

      const requests = await queryInterface.sequelize.query('SELECT id from requests;');
      const requestRows = requests[0];
      return await queryInterface.bulkInsert('trips', [{
          requestId: requestRows[0].id,
          travelFrom: 'kamembe',
          travelTo: 'kigali',
          travelDate: '2020-04-28',
          returnDate: '2020-06-03',
          createdAt: new Date(),
          updatedAt: new Date()
        }], {});
      },
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('requests', null, {})
};
