import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

const API_URL = "https://fictional-invention-jj4jgwpj66qcqvpw-8000.app.github.dev";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = params.get("token");
    if (!token) { setStatus("error"); setMsg("No verification token found."); return; }

    axios.get(`${API_URL}/verify-email?token=${token}`)
      .then(res => { setStatus("success"); setMsg(res.data.message); })
      .catch(err => { setStatus("error"); setMsg(err.response?.data?.detail || "Verification failed."); });
  }, []);

  return (
    <div className="auth-page">
      <Link to="/" className="auth-logo">
        <div className="auth-logo-icon">⚡</div>
        <span className="auth-logo-text">DoubtBridge</span>
      </Link>

      <div className="auth-card" style={{ textAlign: "center" }}>
        {status === "loading" && (
          <>
            <div className="big-spin" style={{ margin: "0 auto 1.5rem" }} />
            <p style={{ color: "var(--muted)" }}>Verifying your email…</p>
          </>
        )}
        {status === "success" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
            <h1 className="auth-title">Email Verified!</h1>
            <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>{msg}</p>
            <Link to="/login" className="btn-submit" style={{ textDecoration: "none", justifyContent: "center" }}>
              Go to Login →
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❌</div>
            <h1 className="auth-title">Verification Failed</h1>
            <p style={{ color: "var(--error-text)", marginBottom: "1.5rem" }}>{msg}</p>
            <Link to="/register" className="btn-submit" style={{ textDecoration: "none", justifyContent: "center" }}>
              Register Again
            </Link>
          </>
        )}
      </div>
    </div>
  );
}