const models = require("../models");

const getRoadmapData = async () => {
  const data = await models.Roadmap.findAll();
  const a = [...data];
  let b = [];

  for (let i = 0; i < a.length; i++) {
    b[i] = a[i].dataValues;
  }

  return b;
};

const getUserRoadmapData = async (userId) => {
  const data = await models.Roadmap.findAll({ where: { userId } });
  return data;
};

const addRoadmap = async (userId, steps) => {
  const data = await models.Roadmap.create({ userId, steps });
  return data;
};

const getSelectedRoadmapData = async (roadmapId) => {
  const data = await models.Roadmap.findOne({ where: { roadmapId } });
  return data;
};

const updateSelectedRoadmap = async (roadmapId, newSteps) => {
  await models.Roadmap.update({ steps: newSteps }, { where: { roadmapId } });
};

const deleteSelectedRoadmapData = async (roadmapId) => {
  await models.Roadmap.destroy({ where: { roadmapId } });
};

module.exports = {
  getRoadmapData,
  getUserRoadmapData,
  addRoadmap,
  getSelectedRoadmapData,
  updateSelectedRoadmap,
  deleteSelectedRoadmapData,
};
