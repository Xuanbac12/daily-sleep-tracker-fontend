import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../utils/axiosInstance"; // Đường dẫn đến axiosInstance của bạn
import "./Signin.css";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "@fontsource/roboto"; // tự động áp dụng


const Signin = () => {
  const [user, setUser] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
    const { login } = useContext(AuthContext);

      // Regex
  const usernameRegex = /^[a-zA-Z0-9_]{2,20}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const validateField = (name, value) => {
    switch (name) {
      case "username":
        if (!value) return "Vui lòng nhập tên đăng nhập.";
        if (!usernameRegex.test(value))
          return "Tên đăng nhập phải từ 2–20 ký tự, chỉ gồm chữ, số, dấu gạch dưới.";
        return "";
      case "password":
        if (!value) return "Vui lòng nhập mật khẩu.";
        if (!passwordRegex.test(value))
          return "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, thường, số và ký tự đặc biệt.";
        return "";
      default:
        return "";
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usernameErr = validateField("username", user.username);
    const passwordErr = validateField("password", user.password);
    setErrors({ username: usernameErr, password: passwordErr });

    if (usernameErr || passwordErr) return;

    try {
      const res = await axios.post("/users/login", user);
      const { token, username, userId, firstLogin } = res.data;
      login({ token, username, userId, firstLogin });
      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (err) {
      console.error("Đăng nhập thất bại:", err);
      toast.error("Tài khoản hoặc mật khẩu sai!");
    }
  };

  return (
    <main className="signin-main">
      <div className="form-container">
        <h2>Đăng nhập</h2>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            value={user.username}
            onChange={handleChange}
          />
            {errors.username && <p className="input-error">{errors.username}</p>}
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

          <button type="submit">Đăng nhập</button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Chưa có tài khoản?{" "}
          <Link to="/signup" style={{ color: "#5795FA", fontWeight: "bold" }}>
            Đăng ký
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Signin;
