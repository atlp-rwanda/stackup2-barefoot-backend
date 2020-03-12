
module.exports = (sequelize, DataTypes) => {
  const request = sequelize.define('request', {
    userId: DataTypes.INTEGER,
    travelFrom: DataTypes.STRING,
    travelTo: DataTypes.STRING,
    travelDate: DataTypes.DATE,
    travelReason: DataTypes.STRING,
    travelType: DataTypes.STRING,
    status: DataTypes.STRING,
    accommodation: DataTypes.BOOLEAN
  });
  return request;
};
