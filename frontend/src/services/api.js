import axios from "axios";
import qs from "qs";

const API = axios.create({
  baseURL: "https://fictional-invention-jj4jgwpj66qcqvpw-8000.app.github.dev",
});

/* -------- REGISTER -------- */
export const registerUser = (email, password) => {
  return API.post("/register", { email, password });
};

/* -------- LOGIN -------- */
export const loginUser = async (email, password) => {
  const response = await API.post(
    "/login",
    qs.stringify({
      username: email,
      password: password,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  localStorage.setItem("token", response.data.access_token);
  return response;
};

/* -------- ASK DOUBT -------- */
export const askDoubt = (question, language) => {
  const token = localStorage.getItem("token");

  return API.post(
    "/ask-doubt",
    { question, language },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};