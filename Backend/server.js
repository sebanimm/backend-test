const express = require("express");
const cors = require("cors");
const { BsmOauthError, BsmOauthErrorType } = require("bsm-oauth");
const {
  connection,
  bsmOauth,
  generateAccessToken,
  generateRefreshToken,
  decodeToken,
} = require("./constants");

const app = express();

app.use(cors({ origin: "*" }));

// bsm oauth 로그인
app.post("/login/oauth", async (req, res) => {
  const authCode = req.query.code;
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
    const { userCode, email } = decodeToken(refreshToken);
    const accessToken = generateAccessToken(userCode, email);
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
    const { userCode } = decodeToken(accessToken);
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
