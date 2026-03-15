import { Link } from "react-router-dom";

export default function About() {
  return (
    <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto", padding: "60px 24px 80px" }}>

      {/* Header */}
      <div style={{ marginBottom: "60px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#7c3aed15", border: "1px solid #7c3aed33", borderRadius: "20px", padding: "5px 14px", marginBottom: "20px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#7c3aed", boxShadow: "0 0 8px #7c3aed" }} />
          <span style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#a78bfa", fontFamily: "'DM Mono', monospace" }}>About Us</span>
        </div>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: "700", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "20px" }}>
          We make AI writing<br /><span style={{ color: "#7c3aed" }}>sound human.</span>
        </h1>
        <p style={{ fontSize: "17px", color: "#9ca3af", lineHeight: "1.7", maxWidth: "600px" }}>
          Humanizer.ink was built because every other humanizer tool was a black box. You'd paste text, get something back, and have no idea what changed or why. We thought that was wrong.
        </p>
      </div>

      {/* Sections */}
      {[
        {
          number: "01",
          title: "What we do differently",
          content: "Every other tool just rewrites your text and calls it done. We show you exactly what we changed and why — which phrases were AI-sounding, what patterns we removed, and how much more human your text scores after. You don't just get better text. You learn to write better yourself.",
        },
        {
          number: "02",
          title: "Why we built this",
          content: "AI writing tools are everywhere now. That's great for productivity. But the writing they produce has tells — specific patterns that scream 'a robot wrote this.' We built a tool based on real documented research into what makes AI writing detectable, and turned that into something anyone can use for free.",
        },
        {
          number: "03",
          title: "Our philosophy",
          content: "Good writing isn't about tricking detectors. It's about actually communicating well — with rhythm, specificity, and a real point of view. Our tool doesn't just remove AI patterns. It pushes toward writing that has personality, varies its rhythm, and says something concrete instead of vague.",
        },
        {
          number: "04",
          title: "Always free to start",
          content: "Three free humanizations per day, no account required. Sign up for more. We believe the tool should prove its value before asking anything from you. If it doesn't help, don't use it. If it does, tell someone.",
        },
      ].map((section, i) => (
        <div key={i} style={{ display: "flex", gap: "24px", marginBottom: "48px", paddingBottom: "48px", borderBottom: i < 3 ? "1px solid #1f2937" : "none" }}>
          <div style={{ fontSize: "11px", color: "#7c3aed", fontFamily: "'DM Mono', monospace", fontWeight: "600", paddingTop: "4px", flexShrink: 0, width: "28px" }}>{section.number}</div>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "12px", letterSpacing: "-0.01em" }}>{section.title}</h2>
            <p style={{ fontSize: "15px", color: "#9ca3af", lineHeight: "1.8" }}>{section.content}</p>
          </div>
        </div>
      ))}

      {/* CTA */}
      <div style={{ background: "#7c3aed12", border: "1px solid #7c3aed33", borderRadius: "16px", padding: "32px", textAlign: "center" }}>
        <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "10px" }}>Try it yourself</h3>
        <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "20px" }}>No signup required. Paste your text and see what changes.</p>
        <Link to="/" style={{
          background: "#7c3aed", border: "none", borderRadius: "8px",
          padding: "12px 28px", color: "#fff", fontSize: "14px",
          fontWeight: "600", textDecoration: "none", display: "inline-block",
        }}>
          Start Humanizing →
        </Link>
      </div>
    </div>
  );
}
