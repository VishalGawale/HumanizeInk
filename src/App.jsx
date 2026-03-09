import { useState, useCallback } from "react";

// ✅ NO API KEY HERE — calls /api/humanize which is our secure Vercel backend

const AIScore = ({ score, label }) => {
  const color = score < 25 ? "#4ade80" : score < 50 ? "#facc15" : score < 75 ? "#fb923c" : "#f87171";
  const blocks = Math.round(score / 10);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
      <div style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7280", fontFamily: "'DM Mono', monospace" }}>{label}</div>
      <div style={{ display: "flex", gap: "3px" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{
            width: "18px", height: "18px", borderRadius: "3px",
            background: i < blocks ? color : "#1f2937",
            transition: "background 0.4s ease",
            border: i < blocks ? `1px solid ${color}44` : "1px solid #374151"
          }} />
        ))}
      </div>
      <div style={{ fontSize: "22px", fontWeight: "700", color, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
        {score}<span style={{ fontSize: "13px", color: "#6b7280" }}>/100</span>
      </div>
    </div>
  );
};

export default function Humanizer() {
  const [input, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const humanize = useCallback(async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // calls our own backend — not Groq directly
      const response = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Server error");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  const copyOutput = () => {
    if (result?.humanized) {
      navigator.clipboard.writeText(result.humanized);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sampleText = `Great question! Here is an overview of remote work trends. I hope this helps!

Remote work serves as a testament to the evolving nature of modern employment, marking a pivotal shift in how organizations approach talent acquisition and retention. In today's rapidly changing landscape, companies are increasingly embracing flexible work arrangements, underscoring their commitment to employee well-being.

The benefits are clear: enhanced productivity, fostering collaboration, and cultivating a culture of trust. It's not just about working from home; it's about unlocking human potential at scale, ensuring that teams remain agile while delivering seamless experiences.

Industry experts have noted that adoption has accelerated significantly. The trend has been featured in numerous leading publications. Additionally, research suggests this may potentially have some positive effects on work-life balance.

In conclusion, the future looks bright for remote work. Exciting times lie ahead as organizations continue their journey toward excellence. Let me know if you'd like me to expand on any section!`;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      color: "#e5e7eb",
      position: "relative",
      overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #7c3aed44; }
        textarea { resize: none; outline: none; }
        textarea:focus { border-color: #7c3aed !important; }
        .btn-primary:hover:not(:disabled) { background: #6d28d9 !important; transform: translateY(-1px); }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-copy:hover { background: #1f2937 !important; }
        .sample-btn:hover { color: #a78bfa !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
        .grid-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg, #ffffff08 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .glow { position: fixed; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, #7c3aed18 0%, transparent 70%); pointer-events: none; z-index: 0; top: -200px; left: -100px; }
      `}</style>

      <div className="grid-bg" />
      <div className="glow" />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "960px", margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: "48px", paddingTop: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#7c3aed", boxShadow: "0 0 12px #7c3aed" }} />
            <span style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7c3aed", fontFamily: "'DM Mono', monospace" }}>AI Writing Detector</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: "700", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "12px" }}>
            Make it sound<br />
            <span style={{ color: "#7c3aed" }}>human.</span>
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "16px", maxWidth: "480px", lineHeight: 1.6 }}>
            Paste AI-generated text. Get back something that reads like a person actually wrote it — with opinions, rhythm, and no fluff.
          </p>
        </div>

        {/* Input */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <label style={{ fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", fontFamily: "'DM Mono', monospace" }}>
              Input text
            </label>
            <button className="sample-btn" onClick={() => setText(sampleText)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "12px", color: "#6b7280", fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.05em", transition: "color 0.2s", padding: "4px 0"
            }}>
              Load sample →
            </button>
          </div>
          <textarea
            value={input}
            onChange={e => setText(e.target.value)}
            placeholder="Paste your AI-generated text here..."
            style={{
              width: "100%", height: "220px",
              background: "#0f1117", border: "1px solid #1f2937",
              borderRadius: "12px", padding: "18px",
              color: "#e5e7eb", fontSize: "14px", lineHeight: "1.7",
              fontFamily: "'DM Sans', system-ui, sans-serif",
              transition: "border-color 0.2s"
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
            <span style={{ fontSize: "12px", color: input.length > 4500 ? "#fb923c" : "#4b5563", fontFamily: "'DM Mono', monospace" }}>
              {input.length}/5000 chars
            </span>
            <button
              className="btn-primary"
              onClick={humanize}
              disabled={!input.trim() || loading}
              style={{
                background: input.trim() && !loading ? "#7c3aed" : "#1f2937",
                border: "none", borderRadius: "8px",
                padding: "12px 28px",
                cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                color: input.trim() && !loading ? "#fff" : "#4b5563",
                fontSize: "14px", fontWeight: "600",
                transition: "all 0.2s", letterSpacing: "0.02em",
                display: "flex", alignItems: "center", gap: "8px"
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: "14px", height: "14px", border: "2px solid #ffffff44", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  Humanizing...
                </>
              ) : "Humanize →"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="fade-in" style={{
            background: "#1f0a0a", border: "1px solid #7f1d1d",
            borderRadius: "8px", padding: "14px 18px",
            color: "#fca5a5", fontSize: "14px", marginBottom: "24px"
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="fade-in">

            {/* Score */}
            <div style={{
              background: "#0f1117", border: "1px solid #1f2937",
              borderRadius: "12px", padding: "24px 32px",
              display: "flex", justifyContent: "center", gap: "60px",
              alignItems: "center", marginBottom: "24px", flexWrap: "wrap"
            }}>
              <AIScore score={result.score_before} label="Before" />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{ fontSize: "24px", color: "#4b5563" }}>→</div>
                <div style={{ fontSize: "11px", color: "#4b5563", fontFamily: "'DM Mono', monospace" }}>AI score</div>
              </div>
              <AIScore score={result.score_after} label="After" />
            </div>

            {/* Output */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <label style={{ fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", fontFamily: "'DM Mono', monospace" }}>
                  Humanized output
                </label>
                <button className="btn-copy" onClick={copyOutput} style={{
                  background: "#161b27", border: "1px solid #1f2937",
                  borderRadius: "6px", padding: "6px 14px",
                  color: copied ? "#4ade80" : "#9ca3af",
                  fontSize: "12px", cursor: "pointer",
                  fontFamily: "'DM Mono', monospace", transition: "all 0.2s"
                }}>
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <div style={{
                background: "#0d1f17", border: "1px solid #14532d44",
                borderRadius: "12px", padding: "20px",
                fontSize: "14px", lineHeight: "1.8", color: "#d1fae5",
                whiteSpace: "pre-wrap"
              }}>
                {result.humanized}
              </div>
            </div>

            {/* Changes */}
            <div style={{ background: "#0f1117", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7280", fontFamily: "'DM Mono', monospace", marginBottom: "14px" }}>
                What changed
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {result.changes?.map((change, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span style={{ color: "#7c3aed", fontSize: "12px", marginTop: "3px", flexShrink: 0, fontFamily: "'DM Mono', monospace" }}>—</span>
                    <span style={{ fontSize: "13px", color: "#9ca3af", lineHeight: "1.6" }}>{change}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
