import axios from "axios";
console.log("🌐 Backend URL: ", process.env.REACT_APP_BACKEND_URL); // Kiểm tra xem giá trị thực sự là gì

const instance = axios.create({
  baseURL: "/api", // dùng proxy
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
