import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";


  
 const Navbar = ({ username }) => {
    console.log("📦 [Navbar.jsx] Username nhận được:", username);
    

  

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("firstLogin"); // nếu có
    navigate("/");
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
