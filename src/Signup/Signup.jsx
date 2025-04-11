import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

const Signup = () => {
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
        const res = await axios.post("http://localhost:8080/api/users/signup", user);
        alert("Đăng ký thành công!");
        navigate("/");
      } catch (err) {
        if (err.response && err.response.status === 409) {
          alert("Tên đăng nhập đã tồn tại.");
        } else {
          alert("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.");
          console.error("Lỗi đăng ký:", err);
        }
      }
    } else {
      alert("Vui lòng nhập đầy đủ thông tin.");
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
          <button type="submit">Đăng ký</button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Đã có tài khoản?{" "}
          <Link to="/" style={{ color: "#5795FA", fontWeight: "bold" }}>
            Đăng nhập
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Signup;
