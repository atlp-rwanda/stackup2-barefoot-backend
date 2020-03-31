module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    userId: DataTypes.INTEGER,
    requestId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
      paranoid: true,
      timestamps: true
  });
  comment.associate = (models) => {
    comment.belongsTo(models.request, {
      foreignKey: 'requestId',
      as: 'request',
      timestamps: true,
    });
    comment.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'author',
      timestamps: true,
    });
  };
  return comment;
};
