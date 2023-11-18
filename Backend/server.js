const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const { BsmOauth, BsmOauthError, BsmOauthErrorType } = require("bsm-oauth");

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
  host: "localhost",
  user: "root",
  password: "1234",
  port: 3306,
  database: "bssm_roadmap",
});

const app = express();

const bsmOauth = new BsmOauth(BSM_AUTH_CLIENT_ID, BSM_AUTH_CLIENT_SECRET);

app.use(cors({ origin: "*" }));

// bsm oauth 로그인
app.post("/login/oauth", async (req, res) => {
  const authCode = req.query.code;
  try {
    const token = await bsmOauth.getToken(authCode);
    const { userCode, email, nickname, student } = await bsmOauth.getResource(
      token,
    );
    const z = connection.query(
      `insert into user(name, admissionYear, grade, class) values(${student.name},${student.admissionYear}, ${student.grade}, ${student.class})`,
    );

    console.log(z);
    const accessToken = jwt.sign(
      { userCode: userCode, email: email },
      JWT_SECRET_KEY,
      { expiresIn: SECONDS_IN_AN_HOUR },
    );
    const refreshToken = jwt.sign(
      {
        userCode: userCode,
        email: email,
        nickname: nickname,
      },
      JWT_SECRET_KEY,
      { expiresIn: SECONDS_IN_A_MONTH },
    );

    res.send({ accessToken, refreshToken });
  } catch (error) {
    if (!(error instanceof BsmOauthError)) {
      return;
    }
    if (error.type === BsmOauthErrorType.INVALID_CLIENT) {
      res.status(400).send("Invalid client");
    }
    if (error.type === BsmOauthErrorType.AUTH_CODE_NOT_FOUND) {
      res.status(404).send("Authentication code not found");
    }
    if (error.type === BsmOauthErrorType.TOKEN_NOT_FOUND) {
      res.status(404).send("Token not found");
    }
  }
});

app.put("/token/reissue", (req, res) => {
  try {
    const refreshToken = req.query.refreshToken;
    const { userCode, email } = jwt.verify(refreshToken, JWT_SECRET_KEY);
    const accessToken = jwt.sign(
      { userCode: userCode, email: email },
      JWT_SECRET_KEY,
      { expiresIn: SECONDS_IN_AN_HOUR },
    );
    res.send(accessToken);
  } catch (error) {
    console.log(error);
    res.status(403).send("Invalid jwt");
  }
});

// 로그인된 유저의 정보
app.get("/user", (req, res) => {
  try {
    const accessToken = req.query.accessToken;
    const { userCode } = jwt.verify(accessToken, JWT_SECRET_KEY);
    connection.query(
      `select * from user where userId = ${userCode}`,
      (error, rows) => {
        if (error) throw error;
        res.send(rows);
      },
    );
  } catch (error) {
    console.log(error);
    res.status(403).send("Invalid jwt");
  }
});

// 특정 유저의 로드맵 조회
app.get("/user/:userId/roadmap", (req, res) => {
  res.send("테스트");
});

// 로드맵 전체 조회
app.get("/roadmap", (req, res) => {
  res.send("테스트");
});

// 로드맵 상세 조회
app.get("/roadmap/:roadmapId", (req, res) => {
  res.send("테스트");
});

// 로드맵 작성
app.post("/roadmap/:roadmapId", (req, res) => {
  res.send("테스트");
});

// 로드맵 수정
app.put("/roadmap/:roadmapId", (req, res) => {
  res.send("테스트");
});

// 로드맵 삭제
app.delete("/roadmap/:roadmapId", (req, res) => {
  res.send("테스트");
});

// 로드맵 찜하기
app.post("/save/:roadmapId", (req, res) => {
  res.send("테스트");
});

// 로드맵 찜하기 취소
app.delete("/save/:roadmapId", (req, res) => {
  res.send("테스트");
});

// 찜하기 횟수
app.get("/save/:roadmapId", (req, res) => {
  res.send("테스트");
});

// 특정 유저의 찜한 로드맵 보기
app.get("/save/:userId", (req, res) => {
  res.send("테스트");
});

app.listen(8080, () => {
  console.log("listen");
});
