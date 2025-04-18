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

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error?.config?.url;
    const isAuthEndpoint = url?.includes("/login") || url?.includes("/signup");

    if (!isAuthEndpoint && error.response?.status === 401) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      localStorage.clear();
      window.location.href = "/";
    }

    return Promise.reject(error); // Vẫn ném về catch
  }
);


export default instance;
