import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("rerecant_user");
    return saved ? JSON.parse(saved) : null;
  });

  const loginWithPhone = (phone) => {
    // Check if user exists in local storage history
    const existingHistory = JSON.parse(localStorage.getItem(`user_orders_${phone}`) || "[]");
    const isReturning = existingHistory.length > 0;

    const userData = {
      phone,
      isReturning,
      orderCount: existingHistory.length,
    };

    setUser(userData);
    localStorage.setItem("rerecant_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("rerecant_user");
  };

  const markOrderCompleted = () => {
    if (user) {
      const updated = { ...user, isReturning: true, orderCount: (user.orderCount || 0) + 1 };
      setUser(updated);
      localStorage.setItem("rerecant_user", JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginWithPhone, logout, markOrderCompleted }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);