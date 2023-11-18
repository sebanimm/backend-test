import { useEffect } from "react";
import instance from "./instance";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const encodedCode = searchParams.get("code") ?? "";
  const encodedValue = encodeURIComponent(encodedCode);

  const postAuthCode = async (encodedValue) => {
    const { data } = await instance.post("/login/oauth", null, {
      params: { "code": encodedValue },
    });
    return data;
  };

  const loginUser = async () => {
    try {
      const { accessToken, refreshToken } = await postAuthCode(encodedValue);

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      navigate("/");
    } catch (error) {
      console.error(error);
      navigate("/");
    }
  };

  const logoutUser = () => {
    localStorage.clear();
  };

  useEffect(() => {
    loginUser();
  }, [encodedValue]);

  return (
    <>
      {!localStorage.getItem("accessToken") ? (
        <a href="https://auth.bssm.kro.kr/oauth?clientId=c44b124c&redirectURI=http://localhost:5173/">
          bsm oauth임
        </a>
      ) : (
        <div onClick={logoutUser}>로그아웃</div>
      )}
    </>
  );
};

export default Login;
