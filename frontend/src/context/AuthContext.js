import { createContext, useContext, useState, useEffect } from "react";
import { registerUser, loginUser } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");

    if (token && email) {
      // Token exists — trust it, interceptor in api.js will auto-logout on 401
      setUser({ email, token });
    } else {
      // No token — clear everything to be safe
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
    }
    setLoading(false);
  }, []);

  const register = async (email, password) => {
    return await registerUser(email, password);
  };

  const login = async (email, password) => {
    // loginUser stores token in localStorage
    const data = await loginUser(email, password);
    localStorage.setItem("userEmail", email);
    setUser({ email, token: data.access_token });
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}