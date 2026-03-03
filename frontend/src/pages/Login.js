import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE = "https://fictional-invention-jj4jgwpj66qcqvpw-8000.app.github.dev"; 
// ⬆ Replace with your actual backend URL if different

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE}/login`,
        new URLSearchParams({
          username: email.trim(),
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data.access_token) {
        login(response.data.access_token); 
        // login() already navigates to dashboard
      } else {
        alert("Unexpected response from server");
      }

    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);

      if (error.response?.status === 401) {
        alert("Invalid email or password");
      } else if (error.response?.status === 422) {
        alert("Invalid request format");
      } else {
        alert("Server error. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 p-10 rounded-2xl shadow-xl w-[400px]">
        <h2 className="text-2xl font-semibold text-center">Welcome Back</h2>

        <input
          className="w-full mt-6 p-3 border rounded-lg"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mt-4 p-3 border rounded-lg"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </div>
    </div>
  );
}