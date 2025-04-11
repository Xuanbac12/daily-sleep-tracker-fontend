// src/components/SplashScreen.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./SplashScreen.css";
import { FaRegMoon } from "react-icons/fa";

const SplashScreen = () => {
  return (
    <div className="splash-wrapper">
      <div className="overlay" />
      <div className="splash-content">
        <FaRegMoon size={50} color="#fff" className="splash-icon" />
        <h1 className="splash-title">Chào mừng đến với Sleep Tracker</h1>
        <p className="splash-desc">
          Ứng dụng giúp bạn theo dõi giấc ngủ và cải thiện chất lượng nghỉ ngơi mỗi ngày. <br />
          Ghi lại giờ ngủ, xem lại lịch sử và đạt mục tiêu ngủ đủ giấc.
        </p>
        <Link to="/signin">
          <button className="splash-button">Bắt đầu ngay</button>
        </Link>
      </div>
    </div>
  );
};

export default SplashScreen;
