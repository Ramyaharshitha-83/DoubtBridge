import axios from "axios";

const API = axios.create({
  baseURL: "https://fictional-invention-jj4jgwpj66qcqvpw-8000.app.github.dev",
});

// ── Auto-logout on 401 (invalid / expired token) ─────────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale token so user is forced to re-login
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      // Only redirect if not already on auth pages
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/register" && path !== "/") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ── REGISTER  POST /register ─────────────────────────────────────────────────
export const registerUser = async (email, password) => {
  const res = await API.post("/register", { email, password });
  return res.data;
};

// ── LOGIN  POST /login  (x-www-form-urlencoded) ───────────────────────────────
export const loginUser = async (email, password) => {
  const res = await API.post(
    "/login",
    new URLSearchParams({ username: email, password }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  // Store fresh token
  localStorage.setItem("token", res.data.access_token);
  return res.data;
};

// ── ASK DOUBT  POST /ask-doubt ────────────────────────────────────────────────
export const askDoubt = async (question, language) => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    throw new Error("No token found. Please login again.");
  }
  const res = await API.post(
    "/ask-doubt",
    { question, language },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};