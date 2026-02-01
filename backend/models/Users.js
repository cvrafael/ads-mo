module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'users',
    {
      id_sub: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      family_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      given_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      tableName: 'users',
      freezeTableName: true,
      underscored: false,
      timestamps: false, // você só tem created_at
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Posts, {
      foreignKey: 'fk_id_user',
      sourceKey: 'id_sub',
    });

    User.hasMany(models.Like, {
      foreignKey: 'fk_id_user',
      sourceKey: 'id_sub',
    });

    User.hasOne(models.Avatar, {
      foreignKey: 'fk_id_user',
      sourceKey: 'id_sub',
    });
  };

  return User;
};
