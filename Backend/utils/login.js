const jwt = require("jsonwebtoken");
const models = require("../models");
const user = require("./user");
const { JWT_SECRET_KEY } = require("../constants");

const generateToken = ({ ...rest }, expiresIn) => {
  const token = jwt.sign({ ...rest }, JWT_SECRET_KEY, {
    expiresIn,
  });
  return token;
};

const decodeToken = (token) => {
  const data = jwt.verify(token, JWT_SECRET_KEY);
  return data;
};

const loginUser = async (resource) => {
  try {
    const { userCode } = resource;
    const { name, enrolledAt, grade, classNo } = resource.student;
    const defaults = { name, enrolledAt, grade, classNo, userCode };

    await models.User.findOrCreate({
      where: { userCode: userCode },
      defaults: defaults,
    });

    const accessToken = generateToken({ userCode }, "1h");
    const refreshToken = generateToken({ userCode }, "30d");

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("로그인 중 에러");
  }
};

const verifyUser = async (accessToken) => {
  const { userCode } = decodeToken(accessToken);
  const data = await user.getSelectedUserData(userCode);

  if (data === null) {
    return false;
  }

  return true;
};

module.exports = { generateToken, decodeToken, loginUser, verifyUser };
