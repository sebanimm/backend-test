const login = require("./utils/login");

const validateToken = (request, response, next) => {
  const accessToken = request.headers.authorization;
  const isValidData = login.verifyUser(accessToken);
  if (isValidData) next();
  else response.status(401).send("Unauthorized");
};

module.exports = { validateToken };
