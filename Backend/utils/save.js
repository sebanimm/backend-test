const models = require("../models");

const addSave = async (userId, roadmapId) => {
  await models.Save.create({ userId, roadmapId });
};
