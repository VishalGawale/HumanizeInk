import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "./supabase.js";


// ─── GLOBAL STYLES ────────────────────────────────────────
export const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=DM+Mono:wght@400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a0f; color: #e5e7eb; }
    textarea { resize: none; outline: none; }
    textarea:focus { border-color: #7c3aed !important; box-shadow: 0 0 0 3px #7c3aed15 !important; }
    input:focus { border-color: #7c3aed !important; outline: none; }
    .btn-primary:hover:not(:disabled) { background: #6d28d9 !important; transform: translateY(-1px); }
    .mode-btn:hover { border-color: #7c3aed44 !important; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
    .fade-in { animation: fadeIn 0.4s ease forwards; }
    .grid-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; background-image: linear-gradient(#ffffff06 1px, transparent 1px), linear-gradient(90deg, #ffffff06 1px, transparent 1px); background-size: 40px 40px; }
    .glow { position: fixed; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, #7c3aed15 0%, transparent 70%); pointer-events: none; z-index: 0; top: -200px; left: -100px; }
    .card { background: #0f1117; border: 1px solid #1f2937; border-radius: 12px; }
    @media (max-width: 768px) {
      .split { flex-direction: column !important; }
      .split > div { width: 100% !important; }
      .hide-mobile { display: none !important; }
      nav .nav-links { display: none !important; }
    }
    @media (max-width: 480px) {
      .mode-selector { gap: 4px !important; }
      .mode-selector button { padding: 6px 10px !important; font-size: 11px !important; }
      .score-card { flex-direction: column !important; align-items: flex-start !important; }
    }
  `}</style>
);

// ─── LANGUAGES ────────────────────────────────────────────
export const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
];

// ─── TRANSLATIONS ─────────────────────────────────────────
export const T = {
  en: { tagline: "Free AI Humanizer", headline: "Make it sound", human: "human.", desc: "Paste AI text. Get a human rewrite with an AI score and a full breakdown of every change.", humanize: "Humanize →", humanizing: "Humanizing...", yourText: "Your text", output: "Humanized output", loadSample: "Load sample →", copy: "Copy", copied: "✓ Copied", signIn: "Sign in", signUp: "Sign up free", signOut: "Sign out", usesLeft: "uses left today", noUses: "No uses left today", guest: "guest" },
  de: { tagline: "Kostenloser KI-Humanisierer", headline: "Klingt wie ein", human: "Mensch.", desc: "KI-Text einfügen. Menschliches Ergebnis mit KI-Score erhalten.", humanize: "Humanisieren →", humanizing: "Verarbeitung...", yourText: "Ihr Text", output: "Humanisierte Ausgabe", loadSample: "Beispiel laden →", copy: "Kopieren", copied: "✓ Kopiert", signIn: "Anmelden", signUp: "Kostenlos registrieren", signOut: "Abmelden", usesLeft: "Nutzungen heute übrig", noUses: "Keine Nutzungen mehr heute", guest: "Gast" },
  fr: { tagline: "Humaniseur IA Gratuit", headline: "Rendez-le", human: "humain.", desc: "Collez le texte IA. Obtenez une réécriture humaine avec un score.", humanize: "Humaniser →", humanizing: "En cours...", yourText: "Votre texte", output: "Résultat humanisé", loadSample: "Charger exemple →", copy: "Copier", copied: "✓ Copié", signIn: "Connexion", signUp: "S'inscrire gratuitement", signOut: "Déconnexion", usesLeft: "utilisations restantes", noUses: "Plus d'utilisations aujourd'hui", guest: "invité" },
  es: { tagline: "Humanizador IA Gratuito", headline: "Hazlo sonar", human: "humano.", desc: "Pega texto de IA. Obtén una reescritura humana con puntuación.", humanize: "Humanizar →", humanizing: "Procesando...", yourText: "Tu texto", output: "Resultado humanizado", loadSample: "Cargar ejemplo →", copy: "Copiar", copied: "✓ Copiado", signIn: "Iniciar sesión", signUp: "Registrarse gratis", signOut: "Cerrar sesión", usesLeft: "usos restantes hoy", noUses: "Sin usos hoy", guest: "invitado" },
};

// Fallback to English for missing languages
export function t(lang, key) {
  return (T[lang] || T.en)[key] || T.en[key] || key;
}

// ─── LANGUAGE SELECTOR ────────────────────────────────────
export const LanguageSelector = ({ lang, setLang }) => {
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        background: "transparent", border: "1px solid #1f2937",
        borderRadius: "7px", padding: "6px 10px",
        color: "#9ca3af", fontSize: "13px", cursor: "pointer",
        display: "flex", alignItems: "center", gap: "6px",
        fontFamily: "'DM Sans', system-ui", transition: "border-color 0.2s",
      }}
        onMouseOver={e => e.currentTarget.style.borderColor = "#7c3aed"}
        onMouseOut={e => e.currentTarget.style.borderColor = "#1f2937"}
      >
        <span style={{ fontSize: "16px" }}>🌐</span>
        <span style={{ fontSize: "12px" }}>{current.flag}</span>
        <span style={{ fontSize: "11px", fontFamily: "'DM Mono', monospace" }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", right: 0, top: "calc(100% + 8px)", zIndex: 100,
          background: "#0f1117", border: "1px solid #1f2937",
          borderRadius: "10px", padding: "6px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px",
          minWidth: "220px",
        }}>
          {LANGUAGES.map(l => (
            <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); }} style={{
              background: lang === l.code ? "#7c3aed22" : "transparent",
              border: `1px solid ${lang === l.code ? "#7c3aed44" : "transparent"}`,
              borderRadius: "6px", padding: "7px 10px",
              color: lang === l.code ? "#a78bfa" : "#9ca3af",
              fontSize: "12px", cursor: "pointer", textAlign: "left",
              display: "flex", alignItems: "center", gap: "7px",
              fontFamily: "'DM Sans', system-ui", transition: "all 0.15s",
            }}
              onMouseOver={e => { if (lang !== l.code) e.currentTarget.style.background = "#1f2937"; }}
              onMouseOut={e => { if (lang !== l.code) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: "14px" }}>{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── NAVBAR ───────────────────────────────────────────────
export const Navbar = ({ user, lang, setLang, usedToday, limit, onSignIn, onSignUp }) => {
  const location = useLocation();
  const remaining = limit - usedToday;
  const isLow = remaining <= 1;

  return (
    <nav style={{
      position: "relative", zIndex: 10,
      borderBottom: "1px solid #1f2937",
      background: "#0a0a0fcc", backdropFilter: "blur(10px)",
      padding: "0 16px",
    }}>
      <style>{`
        .nav-link { color: #6b7280; text-decoration: none; font-size: 13px; transition: color 0.2s; }
        .nav-link:hover { color: #a78bfa; }
        .nav-link.active { color: #a78bfa; }
        @media (max-width: 600px) {
          .nav-page-links { display: none !important; }
          .nav-auth-buttons { display: none !important; }
          .nav-badge-text { display: none !important; }
          .nav-badge { padding: 5px 8px !important; }
        }
      `}</style>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px", gap: "8px" }}>

        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", flexShrink: 0 }}>
          <div style={{ width: "26px", height: "26px", borderRadius: "7px", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>✍</div>
          <span style={{ fontSize: "15px", fontWeight: "700", letterSpacing: "-0.02em", color: "#e5e7eb" }}>humanizer<span style={{ color: "#7c3aed" }}>.ink</span></span>
        </Link>

        {/* Nav links — hidden on mobile */}
        <div className="nav-page-links" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link to="/about" className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}>About</Link>
          <Link to="/contact" className={`nav-link ${location.pathname === "/contact" ? "active" : ""}`}>Contact</Link>
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>

          {/* Usage badge — dot only on mobile */}
          <div className="nav-badge" style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: isLow ? "#1f0a0a" : "#0f1117",
            border: `1px solid ${isLow ? "#7f1d1d" : "#1f2937"}`,
            borderRadius: "20px", padding: "5px 10px",
            fontSize: "11px", fontFamily: "'DM Mono', monospace",
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: isLow ? "#f87171" : "#4ade80", boxShadow: isLow ? "0 0 6px #f87171" : "0 0 6px #4ade80", flexShrink: 0 }} />
            <span className="nav-badge-text" style={{ color: isLow ? "#fca5a5" : "#9ca3af", whiteSpace: "nowrap" }}>
              {remaining <= 0 ? "No uses left" : `${remaining} left`}
            </span>
          </div>

          <LanguageSelector lang={lang} setLang={setLang} />

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "11px", color: "#6b7280", fontFamily: "'DM Mono', monospace", maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email?.split("@")[0]}</span>
              <button onClick={async () => await supabase.auth.signOut()} style={{ background: "transparent", border: "1px solid #374151", borderRadius: "7px", padding: "5px 10px", color: "#6b7280", fontSize: "11px", cursor: "pointer", fontFamily: "'DM Sans', system-ui", whiteSpace: "nowrap" }}>
                Out
              </button>
            </div>
          ) : (
            <>
              <button className="nav-auth-buttons" onClick={onSignIn} style={{ background: "transparent", border: "1px solid #374151", borderRadius: "7px", padding: "6px 12px", color: "#9ca3af", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', system-ui", whiteSpace: "nowrap" }}>Sign in</button>
              <button onClick={onSignUp} style={{ background: "#7c3aed", border: "none", borderRadius: "7px", padding: "6px 12px", color: "#fff", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "'DM Sans', system-ui", whiteSpace: "nowrap" }}>Sign up</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// ─── FOOTER ───────────────────────────────────────────────
export const Footer = () => (
  <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid #1f2937", padding: "32px 24px" }}>
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "24px", marginBottom: "24px" }}>
        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>✍</div>
            <span style={{ fontSize: "15px", fontWeight: "700" }}>humanizer<span style={{ color: "#7c3aed" }}>.ink</span></span>
          </div>
          <p style={{ fontSize: "12px", color: "#4b5563", maxWidth: "220px", lineHeight: "1.6" }}>
            Make AI text sound human. Free, fast, explains every change.
          </p>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#374151", fontFamily: "'DM Mono', monospace", marginBottom: "10px" }}>Product</div>
            {[{ label: "Home", to: "/" }, { label: "About", to: "/about" }, { label: "Contact", to: "/contact" }].map(l => (
              <div key={l.label} style={{ marginBottom: "6px" }}>
                <Link to={l.to} style={{ fontSize: "13px", color: "#6b7280", textDecoration: "none" }}
                  onMouseOver={e => e.target.style.color = "#a78bfa"}
                  onMouseOut={e => e.target.style.color = "#6b7280"}
                >{l.label}</Link>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#374151", fontFamily: "'DM Mono', monospace", marginBottom: "10px" }}>Legal</div>
            {[{ label: "Privacy Policy", to: "/privacy" }, { label: "Terms of Use", to: "/terms" }].map(l => (
              <div key={l.label} style={{ marginBottom: "6px" }}>
                <Link to={l.to} style={{ fontSize: "13px", color: "#6b7280", textDecoration: "none" }}
                  onMouseOver={e => e.target.style.color = "#a78bfa"}
                  onMouseOut={e => e.target.style.color = "#6b7280"}
                >{l.label}</Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #1f2937", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ fontSize: "12px", color: "#374151", fontFamily: "'DM Mono', monospace" }}>
          © {new Date().getFullYear()} humanizer.ink — All rights reserved
        </div>
        <div style={{ fontSize: "12px", color: "#374151", fontFamily: "'DM Mono', monospace" }}>
          Built with ✍ in Munich
        </div>
      </div>
    </div>
  </footer>
);


// ─── FAQ SECTION ──────────────────────────────────────────
export const FAQ = () => {
  const [open, setOpen] = useState(null);

  const faqs = [
    {
      q: "What is an AI humanizer?",
      a: "An AI humanizer is a tool that rewrites AI-generated text to sound more natural and human. It removes patterns that make text sound robotic — like overused phrases, generic conclusions, and unnatural sentence structures — and replaces them with more natural alternatives."
    },
    {
      q: "Is humanizer.ink completely free?",
      a: "Yes. You get 3 free humanizations per day without any account. Sign up for a free account and you get 20 per day. No credit card required at any point."
    },
    {
      q: "How is humanizer.ink different from other AI humanizers?",
      a: "Most humanizer tools just rewrite your text without explaining anything. We show you exactly what changed and why — which patterns were AI-sounding, what we removed, and an AI score before and after. You learn from the tool, not just copy its output."
    },
    {
      q: "Will this bypass GPTZero or Turnitin?",
      a: "Our tool focuses on making writing genuinely better and more human — not on gaming specific detectors. Better, more natural writing tends to score lower on AI detectors, but we make no guarantees about passing any specific tool. Using this to submit AI work as your own in academic contexts may violate your institution's policies."
    },
    {
      q: "What languages does humanizer.ink support?",
      a: "You can paste text in any language and the AI will humanize it. The tool works best with English but handles German, French, Spanish, Italian, Portuguese, and other major languages well. Our UI is available in 12 languages via the language selector in the top right."
    },
    {
      q: "How does the AI score work?",
      a: "The AI score rates how AI-sounding your text is from 0 (sounds completely human) to 100 (pure AI slop). We calculate this based on the density of AI writing patterns like significance inflation, generic phrases, and unnatural sentence rhythm. After humanizing, your score should drop significantly."
    },
    {
      q: "Is my text stored or shared?",
      a: "No. Text you submit is sent to our AI provider for processing and is not stored on our servers. We do not log, sell, or share your content. See our Privacy Policy for full details."
    },
    {
      q: "What are the Fast, Standard, and Enhanced modes?",
      a: "Fast mode makes minimal changes — good for text that's almost there. Standard mode is a balanced rewrite that removes most AI patterns. Enhanced mode aggressively rewrites the whole text, changing structure and adding personality. Start with Standard and go Enhanced if you need more."
    },
  ];

  return (
    <div style={{ marginTop: "64px", paddingTop: "64px", borderTop: "1px solid #1f2937" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#7c3aed15", border: "1px solid #7c3aed33", borderRadius: "20px", padding: "5px 14px", marginBottom: "16px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#7c3aed", boxShadow: "0 0 8px #7c3aed" }} />
          <span style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#a78bfa", fontFamily: "'DM Mono', monospace" }}>FAQ</span>
        </div>
        <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: "700", letterSpacing: "-0.02em", marginBottom: "10px" }}>
          Frequently asked <span style={{ color: "#7c3aed" }}>questions</span>
        </h2>
        <p style={{ color: "#6b7280", fontSize: "14px" }}>Everything you need to know about humanizer.ink</p>
      </div>

      {/* FAQ items */}
      <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "8px" }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{
            background: "#0f1117",
            border: `1px solid ${open === i ? "#7c3aed44" : "#1f2937"}`,
            borderRadius: "10px",
            overflow: "hidden",
            transition: "border-color 0.2s",
          }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{
              width: "100%", padding: "16px 20px",
              background: "transparent", border: "none",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              cursor: "pointer", textAlign: "left", gap: "16px",
            }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: open === i ? "#a78bfa" : "#e5e7eb", lineHeight: "1.4" }}>
                {faq.q}
              </span>
              <span style={{
                fontSize: "18px", color: open === i ? "#7c3aed" : "#4b5563",
                flexShrink: 0, transition: "transform 0.2s",
                transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                display: "inline-block",
              }}>+</span>
            </button>
            {open === i && (
              <div style={{ padding: "0 20px 16px", fontSize: "14px", color: "#9ca3af", lineHeight: "1.7", borderTop: "1px solid #1f2937", paddingTop: "14px" }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── COOKIE BANNER ────────────────────────────────────────
export const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie_consent");
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
      zIndex: 999, maxWidth: "560px", width: "calc(100% - 48px)",
      background: "#0f1117", border: "1px solid #1f2937",
      borderRadius: "12px", padding: "16px 20px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap",
      animation: "slideUp 0.4s ease",
    }}>
      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }`}</style>
      <div style={{ fontSize: "12px", color: "#6b7280", flex: 1, lineHeight: "1.5", minWidth: "200px" }}>
        🍪 We use cookies for basic functionality and session management.{" "}
        <Link to="/privacy" style={{ color: "#7c3aed", textDecoration: "none" }}>Learn more</Link>
      </div>
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <button onClick={accept} style={{
          background: "#7c3aed", border: "none", borderRadius: "6px",
          padding: "7px 16px", color: "#fff", fontSize: "12px",
          fontWeight: "600", cursor: "pointer", fontFamily: "'DM Sans', system-ui",
        }}>Accept</button>
        <button onClick={() => setVisible(false)} style={{
          background: "transparent", border: "1px solid #374151", borderRadius: "6px",
          padding: "7px 16px", color: "#6b7280", fontSize: "12px",
          cursor: "pointer", fontFamily: "'DM Sans', system-ui",
        }}>Decline</button>
      </div>
    </div>
  );
};
