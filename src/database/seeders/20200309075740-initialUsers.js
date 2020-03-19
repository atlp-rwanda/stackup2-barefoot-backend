import utils from '../../utils/authentication.utils';

const { passwordHasher } = utils;
export default {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('users', [
    {
    firstName: 'Emmanuel',
    lastName: 'descholar',
    username: 'UDivine',
    email: 'barefootnomad2@gmail.com',
    password: await passwordHasher('barefootnomad2'),
    gender: 'Male',
    address: 'Butare',
    role: 'user',
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date()
    }
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('users', null, {})
};
