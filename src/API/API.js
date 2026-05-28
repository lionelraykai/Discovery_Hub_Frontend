import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
  timeout: 200000,
});

API.interceptors.request.use(
  async (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    
    // Only set default Content-Type if it's not already set (e.g. for FormData)
    if (!req.headers["Content-Type"]) {
      req.headers["Content-Type"] = "application/json";
    }
    req.headers["Accept"] = "application/json";

    console.log(
      `${new Date()} | ${req.method?.toUpperCase()} | ${req.url} |`,
      req.data,
    );
    return req;
  },
  (error) => Promise.reject(error),
);

API.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized- redirect to login");
      localStorage.clear();
    }
    return Promise.reject(error);
  },
);

export default API
