const HOST = process.env.MYSQL_HOST;
const USER = process.env.MYSQL_USER;
const PASSWORD = process.env.MYSQL_PASSWORD;
const PORT = process.env.MYSQL_PORT;
const DATABASE = process.env.MYSQL_DATABASE;
const BSM_AUTH_CLIENT_ID = process.env.BSM_AUTH_CLIENT_ID;
const BSM_AUTH_CLIENT_SECRET = process.env.BSM_AUTH_CLIENT_SECRET;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

module.exports = {
  HOST,
  USER,
  PASSWORD,
  PORT,
  DATABASE,
  BSM_AUTH_CLIENT_ID,
  BSM_AUTH_CLIENT_SECRET,
  JWT_SECRET_KEY,
};
