
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    gender: DataTypes.STRING,
    address: DataTypes.STRING,
    role: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN
  }, {});
  return user;
};
