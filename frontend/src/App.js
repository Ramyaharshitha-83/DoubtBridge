import React, { useState } from "react";
import axios from "axios";
import qs from "qs";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState("English");
  const [response, setResponse] = useState("");

  const register = async () => {
    try {
      const res = await API.post("/register", { email, password });
      alert(res.data.message);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      alert("Registration failed: " + (error.response?.data?.detail || error.message));
    }
  };

  const login = async () => {
    try {
      const res = await API.post(
        "/login",
        qs.stringify({
          username: email,
          password: password,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      localStorage.setItem("token", res.data.access_token);
      alert("Login successful!");
    } catch {
      alert("Login failed");
    }
  };

  const askDoubt = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/ask-doubt",
        { question, language },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResponse(res.data);
    } catch {
      alert("Error asking doubt");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>DoubtBridge AI</h1>

      <h2>Register / Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={register}>Register</button>
      <button onClick={login} style={{ marginLeft: 10 }}>Login</button>

      <hr />

      <h2>Ask Doubt</h2>

      <textarea
        rows="4"
        cols="50"
        placeholder="Enter your doubt"
        onChange={(e) => setQuestion(e.target.value)}
      />
      <br /><br />

      <select onChange={(e) => setLanguage(e.target.value)}>
        <option>English</option>
        <option>Telugu</option>
        <option>Hindi</option>
      </select>

      <br /><br />

      <button onClick={askDoubt}>Ask</button>

      <hr />

      <h3>Response:</h3>
      <pre>{response}</pre>
    </div>
  );
}

export default App;