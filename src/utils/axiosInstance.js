import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080",
});

// ✅ Thêm token vào request header
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Nếu nhận lỗi 401 (token hết hạn), thì logout
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      localStorage.clear();
      window.location.href = "/"; // Quay về trang login
    }
    return Promise.reject(error);
  }
);

export default instance;
