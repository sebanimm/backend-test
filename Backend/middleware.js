const login = require("./utils/login");

const validateToken = (request, response, next) => {
  try {
    const accessToken = request.headers.authorization;
    const isValidData = login.verifyUser(accessToken);
    if (isValidData) next();
  } catch (error) {
    console.log(error);
    response.status(401).send("Unauthorized");
  }
};

module.exports = { validateToken };
