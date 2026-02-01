module.exports = (sequelize, DataTypes) => {
  const Avatar = sequelize.define(
    'avatars',
    {
      image: DataTypes.STRING,
      fk_id_user: DataTypes.STRING,
    },
    {
      tableName: 'avatars',
      freezeTableName: true,
      underscored: true,
      timestamps: false,
    }
  );

  Avatar.associate = (models) => {
    Avatar.belongsTo(models.User, {
      foreignKey: 'fk_id_user',
      targetKey: 'id_sub',
    });
  };

  return Avatar;
};
