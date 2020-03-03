
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('users', [{
    firstName: 'Divine',
    lastName: 'ugizwenayo',
    username: 'UDivine',
    email: 'ugizwenayodiny@gmail.com',
    password: 'didiny',
    gender: 'Female',
    address: 'kamembe',
    role: 'user',
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('users', null, {})
};
