import axios from "axios";

// ── Exact same baseURL as your working single-file code ──────────────────────
const API = axios.create({
  baseURL: "https://fictional-invention-jj4jgwpj66qcqvpw-8000.app.github.dev",
});

// ── REGISTER  POST /register ─────────────────────────────────────────────────
export const registerUser = async (email, password) => {
  const res = await API.post("/register", { email, password });
  return res.data;
};

// ── LOGIN  POST /login  (x-www-form-urlencoded, same as working code) ─────────
export const loginUser = async (email, password) => {
  const res = await API.post(
    "/login",
    new URLSearchParams({ username: email, password }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  localStorage.setItem("token", res.data.access_token);
  return res.data;
};

// ── ASK DOUBT  POST /ask-doubt  Bearer token ─────────────────────────────────
export const askDoubt = async (question, language) => {
  const token = localStorage.getItem("token");
  const res = await API.post(
    "/ask-doubt",
    { question, language },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};