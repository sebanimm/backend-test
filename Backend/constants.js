const mysql = require("mysql2");
const { BsmOauth } = require("bsm-oauth");

const HOST = process.env.MYSQL_HOST;
const USER = process.env.MYSQL_USER;
const PASSWORD = process.env.MYSQL_PASSWORD;
const PORT = process.env.MYSQL_PORT;
const DATABASE = process.env.MYSQL_DATABASE;
const BSM_AUTH_CLIENT_ID = process.env.BSM_AUTH_CLIENT_ID;
const BSM_AUTH_CLIENT_SECRET = process.env.BSM_AUTH_CLIENT_SECRET;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const SECONDS_IN_A_MINUTE = 60;
const MINUTES_IN_AN_HOUR = 60;
const HOURS_IN_A_DAY = 24;
const DAYS_IN_A_MONTH = 30;
const SECONDS_IN_AN_HOUR = SECONDS_IN_A_MINUTE * MINUTES_IN_AN_HOUR;
const SECONDS_IN_A_MONTH =
  SECONDS_IN_AN_HOUR * HOURS_IN_A_DAY * DAYS_IN_A_MONTH;

const connection = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  port: PORT,
  database: DATABASE,
});

const bsmOauth = new BsmOauth(BSM_AUTH_CLIENT_ID, BSM_AUTH_CLIENT_SECRET);

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

module.exports = {
  connection,
  bsmOauth,
  generateAccessToken,
  generateRefreshToken,
  decodeToken,
};
