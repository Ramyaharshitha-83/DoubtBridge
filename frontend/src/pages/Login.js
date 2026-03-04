import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleLogin = async () => {
    if (!email.trim()) { setError("Please enter your email.");    return; }
    if (!password)     { setError("Please enter your password."); return; }

    setError(""); setLoading(true);

    try {
      // ── calls POST /login with URLSearchParams (x-www-form-urlencoded) ──────
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Link to="/" className="auth-logo">
        <div className="auth-logo-icon">⚡</div>
        <span className="auth-logo-text">DoubtBridge</span>
      </Link>

      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to continue solving your doubts</p>

        {error && <div className="alert alert-err">⚠ {error}</div>}

        <div className="fgroup afu d1">
          <label className="flabel">Email</label>
          <input className="finput" type="email" placeholder="you@example.com"
            value={email} onChange={e=>setEmail(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
        </div>

        <div className="fgroup afu d2">
          <label className="flabel">Password</label>
          <input className="finput" type="password" placeholder="••••••••"
            value={password} onChange={e=>setPassword(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
        </div>

        <button className="btn-submit afu d3" onClick={handleLogin} disabled={loading}>
          {loading ? <><span className="spinner"/>Signing in…</> : "Sign In →"}
        </button>

        <p className="auth-foot">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>

      <Link to="/" className="auth-back">← Back to home</Link>
    </div>
  );
}