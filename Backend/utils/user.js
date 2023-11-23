const models = require("../models");

const getUserData = async (userCode) => {
  const data = await models.User.findOne({ where: { userCode } });
  return data;
};

const getSelectedUserData = async (userId) => {
  const data = await models.User.findOne({ where: { userId } });
  return data;
};

module.exports = { getUserData, getSelectedUserData };
