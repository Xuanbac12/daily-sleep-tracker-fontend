import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const {username, logout } = useContext(AuthContext);
  console.log("👤 Username trong Navbar:", username); // ✅ Thêm dòng này để kiểm tra
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h3>Sleep Tracker</h3>
      </div>
      <div className="navbar-right">
        <span>Xin chào, <strong>{username}</strong></span>
        <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
      </div>
    </nav>
  );
};

export default Navbar;
