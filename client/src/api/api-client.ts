import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getToken = () => localStorage.getItem("tubescribe_token");

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => {
    console.error("Request error:", err);
    return Promise.reject(err);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log({ ApiResponse: response });
    return response;
  },
  (err) => {
    console.error("Response error:", err);
    if (err.response?.status === 401) {
      localStorage.removeItem("tubescribe_token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(err);
  }
);
