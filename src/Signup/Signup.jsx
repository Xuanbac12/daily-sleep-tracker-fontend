import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import "./Signup.css";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";

const Signup = () => {
  const [user, setUser] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); //Loading state

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  
  
  // ✅ Regex kiểm tra username và password
  const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const isValidUsername = (username) => usernameRegex.test(username);
  const isStrongPassword = (password) => passwordRegex.test(password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //Không cho reload trang
   
    let hasError = false; //Biến kiểm tra có lỗi hay không
    
    const newErrors = { //Reset lỗi khi submit
      username: "",
      password: "",
    };

    
      // Kiểm tra trống
  if (!user.username) {
    newErrors.username = "Vui lòng nhập tên đăng nhập.";
    hasError = true;
  } else if (!isValidUsername(user.username)) {
    newErrors.username = "Tên đăng nhập phải từ 4–20 ký tự, chỉ gồm chữ, số, dấu gạch dưới.";
    hasError = true;
  }

  if (!user.password) {
    newErrors.password = "Vui lòng nhập mật khẩu.";
    hasError = true;
  } else if (!isStrongPassword(user.password)) {
    newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, thường, số và ký tự đặc biệt.";
    hasError = true;
  }

  if (hasError) {
    setErrors(newErrors);
    return;
  }

       // Xóa lỗi cũ nếu không còn lỗi
  setErrors({ username: "", password: "" });
    
    setLoading(true); //Bắt đầu loading
    try {
      const res = await axios.post("/users/signup", user);
      
            // ✅ Đăng ký thành công → toast & chuyển trang khi toast đóng
            toast.success("Đăng ký thành công!", {
              autoClose: 2000,
              onClose: () => navigate("/signin"),
            });
      
      } catch (err){
        if (err.response?.status === 409) {
          toast.error("Tên đăng ký đã tồn tại!");
        } else if (err.response?.status === 400) {
          toast.warn(err.response.data); // Thông báo từ backend (ví dụ: sai định dạng)
        } else if (err.response?.status === 500) {
          toast.error("Lỗi hệ thống. Vui lòng thử lại sau.");
        } else {
          toast.error("Đã xảy ra lỗi khi đăng ký.");
          console.error("Lỗi đăng ký:", err);
        }
      } finally {
        setLoading(false);
      
      
    }

  };

  return (
    <main className="signup-main">
      <div className="form-container">
        <h2>Đăng ký</h2>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Tên đăng ký"
            value={user.username}
            onChange={handleChange}           
          />
          {/* ✅ Hiển thị lỗi dưới ô username */}
  {errors.username && <p className="input-error">{errors.username}</p>}
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={user.password}
            onChange={handleChange}
          />
          {/* ✅ Hiển thị lỗi dưới ô password */}
  {errors.password && <p className="input-error">{errors.password}</p>}
  <button type="submit" disabled={loading}>
    {loading ? "Đang xử lý..." : "Đăng ký"}
  </button>
</form>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Đã có tài khoản?{" "}
          <Link to="/signin" style={{ color: "#5795FA", fontWeight: "bold" }}>
            Đăng nhập
          </Link>
        </p>
      </div>
    </main>
  );

};


export default Signup;
