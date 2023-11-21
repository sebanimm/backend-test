"use strict";

const Sequelize = require("sequelize");
const env = "development";
const config = require("../config")[env];
const { database, username, password } = config;

const User = require("./user");
const Save = require("./save");
const Roadmap = require("./roadmap");

const sequelize = new Sequelize(database, username, password, config);

const db = {};

db.User = User(sequelize, Sequelize);
db.Roadmap = Roadmap(sequelize, Sequelize);
db.Save = Save(sequelize, Sequelize);

Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
