module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define(
    'posts',
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      image: DataTypes.BOOLEAN,
      website: DataTypes.STRING,
      payment_status: DataTypes.STRING,
      id_payment: DataTypes.STRING,
      status: DataTypes.STRING,
      premium: DataTypes.BOOLEAN,
      fk_id_user: DataTypes.STRING,
    },
    {
      tableName: 'posts',
      freezeTableName: true,
      underscored: false,
      timestamps: false,
    }
  );

  Posts.associate = (models) => {
    Posts.belongsTo(models.User, {
      foreignKey: 'fk_id_user',
      targetKey: 'id_sub',
    });

    Posts.hasMany(models.Like, {
      foreignKey: 'fk_id_post',
    });
  };

  return Posts;
};
