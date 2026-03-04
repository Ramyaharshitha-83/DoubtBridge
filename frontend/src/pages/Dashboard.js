import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CARDS = [
  {
    to: "/ask",
    icon: "🤖",
    label: "AI ASSISTANT",
    title: "Ask a Doubt",
    desc: "Instant answers with code examples, step-by-step explanations and complexity analysis.",
    delay: "0.2s",
  },
  {
    to: "/topics",
    icon: "📚",
    label: "LEARNING",
    title: "Browse Topics",
    desc: "Explore DSA, web dev, system design, AI/ML through guided AI explanations.",
    delay: "0.3s",
  },
  {
    to: "/mentors",
    icon: "👥",
    label: "MENTORSHIP",
    title: "Find a Mentor",
    desc: "Book a 15 or 30-min 1-on-1 session with a verified mentor at student-friendly prices.",
    delay: "0.4s",
  },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.email?.split("@")[0] || "there";

  return (
    <div className="dash-page">
      <nav className="navbar">
        <Link to="/" className="nav-logo">
          <div className="nav-logo-icon">⚡</div>
          <span className="nav-logo-text">DoubtBridge</span>
        </Link>
        <div className="nav-actions">
          <span style={{ fontSize: ".82rem", color: "var(--muted)", padding: ".4rem .8rem", background: "var(--bg)", borderRadius: "8px", border: "1px solid var(--border)" }}>
            {user?.email}
          </span>
          <button className="btn-ghost-nav" style={{ color: "var(--error-text)" }}
            onClick={() => { logout(); navigate("/"); }}>
            Sign Out
          </button>
        </div>
      </nav>

      <div className="dash-hdr">
        <div className="dash-hdr-inner">
          <div className="dash-greeting afu">DASHBOARD</div>
          <h1 className="dash-title afu d1">Hey, {name} 👋</h1>
          <p className="dash-subtitle afu d2">What would you like to do today?</p>
        </div>
      </div>

      <div className="dash-cards">
        {CARDS.map(c => (
          <Link key={c.title} to={c.to} className="dash-card" style={{ animationDelay: c.delay }}>
            <div className="dc-icon">{c.icon}</div>
            <div className="dc-label">{c.label}</div>
            <div className="dc-title">{c.title}</div>
            <div className="dc-desc">{c.desc}</div>
            <div className="dc-arrow">→</div>
          </Link>
        ))}
      </div>
    </div>
  );
}