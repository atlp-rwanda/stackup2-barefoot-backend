export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      unique: true
    },
    password: {
      type: Sequelize.STRING
    },
    socialMediaId: {
      type: Sequelize.STRING
    },
    provider: {
      type: Sequelize.STRING
    },
    gender: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
    },
    role: {
      type: Sequelize.STRING
    },
    isVerified: {
      type: Sequelize.BOOLEAN
    },
    username: {
      type: Sequelize.STRING
    },
    birthDate: {
      type: Sequelize.DATE
    },
    preferredLanguage: {
      type: Sequelize.STRING
    },
    preferredCurrency: {
      type: Sequelize.STRING
    },
    department: {
      type: Sequelize.STRING
    },
    lineManager: {
      type: Sequelize.STRING
    },
    idCardNumber: {
      type: Sequelize.STRING
    },
    phoneNumber: {
      type: Sequelize.STRING
    },
    profileImage: {
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('users')
};
