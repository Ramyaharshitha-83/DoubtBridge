import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role,     setRole]     = useState("student");
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

  const handleRegister = async () => {
    // Validate
    if (!name.trim())        { setError("Please enter your full name."); return; }
    if (!email.trim())       { setError("Please enter your email."); return; }
    if (!password)           { setError("Please enter a password."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setError(""); setSuccess(""); setLoading(true);

    try {
      // ── calls POST /register { email, password } ──────────────────────────
      const data = await register(email, password);
      setSuccess(data.message || "Account created! Redirecting to login…");
      setName(""); setEmail(""); setPassword("");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
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
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Choose your role and get started</p>

        {/* Role selector */}
        <div className="role-row">
          <button type="button" className={`role-btn ${role==="student"?"on":""}`} onClick={()=>setRole("student")}>
            <div className="role-ico">🎓</div>
            <span className="role-name">Student</span>
            <span className="role-hint">Get help learning</span>
          </button>
          <button type="button" className={`role-btn ${role==="mentor"?"on":""}`} onClick={()=>setRole("mentor")}>
            <div className="role-ico">👥</div>
            <span className="role-name">Mentor</span>
            <span className="role-hint">Help &amp; earn</span>
          </button>
        </div>

        {error   && <div className="alert alert-err">⚠ {error}</div>}
        {success && <div className="alert alert-ok">✓ {success}</div>}

        <div className="fgroup afu d1">
          <label className="flabel">Full Name</label>
          <input className="finput" type="text" placeholder="John Doe"
            value={name} onChange={e=>setName(e.target.value)} />
        </div>

        <div className="fgroup afu d2">
          <label className="flabel">Email</label>
          <input className="finput" type="email" placeholder="you@example.com"
            value={email} onChange={e=>setEmail(e.target.value)} />
        </div>

        <div className="fgroup afu d3">
          <label className="flabel">Password</label>
          <input className="finput" type="password" placeholder="Min 6 characters"
            value={password} onChange={e=>setPassword(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&handleRegister()} />
        </div>

        <button className="btn-submit afu d4" onClick={handleRegister} disabled={loading}>
          {loading ? <><span className="spinner"/>Creating account…</> : `Create ${role==="student"?"Student":"Mentor"} Account`}
        </button>

        <p className="auth-foot">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>

      <Link to="/" className="auth-back">← Back to home</Link>
    </div>
  );
}