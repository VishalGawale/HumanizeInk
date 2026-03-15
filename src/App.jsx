import { useState, useCallback, useEffect } from "react";

// ─── LIMITS ───────────────────────────────────────────────
const GUEST_LIMIT = 3;
const STORAGE_KEY = "hum_usage";

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function getUsage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: getTodayKey(), count: 0 };
    const parsed = JSON.parse(raw);
    if (parsed.date !== getTodayKey()) return { date: getTodayKey(), count: 0 };
    return parsed;
  } catch {
    return { date: getTodayKey(), count: 0 };
  }
}

function incrementUsage() {
  const usage = getUsage();
  const updated = { date: getTodayKey(), count: usage.count + 1 };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated.count;
}

// ─── AI SCORE ─────────────────────────────────────────────
const AIScore = ({ score, label }) => {
  // Before = red (bad), After = green (good)
  const isBefore = label === "Before";
  const color = isBefore ? "#f87171" : "#4ade80";
  const blocks = Math.round(score / 10);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <div style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7280", fontFamily: "'DM Mono', monospace" }}>{label}</div>

      {/* Vertical bar chart */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "60px" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{
            width: "14px",
            height: `${(i + 1) * 6}px`,
            borderRadius: "2px 2px 0 0",
            background: i < blocks ? color : "#1f2937",
            border: i < blocks ? `1px solid ${color}44` : "1px solid #374151",
            transition: "background 0.4s ease",
          }} />
        ))}
      </div>

      <div style={{ fontSize: "22px", fontWeight: "700", color, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
        {score}<span style={{ fontSize: "12px", color: "#6b7280" }}>/100</span>
      </div>
      <div style={{ fontSize: "10px", color: isBefore ? "#f8717188" : "#4ade8088", fontFamily: "'DM Mono', monospace" }}>
        {isBefore ? "AI detected" : "looks human"}
      </div>
    </div>
  );
};

// ─── SIGNUP POPUP ─────────────────────────────────────────
const SignupPopup = ({ onClose }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 1000,
    background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
  }}>
    <div style={{
      background: "#0f1117", border: "1px solid #7c3aed44",
      borderRadius: "16px", padding: "40px 32px", maxWidth: "420px", width: "100%",
      boxShadow: "0 0 60px #7c3aed22", textAlign: "center",
      animation: "fadeIn 0.3s ease",
    }}>
      <div style={{
        width: "56px", height: "56px", borderRadius: "14px",
        background: "#7c3aed22", border: "1px solid #7c3aed44",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 20px", fontSize: "24px",
      }}>✍️</div>
      <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "10px", color: "#f9fafb" }}>
        You've used your free quota
      </h2>
      <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: "1.6", marginBottom: "28px" }}>
        You've used your <span style={{ color: "#a78bfa", fontWeight: "600" }}>3 free daily uses</span>. Come back tomorrow for more — completely free, no account needed.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px", textAlign: "left" }}>
        {[
          "3 free uses every day — no signup",
          "No credit card ever required",
          "Explains every change it makes",
          "AI score before and after",
        ].map((perk, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#14532d", border: "1px solid #4ade8044", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", flexShrink: 0 }}>✓</div>
            <span style={{ fontSize: "13px", color: "#d1d5db" }}>{perk}</span>
          </div>
        ))}
      </div>
      <button onClick={onClose} style={{
        width: "100%", padding: "13px", borderRadius: "8px",
        background: "#7c3aed", border: "none", color: "#fff",
        fontSize: "15px", fontWeight: "600", cursor: "pointer",
        fontFamily: "'DM Sans', system-ui",
      }}>
        OK, come back tomorrow
      </button>
      <button onClick={onClose} style={{
        marginTop: "16px", background: "none", border: "none",
        color: "#4b5563", fontSize: "12px", cursor: "pointer",
        fontFamily: "'DM Mono', monospace",
      }}>
        close ×
      </button>
    </div>
  </div>
);

// ─── USAGE BADGE ──────────────────────────────────────────
const UsageBadge = ({ used, limit }) => {
  const remaining = limit - used;
  const isLow = remaining <= 1;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "6px",
      background: isLow ? "#1f0a0a" : "#0f1117",
      border: `1px solid ${isLow ? "#7f1d1d" : "#1f2937"}`,
      borderRadius: "20px", padding: "5px 12px",
      fontSize: "12px", fontFamily: "'DM Mono', monospace",
    }}>
      <div style={{
        width: "6px", height: "6px", borderRadius: "50%",
        background: isLow ? "#f87171" : "#4ade80",
        boxShadow: isLow ? "0 0 6px #f87171" : "0 0 6px #4ade80",
      }} />
      <span style={{ color: isLow ? "#fca5a5" : "#9ca3af" }}>
        {remaining <= 0 ? "No uses left today" : `${remaining} use${remaining !== 1 ? "s" : ""} left today`}
      </span>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────
export default function App() {
  const [input, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [usage, setUsage] = useState(getUsage);
  const [mode, setMode] = useState("standard");

  useEffect(() => { setUsage(getUsage()); }, []);

  const limit = GUEST_LIMIT;
  const usedToday = usage.count;
  const hasReachedLimit = usedToday >= limit;

  const humanize = useCallback(async () => {
    if (!input.trim() || loading) return;
    if (hasReachedLimit) { setShowPopup(true); return; }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, mode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Server error");
      const newCount = incrementUsage();
      setUsage({ date: getTodayKey(), count: newCount });
      setResult(data);
      if (newCount >= GUEST_LIMIT) {
        setTimeout(() => setShowPopup(true), 1500);
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }, [input, loading, hasReachedLimit, mode]);

  const copyOutput = () => {
    if (result?.humanized) {
      navigator.clipboard.writeText(result.humanized);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sampleText = `Great question! Here is an overview of remote work trends. I hope this helps!

Remote work serves as a testament to the evolving nature of modern employment, marking a pivotal shift in how organizations approach talent acquisition and retention. In today's rapidly changing landscape, companies are increasingly embracing flexible work arrangements, underscoring their commitment to employee well-being.

The benefits are clear: enhanced productivity, fostering collaboration, and cultivating a culture of trust. It's not just about working from home; it's about unlocking human potential at scale.

In conclusion, the future looks bright for remote work. Exciting times lie ahead as organizations continue their journey toward excellence.`;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#e5e7eb", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea { resize: none; outline: none; }
        textarea:focus { border-color: #7c3aed !important; box-shadow: 0 0 0 3px #7c3aed15 !important; }
        .btn-primary:hover:not(:disabled) { background: #6d28d9 !important; transform: translateY(-1px); }
        .mode-btn:hover { border-color: #7c3aed44 !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
        .grid-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; background-image: linear-gradient(#ffffff06 1px, transparent 1px), linear-gradient(90deg, #ffffff06 1px, transparent 1px); background-size: 40px 40px; }
        .glow { position: fixed; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, #7c3aed15 0%, transparent 70%); pointer-events: none; z-index: 0; top: -200px; left: -100px; }
        .card { background: #0f1117; border: 1px solid #1f2937; border-radius: 12px; }
        @media (max-width: 768px) { .split { flex-direction: column !important; } .split > div { width: 100% !important; } }
      `}</style>

      <div className="grid-bg" />
      <div className="glow" />

      {/* NAVBAR */}
      <nav style={{ position: "relative", zIndex: 10, borderBottom: "1px solid #1f2937", background: "#0a0a0fcc", backdropFilter: "blur(10px)", padding: "0 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>✍</div>
            <span style={{ fontSize: "16px", fontWeight: "700", letterSpacing: "-0.02em" }}>humanizer<span style={{ color: "#7c3aed" }}>.ink</span></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <UsageBadge used={usedToday} limit={limit} />
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#7c3aed15", border: "1px solid #7c3aed33", borderRadius: "20px", padding: "5px 14px", marginBottom: "16px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#7c3aed", boxShadow: "0 0 8px #7c3aed" }} />
            <span style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#a78bfa", fontFamily: "'DM Mono', monospace" }}>Free AI Humanizer</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: "700", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "12px" }}>
            Make it sound <span style={{ color: "#7c3aed" }}>human.</span>
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "15px", maxWidth: "500px", margin: "0 auto", lineHeight: 1.6 }}>
            Paste AI text. Get a human rewrite with an AI score and a full breakdown of every change.
          </p>
        </div>

        {/* Mode selector */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "24px" }}>
          {[{ id: "fast", label: "Fast", desc: "Light touch" }, { id: "standard", label: "Standard", desc: "Balanced" }, { id: "enhanced", label: "Enhanced", desc: "Deep rewrite" }].map((m) => (
            <button key={m.id} className="mode-btn" onClick={() => setMode(m.id)} style={{
              background: mode === m.id ? "#7c3aed15" : "transparent",
              border: `1px solid ${mode === m.id ? "#7c3aed" : "#1f2937"}`,
              borderRadius: "8px", padding: "8px 18px",
              color: mode === m.id ? "#a78bfa" : "#6b7280",
              fontSize: "13px", fontWeight: mode === m.id ? "600" : "400",
              cursor: "pointer", transition: "all 0.2s", fontFamily: "'DM Sans', system-ui",
            }}>
              {m.label}
              <span style={{ display: "block", fontSize: "10px", color: mode === m.id ? "#7c3aed" : "#4b5563", fontFamily: "'DM Mono', monospace" }}>{m.desc}</span>
            </button>
          ))}
        </div>

        {/* Split panel */}
        <div className="split" style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          {/* Input */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", fontFamily: "'DM Mono', monospace" }}>Your text</span>
              <button onClick={() => setText(sampleText)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "11px", color: "#4b5563", fontFamily: "'DM Mono', monospace" }}>Load sample →</button>
            </div>
            <textarea value={input} onChange={(e) => setText(e.target.value)} placeholder="Paste your AI-generated text here..." style={{ width: "100%", height: "280px", background: "#0f1117", border: "1px solid #1f2937", borderRadius: "12px", padding: "16px", color: "#e5e7eb", fontSize: "14px", lineHeight: "1.7", fontFamily: "'DM Sans', system-ui", transition: "border-color 0.2s" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
              <span style={{ fontSize: "11px", color: input.length > 4500 ? "#fb923c" : "#374151", fontFamily: "'DM Mono', monospace" }}>
                {input.trim().split(/\s+/).filter(Boolean).length} words · {input.length}/5000
              </span>
              <button className="btn-primary" onClick={humanize} disabled={!input.trim() || loading} style={{
                background: hasReachedLimit ? "#450a0a" : (input.trim() && !loading ? "#7c3aed" : "#1f2937"),
                border: hasReachedLimit ? "1px solid #7f1d1d" : "none",
                borderRadius: "8px", padding: "11px 24px",
                cursor: input.trim() ? "pointer" : "not-allowed",
                color: hasReachedLimit ? "#fca5a5" : (input.trim() && !loading ? "#fff" : "#4b5563"),
                fontSize: "14px", fontWeight: "600", transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: "8px", fontFamily: "'DM Sans', system-ui",
              }}>
                {loading ? (<><div style={{ width: "13px", height: "13px", border: "2px solid #ffffff44", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />Humanizing...</>) : hasReachedLimit ? "Come back tomorrow" : "Humanize →"}
              </button>
            </div>
          </div>

          {/* Output */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", fontFamily: "'DM Mono', monospace" }}>Humanized output</span>
              {result && (
                <button onClick={copyOutput} style={{ background: "#161b27", border: "1px solid #1f2937", borderRadius: "6px", padding: "4px 12px", color: copied ? "#4ade80" : "#9ca3af", fontSize: "11px", cursor: "pointer", fontFamily: "'DM Mono', monospace" }}>
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              )}
            </div>
            <div style={{ height: "280px", overflowY: "auto", background: "#0d1a12", border: `1px solid ${result ? "#14532d44" : "#1f2937"}`, borderRadius: "12px", padding: "16px", fontSize: "14px", lineHeight: "1.7", color: result ? "#d1fae5" : "#374151", whiteSpace: "pre-wrap" }}>
              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingTop: "8px" }}>
                  {["90%", "75%", "85%", "60%"].map((w, i) => (
                    <div key={i} style={{ height: "14px", background: "#1f2937", borderRadius: "4px", width: w, animation: `pulse 1.5s ease infinite`, animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              ) : result ? result.humanized : <span style={{ fontStyle: "italic", fontSize: "13px" }}>Your humanized text will appear here...</span>}
            </div>
            <div style={{ marginTop: "10px", fontSize: "11px", color: "#374151", fontFamily: "'DM Mono', monospace", textAlign: "right" }}>
              {result && `${result.humanized.trim().split(/\s+/).filter(Boolean).length} words`}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="fade-in card" style={{ padding: "14px 18px", color: "#fca5a5", fontSize: "14px", marginBottom: "20px", borderColor: "#7f1d1d", background: "#1f0a0a" }}>
            ⚠ {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="fade-in" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div className="card" style={{ padding: "24px 28px", display: "flex", gap: "20px", alignItems: "center", justifyContent: "center", flex: "1", minWidth: "280px" }}>
              <AIScore score={result.score_before} label="Before" />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{ fontSize: "20px", color: "#4ade80" }}>↓</div>
                <div style={{ fontSize: "9px", color: "#374151", fontFamily: "'DM Mono', monospace", textAlign: "center" }}>AI<br/>score</div>
                <div style={{ fontSize: "12px", color: "#4ade80", fontWeight: "700", fontFamily: "'DM Mono', monospace" }}>
                  -{result.score_before - result.score_after}
                </div>
              </div>
              <AIScore score={result.score_after} label="After" />
            </div>
            <div className="card" style={{ padding: "20px", flex: "2", minWidth: "280px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#4b5563", fontFamily: "'DM Mono', monospace", marginBottom: "12px" }}>What changed</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                {result.changes?.map((change, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <span style={{ color: "#7c3aed", fontSize: "11px", marginTop: "3px", flexShrink: 0 }}>—</span>
                    <span style={{ fontSize: "13px", color: "#9ca3af", lineHeight: "1.5" }}>{change}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <footer style={{
        position: "relative", zIndex: 1,
        borderTop: "1px solid #1f2937",
        padding: "24px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "20px", height: "20px", borderRadius: "5px", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>✍</div>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>humanizer<span style={{ color: "#7c3aed" }}>.ink</span></span>
          </div>
          <div style={{ fontSize: "12px", color: "#4b5563", fontFamily: "'DM Mono', monospace" }}>
            © {new Date().getFullYear()} humanizer.ink — All rights reserved
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy Policy", "Terms of Use", "Contact"].map((link) => (
              <a key={link} href="#" style={{ fontSize: "12px", color: "#4b5563", textDecoration: "none", fontFamily: "'DM Mono', monospace", transition: "color 0.2s" }}
                onMouseOver={e => e.target.style.color = "#a78bfa"}
                onMouseOut={e => e.target.style.color = "#4b5563"}
              >{link}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* Popup */}
      {showPopup && <SignupPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
}