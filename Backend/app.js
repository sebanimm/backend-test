const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const db = require("./models");
const { BsmOauth, BsmOauthError, BsmOauthErrorType } = require("bsm-oauth");
const {
  HOST,
  USER,
  PASSWORD,
  PORT,
  DATABASE,
  BSM_AUTH_CLIENT_ID,
  BSM_AUTH_CLIENT_SECRET,
} = require("./constants");

const connection = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  port: PORT,
  database: DATABASE,
});

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("✅ DB Connected!");
  })
  .catch((err) => {
    console.error(err);
  });

const bsmOauth = new BsmOauth(BSM_AUTH_CLIENT_ID, BSM_AUTH_CLIENT_SECRET);

const app = express();

app.use(cors({ origin: "*" }));

// bsm oauth 로그인
app.post("/login/oauth", async (request, response) => {
  const authCode = request.query.code;
  try {
    const token = await bsmOauth.getToken(authCode);
    const resource = await bsmOauth.getResource(token);
    const { userCode, email, nickname } = resource;
    const { name, enrolledAt, grade, classNo } = resource.student;
    const values = { name, enrolledAt, grade, classNo, userCode };

    const findQuery = "SELECT userCode FROM user WHERE userCode = ?";
    connection.query(findQuery, userCode, (error, result) => {
      console.log(result);
    });

    const insertQuery =
      "INSERT INTO user(name, enrolledAt, grade, classNo, userCode) VALUES(?)";
    connection.query(insertQuery, values, (error, result) => {
      console.log(result);
    });

    const accessToken = generateAccessToken(userCode, email);
    const refreshToken = generateRefreshToken(userCode, email, nickname);

    response.send({ accessToken, refreshToken });
  } catch (error) {
    if (!(error instanceof BsmOauthError)) {
      return;
    }
    if (error.type === BsmOauthErrorType.INVALID_CLIENT) {
      response.status(400).send("Invalid client");
    }
    if (error.type === BsmOauthErrorType.AUTH_CODE_NOT_FOUND) {
      response.status(404).send("Authentication code not found");
    }
    if (error.type === BsmOauthErrorType.TOKEN_NOT_FOUND) {
      response.status(404).send("Token not found");
    }
  }
});

app.put("/token/reissue", (request, response) => {
  try {
    const refreshToken = request.query.refreshToken;
    const { userCode, email } = decodeToken(refreshToken);
    const accessToken = generateAccessToken(userCode, email);
    response.send(accessToken);
  } catch (error) {
    console.log(error);
    response.status(403).send("Invalid jwt");
  }
});

// 로그인된 유저의 정보
app.get("/user", (request, response) => {
  try {
    const accessToken = request.query.accessToken;
    const { userCode } = decodeToken(accessToken);
    connection.query(
      `select * from user where userId = ${userCode}`,
      (error, rows) => {
        if (error) throw error;
        response.send(rows);
      },
    );
  } catch (error) {
    console.log(error);
    response.status(403).send("Invalid jwt");
  }
});

// 특정 유저의 로드맵 조회
app.get("/user/:userId/roadmap", (request, response) => {
  response.send("테스트");
});

// 로드맵 전체 조회
app.get("/roadmap", (request, response) => {
  response.send("테스트");
});

// 로드맵 상세 조회
app.get("/roadmap/:roadmapId", (request, response) => {
  response.send("테스트");
});

// 로드맵 작성
app.post("/roadmap/:roadmapId", (request, response) => {
  response.send("테스트");
});

// 로드맵 수정
app.put("/roadmap/:roadmapId", (request, response) => {
  response.send("테스트");
});

// 로드맵 삭제
app.delete("/roadmap/:roadmapId", (request, response) => {
  response.send("테스트");
});

// 로드맵 찜하기
app.post("/save/:roadmapId", (request, response) => {
  response.send("테스트");
});

// 로드맵 찜하기 취소
app.delete("/save/:roadmapId", (request, response) => {
  response.send("테스트");
});

// 찜하기 횟수
app.get("/save/:roadmapId", (request, response) => {
  response.send("테스트");
});

// 특정 유저의 찜한 로드맵 보기
app.get("/save/:userId", (request, response) => {
  response.send("테스트");
});

app.listen(8080, () => {
  console.log("listen");
});
