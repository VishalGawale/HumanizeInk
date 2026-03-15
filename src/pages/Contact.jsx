import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Opens email client with prefilled content
    const mailto = `mailto:hello@humanizer.ink?subject=${encodeURIComponent(form.subject || "Contact from humanizer.ink")}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    window.location.href = mailto;
    setSent(true);
  };

  return (
    <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto", padding: "60px 24px 80px" }}>

      {/* Header */}
      <div style={{ marginBottom: "48px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#7c3aed15", border: "1px solid #7c3aed33", borderRadius: "20px", padding: "5px 14px", marginBottom: "20px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#7c3aed", boxShadow: "0 0 8px #7c3aed" }} />
          <span style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#a78bfa", fontFamily: "'DM Mono', monospace" }}>Contact Us</span>
        </div>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "700", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "14px" }}>
          Get in <span style={{ color: "#7c3aed" }}>touch.</span>
        </h1>
        <p style={{ fontSize: "16px", color: "#9ca3af", lineHeight: "1.6" }}>
          Have a question, feedback, or just want to say hi? We'd love to hear from you.
        </p>
      </div>

      <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>

        {/* Contact info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", minWidth: "200px" }}>
          {[
            { icon: "✉", label: "Email", value: "hello@humanizer.ink", href: "mailto:hello@humanizer.ink" },
            { icon: "🌐", label: "Website", value: "humanizer.ink", href: "https://humanizer.ink" },
            { icon: "📍", label: "Based in", value: "Munich, Germany", href: null },
          ].map((item, i) => (
            <div key={i} style={{ background: "#0f1117", border: "1px solid #1f2937", borderRadius: "10px", padding: "16px" }}>
              <div style={{ fontSize: "18px", marginBottom: "6px" }}>{item.icon}</div>
              <div style={{ fontSize: "11px", color: "#4b5563", fontFamily: "'DM Mono', monospace", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.label}</div>
              {item.href ? (
                <a href={item.href} style={{ fontSize: "13px", color: "#a78bfa", textDecoration: "none" }}>{item.value}</a>
              ) : (
                <div style={{ fontSize: "13px", color: "#9ca3af" }}>{item.value}</div>
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{ flex: 1, minWidth: "280px" }}>
          {sent ? (
            <div style={{ background: "#0d1f17", border: "1px solid #4ade8033", borderRadius: "12px", padding: "32px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>✓</div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#4ade80", marginBottom: "8px" }}>Email client opened!</h3>
              <p style={{ fontSize: "13px", color: "#6b7280" }}>Your message is ready to send from your email client.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { key: "name", placeholder: "Your name", type: "text" },
                { key: "email", placeholder: "Your email", type: "email" },
                { key: "subject", placeholder: "Subject", type: "text" },
              ].map(field => (
                <input key={field.key} type={field.type} placeholder={field.placeholder} value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", background: "#0f1117", border: "1px solid #1f2937", color: "#e5e7eb", fontSize: "14px", fontFamily: "'DM Sans', system-ui", outline: "none" }}
                />
              ))}
              <textarea placeholder="Your message..." value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                rows={5} style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", background: "#0f1117", border: "1px solid #1f2937", color: "#e5e7eb", fontSize: "14px", fontFamily: "'DM Sans', system-ui", outline: "none", resize: "none" }}
              />
              <button type="submit" style={{ background: "#7c3aed", border: "none", borderRadius: "8px", padding: "12px", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "'DM Sans', system-ui" }}>
                Send Message →
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
