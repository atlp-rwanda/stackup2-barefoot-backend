import utils from '../../utils/authentication.utils';
import userRoles from '../../utils/userRoles.utils';

const {
      passwordHasher
} = utils;
const {
      REQUESTER
} = userRoles;

export default {
      up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('users', [{
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
            },
            {
                  firstName: 'Emmanuel',
                  lastName: 'descholar',
                  username: 'commentManager',
                  email: 'commentManager@gmail.com',
                  password: await passwordHasher('commentManager@1'),
                  gender: 'Male',
                  address: 'Butare',
                  role: 'manager',
                  isVerified: true,
                  createdAt: new Date(),
                  updatedAt: new Date()
            },
            {
                  firstName: 'Emmanuel',
                  lastName: 'descholar',
                  username: 'UDivine',
                  email: 'barefootnomad5@gmail.com',
                  password: await passwordHasher('barefootnomad2'),
                  gender: 'Male',
                  address: 'Butare',
                  role: 'requester',
                  isVerified: false,
                  createdAt: new Date(),
                  updatedAt: new Date()
            },
            {
                  firstName: 'Emmanuel',
                  lastName: 'descholar',
                  username: 'SPatrick',
                  email: 'barefootnomad3@gmail.com',
                  password: await passwordHasher('barefootnomad2'),
                  gender: 'Male',
                  address: 'Butare',
                  role: 'travel administrator',
                  isVerified: true,
                  createdAt: new Date(),
                  updatedAt: new Date()
            },
            {
                  firstName: 'Jon',
                  lastName: 'Snow',
                  username: 'Stark',
                  email: 'jonsnow@gmail.com',
                  password: await passwordHasher('commentManager@1'),
                  gender: 'Male',
                  address: 'Butare',
                  role: 'manager',
                  emailNotification: true,
                  inAppNotification: true,
                  isVerified: true,
                  createdAt: new Date(),
                  updatedAt: new Date()
            },
            {
                  firstName: 'Lord',
                  lastName: 'Varys',
                  username: 'VarysHouse',
                  email: 'varys@gmail.com',
                  password: await passwordHasher('barefootnomad2'),
                  gender: 'Male',
                  address: 'Butare',
                  role: 'requester',
                  isVerified: false,
                  createdAt: new Date(),
                  updatedAt: new Date()
            },
      ], {}),

      down: (queryInterface, Sequelize) => queryInterface.bulkDelete('users', null, {})
};
