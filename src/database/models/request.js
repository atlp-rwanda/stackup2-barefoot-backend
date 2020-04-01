
module.exports = (sequelize, DataTypes) => {
  const request = sequelize.define('request', {
    userId: DataTypes.INTEGER,
    travelFrom: DataTypes.STRING,
    travelTo: DataTypes.STRING,
    travelDate: DataTypes.DATEONLY,
    returnDate: DataTypes.DATEONLY,
    travelReason: DataTypes.STRING,
    travelType: DataTypes.STRING,
    status: DataTypes.STRING,
    accommodation: DataTypes.BOOLEAN
  });
  request.associate = (models) => {
    request.hasMany(models.comment, {
      foreignKey: 'requestId',
      onDelete: 'CASCADE'
    });
      request.belongsTo(models.user, {
      foreignKey: 'userId'
    });
  };
  return request;
};
