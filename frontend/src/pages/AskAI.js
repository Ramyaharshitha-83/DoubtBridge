import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { askDoubt } from "../services/api";

const LANGS = [
  { code: "English", flag: "🇬🇧" },
  { code: "Telugu",  flag: "🇮🇳" },
  { code: "Hindi",   flag: "🇮🇳" },
  { code: "Tamil",   flag: "🇮🇳" },
  { code: "Kannada", flag: "🇮🇳" },
];

const CHIPS = [
  "Explain BFS vs DFS",
  "How does useEffect work?",
  "What is time complexity?",
  "Explain binary search",
  "What is a closure?",
  "SQL vs NoSQL difference",
];

export default function AskAI() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const location         = useLocation();
  const bottomRef        = useRef(null);

  const [lang,      setLang]      = useState("English");
  const [question,  setQuestion]  = useState("");
  const [messages,  setMessages]  = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [remaining, setRemaining] = useState(null);

  // If navigated from Topics page with ?q=... auto-send the question
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) {
      send(q);
      // clean up URL
      navigate("/ask", { replace: true });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (override) => {
    const text = (override || question).trim();
    if (!text || loading) return;

    setMessages(prev => [...prev, { role: "user", text }]);
    setQuestion("");
    setLoading(true);

    try {
      // POST /ask-doubt { question, language }  Authorization: Bearer <token>
      const data = await askDoubt(text, lang);
      setRemaining(data.remaining_questions);
      setMessages(prev => [...prev, { role: "ai", answer: data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "error",
        text: err.response?.data?.detail || err.message || "Network Error",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="ask-page">
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

      <div className="ask-layout">
        {/* SIDEBAR */}
        <aside className="ask-side">
          <div className="aside-card">
            <div className="aside-title">Response Language</div>
            {LANGS.map(l => (
              <button key={l.code} className={`lang-btn ${lang === l.code ? "on" : ""}`}
                onClick={() => setLang(l.code)}>
                <span>{l.flag}</span>{l.code}
              </button>
            ))}
          </div>

          <div className="mentor-cta">
            <div className="mentor-cta-title">🎓 Talk to a Mentor</div>
            <div className="mentor-cta-desc">
              Still confused after the AI explanation? Book a 1-on-1 session with a verified mentor.
            </div>
            <button className="btn-mentor" onClick={() => navigate("/mentors")}>
              Find Mentors →
            </button>
          </div>

          <div className="aside-card">
            <div className="aside-title">Tips for Better Answers</div>
            <ul style={{ paddingLeft: "1rem", fontSize: ".8rem", color: "var(--muted)", lineHeight: 2 }}>
              <li>Be specific about the topic</li>
              <li>Mention your language / framework</li>
              <li>Describe what you've tried</li>
              <li>Ask one question at a time</li>
            </ul>
          </div>
        </aside>

        {/* CHAT */}
        <main className="ask-main">
          <div className="chat-win">
            <div className="chat-hdr">
              <div className="chat-hdr-l">
                <div className="chat-ai-av">🤖</div>
                <div>
                  <div className="chat-ai-name">DoubtBridge AI</div>
                  <div className="chat-ai-status">
                    <span className="status-dot" /> Online · {lang}
                  </div>
                </div>
              </div>
              {remaining !== null && (
                <div className="remain-pill">{remaining} questions left</div>
              )}
            </div>

            <div className="chat-msgs">
              {messages.length === 0 && (
                <div className="chat-welcome">
                  <div className="chat-welcome-ico">🤖</div>
                  <div className="chat-welcome-title">Hi! I'm your AI tutor</div>
                  <div className="chat-welcome-sub">
                    Ask me any programming question — DSA, web development, system design, or anything else.
                    I'll give you clear, structured explanations with code examples.
                  </div>
                  <div className="chips">
                    {CHIPS.map(c => (
                      <button key={c} className="chip" onClick={() => send(c)}>{c}</button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => {
                if (m.role === "user") return (
                  <div key={i} className="msg msg-u">
                    <div className="msg-av av-u">{user?.email?.[0]?.toUpperCase() || "U"}</div>
                    <div className="msg-bub bub-u">{m.text}</div>
                  </div>
                );

                if (m.role === "error") return (
                  <div key={i} className="msg">
                    <div className="msg-av av-ai">🤖</div>
                    <div className="msg-bub bub-ai" style={{ color: "var(--error-text)" }}>
                      ⚠ {m.text}
                    </div>
                  </div>
                );

                const a = m.answer;
                return (
                  <div key={i} className="msg">
                    <div className="msg-av av-ai">🤖</div>
                    <div className="msg-bub bub-ai">

                      {a.problem_understanding && (
                        <div className="rsec">
                          <div className="rlbl">Problem Understanding</div>
                          <div className="rtxt">{a.problem_understanding}</div>
                        </div>
                      )}

                      {a.approach && (<>
                        <hr className="rdiv" />
                        <div className="rsec">
                          <div className="rlbl">Approach</div>
                          <div className="rtxt">{a.approach}</div>
                        </div>
                      </>)}

                      {a.step_by_step_explanation && (<>
                        <hr className="rdiv" />
                        <div className="rsec">
                          <div className="rlbl">Step-by-Step Explanation</div>
                          <div className="rtxt">{a.step_by_step_explanation}</div>
                        </div>
                      </>)}

                      {a.code && (<>
                        <hr className="rdiv" />
                        <div className="rsec">
                          <div className="rlbl">Code</div>
                          <pre className="rcode">{a.code}</pre>
                        </div>
                      </>)}

                      {(a.time_complexity || a.space_complexity) && (<>
                        <hr className="rdiv" />
                        <div className="rsec">
                          <div className="rlbl">Complexity</div>
                          <div className="rmetrics">
                            {a.time_complexity  && <div className="rpill">⏱ Time: <b>{a.time_complexity}</b></div>}
                            {a.space_complexity && <div className="rpill">🗂 Space: <b>{a.space_complexity}</b></div>}
                          </div>
                        </div>
                      </>)}

                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="msg">
                  <div className="msg-av av-ai">🤖</div>
                  <div className="msg-bub bub-ai">
                    <div className="typing">
                      <div className="tdot" /><div className="tdot" /><div className="tdot" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="chat-input-row">
              <textarea
                className="chat-ta"
                rows={1}
                placeholder="Ask your doubt… (Enter to send, Shift+Enter for new line)"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={onKey}
              />
              <button className="btn-send"
                onClick={() => send()}
                disabled={loading || !question.trim()}
                title="Send">
                ➤
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}