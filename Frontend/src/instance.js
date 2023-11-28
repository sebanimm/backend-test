import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json", "Accept": "application/json" },
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = accessToken;
    }

    return config;
  },

  (error) => {
    return error;
  },
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    return error;
  },
);

export default instance;
