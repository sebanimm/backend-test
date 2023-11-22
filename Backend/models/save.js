module.exports = (sequelize, DataTypes) => {
  const Save = sequelize.define(
    "Save",
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      roadmapId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      modelName: "Save",
      tableName: "save",
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    },
  );

  Save.associate = (models) => {
    Save.belongsTo(models.User, {
      foreignKey: "userId",
      sourceKey: "userId",
    });
    Save.belongsTo(models.Roadmap, {
      foreignKey: "roadmapId",
      sourceKey: "roadmapId",
    });
  };

  return Save;
};
