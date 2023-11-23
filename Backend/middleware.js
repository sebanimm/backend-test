const login = require("./utils/login");

const tokenValidation = (request, response, next) => {
  const accessToken = request.query.accessToken;
  const isValidData = login.verifyUser(accessToken);
  if (isValidData) next();
  else response.status(403).send("Invalid jwt");
};

module.exports = { tokenValidation };
