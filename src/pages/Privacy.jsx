export default function Privacy() {
  const sections = [
    {
      title: "Information We Collect",
      content: `We collect minimal information to operate the service:
      
• Usage data: We track how many humanizations you've used today using your browser's local storage. This data stays on your device and is never sent to our servers.

• Account data: If you create an account, we store your email address and authentication tokens via Supabase, our auth provider. We never store passwords in plain text.

• Session cookies: When you sign in, a session token is stored in your browser to keep you logged in. This is essential for the service to work.

• No tracking cookies: We do not use advertising cookies, analytics cookies, or any third-party tracking.`
    },
    {
      title: "How We Use Your Information",
      content: `We use the information we collect only to:

• Provide and improve the humanizer service
• Manage your account and usage limits
• Respond to your support requests sent to hello@humanizer.ink
• Ensure the security of our service

We do not sell, rent, or share your personal data with third parties for marketing purposes.`
    },
    {
      title: "Third-Party Services",
      content: `We use the following third-party services to operate humanizer.ink:

• Supabase: Handles user authentication and account management. Your email is stored securely on their servers. See Supabase's privacy policy at supabase.com/privacy.

• Groq: Processes the text you submit for humanization. Text you submit is sent to Groq's API for processing. See Groq's privacy policy at groq.com/privacy.

• Vercel: Hosts our website and serverless functions. See Vercel's privacy policy at vercel.com/legal/privacy-policy.

• Cloudflare: Provides DNS, CDN, and email routing services. See Cloudflare's privacy policy at cloudflare.com/privacypolicy.`
    },
    {
      title: "Data Retention",
      content: `• Usage counts reset daily and are stored only in your browser's local storage
• Account data is retained as long as your account exists
• You can delete your account at any time by contacting us at hello@humanizer.ink
• We will delete your data within 30 days of your request`
    },
    {
      title: "Your Rights (GDPR)",
      content: `As a user in the European Union, you have the following rights under GDPR:

• Right to access: You can request a copy of your personal data
• Right to rectification: You can ask us to correct inaccurate data
• Right to erasure: You can ask us to delete your personal data
• Right to portability: You can request your data in a machine-readable format
• Right to object: You can object to certain types of processing

To exercise any of these rights, contact us at hello@humanizer.ink`
    },
    {
      title: "Cookies",
      content: `We use the following cookies:

• Session cookie: Set when you sign in. Required for authentication. Expires when you sign out or after 7 days.
• Consent cookie: Stores your cookie consent preference. Expires after 1 year.

We do not use advertising cookies or third-party tracking cookies.`
    },
    {
      title: "Contact",
      content: `If you have any questions about this Privacy Policy or how we handle your data, please contact us at:

Email: hello@humanizer.ink
Website: humanizer.ink

This policy was last updated on March 2026.`
    },
  ];

  return (
    <div style={{ position: "relative", zIndex: 1, maxWidth: "760px", margin: "0 auto", padding: "60px 24px 80px" }}>

      {/* Header */}
      <div style={{ marginBottom: "48px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#7c3aed15", border: "1px solid #7c3aed33", borderRadius: "20px", padding: "5px 14px", marginBottom: "20px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#7c3aed", boxShadow: "0 0 8px #7c3aed" }} />
          <span style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#a78bfa", fontFamily: "'DM Mono', monospace" }}>Legal</span>
        </div>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "700", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "14px" }}>
          Privacy <span style={{ color: "#7c3aed" }}>Policy</span>
        </h1>
        <p style={{ fontSize: "15px", color: "#6b7280", fontFamily: "'DM Mono', monospace" }}>
          Last updated: March 2026
        </p>
      </div>

      {/* Intro */}
      <div style={{ background: "#0f1117", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px 24px", marginBottom: "40px" }}>
        <p style={{ fontSize: "14px", color: "#9ca3af", lineHeight: "1.7" }}>
          At humanizer.ink, we take your privacy seriously. This policy explains what data we collect, why we collect it, and how we use it. We've written this in plain language — no legal jargon.
        </p>
      </div>

      {/* Sections */}
      {sections.map((section, i) => (
        <div key={i} style={{ marginBottom: "40px", paddingBottom: "40px", borderBottom: i < sections.length - 1 ? "1px solid #1f2937" : "none" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "11px", color: "#7c3aed", fontFamily: "'DM Mono', monospace", fontWeight: "600" }}>{String(i + 1).padStart(2, "0")}</span>
            {section.title}
          </h2>
          <div style={{ fontSize: "14px", color: "#9ca3af", lineHeight: "1.8", whiteSpace: "pre-line" }}>
            {section.content}
          </div>
        </div>
      ))}
    </div>
  );
}
