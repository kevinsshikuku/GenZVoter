"use client";

const G = {
  dark:    "var(--green-dark)",
  mid:     "var(--green-mid)",
  gold:    "var(--gold)",
  bg:      "var(--bg)",
  surface: "var(--surface)",
  text:    "var(--text)",
  text2:   "var(--text2)",
  muted:   "var(--muted)",
  subtle:  "var(--subtle)",
  border:  "var(--border)",
};

const LINKS = [
  { label: "IEBC Verify Status",      url: "https://verify.iebc.or.ke",                          icon: "🔍" },
  { label: "Registration Centres",    url: "https://kiongozi.online/iebc-constituency-offices",   icon: "📍" },
  { label: "How to Register",         url: "https://www.iebc.or.ke/registration/?how",            icon: "📋" },
  { label: "IEBC News & Dates",       url: "https://www.iebc.or.ke/news/?Register_Today",         icon: "📰" },
];

export default function InfoTab() {
  return (
    <div style={{ height: "100%", overflowY: "auto", background: G.bg, padding: "24px 20px 40px" }} className="no-scrollbar">

      {/* App identity */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 900, color: G.text, margin: "0 0 4px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
          Target ni 8 Million GenZs to Vote
        </h1>
        <p style={{ fontSize: "13px", color: G.muted, margin: 0, fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: 1.5 }}>
          Register. Show up. Change the game.
        </p>
      </div>

      {/* Support / Buy us cabbage */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: G.muted, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
          Support the App
        </p>
        <div style={{
          background: G.surface, border: `1.5px solid ${G.dark}`,
          borderRadius: "12px", padding: "16px",
          display: "flex", flexDirection: "column", gap: "10px",
        }}>
          <p style={{ fontSize: "14px", color: G.text, margin: 0, fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: 1.5 }}>
            Za cabbage tulipie server costs 🥬<br />
            <span style={{ fontSize: "12px", color: G.muted }}>Anything helps — hata 10 bob.</span>
          </p>
          <div style={{
            background: G.bg, borderRadius: "8px",
            padding: "12px 14px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <p style={{ fontSize: "11px", color: G.muted, margin: "0 0 2px", fontFamily: "system-ui, -apple-system, sans-serif", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>M-Pesa</p>
              <p style={{ fontSize: "22px", fontWeight: 900, color: G.dark, margin: 0, fontFamily: "system-ui, -apple-system, sans-serif", letterSpacing: "0.04em" }}>0113 201 208</p>
            </div>
            <button
              onClick={() => navigator.clipboard?.writeText("0113201208")}
              style={{
                background: G.dark, border: "none", borderRadius: "8px",
                color: "#fff", fontSize: "12px", fontWeight: 700,
                padding: "8px 14px", cursor: "pointer",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* Official links */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: G.muted, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
          Official IEBC Links
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 14px", borderRadius: "10px",
                background: G.surface, border: `1px solid ${G.border}`,
                textDecoration: "none", color: G.text,
                fontFamily: "system-ui, -apple-system, sans-serif",
                transition: "opacity 0.15s",
              }}
            >
              <span style={{ fontSize: "18px", flexShrink: 0 }}>{link.icon}</span>
              <span style={{ fontSize: "13px", fontWeight: 600 }}>{link.label}</span>
              <span style={{ marginLeft: "auto", fontSize: "11px", color: G.subtle }}>↗</span>
            </a>
          ))}
        </div>
      </div>

      {/* About */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: G.muted, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
          About
        </p>
        <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "10px", padding: "14px 16px" }}>
          <p style={{ fontSize: "13px", color: G.text2, margin: 0, lineHeight: 1.6, fontFamily: "system-ui, -apple-system, sans-serif" }}>
            GenZ Voter is a civic tech app built to mobilise Kenyan youth to register and vote in the 2027 general elections. You are the sponsor. Share with friends. Just Kura.
          </p>
        </div>
      </div>

      {/* Version */}
      <p style={{ textAlign: "center", fontSize: "11px", color: G.subtle, fontFamily: "system-ui, -apple-system, sans-serif", margin: 0 }}>
        v1.0.0 · Data: IEBC 2026
      </p>
    </div>
  );
}
