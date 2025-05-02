import axios from "axios";
import { BASE_API } from "../shared/constants/app";
import { toast } from "react-toastify";

const Http = axios.create({
  baseURL: BASE_API,
  withCredentials: true,
});
// Gắn accessToken vào headers trước mỗi request
Http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Xử lý token hết hạn
Http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Nếu access token hết hạn và chưa từng retry
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("token")
    ) {
      originalRequest._retry = true;
      try {
        // Gọi API refresh token
        const res = await axios.get(`${BASE_API}/auth/refresh-token`, {
          withCredentials: true,
        });

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("token", newAccessToken);

        // Cập nhật lại Authorization header cho request cũ
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return Http(originalRequest); // Gửi lại request cũ
      } catch (refreshError) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export default Http;
