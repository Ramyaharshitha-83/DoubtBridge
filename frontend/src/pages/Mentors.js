import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MENTORS = [
  {
    id: 1,
    name: "Arjun Sharma",
    role: "SDE-2 @ Google",
    avatar: "AS",
    color: "#4f46e5",
    college: "IIT Bombay, B.Tech CSE",
    experience: "4 years",
    subjects: ["DSA", "System Design", "C++", "Problem Solving"],
    prev: ["Google", "Flipkart Intern"],
    bio: "Helped 200+ students crack FAANG interviews. Specializes in competitive programming and system design for senior roles.",
    rating: 4.9,
    reviews: 143,
    rate: "₹500 / 30 min",
    available: true,
    sessions: [15, 30, 60],
  },
  {
    id: 2,
    name: "Priya Nair",
    role: "Frontend Engineer @ Microsoft",
    avatar: "PN",
    color: "#0891b2",
    college: "NIT Calicut, B.Tech CSE",
    experience: "3 years",
    subjects: ["React.js", "JavaScript", "Web Dev", "TypeScript"],
    prev: ["Microsoft", "Razorpay Intern"],
    bio: "Expert in frontend development and web performance. Has mentored 100+ students from tier-2 colleges into product companies.",
    rating: 4.8,
    reviews: 98,
    rate: "₹400 / 30 min",
    available: true,
    sessions: [15, 30],
  },
  {
    id: 3,
    name: "Rohan Mehta",
    role: "Data Engineer @ Amazon",
    avatar: "RM",
    color: "#059669",
    college: "BITS Pilani, B.Tech CSE",
    experience: "5 years",
    subjects: ["Python", "SQL", "DBMS", "Machine Learning Basics"],
    prev: ["Amazon", "Oracle", "Juspay Intern"],
    bio: "Strong in database internals, SQL optimization and data pipelines. Helps students with both core CS interviews and data-focused roles.",
    rating: 4.7,
    reviews: 76,
    rate: "₹450 / 30 min",
    available: false,
    sessions: [30, 60],
  },
  {
    id: 4,
    name: "Sneha Reddy",
    role: "Backend Engineer @ Swiggy",
    avatar: "SR",
    color: "#dc2626",
    college: "VIT Vellore, B.Tech IT",
    experience: "3 years",
    subjects: ["Node.js", "System Design", "OS", "Computer Networks"],
    prev: ["Swiggy", "Zomato", "Infosys"],
    bio: "From a non-IIT background, cracked multiple product companies. Passionate about helping tier-2/3 college students land their dream jobs.",
    rating: 4.9,
    reviews: 112,
    rate: "₹350 / 30 min",
    available: true,
    sessions: [15, 30],
  },
  {
    id: 5,
    name: "Karthik Iyer",
    role: "Full Stack Dev @ Razorpay",
    avatar: "KI",
    color: "#7c3aed",
    college: "Anna University, B.E CSE",
    experience: "4 years",
    subjects: ["Full Stack", "React", "Node.js", "AWS"],
    prev: ["Razorpay", "Freshworks", "TCS"],
    bio: "Full-stack expert with deep knowledge of payment systems and microservices. Specializes in web dev interview prep and live project guidance.",
    rating: 4.8,
    reviews: 89,
    rate: "₹500 / 30 min",
    available: true,
    sessions: [30, 60],
  },
  {
    id: 6,
    name: "Divya Krishnan",
    role: "SDE @ Uber",
    avatar: "DK",
    color: "#b45309",
    college: "PSG Tech Coimbatore, B.E CSE",
    experience: "2 years",
    subjects: ["DSA", "OOP", "Java", "Aptitude & Reasoning"],
    prev: ["Uber", "Zoho"],
    bio: "Cracked Uber, Zoho and several other product companies from a state-level college. Knows exactly what mass recruiters look for.",
    rating: 4.7,
    reviews: 54,
    rate: "₹300 / 30 min",
    available: true,
    sessions: [15, 30],
  },
];

function Stars({ n }) {
  return (
    <span style={{ color: "#f59e0b", fontSize: ".9rem" }}>
      {"★".repeat(Math.floor(n))}{"☆".repeat(5 - Math.floor(n))}
    </span>
  );
}

export default function Mentors() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const [booked, setBooked] = useState(null);

  const FILTERS = ["All", "DSA", "Web Dev", "System Design", "DBMS", "Python", "Java"];

  const filtered = filter === "All"
    ? MENTORS
    : MENTORS.filter(m => m.subjects.some(s => s.toLowerCase().includes(filter.toLowerCase())));

  const book = (mentor, mins) => {
    setBooked({ mentor, mins });
    setSelected(null);
  };

  return (
    <div className="dash-page">
      <nav className="navbar">
        <Link to="/dashboard" className="nav-logo">
          <div className="nav-logo-icon">⚡</div>
          <span className="nav-logo-text">DoubtBridge</span>
        </Link>
        <div className="nav-actions">
          <Link to="/dashboard" className="btn-ghost-nav">← Dashboard</Link>
          <span style={{ fontSize: ".82rem", color: "var(--muted)", padding: ".4rem .8rem", background: "var(--bg)", borderRadius: "8px", border: "1px solid var(--border)" }}>
            {user?.email}
          </span>
          <button className="btn-ghost-nav" style={{ color: "var(--error-text)" }}
            onClick={() => { logout(); navigate("/"); }}>Sign Out</button>
        </div>
      </nav>

      <div className="dash-hdr">
        <div className="dash-hdr-inner">
          <div className="dash-greeting afu">MENTORSHIP</div>
          <h1 className="dash-title afu d1">Find a Mentor 👥</h1>
          <p className="dash-subtitle afu d2">Book 1-on-1 sessions with verified engineers from top companies.</p>
        </div>
      </div>

      {/* Booking success banner */}
      {booked && (
        <div style={{ maxWidth: 1000, margin: "1rem auto", padding: "0 2rem" }}>
          <div className="alert alert-ok" style={{ borderRadius: "12px", fontSize: ".9rem" }}>
            ✓ Session request sent to <b>{booked.mentor.name}</b> for a {booked.mins}-min session! They'll confirm within 2 hours.
            <button onClick={() => setBooked(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: "1rem" }}>✕</button>
          </div>
        </div>
      )}

      {/* Filter chips */}
      <div style={{ maxWidth: 1000, margin: "0 auto 1.5rem", padding: "0 2rem", display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
        {FILTERS.map(f => (
          <button key={f}
            onClick={() => setFilter(f)}
            style={{ background: filter === f ? "var(--accent)" : "#fff", color: filter === f ? "#fff" : "var(--text2)", border: "1px solid " + (filter === f ? "var(--accent)" : "var(--border)"), borderRadius: "20px", padding: ".4rem 1rem", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: ".82rem", cursor: "pointer", transition: "all .2s" }}>
            {f}
          </button>
        ))}
      </div>

      {/* Mentor grid */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 2rem 3rem", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: "1.25rem" }}>
        {filtered.map((m, i) => (
          <div key={m.id} className="mentor-profile-card afu" style={{ animationDelay: `${0.05 * i}s` }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: ".85rem", marginBottom: "1rem" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: ".95rem", flexShrink: 0 }}>
                {m.avatar}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: ".95rem" }}>{m.name}</div>
                <div style={{ fontSize: ".78rem", color: "var(--muted)" }}>{m.role}</div>
              </div>
              <div style={{ marginLeft: "auto", fontSize: ".72rem", fontWeight: 700, padding: ".2rem .6rem", borderRadius: "20px", background: m.available ? "#f0fdf4" : "#fef2f2", color: m.available ? "#16a34a" : "#dc2626", border: `1px solid ${m.available ? "#bbf7d0" : "#fecaca"}` }}>
                {m.available ? "● Available" : "● Busy"}
              </div>
            </div>

            {/* College & exp */}
            <div style={{ fontSize: ".8rem", color: "var(--muted)", marginBottom: ".75rem", display: "flex", flexDirection: "column", gap: ".25rem" }}>
              <span>🎓 {m.college}</span>
              <span>💼 {m.experience} experience · Previously: {m.prev.join(", ")}</span>
            </div>

            {/* Bio */}
            <p style={{ fontSize: ".85rem", color: "var(--text2)", lineHeight: 1.6, marginBottom: ".85rem" }}>{m.bio}</p>

            {/* Subjects */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".35rem", marginBottom: ".85rem" }}>
              {m.subjects.map(s => (
                <span key={s} style={{ fontSize: ".72rem", background: "var(--accent-light)", color: "var(--accent)", padding: ".2rem .55rem", borderRadius: "6px", fontWeight: 600 }}>{s}</span>
              ))}
            </div>

            {/* Rating & price */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Stars n={m.rating} />
                <span style={{ fontSize: ".78rem", color: "var(--muted)" }}>{m.rating} ({m.reviews} reviews)</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: ".875rem", color: "var(--accent)" }}>{m.rate}</span>
            </div>

            {/* Book button */}
            <button
              onClick={() => setSelected(m)}
              disabled={!m.available}
              style={{ width: "100%", background: m.available ? "var(--accent)" : "var(--muted2)", color: "#fff", border: "none", borderRadius: "8px", padding: ".75rem", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: ".88rem", cursor: m.available ? "pointer" : "not-allowed", transition: "all .2s" }}>
              {m.available ? "Book a Session" : "Currently Unavailable"}
            </button>
          </div>
        ))}
      </div>

      {/* Booking modal */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "1rem", animation: "fadeIn .2s ease both" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "2rem", maxWidth: 420, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,.2)", animation: "scaleIn .3s ease both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".85rem", marginBottom: "1.5rem" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: selected.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: ".95rem" }}>
                {selected.avatar}
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>{selected.name}</div>
                <div style={{ fontSize: ".8rem", color: "var(--muted)" }}>{selected.role}</div>
              </div>
            </div>
            <p style={{ fontWeight: 700, marginBottom: "1rem", fontSize: ".95rem" }}>Choose session duration:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: ".75rem", marginBottom: "1.5rem" }}>
              {selected.sessions.map(mins => (
                <button key={mins}
                  onClick={() => book(selected, mins)}
                  style={{ background: "var(--bg)", border: "1.5px solid var(--border)", borderRadius: "10px", padding: "1rem", cursor: "pointer", transition: "all .2s", textAlign: "left", fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--accent-light)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg)"; }}>
                  <div style={{ fontWeight: 700 }}>{mins} minutes</div>
                  <div style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: ".2rem" }}>
                    {mins === 15 ? "Quick doubt clearing" : mins === 30 ? "Deep dive + concept clarity" : "Full interview prep session"}
                    {" · "}
                    <b style={{ color: "var(--accent)" }}>₹{parseInt(selected.rate.replace(/[^0-9]/g, "")) * mins / 30}</b>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setSelected(null)}
              style={{ width: "100%", background: "none", border: "1.5px solid var(--border)", borderRadius: "10px", padding: ".75rem", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, color: "var(--muted)" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}