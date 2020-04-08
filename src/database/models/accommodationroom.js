
export default (sequelize, DataTypes) => {
  const accommodationRoom = sequelize.define('accommodationRoom', {
    accommodationId: DataTypes.INTEGER,
    roomNumber: DataTypes.STRING,
    roomType: DataTypes.STRING
  }, {
    tableName: 'accommodationRooms',
  });
  accommodationRoom.associate = (models) => {
    accommodationRoom.belongsTo(models.accommodation, {
      foreignKey: 'accommodationId',
      timestamp: true
    });
  };
  return accommodationRoom;
};
