const models = require("../models");

const getSelectedUserData = async (userCode) => {
  const data = await models.User.findOne({ where: { userCode } });
  return data;
};

module.exports = { getSelectedUserData };
