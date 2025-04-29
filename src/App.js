import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./SignIn/Signin";
import Signup from "./Signup/Signup";
import Home from "./Home/Home";
import SplashScreen from "./SplashScreen/SplashScreen";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

function AppRoutes() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <Home /> : <SplashScreen />} />
      {/* ✅ Nếu đã login → chuyển hướng khỏi trang đăng nhập */}
  <Route path="/signin" element={isLoggedIn ? <Navigate to="/home" /> : <Signin />} />
  <Route path="/signup" element={isLoggedIn ? <Navigate to="/home" /> : <Signup />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-center" autoClose={6000} />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
