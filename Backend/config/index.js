const { USER, PASSWORD, DATABASE, HOST } = require("../constants");

const development = {
  "username": USER,
  "password": PASSWORD,
  "database": DATABASE,
  "host": HOST,
  "dialect": "mysql",
};

const test = {
  "username": USER,
  "password": PASSWORD,
  "database": DATABASE,
  "host": HOST,
  "dialect": "mysql",
};

const production = {
  "username": USER,
  "password": PASSWORD,
  "database": DATABASE,
  "host": HOST,
  "dialect": "mysql",
};

module.exports = { development, test, production };
