import Login from "./Login";
import * as api from "./api";

function App() {
  return (
    <div style={{ background: "lightblue", width: "100vw", height: "100vh" }}>
      <div>
        <button>
          <Login />
        </button>
      </div>
      <div>
        <button onClick={api.reissueToken}>토큰재발급</button>
      </div>
      <div>
        <button onClick={api.getUser}>내 정보</button>
      </div>
      <div>
        <button onClick={() => api.getSelectedUser(1)}>한명 정보</button>
      </div>
      <div>
        <button onClick={api.getRoadmapData}>전체 로드맵</button>
      </div>
      <div>
        <button onClick={() => api.getUserRoadmapData(1)}>한명 로드맵</button>
      </div>
      <div>
        <button
          onClick={() => api.generateRoadmap(1, ["asdf", "qwer", "vjsw"])}
        >
          로드맵 생성
        </button>
      </div>
      <div>
        <button onClick={() => api.updateSelectedRoadmap(1, "qwer")}>
          로드맵 수정
        </button>
      </div>
      <div>
        <button onClick={() => api.getRoadmapDetail(1)}>로드맵 상세</button>
      </div>
      <div>
        <button onClick={() => api.deleteSelectedRoadmap(1)}>
          로드맵 삭제
        </button>
      </div>
      <div>
        <button onClick={() => api.addJJim(2, 1)}>찜 추가</button>
        <button onClick={() => api.deleteJJim(1, 1)}>찜 제거</button>
        <button onClick={() => api.countJJim(1)}>찜 갯수</button>
        <button onClick={() => api.userJJimRoadmap(1)}>유저 찜한 로드맵</button>
      </div>
    </div>
  );
}

export default App;
