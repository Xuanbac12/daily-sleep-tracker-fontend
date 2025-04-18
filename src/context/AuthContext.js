import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ✅ Đọc dữ liệu từ localStorage khi khởi tạo
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [username, setUsername] = useState(() => localStorage.getItem("username"));
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));
  const [firstLogin, setFirstLogin] = useState(() => localStorage.getItem("firstLogin"));

  const isLoggedIn = !!token;

  // ✅ Gọi khi đăng nhập thành công
  const login = ({ token, username, userId, firstLogin }) => {
    // Lưu vào localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("userId", userId);
    localStorage.setItem("firstLogin", firstLogin);

    // Cập nhật state
    setToken(token);
    setUsername(username);
    setUserId(userId);
    setFirstLogin(firstLogin);
  };

  // ✅ Gọi khi đăng xuất
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("firstLogin");

    setToken(null);
    setUsername(null);
    setUserId(null);
    setFirstLogin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        username,
        userId,
        firstLogin,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
