const models = require("../models");

const addSave = async (userId, roadmapId) => {
  const a = await models.Roadmap.findOne({ where: { roadmapId } });
  if (a === null) return null;
  const data = await models.Save.create({ userId, roadmapId });
  return data;
};

const deleteSave = async (userId, roadmapId) => {
  const a = await models.Save.findOne({ where: { userId, roadmapId } });
  if (a === null) return null;
  const data = await models.Save.destroy({ where: { userId, roadmapId } });
  return data;
};

const getSaveCount = async (roadmapId) => {
  const data = await models.Save.count({ where: { roadmapId } });
  return data;
};

const getUserSavedRoadmap = async (userId) => {
  const saveData = await models.Save.findAll({ where: { userId } });
  console.log(saveData);
  // let roadmapId = [];
  // for (let i = 0; i < saveData.length; i++) {
  //   roadmapId.push(saveData[0].dataValues.roadmapId);
  // }
  // const data = await models.Roadmap.findAll({ where: { roadmapId } });
  // console.log(data);
  return data;
};

module.exports = { addSave, deleteSave, getSaveCount, getUserSavedRoadmap };
