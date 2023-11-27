const express = require("express");
const cors = require("cors");
const db = require("./models");
const login = require("./utils/login");
const user = require("./utils/user");
const roadmap = require("./utils/roadmap");
const save = require("./utils/save");
const constants = require("./constants");
const { BsmOauth, BsmOauthError, BsmOauthErrorType } = require("bsm-oauth");
const { validateToken } = require("./middleware");

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
app.use("/roadmap", express.json());
app.use("/roadmap", express.urlencoded({ extended: false }));
app.use("/roadmap/:roadmapId", express.json());
app.use("/roadmap/:roadmapId", express.urlencoded({ extended: false }));
app.use("/save/:roadmapId", express.json());
app.use("/save/:roadmapId", express.urlencoded({ extended: false }));

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
app.put("/login/token", validateToken, (request, response) => {
  try {
    const refreshToken = request.headers["refresh-token"];
    const { userCode, userId } = login.decodeToken(refreshToken);

    const accessToken = login.generateToken(userCode, userId, "1h");

    response.send(accessToken);
  } catch (error) {
    console.log(error);
    response.status(403).send("Invalid jwt");
  }
});

// 로그인된 유저의 정보
app.get("/user", validateToken, async (request, response) => {
  try {
    const accessToken = request.headers.authorization;
    const { userCode } = login.decodeToken(accessToken);
    const data = await user.getUserData(userCode);

    if (data === null) {
      response.status(404).send("User not found");
    } else {
      response.send(data.dataValues);
    }
  } catch (error) {
    console.log(error);
    response.status(403).send("Invalid jwt");
  }
});

// 특정 유저의 정보 조회
app.get("/user/:userId", async (request, response) => {
  try {
    const userId = request.params.userId;
    const data = await user.getSelectedUserData(userId);

    if (data === null) {
      response.status(404).send("User not found");
    } else {
      response.send(data.dataValues);
    }
  } catch (error) {
    console.log(error);
    response.status(500).send("유저 조회 에러");
  }
});

// 특정 유저의 로드맵 조회
app.get("/user/:userId/roadmap", async (request, response) => {
  try {
    const userId = request.params.userId;
    const data = await roadmap.getUserRoadmapData(userId);
    response.send(data);
  } catch (error) {
    console.log(error);
    response.status(404).send("invalid user");
  }
});

// 로드맵 전체 조회
app.get("/roadmap", async (request, response) => {
  try {
    const data = await roadmap.getRoadmapData();
    response.send(data);
  } catch (error) {
    console.log(error);
  }
});

// 로드맵 작성
app.post("/roadmap", validateToken, async (request, response) => {
  try {
    const { userId, steps } = request.body;
    const data = await roadmap.addRoadmap(userId, steps);
    response.send(data);
  } catch (error) {
    console.log(error);
    response.status(404).send("잘못된 접근");
  }
});

// 로드맵 상세 조회
app.get("/roadmap/:roadmapId", async (request, response) => {
  try {
    const { roadmapId } = request.params;
    const data = await roadmap.getSelectedRoadmapData(roadmapId);
    response.send(data.dataValues);
  } catch (error) {
    console.log(error);
    response.status(404).send("invalid roadmap");
  }
});

// 로드맵 수정
app.put("/roadmap/:roadmapId", validateToken, async (request, response) => {
  try {
    const { roadmapId } = request.params;
    const { steps } = request.body;
    const data = await roadmap.updateSelectedRoadmap(roadmapId, steps);
    if (data === null) {
      response.status(404).send("존재하지 않는 로드맵");
    } else {
      response.status(200).send("성공적으로 수정됨");
    }
  } catch (error) {
    console.log(error);
    response.status(404).send("invalid roadmap");
  }
});

// 로드맵 삭제
app.delete("/roadmap/:roadmapId", validateToken, async (request, response) => {
  try {
    const { roadmapId } = request.params;
    const data = await roadmap.deleteSelectedRoadmapData(roadmapId);
    if (data === null) {
      response.status(404).send("존재하지 않는 로드맵");
    } else {
      response.status(200).send("성공적으로 삭제됨");
    }
  } catch (error) {
    console.log(error);
    response.status(500).send("로드맵 삭제 에러");
  }
});

// 로드맵 찜하기
app.post("/save/:roadmapId", validateToken, async (request, response) => {
  try {
    const { roadmapId } = request.params;
    const { userId } = request.body;
    const data = await save.addSave(userId, roadmapId);
    if (data === null) {
      response.status(404).send("로드맵이 존재하지 않음");
    } else {
      response.status(200).send("찜 성공");
    }
  } catch (error) {
    console.log(error);
    response.status(403).send("이미 찜한 로드맵입니다");
  }
});

// 로드맵 찜하기 취소
app.delete("/save/:roadmapId", validateToken, async (request, response) => {
  try {
    const { roadmapId } = request.params;
    const { userId } = request.query;
    const data = await save.deleteSave(userId, roadmapId);
    if (data === null) {
      response.status(404).send("존재하지 않는 찜");
    } else {
      response.status(200).send("찜 취소 성공");
    }
  } catch (error) {
    console.log(error);
    response.status(403).send("찜 취소 실패");
  }
});

// 찜하기 횟수
app.get("/save/:roadmapId/count", async (request, response) => {
  try {
    const { roadmapId } = request.params;
    const data = await save.getSaveCount(roadmapId);
    response.status(200).json(data);
  } catch (error) {
    console.log(error);
    response.status(500).send("찜 갯수 불러오기 실패");
  }
});

// 특정 유저의 찜한 로드맵 보기
app.get("/save/:userId/roadmap", async (request, response) => {
  try {
    const { userId } = request.params;
    const data = await save.getUserSavedRoadmap(userId);
    response.status(200).send(data);
  } catch (error) {
    console.log(error);
    response.status(500).send("찜한 로드맵 불러오기 실패");
  }
});

app.listen(8080, () => {
  console.log("listen");
});
