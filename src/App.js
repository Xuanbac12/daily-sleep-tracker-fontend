import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./SignIn/Signin";
import Signup from "./Signup/Signup";
import Home from "./Home/Home"; 
import SplashScreen from "./SplashScreen/SplashScreen";

function App() {
  const isLoggedIn = false; // ✅ Giả lập trạng thái đăng nhập (sau này thay bằng localStorage hoặc AuthContext)
  return (
    <Router>
      <Routes>
      <Route path="/" element={isLoggedIn ? <Home /> : <SplashScreen />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} /> {/* ✅ Giao diện sau đăng nhập */}
      </Routes>
    </Router>
  );
}

export default App;
