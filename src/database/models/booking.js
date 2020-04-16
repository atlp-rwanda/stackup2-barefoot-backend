
module.exports = (sequelize, DataTypes) => {
  const booking = sequelize.define('booking', {
    tripRequestId: DataTypes.NUMBER,
    accommodationId: DataTypes.NUMBER,
    arrivalDate: DataTypes.DATEONLY,
    departureDate: DataTypes.DATEONLY
  }, {});
  booking.associate = () => { };
  return booking;
};
