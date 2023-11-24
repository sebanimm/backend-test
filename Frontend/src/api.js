import instance from "./instance";

export const reissueToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const { data } = await instance.put("/login/token", null, {
    headers: { "refresh-token": refreshToken },
  });
  console.log(data);
};

export const getUser = async () => {
  const { data } = await instance.get("/user");
  console.log(data);
};

export const getSelectedUser = async (userId) => {
  const { data } = await instance.get("/user", {
    params: { userId },
  });
  console.log(data);
};

export const getRoadmapData = async () => {
  const { data } = await instance.get("/roadmap");
  console.log(data);
};

export const getUserRoadmapData = async (userId) => {
  const { data } = await instance.get(`/user/${userId}/roadmap`);
  console.log(data);
};

export const generateRoadmap = async (userId, steps) => {
  const { data } = await instance.post("/roadmap", { userId, steps });
  console.log(data);
};

export const getRoadmapDetail = async (roadmapId) => {
  const { data } = await instance.get(`/roadmap/${roadmapId}`);
  console.log(data);
};

export const updateSelectedRoadmap = async (roadmapId, steps) => {
  const { data } = await instance.put(`/roadmap/${roadmapId}`, { steps });
  console.log(data);
};

export const deleteSelectedRoadmap = async (roadmapId) => {
  const { data } = await instance.delete(`/roadmap/${roadmapId}`);
  console.log(data);
};
