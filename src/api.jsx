import axios from "axios";
import { useNavigate } from "react-router-dom";

// Konfigurasi Axios
const api = axios.create({
  baseURL: "https://api.wisatawatuaji.com/",
  withCredentials: true,
});

// Tambahkan interceptor untuk menangani status 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Gunakan navigate di dalam interceptor
      window.location.href = "/loginAdmin"; // Arahkan ke halaman login
    }
    return Promise.reject(error);
  }
);

export default api;
