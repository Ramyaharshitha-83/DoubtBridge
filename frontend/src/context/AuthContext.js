import { createContext, useContext, useState, useEffect } from "react";
import { registerUser, loginUser } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on reload
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    if (token && email) setUser({ email, token });
    setLoading(false);
  }, []);

  const register = async (email, password) => {
    return await registerUser(email, password); // returns { message }
  };

  const login = async (email, password) => {
    const data = await loginUser(email, password); // stores token in localStorage
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