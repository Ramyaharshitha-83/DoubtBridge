import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TOPICS = [
  {
    id: "dsa",
    icon: "🧩",
    title: "Data Structures & Algorithms",
    tag: "Most Important",
    tagColor: "#dc2626",
    desc: "The backbone of all coding interviews. Master arrays to graphs.",
    roadmap: [
      { step: "1", title: "Arrays & Strings", items: ["Two Pointers", "Sliding Window", "Prefix Sum", "Kadane's Algorithm"] },
      { step: "2", title: "Linked Lists", items: ["Singly & Doubly LL", "Fast & Slow Pointers", "Reverse LL", "Merge Sorted Lists"] },
      { step: "3", title: "Stacks & Queues", items: ["Monotonic Stack", "LRU Cache", "Circular Queue", "Expression Evaluation"] },
      { step: "4", title: "Trees & BST", items: ["DFS / BFS Traversals", "Height & Diameter", "LCA", "Segment Tree"] },
      { step: "5", title: "Graphs", items: ["BFS / DFS", "Dijkstra", "Topological Sort", "Union Find"] },
      { step: "6", title: "Dynamic Programming", items: ["Memoization", "Tabulation", "0/1 Knapsack", "LCS / LIS"] },
      { step: "7", title: "Sorting & Searching", items: ["Merge Sort", "Quick Sort", "Binary Search variants", "Counting Sort"] },
    ],
  },
  {
    id: "os",
    icon: "💻",
    title: "Operating Systems",
    tag: "Core CS",
    tagColor: "#7c3aed",
    desc: "Essential OS concepts asked in every product company interview.",
    roadmap: [
      { step: "1", title: "Process Management", items: ["Process vs Thread", "PCB", "Process States", "Context Switching"] },
      { step: "2", title: "CPU Scheduling", items: ["FCFS, SJF, SRTF", "Round Robin", "Priority Scheduling", "Multilevel Queue"] },
      { step: "3", title: "Synchronization", items: ["Mutex & Semaphore", "Deadlock", "Banker's Algorithm", "Race Conditions"] },
      { step: "4", title: "Memory Management", items: ["Paging", "Segmentation", "Virtual Memory", "Page Replacement Algorithms"] },
      { step: "5", title: "File Systems", items: ["Inode", "FAT", "Disk Scheduling", "RAID"] },
    ],
  },
  {
    id: "dbms",
    icon: "🗄️",
    title: "Database Management (DBMS)",
    tag: "Core CS",
    tagColor: "#7c3aed",
    desc: "SQL, normalization, transactions and indexing — a must for every role.",
    roadmap: [
      { step: "1", title: "SQL Basics", items: ["DDL, DML, DCL", "JOINs (Inner, Left, Right)", "GROUP BY / HAVING", "Subqueries"] },
      { step: "2", title: "Normalization", items: ["1NF, 2NF, 3NF", "BCNF", "Functional Dependencies", "Decomposition"] },
      { step: "3", title: "Transactions", items: ["ACID Properties", "Isolation Levels", "Deadlock in DBMS", "Two-Phase Locking"] },
      { step: "4", title: "Indexing & Query Optimization", items: ["B+ Tree Index", "Query Execution Plan", "Clustered vs Non-clustered", "Explain Analyze"] },
      { step: "5", title: "NoSQL Basics", items: ["MongoDB", "Key-Value Store", "CAP Theorem", "When SQL vs NoSQL"] },
    ],
  },
  {
    id: "cn",
    icon: "🌐",
    title: "Computer Networks",
    tag: "Core CS",
    tagColor: "#7c3aed",
    desc: "From OSI layers to HTTP — understand how the internet works.",
    roadmap: [
      { step: "1", title: "OSI & TCP/IP Model", items: ["7 OSI Layers", "TCP/IP Layers", "Protocols per layer", "Encapsulation"] },
      { step: "2", title: "Network Layer", items: ["IP Addressing", "Subnetting", "Routing Algorithms", "NAT"] },
      { step: "3", title: "Transport Layer", items: ["TCP vs UDP", "3-Way Handshake", "Flow & Congestion Control", "Port Numbers"] },
      { step: "4", title: "Application Layer", items: ["HTTP / HTTPS", "DNS", "SMTP, FTP", "WebSockets"] },
      { step: "5", title: "Security Basics", items: ["SSL/TLS", "Symmetric vs Asymmetric", "Firewalls", "VPN"] },
    ],
  },
  {
    id: "oops",
    icon: "🧱",
    title: "Object-Oriented Programming",
    tag: "Must Know",
    tagColor: "#0369a1",
    desc: "Classes, objects, design principles — asked in almost every interview.",
    roadmap: [
      { step: "1", title: "Core Concepts", items: ["Class & Object", "Encapsulation", "Abstraction", "Inheritance & Polymorphism"] },
      { step: "2", title: "Advanced OOP", items: ["Virtual Functions", "Abstract Classes", "Interfaces", "Method Overriding vs Overloading"] },
      { step: "3", title: "Design Principles", items: ["SOLID Principles", "DRY & KISS", "Composition vs Inheritance", "Dependency Injection"] },
      { step: "4", title: "Design Patterns", items: ["Singleton", "Factory", "Observer", "Strategy Pattern"] },
    ],
  },
  {
    id: "system-design",
    icon: "🏗️",
    title: "System Design",
    tag: "For Senior Roles",
    tagColor: "#0891b2",
    desc: "Low-level and high-level design — essential for SDE-2 and above.",
    roadmap: [
      { step: "1", title: "Basics", items: ["Scalability", "Latency vs Throughput", "CAP Theorem", "Load Balancing"] },
      { step: "2", title: "Databases in System Design", items: ["SQL vs NoSQL choice", "Database Sharding", "Replication", "Caching (Redis)"] },
      { step: "3", title: "Common Components", items: ["CDN", "Message Queues (Kafka)", "Rate Limiting", "API Gateway"] },
      { step: "4", title: "Design Popular Systems", items: ["Design URL Shortener", "Design Twitter Feed", "Design Uber", "Design YouTube"] },
    ],
  },
  {
    id: "webdev",
    icon: "🌍",
    title: "Web Development",
    tag: "For Dev Roles",
    tagColor: "#059669",
    desc: "Frontend to backend — full-stack concepts for web-focused interviews.",
    roadmap: [
      { step: "1", title: "Frontend Basics", items: ["HTML5 & CSS3", "JavaScript ES6+", "DOM Manipulation", "Event Loop & Async"] },
      { step: "2", title: "React.js", items: ["Components & Props", "Hooks (useState, useEffect)", "Context API", "React Router"] },
      { step: "3", title: "Backend Basics", items: ["Node.js & Express", "REST API Design", "JWT Auth", "Middleware"] },
      { step: "4", title: "Databases", items: ["MongoDB (Mongoose)", "PostgreSQL", "ORM (Prisma/Sequelize)", "CRUD Operations"] },
      { step: "5", title: "Deployment", items: ["Git & GitHub", "Docker Basics", "CI/CD", "AWS / Vercel / Netlify"] },
    ],
  },
  {
    id: "aptitude",
    icon: "🧮",
    title: "Aptitude & Reasoning",
    tag: "For Placements",
    tagColor: "#b45309",
    desc: "Crack the aptitude round of TCS, Infosys, Wipro and other mass recruiters.",
    roadmap: [
      { step: "1", title: "Quantitative Aptitude", items: ["Number System", "Percentages & Profit-Loss", "Time-Speed-Distance", "Permutation & Combination"] },
      { step: "2", title: "Logical Reasoning", items: ["Syllogism", "Blood Relations", "Seating Arrangement", "Coding-Decoding"] },
      { step: "3", title: "Verbal Ability", items: ["Reading Comprehension", "Sentence Correction", "Para Jumbles", "Fill in the Blanks"] },
    ],
  },
];

export default function Topics() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  const toggle = (id) => setOpen(open === id ? null : id);

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
          <div className="dash-greeting afu">LEARNING</div>
          <h1 className="dash-title afu d1">Placement Roadmaps 📚</h1>
          <p className="dash-subtitle afu d2">Click any subject to see the full roadmap. Use Ask AI to go deeper on any topic.</p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "2rem auto", padding: "0 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1.25rem" }}>
          {TOPICS.map((t, i) => (
            <div key={t.id} className="topics-card afu" style={{ animationDelay: `${0.05 * i}s` }}>
              {/* Card header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: ".75rem" }}>
                <div style={{ fontSize: "2rem" }}>{t.icon}</div>
                <span style={{ fontSize: ".7rem", fontWeight: 700, background: t.tagColor + "18", color: t.tagColor, padding: ".2rem .6rem", borderRadius: "20px", border: `1px solid ${t.tagColor}30` }}>
                  {t.tag}
                </span>
              </div>
              <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: ".4rem" }}>{t.title}</div>
              <div style={{ fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1rem" }}>{t.desc}</div>

              {/* Toggle roadmap */}
              <button
                onClick={() => toggle(t.id)}
                style={{ width: "100%", background: open === t.id ? "var(--accent)" : "var(--accent-light)", color: open === t.id ? "#fff" : "var(--accent)", border: "none", borderRadius: "8px", padding: ".6rem", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: ".82rem", cursor: "pointer", transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                {open === t.id ? "▲ Hide Roadmap" : "▼ View Roadmap"}
              </button>

              {/* Roadmap accordion */}
              {open === t.id && (
                <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: ".6rem", animation: "fadeUp .3s ease both" }}>
                  {t.roadmap.map((r) => (
                    <div key={r.step} style={{ background: "var(--bg)", borderRadius: "8px", padding: ".75rem 1rem", border: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: ".4rem" }}>
                        <span style={{ width: "22px", height: "22px", background: "var(--accent)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: ".72rem", fontWeight: 700, flexShrink: 0 }}>{r.step}</span>
                        <span style={{ fontWeight: 700, fontSize: ".875rem" }}>{r.title}</span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem", paddingLeft: "30px" }}>
                        {r.items.map(item => (
                          <Link
                            key={item}
                            to={`/ask?q=${encodeURIComponent("Explain " + item)}`}
                            style={{ fontSize: ".75rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "6px", padding: ".25rem .6rem", color: "var(--text2)", textDecoration: "none", transition: "all .15s" }}
                            onMouseEnter={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.color = "var(--accent)"; }}
                            onMouseLeave={e => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--text2)"; }}
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                  {/* Ask AI button */}
                  <Link
                    to={`/ask?q=${encodeURIComponent("Give me a complete guide on " + t.title)}`}
                    style={{ marginTop: ".25rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: "var(--accent)", color: "#fff", borderRadius: "8px", padding: ".65rem", fontWeight: 700, fontSize: ".82rem", textDecoration: "none", transition: "all .2s" }}>
                    🤖 Ask AI about {t.title.split(" ")[0]}
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: "3rem" }} />
    </div>
  );
}