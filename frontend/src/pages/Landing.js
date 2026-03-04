import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const features = [
  { icon: "🧠", title: "AI-Powered Explanations", desc: "Get instant, detailed explanations with code examples, step-by-step breakdowns, and real-world analogies." },
  { icon: "👥", title: "Instant Mentor Access",   desc: "Connect with verified mentors from top colleges for personalized 1-on-1 doubt solving sessions." },
  { icon: "💳", title: "Affordable Micro Sessions", desc: "Book 15 or 30 minute sessions at student-friendly prices. Pay only for what you need." },
  { icon: "✅", title: "Verified Mentors",          desc: "Every mentor is verified for expertise and teaching ability. Read reviews before booking." },
];

const steps = [
  { num: "STEP 01", icon: "💬", title: "Ask Your Doubt",    desc: "Type your programming question — from DSA to web development, system design to AI/ML." },
  { num: "STEP 02", icon: "🤖", title: "Get AI Help",       desc: "Receive instant AI-generated explanations with code examples, analogies, and step-by-step solutions." },
  { num: "STEP 03", icon: "🎓", title: "Connect to Expert", desc: "Still confused? Book a quick session with a verified mentor for personalized guidance." },
];

const testimonials = [
  { stars: 5, text: '"DoubtBridge saved my placement prep. The AI explanations are incredibly clear, and when I needed extra help, the mentors were just a click away."', name: "Rahul Verma",   college: "IIT Bombay",  init: "RV" },
  { stars: 5, text: '"The step-by-step breakdowns for DSA problems are amazing. I went from struggling with trees to cracking coding rounds at top companies."',         name: "Priya Sharma",  college: "NIT Trichy",  init: "PS" },
  { stars: 5, text: '"Affordable and effective. The 15-minute sessions with mentors are perfect for clearing quick doubts before exams."',                               name: "Ananya Gupta",  college: "BITS Pilani", init: "AG" },
  { stars: 4, text: '"As a mentor on DoubtBridge, I love helping students while earning. The platform is clean and the booking system works flawlessly."',               name: "Vikram Singh",  college: "VIT Vellore", init: "VS" },
];

function Stars({ n }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= n ? "#f59e0b" : "#e2e8f0" }}>★</span>
      ))}
    </div>
  );
}

export default function Landing() {
  const { user } = useAuth();

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <Link to="/" className="nav-logo">
          <div className="nav-logo-icon">⚡</div>
          <span className="nav-logo-text">DoubtBridge</span>
        </Link>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how">How It Works</a></li>
          <li><a href="#testimonials">Testimonials</a></li>
        </ul>
        <div className="nav-actions">
          {user ? (
            <Link to="/dashboard" className="btn-primary-nav">Dashboard →</Link>
          ) : (
            <>
              <Link to="/login"    className="btn-ghost-nav">Log in</Link>
              <Link to="/register" className="btn-primary-nav">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge afu">
          <span className="hero-dot" /> AI-Powered Learning Platform
        </div>
        <h1 className="hero-h1">
          Instant Doubt Solving for<br />
          <span className="accent">Future Engineers</span>
        </h1>
        <p className="hero-desc">
          Get instant AI explanations for your programming doubts, or connect
          with verified mentors for personalized guidance. Learn faster, learn smarter.
        </p>
        <div className="hero-btns">
          <Link to={user ? "/ask" : "/register"} className="btn-cta">
            🤖 Ask AI Now →
          </Link>
          <button className="btn-outline">👥 Become a Mentor</button>
        </div>
        <div className="hero-stats">
          {[
            { n: "10K+",   l: "Doubts Solved" },
            { n: "500+",   l: "Verified Mentors" },
            { n: "4.9★",   l: "Average Rating" },
            { n: "< 2min", l: "Avg Response" },
          ].map(s => (
            <div key={s.l} style={{ textAlign: "center" }}>
              <div className="stat-num">{s.n}</div>
              <div className="stat-lbl">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="section sec-gray" id="features">
        <div className="sec-inner">
          <div className="sec-hdr">
            <div className="sec-tag">FEATURES</div>
            <h2 className="sec-title">Everything you need to learn faster</h2>
            <p className="sec-sub">From instant AI help to expert human mentors — DoubtBridge gives you the complete toolkit for mastering programming.</p>
          </div>
          <div className="feat-grid">
            {features.map((f, i) => (
              <div key={f.title} className="feat-card" style={{ animationDelay: `${.1+i*.1}s` }}>
                <div className="feat-icon">{f.icon}</div>
                <div className="feat-title">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section sec-white" id="how">
        <div className="sec-inner">
          <div className="sec-hdr">
            <div className="sec-tag">HOW IT WORKS</div>
            <h2 className="sec-title">Three steps to clarity</h2>
            <p className="sec-sub">Get from confused to confident in minutes, not hours.</p>
          </div>
          <div className="steps">
            {steps.map((s, i) => (
              <div key={s.num}>
                <div className="step-card" style={{ animationDelay: `${.1+i*.15}s` }}>
                  <div className="step-ico">{s.icon}</div>
                  <div>
                    <div className="step-num">{s.num}</div>
                    <div className="step-title">{s.title}</div>
                    <div className="step-desc">{s.desc}</div>
                  </div>
                </div>
                {i < steps.length - 1 && <div className="step-arrow">↓</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section sec-gray" id="testimonials">
        <div className="sec-inner">
          <div className="sec-hdr">
            <div className="sec-tag">TESTIMONIALS</div>
            <h2 className="sec-title">Loved by students &amp; mentors</h2>
            <p className="sec-sub">Join thousands of students who are learning smarter with DoubtBridge.</p>
          </div>
          <div className="testi-grid">
            {testimonials.map((t, i) => (
              <div key={t.name} className="testi-card" style={{ animationDelay: `${.1+i*.1}s` }}>
                <Stars n={t.stars} />
                <p className="testi-text">{t.text}</p>
                <div className="testi-author">
                  <div className="t-avatar">{t.init}</div>
                  <div>
                    <div className="t-name">{t.name}</div>
                    <div className="t-college">{t.college}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <Link to="/" className="nav-logo" style={{ display: "inline-flex" }}>
              <div className="nav-logo-icon">⚡</div>
              <span className="nav-logo-text">DoubtBridge</span>
            </Link>
            <p className="footer-desc">AI-powered doubt solving and expert mentorship for programming students. Learn faster, learn smarter.</p>
          </div>
          <div>
            <div className="footer-col-title">Platform</div>
            <ul className="footer-links">
              <li><Link to="/ask">Ask AI</Link></li>
              <li><a href="#features">Find Mentors</a></li>
              <li><a href="#features">Pricing</a></li>
              <li><a href="#features">FAQ</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              <li><a href="#features">About</a></li>
              <li><a href="#features">Contact</a></li>
              <li><a href="#features">Terms</a></li>
              <li><a href="#features">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">© 2026 DoubtBridge. All rights reserved.</div>
      </footer>
    </div>
  );
}