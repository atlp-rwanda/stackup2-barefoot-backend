
export default (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    socialMediaId: DataTypes.STRING,
    provider: DataTypes.STRING,
    gender: DataTypes.STRING,
    address: DataTypes.STRING,
    role: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN,
    birthDate: DataTypes.DATE,
    preferredLanguage: DataTypes.STRING,
    preferredCurrency: DataTypes.STRING,
    department: DataTypes.STRING,
    lineManager: DataTypes.STRING,
    idCardNumber: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    profileImage: DataTypes.STRING
  }, {});

  return user;
};
