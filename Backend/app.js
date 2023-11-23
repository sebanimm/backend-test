const express = require("express");
const cors = require("cors");
const db = require("./models");
const login = require("./utils/login");
const user = require("./utils/user");
const roadmap = require("./utils/roadmap");
const save = require("./utils/save");
const constants = require("./constants");
const { BsmOauth, BsmOauthError, BsmOauthErrorType } = require("bsm-oauth");
const { tokenValidation } = require("./middleware");

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("✅ DB Connected!");
  })
  .catch((err) => {
    console.error(err);
  });

const bsmOauth = new BsmOauth(
  constants.BSM_AUTH_CLIENT_ID,
  constants.BSM_AUTH_CLIENT_SECRET,
);

const app = express();

app.use(cors({ origin: true, credentials: true }));

// bsm oauth 로그인
app.post("/login/oauth", async (request, response) => {
  try {
    const authCode = request.query.code;
    const token = await bsmOauth.getToken(authCode);
    const resource = await bsmOauth.getResource(token);

    const { accessToken, refreshToken } = await login.loginUser(resource);

    response.send({ accessToken, refreshToken });
  } catch (error) {
    if (error instanceof BsmOauthError) {
      switch (error.type) {
        case BsmOauthErrorType.INVALID_CLIENT: {
          console.log("클라이언트 정보가 올바르지 않습니다.");
          break;
        }
        case BsmOauthErrorType.AUTH_CODE_NOT_FOUND: {
          console.log("인증코드를 찾을 수 없습니다.");
          break;
        }
        case BsmOauthErrorType.TOKEN_NOT_FOUND: {
          console.log("토큰을 찾을 수 없습니다.");
          break;
        }
        default: {
          console.log("알 수 없는 오류가 발생했습니다.");
        }
      }
    } else {
      console.log("알 수 없는 오류가 발생했습니다2.");
      console.log(error);
    }
  }
});

// 토큰 재발급
app.put("/login/token", tokenValidation, (request, response) => {
  try {
    const refreshToken = request.query.refreshToken;
    const { userCode } = login.decodeToken(refreshToken);

    const accessToken = login.generateToken(userCode, "1h");

    response.send(accessToken);
  } catch (error) {
    console.log(error);
    response.status(403).send("Invalid jwt");
  }
});

// 로그인된 유저의 정보
app.get("/user", async (request, response) => {
  try {
    const accessToken = request.query.accessToken;
    const { userCode } = login.decodeToken(accessToken);

    const data = await user.getSelectedUserData(userCode);

    if (data === null) {
      response.status(404).send("user not found");
    } else {
      response.send(data.dataValues);
    }
  } catch (error) {
    console.log(error);
    response.status(403).send("Invalid jwt");
  }
});

// 특정 유저의 정보 조회
app.get("/user/:userId", (request, response) => {
  const userId = request.params.userId;
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
