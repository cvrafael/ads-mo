module.exports = (sequelize, DataTypes) => {
  const Position = sequelize.define(
    'positions',
    {
      position: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('OK', 'NOK'),
        allowNull: false,
        defaultValue: 'OK',
      },
      fk_id_rack: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'positions',
      freezeTableName: true,
      underscored: true,
      timestamps: false,
    }
  );

  Position.associate = (models) => {
    Position.belongsTo(models.Rack, {
      foreignKey: 'fk_id_rack',
    });
  };

  return Position;
};
