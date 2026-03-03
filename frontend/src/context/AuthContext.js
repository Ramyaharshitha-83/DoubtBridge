import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  // Decode JWT to extract email
  const decodeAndSetUser = useCallback((jwtToken) => {
    try {
      const payload = JSON.parse(atob(jwtToken.split(".")[1]));
      setUserEmail(payload.sub); // your backend stores email in "sub"
    } catch (err) {
      console.error("Invalid token");
      setToken(null);
      setUserEmail(null);
    }
  }, []);

  // Load token from localStorage on first load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      decodeAndSetUser(storedToken);
    }
  }, [decodeAndSetUser]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    decodeAndSetUser(newToken);
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserEmail(null);
    navigate("/");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        userEmail,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);