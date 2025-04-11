
# 💤 Daily Sleep Tracker - Frontend

Đây là giao diện người dùng của ứng dụng **Daily Sleep Tracker**, cho phép người dùng ghi lại thời gian ngủ và phân tích thói quen ngủ hằng tuần. Dự án được phát triển bằng **React.js**.

---

## 📷 Giao diện chính

- Trang chào mừng (Splash Screen)
- Đăng ký / Đăng nhập người dùng
- Giao diện thêm bản ghi giấc ngủ (ngày, giờ ngủ, giờ thức)
- Biểu đồ trực quan hóa thời gian ngủ
- Bảng phân tích thói quen ngủ hằng tuần

---

## 🧩 Cấu trúc thư mục

```bash
src/
├── Home/              # Giao diện trang chính (biểu đồ, bảng, dialog nhập)
│   ├── Home.jsx
│   ├── SleepChart.jsx
│   ├── SleepTable.jsx
│   └── NewEntryDialog.jsx
│
├── Navbar/            # Thanh điều hướng
│   └── Navbar.jsx
│
├── Signin/            # Giao diện đăng nhập
│   └── Signin.jsx
│
├── Signup/            # Giao diện đăng ký
│   └── Signup.jsx
│
├── SleepAnalysis/     # Phân tích thói quen ngủ theo tuần
│   └── SleepAnalysis.jsx
│
├── SplashScreen/      # Màn hình chào ban đầu
│   └── SplashScreen.jsx
│
├── utils/             # Tiện ích như cấu hình axios
│   └── axiosInstance.js
│
├── App.js             # Cấu hình router chính
└── index.js           # Điểm bắt đầu ứng dụng
```

---

## 🚀 Cài đặt & Chạy dự án

```bash
# 1. Clone dự án
git clone https://github.com/Xuanbac12/daily-sleep-tracker-fontend.git
cd daily-sleep-tracker-fontend

# 2. Cài đặt thư viện
npm install

# 3. Chạy ứng dụng
npm start
```

---

## 🔧 Các thư viện sử dụng

- `react` – Thư viện UI chính
- `@mui/material` – Giao diện đẹp, dễ dùng (Material UI)
- `@mui/icons-material` – Thư viện icon MUI
- `chart.js`, `react-chartjs-2` – Biểu đồ trực quan
- `axios` – Gửi request đến backend

---

## 📡 Kết nối backend

Ứng dụng frontend này cần kết nối với backend (Spring Boot hoặc Node.js). Cập nhật địa chỉ trong file:

```js
// src/utils/axiosInstance.js
axios.defaults.baseURL = "http://localhost:8080/api"; // hoặc domain thật khi deploy
```

---

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp!  
Vui lòng tạo branch mới trước khi commit:

```bash
git checkout -b feature/your-feature-name
```

---

## 📄 Giấy phép

Dự án được phát hành theo giấy phép **MIT License**.

---

## 👤 Tác giả

- **Xuanbac12** - [GitHub](https://github.com/Xuanbac12)

