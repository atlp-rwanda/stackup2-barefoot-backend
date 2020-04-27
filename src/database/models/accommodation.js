export default (sequelize, DataTypes) => {
  const accommodation = sequelize.define('accommodation', {
    createdBy: DataTypes.INTEGER,
    accommodationImage: DataTypes.STRING,
    accommodationName: DataTypes.STRING,
    accommodationAddress: DataTypes.STRING,
    accommodationDescription: DataTypes.TEXT,
    cost: DataTypes.INTEGER,
    currency: DataTypes.STRING,
    services: DataTypes.ARRAY(DataTypes.STRING),
    amenities: DataTypes.ARRAY(DataTypes.STRING),
  }, {
    tableName: 'accommodations',
  });
  accommodation.associate = (models) => {
    accommodation.hasMany(models.accommodationRoom, {
      foreignKey: 'accommodationId',
      onUpdate: 'CASCADE'
    });
    accommodation.belongsTo(models.user, {
      foreignKey: 'createdBy',
      timestamp: true
    });
    accommodation.hasMany(models.rating, {
      foreignKey: 'accommodationId',
      onUpdate: 'CASCADE'
    });
  };
  return accommodation;
};
