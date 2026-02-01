module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    'likes',
    {
      like: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fk_id_post: DataTypes.INTEGER,
      fk_id_user: DataTypes.STRING,
    },
    {
      tableName: 'likes',
      freezeTableName: true,
      underscored: true,
      timestamps: false,
      indexes: [
    {
      unique: true,
      fields: ['fk_id_user', 'fk_id_post'],
    },
  ],
    }
  );

  Like.associate = (models) => {
    Like.belongsTo(models.Posts, {
      foreignKey: 'fk_id_post',
    });

    Like.belongsTo(models.User, {
      foreignKey: 'fk_id_user',
      targetKey: 'id_sub',
    });
  };

  return Like;
};
