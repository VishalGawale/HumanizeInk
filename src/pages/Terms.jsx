export default function Terms() {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: `By accessing and using humanizer.ink, you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our service.

We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms.`
    },
    {
      title: "Use of the Service",
      content: `humanizer.ink provides an AI-powered text humanization service. You may use this service to:

• Rewrite AI-generated text to sound more natural
• Improve the readability and flow of your writing
• Analyze the human-likeness of text

You may NOT use this service to:

• Submit content that is illegal, harmful, or violates the rights of others
• Attempt to circumvent academic integrity policies in a way that constitutes academic fraud
• Reverse engineer, copy, or replicate our service or its underlying technology
• Use automated tools to make bulk requests beyond normal usage`
    },
    {
      title: "Free Usage Limits",
      content: `The free tier of humanizer.ink allows:

• 3 humanizations per day without an account
• 20 humanizations per day with a free account

These limits are enforced to ensure fair access for all users and to manage our operating costs. We reserve the right to change these limits at any time.`
    },
    {
      title: "Content and Intellectual Property",
      content: `You retain full ownership of any text you submit to humanizer.ink. We do not claim any rights to your content.

The humanizer.ink service, including its design, code, and underlying technology, is owned by humanizer.ink. You may not copy, reproduce, or distribute any part of the service without our written permission.

The humanized output you receive is yours to use freely for any lawful purpose.`
    },
    {
      title: "Disclaimer of Warranties",
      content: `humanizer.ink is provided "as is" without any warranties, express or implied. We do not guarantee:

• That the service will always be available or error-free
• That the humanized output will pass any specific AI detection tool
• That the output will be suitable for any particular purpose

Use of the service is at your own risk.`
    },
    {
      title: "Limitation of Liability",
      content: `To the fullest extent permitted by law, humanizer.ink and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.

Our total liability for any claim shall not exceed the amount you paid us in the 12 months prior to the claim (which for free users is €0).`
    },
    {
      title: "Governing Law",
      content: `These terms are governed by the laws of Germany. Any disputes shall be resolved in the courts of Munich, Germany.

If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full effect.`
    },
    {
      title: "Contact",
      content: `If you have questions about these Terms of Use, please contact us at:

Email: hello@humanizer.ink
Website: humanizer.ink

These terms were last updated in March 2026.`
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
          Terms of <span style={{ color: "#7c3aed" }}>Use</span>
        </h1>
        <p style={{ fontSize: "15px", color: "#6b7280", fontFamily: "'DM Mono', monospace" }}>
          Last updated: March 2026
        </p>
      </div>

      {/* Intro */}
      <div style={{ background: "#0f1117", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px 24px", marginBottom: "40px" }}>
        <p style={{ fontSize: "14px", color: "#9ca3af", lineHeight: "1.7" }}>
          Please read these terms carefully before using humanizer.ink. These terms govern your use of our service and form a legal agreement between you and humanizer.ink.
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
