import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // nếu dùng react-icons


import "./Signup.css";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";
import "@fontsource/roboto";

const Signup = () => {
  const [user, setUser] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); //Loading state
  const [showPassword, setShowPassword] = useState(false); // 👁


  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  
  
  // ✅ Regex kiểm tra username và password
  const usernameRegex = /^[a-zA-Z0-9_]{2,20}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const isValidUsername = (username) => usernameRegex.test(username);
  const isStrongPassword = (password) => passwordRegex.test(password);

  //Hàm kiểm tra lỗi 1 field
  const validateField = (name, value) =>{
    switch (name) {
      case "username":
        if(!value) return "Vui lòng nhập tên đăng nhập.";
        if(!usernameRegex.test(value))
          return "Tên đăng ký phải từ 2–20 ký tự, chỉ gồm chữ, số, dấu gạch dưới.";
        return ""; // Không có lỗi
      case "password":
        if(!value) return "Vui lòng nhập mật khẩu.";
        if(!passwordRegex.test(value))
          return "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, thường, số và ký tự đặc biệt.";
        return ""; // Không có lỗi
        default:
          return ""; // Không có lỗi
    }
  };

  //Khi người dùng nhập -> kiểm tra lỗi ngay realtime
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const updatedUser = { ...user, [name]: value }; // ✅ đảm bảo lấy đúng dữ liệu mới
  setUser(updatedUser);

  
    const errorMessage = validateField(name, value); //Kiểm tra lỗi
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage })); //Cập nhật lỗi
  };

  //khi người dùng submit form(Đăng ký)
  const handleSubmit = async (e) => {
    e.preventDefault(); //Không cho reload trang
   
    const usernameError = validateField("username", user.username);
    const passwordError = validateField("password", user.password);

    const newErrors = { //Reset lỗi khi submit
      username: usernameError,
      password: passwordError,
    };

    setErrors(newErrors); //Cập nhật lỗi

    if (usernameError || passwordError) {
      return; // Nếu có lỗi thì không gửi yêu cầu
    }
  
    
    setLoading(true); //Bắt đầu loading
    try {
      const res = await axios.post("/users/signup", user);
      
            // ✅ Đăng ký thành công → toast & chuyển trang khi toast đóng
            toast.success("Đăng ký thành công!", {
              autoClose: 4000,
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

           {/* 👁 Mật khẩu có toggle */}
           <div className="password-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Mật khẩu"
    value={user.password}
    onChange={handleChange}
    className="password-input"
  />
  <span
    className="toggle-password-icon"
    onClick={() => setShowPassword((prev) => !prev)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>
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
