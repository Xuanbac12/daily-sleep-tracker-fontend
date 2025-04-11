import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Signin.css";

const Signin = () => {
  const [user, setUser] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.username && user.password) {
      try {
        // Gửi yêu cầu đăng nhập
        const res = await axios.post("http://localhost:8080/api/users/login", user);
  
        const { token, userId, firstLogin } = res.data;
  
        // ✅ Lưu thông tin vào localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("username", user.username);
        localStorage.setItem("firstLogin", firstLogin);
  
        // ✅ Điều hướng
        navigate("/home");
  
      } catch (err) {
        console.error("Đăng nhập thất bại:", err);
        alert("Tài khoản hoặc mật khẩu sai!");
      }
    } else {
      alert("Vui lòng nhập đầy đủ thông tin.");
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
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={user.password}
            onChange={handleChange}
            required
          />
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
