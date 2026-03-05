import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { saveMentorProfile } from "../services/api";

const SUBJECT_OPTIONS = [
  "DSA", "Python", "Java", "C++", "JavaScript", "React.js", "Node.js",
  "System Design", "DBMS", "Operating Systems", "Computer Networks",
  "Machine Learning", "Deep Learning", "SQL", "MongoDB", "AWS",
  "Full Stack", "OOP", "Aptitude & Reasoning", "Web Development",
];

const TIMING_OPTIONS = [
  "Mon–Fri 6PM–9PM IST", "Mon–Fri 7AM–10AM IST",
  "Weekends 10AM–2PM IST", "Weekends 2PM–6PM IST",
  "Weekdays Afternoon 2PM–5PM IST", "Flexible",
];

export default function MentorOnboarding() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    bio: "",
    experience_years: "",
    previous_companies: "",
    college: "",
    available_timings: "",
    session_rate_30: "",
    session_rate_60: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [step, setStep]         = useState(1); // 1=basic 2=expertise 3=pricing

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleSubject = (s) => {
    setSubjects(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = async () => {
    if (!form.name)               { setError("Please enter your name."); return; }
    if (!form.bio)                { setError("Please enter a short bio."); return; }
    if (!form.experience_years)   { setError("Please enter years of experience."); return; }
    if (!form.college)            { setError("Please enter your college."); return; }
    if (subjects.length === 0)    { setError("Please select at least one subject."); return; }
    if (!form.available_timings)  { setError("Please select your available timings."); return; }
    if (!form.session_rate_30)    { setError("Please set your 30-min session rate."); return; }

    setError(""); setLoading(true);
    try {
      await saveMentorProfile({
        ...form,
        subjects: subjects.join(","),
        experience_years: parseInt(form.experience_years),
        session_rate_30: parseInt(form.session_rate_30),
        session_rate_60: parseInt(form.session_rate_60 || form.session_rate_30 * 2),
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ paddingTop: "2rem", paddingBottom: "3rem" }}>
      <Link to="/" className="auth-logo">
        <div className="auth-logo-icon">⚡</div>
        <span className="auth-logo-text">DoubtBridge</span>
      </Link>

      <div className="auth-card" style={{ maxWidth: 560 }}>
        {/* Progress bar */}
        <div style={{ display: "flex", gap: ".5rem", marginBottom: "2rem" }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 4, background: step >= s ? "var(--accent)" : "var(--border)", transition: "background .3s" }} />
          ))}
        </div>

        <div className="dash-greeting">MENTOR ONBOARDING · STEP {step} OF 3</div>
        <h1 className="auth-title" style={{ fontSize: "1.4rem", textAlign: "left", marginTop: ".5rem" }}>
          {step === 1 && "Tell us about yourself"}
          {step === 2 && "Your expertise"}
          {step === 3 && "Session pricing & availability"}
        </h1>
        <p className="auth-sub" style={{ textAlign: "left" }}>
          {step === 1 && "Students will see this on your public profile."}
          {step === 2 && "Select subjects you can teach confidently."}
          {step === 3 && "Set your rates and when you're available."}
        </p>

        {error && <div className="alert alert-err">⚠ {error}</div>}

        {/* ── STEP 1: Basic Info ── */}
        {step === 1 && (
          <>
            <div className="fgroup">
              <label className="flabel">Full Name</label>
              <input className="finput" placeholder="Arjun Sharma" value={form.name} onChange={e => set("name", e.target.value)} />
            </div>
            <div className="fgroup">
              <label className="flabel">College / University</label>
              <input className="finput" placeholder="IIT Bombay, B.Tech CSE" value={form.college} onChange={e => set("college", e.target.value)} />
            </div>
            <div className="fgroup">
              <label className="flabel">Years of Experience</label>
              <input className="finput" type="number" min="0" max="30" placeholder="e.g. 3" value={form.experience_years} onChange={e => set("experience_years", e.target.value)} />
            </div>
            <div className="fgroup">
              <label className="flabel">Previous Companies</label>
              <input className="finput" placeholder="Google, Flipkart (comma separated)" value={form.previous_companies} onChange={e => set("previous_companies", e.target.value)} />
            </div>
            <div className="fgroup">
              <label className="flabel">Short Bio</label>
              <textarea className="finput" rows={3} placeholder="Tell students about yourself, your background, and teaching style…"
                style={{ resize: "vertical" }}
                value={form.bio} onChange={e => set("bio", e.target.value)} />
            </div>
            <button className="btn-submit" onClick={() => { setError(""); setStep(2); }}>
              Next: Expertise →
            </button>
          </>
        )}

        {/* ── STEP 2: Subjects ── */}
        {step === 2 && (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginBottom: "1.5rem" }}>
              {SUBJECT_OPTIONS.map(s => (
                <button key={s} type="button"
                  onClick={() => toggleSubject(s)}
                  style={{
                    padding: ".45rem .9rem", borderRadius: "20px", cursor: "pointer",
                    fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: ".82rem",
                    border: subjects.includes(s) ? "2px solid var(--accent)" : "1.5px solid var(--border)",
                    background: subjects.includes(s) ? "var(--accent-light)" : "#fff",
                    color: subjects.includes(s) ? "var(--accent)" : "var(--text2)",
                    transition: "all .15s",
                  }}>
                  {subjects.includes(s) ? "✓ " : ""}{s}
                </button>
              ))}
            </div>
            <div style={{ fontSize: ".82rem", color: "var(--muted)", marginBottom: "1.5rem" }}>
              {subjects.length} subject{subjects.length !== 1 ? "s" : ""} selected
            </div>
            <div style={{ display: "flex", gap: ".75rem" }}>
              <button className="btn-submit" style={{ background: "var(--bg)", color: "var(--text)", boxShadow: "none", border: "1.5px solid var(--border)" }} onClick={() => setStep(1)}>
                ← Back
              </button>
              <button className="btn-submit" onClick={() => { if (subjects.length === 0) { setError("Select at least one subject."); return; } setError(""); setStep(3); }}>
                Next: Pricing →
              </button>
            </div>
          </>
        )}

        {/* ── STEP 3: Pricing & Timing ── */}
        {step === 3 && (
          <>
            <div className="fgroup">
              <label className="flabel">Available Timings</label>
              <select className="finput" value={form.available_timings} onChange={e => set("available_timings", e.target.value)}>
                <option value="">Select your availability…</option>
                {TIMING_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="fgroup">
              <label className="flabel">30-min Session Rate (₹)</label>
              <input className="finput" type="number" min="100" placeholder="e.g. 300" value={form.session_rate_30} onChange={e => set("session_rate_30", e.target.value)} />
            </div>
            <div className="fgroup">
              <label className="flabel">60-min Session Rate (₹)</label>
              <input className="finput" type="number" min="200" placeholder="e.g. 500" value={form.session_rate_60} onChange={e => set("session_rate_60", e.target.value)} />
            </div>

            {/* Summary preview */}
            <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "10px", padding: "1rem", marginBottom: "1.25rem", fontSize: ".85rem", color: "var(--text2)" }}>
              <div style={{ fontWeight: 700, marginBottom: ".5rem", color: "var(--accent)" }}>Profile Preview</div>
              <div>👤 {form.name} · {form.college}</div>
              <div>💼 {form.experience_years} yrs · {form.previous_companies || "—"}</div>
              <div>📚 {subjects.join(", ") || "—"}</div>
              <div>🕐 {form.available_timings || "—"}</div>
              <div>💰 ₹{form.session_rate_30}/30min · ₹{form.session_rate_60}/60min</div>
            </div>

            <div style={{ display: "flex", gap: ".75rem" }}>
              <button className="btn-submit" style={{ background: "var(--bg)", color: "var(--text)", boxShadow: "none", border: "1.5px solid var(--border)" }} onClick={() => setStep(2)}>
                ← Back
              </button>
              <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
                {loading ? <><span className="spinner" />Saving…</> : "🚀 Complete Setup"}
              </button>
            </div>
          </>
        )}
      </div>
      <Link to="/" className="auth-back">← Back to home</Link>
    </div>
  );
}