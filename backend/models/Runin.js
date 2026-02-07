module.exports = (sequelize, DataTypes) => {
  const Runin = sequelize.define(
    'runins',
    {
      runin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'runins',
      freezeTableName: true,
      underscored: true,
      timestamps: false,
    }
  );

  Runin.associate = (models) => {
    Runin.hasMany(models.Rack, {
      foreignKey: 'fk_id_runin',
    });
  };

  return Runin;
};
