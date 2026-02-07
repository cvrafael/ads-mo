module.exports = (sequelize, DataTypes) => {
  const Rack = sequelize.define(
    'racks',
    {
      rack: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fk_id_runin: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'racks',
      freezeTableName: true,
      underscored: true,
      timestamps: false,
    }
  );

  Rack.associate = (models) => {
    Rack.belongsTo(models.Runin, {
      foreignKey: 'fk_id_runin',
    });

    Rack.hasMany(models.Position, {
      foreignKey: 'fk_id_rack',
    });
  };

  return Rack;
};
