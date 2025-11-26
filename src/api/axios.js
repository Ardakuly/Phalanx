import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api/public/user", // Base URL for auth endpoints
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
