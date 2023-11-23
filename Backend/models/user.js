module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
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
      classNo: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
    },
    {
      modelName: "User",
      tableName: "user",
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
