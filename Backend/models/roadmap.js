module.exports = (sequelize, DataTypes) => {
  const Roadmap = sequelize.define(
    "Roadmap",
    {
      roadmapId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      steps: {
        type: DataTypes.STRING(1100),
        allowNull: false,
      },
    },
    {
      modelName: "Roadmap",
      tableName: "Roadmap",
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    },
  );

  Roadmap.associate = (models) => {
    Roadmap.belongsTo(models.User, {
      foreignKey: "userId",
      sourceKey: "userId",
    });
    Roadmap.hasMany(models.Save, {
      foreignKey: "userId",
      sourceKey: "userId",
    });
  };

  return Roadmap;
};
