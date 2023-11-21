module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      enrolledAt: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      grade: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      class: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      modelName: "User",
      tableName: "User",
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    },
  );

  User.associate = (models) => {
    User.hasMany(models.Roadmap, {
      foreignKey: "userId",
      sourceKey: "userId",
    });
    User.hasMany(models.Save, {
      foreignKey: "userId",
      sourceKey: "userId",
    });
  };

  return User;
};
