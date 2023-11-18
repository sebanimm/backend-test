import React from "react";
import instance from "./instance";
import Login from "./Login";

function App() {
  const [data, setData] = React.useState();
  const [token, setToken] = React.useState();
  const get = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;
    const { data } = await instance.get("/user", {
      params: { accessToken: accessToken },
    });
    setData(data);
  };

  React.useEffect(() => {
    get();
  }, []);

  const reissueToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const { data } = await instance.put("/token/reissue", null, {
      params: { refreshToken: refreshToken },
    });
    localStorage.setItem("accessToken", data);
    setToken(data);
  };

  return (
    <div style={{ background: "lightblue", width: "100vw", height: "100vh" }}>
      <h1>응답 : {data}</h1>
      <button>
        <Login />
      </button>
      <div>
        <button onClick={reissueToken}>토큰재발급</button>
        <h1>
          새거:<pre>{token}</pre>
        </h1>
      </div>
      <button onClick={get}>내 정보</button>
    </div>
  );
}

export default App;
