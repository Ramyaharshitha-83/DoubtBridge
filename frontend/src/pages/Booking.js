import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyBookings, bookingAction } from "../services/api";

const STATUS_COLORS = {
  pending:  { bg: "#fef9c3", color: "#854d0e", border: "#fde68a" },
  accepted: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  declined: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
};

export default function Bookings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [actioning, setActioning] = useState(null);
  const [toast, setToast]       = useState("");

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data.bookings || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    // Handle action from email link e.g. /bookings?action=accept&id=5
    const action = params.get("action");
    const id     = params.get("id");
    if (action && id) handleAction(parseInt(id), action);
  }, []);

  const handleAction = async (booking_id, action) => {
    setActioning(booking_id);
    try {
      const res = await bookingAction(booking_id, action);
      setToast(res.message);
      setTimeout(() => setToast(""), 4000);
      fetchBookings();
    } catch (err) {
      setToast(err.response?.data?.detail || "Action failed");
    } finally {
      setActioning(null);
    }
  };

  const isMentor = localStorage.getItem("userRole") === "mentor";

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
          <button className="btn-ghost-nav" style={{ color: "var(--error-text)" }} onClick={() => { logout(); navigate("/"); }}>Sign Out</button>
        </div>
      </nav>

      <div className="dash-hdr">
        <div className="dash-hdr-inner">
          <div className="dash-greeting afu">{isMentor ? "MENTOR" : "STUDENT"} · BOOKINGS</div>
          <h1 className="dash-title afu d1">My Sessions 📅</h1>
          <p className="dash-subtitle afu d2">
            {isMentor ? "Accept or decline session requests from students." : "Track your booked mentor sessions."}
          </p>
        </div>
      </div>

      {toast && (
        <div style={{ maxWidth: 800, margin: "1rem auto", padding: "0 2rem" }}>
          <div className="alert alert-ok">{toast}</div>
        </div>
      )}

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "1rem 2rem 3rem" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
            <div className="big-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
            <div style={{ fontWeight: 700, marginBottom: ".5rem" }}>No bookings yet</div>
            <div style={{ fontSize: ".875rem" }}>
              {isMentor ? "Session requests from students will appear here." : (
                <><Link to="/mentors" style={{ color: "var(--accent)", fontWeight: 700 }}>Find a mentor</Link> to book your first session.</>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {bookings.map(b => {
              const sc = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
              return (
                <div key={b.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "14px", padding: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: ".5rem" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: ".25rem" }}>{b.topic}</div>
                      <div style={{ fontSize: ".82rem", color: "var(--muted)" }}>
                        {isMentor ? `Student: ${b.student_email}` : `Mentor: ${b.mentor_name}`}
                        {" · "}{b.duration_minutes} min · {b.preferred_time}
                      </div>
                    </div>
                    <span style={{ fontSize: ".75rem", fontWeight: 700, padding: ".3rem .75rem", borderRadius: "20px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                      {b.status.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
                    {/* Mentor can accept/decline pending */}
                    {isMentor && b.status === "pending" && (
                      <>
                        <button onClick={() => handleAction(b.id, "accept")} disabled={actioning === b.id}
                          style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: "8px", padding: ".6rem 1.25rem", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: ".85rem", display: "flex", alignItems: "center", gap: "6px" }}>
                          {actioning === b.id ? <span className="spinner" /> : "✅"} Accept
                        </button>
                        <button onClick={() => handleAction(b.id, "decline")} disabled={actioning === b.id}
                          style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "8px", padding: ".6rem 1.25rem", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: ".85rem" }}>
                          ❌ Decline
                        </button>
                      </>
                    )}

                    {/* Chat available for accepted sessions */}
                    {b.status === "accepted" && (
                      <Link to={`/chat/${b.id}`}
                        style={{ background: "var(--accent)", color: "#fff", borderRadius: "8px", padding: ".6rem 1.25rem", textDecoration: "none", fontWeight: 700, fontSize: ".85rem", display: "flex", alignItems: "center", gap: "6px" }}>
                        💬 Open Chat
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}