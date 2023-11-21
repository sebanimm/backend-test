const {
  JWT_SECRET_KEY,
  SECONDS_IN_AN_HOUR,
  SECONDS_IN_A_MONTH,
} = require("./constants");

const generateAccessToken = (userCode, email) => {
  const accessToken = jwt.sign(
    { userCode: userCode, email: email },
    JWT_SECRET_KEY,
    { expiresIn: SECONDS_IN_AN_HOUR },
  );
  return accessToken;
};

const generateRefreshToken = (userCode, email, nickname) => {
  const refreshToken = jwt.sign(
    { userCode: userCode, email: email, nickname: nickname },
    JWT_SECRET_KEY,
    { expiresIn: SECONDS_IN_A_MONTH },
  );
  return refreshToken;
};

const decodeToken = (token) => {
  const data = jwt.verify(token, JWT_SECRET_KEY);
  return data;
};

module.exports = { generateAccessToken, generateRefreshToken, decodeToken };
