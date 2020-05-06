import utils from '../../utils/authentication.utils';
import userRoles from '../../utils/userRoles.utils';

const { passwordHasher } = utils;
const { REQUESTER } = userRoles;

export default {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('users', [
    {
    firstName: 'initial',
    lastName: 'user',
    username: 'initialuser',
    email: 'barefootnomad2@gmail.com',
    password: await passwordHasher('barefootnomad2'),
    gender: 'Male',
    address: 'Butare',
    role: REQUESTER,
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date()
    }
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('users', null, {})
};
