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
  const a = [...data];
  let b = [];

  for (let i = 0; i < a.length; i++) {
    b[i] = a[i].dataValues;
  }

  return b;
};

const addRoadmap = async (userId, steps) => {
  const a = [...steps];
  const b = a.join(",");
  const data = await models.Roadmap.create({ userId, steps: b });
  return data;
};

const getSelectedRoadmapData = async (roadmapId) => {
  const data = await models.Roadmap.findOne({ where: { roadmapId } });
  return data;
};

const updateSelectedRoadmap = async (roadmapId, newSteps) => {
  const data = await models.Roadmap.update(
    { steps: newSteps },
    { where: { roadmapId } },
  );
  return data;
};

const deleteSelectedRoadmapData = async (roadmapId) => {
  const data = await models.Roadmap.destroy({ where: { roadmapId } });
  return data;
};

module.exports = {
  getRoadmapData,
  getUserRoadmapData,
  addRoadmap,
  getSelectedRoadmapData,
  updateSelectedRoadmap,
  deleteSelectedRoadmapData,
};
