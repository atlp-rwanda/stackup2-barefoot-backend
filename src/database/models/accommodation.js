
module.exports = (sequelize, DataTypes) => {
  const accommodation = sequelize.define('accommodation', {
    name: DataTypes.STRING
  }, {});
  accommodation.associate = () => { };
  return accommodation;
};
