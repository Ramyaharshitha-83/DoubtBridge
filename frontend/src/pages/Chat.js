import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getChatMessages, sendChatMessage } from "../services/api";

export default function Chat() {
  const { user, logout }   = useAuth();
  const navigate           = useNavigate();
  const { bookingId }      = useParams();
  const bottomRef          = useRef(null);
  const pollRef            = useRef(null);

  const [messages,  setMessages]  = useState([]);
  const [booking,   setBooking]   = useState(null);
  const [text,      setText]      = useState("");
  const [loading,   setLoading]   = useState(true);
  const [sending,   setSending]   = useState(false);
  const [error,     setError]     = useState("");

  const myEmail = user?.email;

  const fetchMessages = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const data = await getChatMessages(parseInt(bookingId));
      setMessages(data.messages || []);
      setBooking(data.booking || null);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load chat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(true);
    // Poll every 4 seconds for new messages
    pollRef.current = setInterval(() => fetchMessages(false), 4000);
    return () => clearInterval(pollRef.current);
  }, [bookingId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      await sendChatMessage(parseInt(bookingId), text.trim());
      setText("");
      fetchMessages(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to send.");
    } finally {
      setSending(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="ask-page">
      <nav className="navbar">
        <Link to="/bookings" className="nav-logo">
          <div className="nav-logo-icon">⚡</div>
          <span className="nav-logo-text">DoubtBridge</span>
        </Link>
        <div className="nav-actions">
          <Link to="/bookings" className="btn-ghost-nav">← My Sessions</Link>
          <span style={{ fontSize: ".82rem", color: "var(--muted)", padding: ".4rem .8rem", background: "var(--bg)", borderRadius: "8px", border: "1px solid var(--border)" }}>
            {user?.email}
          </span>
          <button className="btn-ghost-nav" style={{ color: "var(--error-text)" }} onClick={() => { logout(); navigate("/"); }}>Sign Out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 780, margin: "1.5rem auto", padding: "0 1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>

        {/* Session info banner */}
        {booking && (
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "1rem 1.5rem", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: ".5rem" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: ".95rem" }}>📚 {booking.topic}</div>
              <div style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: ".2rem" }}>
                Session #{booking.id} · {booking.status === "accepted" ? "✅ Active" : booking.status}
              </div>
            </div>
            <div style={{ fontSize: ".72rem", fontWeight: 700, background: "var(--accent-light)", color: "var(--accent)", padding: ".3rem .75rem", borderRadius: "20px" }}>
              LIVE CHAT
            </div>
          </div>
        )}

        {/* Chat window */}
        <div className="chat-win" style={{ minHeight: 460, flex: 1 }}>

          {/* Messages */}
          <div className="chat-msgs" style={{ padding: "1.25rem" }}>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
                <div className="big-spin" />
              </div>
            ) : error ? (
              <div className="alert alert-err">{error}</div>
            ) : messages.length === 0 ? (
              <div className="chat-welcome">
                <div className="chat-welcome-ico">💬</div>
                <div className="chat-welcome-title">Start the conversation</div>
                <div className="chat-welcome-sub">
                  This is your private session chat. Ask your doubts, share code snippets, and collaborate with your mentor.
                </div>
              </div>
            ) : (
              messages.map(m => {
                const isMe = m.sender_email === myEmail;
                return (
                  <div key={m.id} className={`msg ${isMe ? "msg-u" : ""}`} style={{ marginBottom: ".75rem" }}>
                    <div className={`msg-av ${isMe ? "av-u" : "av-ai"}`}>
                      {m.sender_email?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: ".2rem", alignItems: isMe ? "flex-end" : "flex-start" }}>
                      <div style={{ fontSize: ".72rem", color: "var(--muted)", paddingLeft: "2px", paddingRight: "2px" }}>
                        {isMe ? "You" : m.sender_email} · {new Date(m.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div className={`msg-bub ${isMe ? "bub-u" : "bub-ai"}`} style={{ whiteSpace: "pre-wrap" }}>
                        {m.message}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="chat-input-row">
            <textarea
              className="chat-ta"
              rows={1}
              placeholder="Type your message… (Enter to send, Shift+Enter for new line)"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={onKey}
              disabled={sending}
            />
            <button className="btn-send"
              onClick={sendMessage}
              disabled={sending || !text.trim()}>
              {sending ? <span className="spinner" style={{ borderColor: "rgba(255,255,255,.3)", borderTopColor: "#fff" }} /> : "➤"}
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: ".78rem", color: "var(--muted2)", marginTop: ".75rem" }}>
          🔄 Chat auto-refreshes every 4 seconds
        </p>
      </div>
    </div>
  );
}