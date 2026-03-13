"use client";

import { useState } from "react";
import { REQUIREMENTS, GAME_LEVELS } from "@/lib/data";

function CheckIcon({ size = 24, color = "#16a34a" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2.5 C17.6 2.3 21.5 6.4 21.6 12 C21.7 17.7 17.8 21.8 12 21.7 C6.3 21.6 2.4 17.5 2.3 11.9 C2.2 6.3 6.4 2.7 12 2.5" stroke={color} strokeWidth="2.1" strokeLinecap="round" />
      <path d="M7.5 12.2 C9 13.6 10.4 15.1 11.3 16 C13.2 13.4 15.6 10.8 17.1 9.2" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon({ size = 24, color = "#16a34a" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4.5 12.1 C8.8 12 15.2 12 19.5 12" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M14.8 7.5 C16.5 9.2 18.5 11 19.5 12.1 C18.4 13.2 16.4 15.1 14.8 16.6" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VoteBoxIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4.2 10.5 L4 19.8 C4 21 5 21.8 6.1 21.9 L17.9 21.8 C19.1 21.8 20 21 20.1 19.7 L19.9 10.4" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 10.6 L21.5 10.5" stroke={color} strokeWidth="2.1" strokeLinecap="round" />
      <path d="M9.5 2.5 L7.2 10.5 M14.5 2.5 L16.8 10.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M9.5 2.4 L14.5 2.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

type Screen = "status" | "requirements" | "quest";

const SCREENS: { id: Screen; label: string; icon: string }[] = [
  { id: "status",       label: "Am I Reg?",   icon: "🔍" },
  { id: "requirements", label: "What I Need", icon: "📋" },
  { id: "quest",        label: "Quest",       icon: "🎮" },
];

/* Shared style tokens — all backed by CSS custom properties */
const G = {
  dark:   "var(--green-dark)",
  mid:    "var(--green-mid)",
  light:  "var(--green-light)",
  pale:   "var(--green-pale)",
  gold:   "var(--gold)",
  border: "var(--border)",
  border2:"var(--border2)",
  bg:     "var(--bg)",
  surface:"var(--surface)",
  text:   "var(--text)",
  muted:  "var(--muted)",
  subtle: "var(--subtle)",
};

export default function MobileRegisterPage() {
  const [screen, setScreen] = useState<Screen>("status");
  const [showWebview, setShowWebview] = useState(false);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: G.bg, overflow: "hidden" }}>

      {/* IEBC webview — bottom cleared for sticky nav */}
      {showWebview && (
        <div style={{
          position: "fixed", top: 0, left: "50%",
          transform: "translateX(-50%)",
          width: "100%", maxWidth: "430px", bottom: "72px",
          background: "#fff", zIndex: 90,
          display: "flex", flexDirection: "column",
        }}>
          {/* Native-style browser bar */}
          <div style={{
            padding: "10px 14px",
            background: G.dark,
            display: "flex", alignItems: "center", gap: "10px", flexShrink: 0,
          }}>
            <button
              onClick={() => setShowWebview(false)}
              style={{
                background: "rgba(255,255,255,0.15)", border: "none",
                color: "#fff", fontSize: "13px", fontWeight: 700,
                cursor: "pointer", padding: "6px 12px", borderRadius: "8px",
              }}
            >
              ← Back
            </button>
            <div style={{
              flex: 1, background: "rgba(255,255,255,0.12)",
              borderRadius: "8px", padding: "6px 12px",
              display: "flex", alignItems: "center", gap: "6px",
            }}>
              <span style={{ fontSize: "12px" }}>🔒</span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)" }}>verify.iebc.or.ke</span>
            </div>
          </div>
          <iframe
            src="https://verify.iebc.or.ke"
            style={{ flex: 1, border: "none", width: "100%" }}
            title="IEBC Voter Verification Portal"
          />
        </div>
      )}

      {/* Sub-nav tabs */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: G.surface,
        borderBottom: `1.5px solid ${G.border2}`,
        padding: "12px 14px 0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", gap: "0" }} className="no-scrollbar">
          {SCREENS.map((s) => (
            <button
              key={s.id}
              onClick={() => setScreen(s.id)}
              style={{
                flex: 1, padding: "8px 12px",
                borderRadius: "10px 10px 0 0", border: "none",
                background: "transparent",
                borderBottom: screen === s.id ? `3px solid ${G.dark}` : "3px solid transparent",
                color: screen === s.id ? G.dark : G.muted,
                fontSize: "13px", fontWeight: 600, cursor: "pointer",
                fontFamily: "system-ui, -apple-system, sans-serif",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease", whiteSpace: "nowrap",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" } as React.CSSProperties} key={screen} className="no-scrollbar slide-in">
        {screen === "status"       && <StatusScreen onOpenWebview={() => setShowWebview(true)} />}
        {screen === "requirements" && <RequirementsScreen onNavigate={setScreen} />}
        {screen === "quest"        && <QuestScreen />}
      </div>
    </div>
  );
}

/* ─── STATUS ─────────────────────────────────────────────────── */
function StatusScreen({ onOpenWebview }: { onOpenWebview: () => void }) {
  return (
    <div style={{ padding: "28px 20px", display: "flex", flexDirection: "column", gap: "18px" }}>
      <div>
        <h1 style={{ fontSize: "28px", fontWeight: 900, color: G.text, margin: "0 0 4px", lineHeight: 1.1 }}>
          Am I Registered?
        </h1>
        <p style={{ fontSize: "14px", color: G.muted, margin: 0 }}>
          Chapia wasee...
        </p>
      </div>

      {/* Card — no background/border, content only */}
      <div style={{ padding: "0" }}>
        {[
          { icon: "🪪", label: "ID Number", sub: "National ID ama Passport No." },
          { icon: "🎂", label: "Date of Birth", sub: "Date ya kuzaliwa" },
        ].map((item) => (
          <div key={item.label} style={{
            display: "flex", alignItems: "center", gap: "12px",
            background: G.pale, borderRadius: "12px", padding: "12px 14px",
            marginBottom: "10px", border: `1px solid ${G.border}`,
          }}>
            <span style={{ fontSize: "22px" }}>{item.icon}</span>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 700, color: G.text, margin: 0 }}>{item.label}</p>
              <p style={{ fontSize: "12px", color: G.muted, margin: 0 }}>{item.sub}</p>
            </div>
          </div>
        ))}

        <button
          onClick={onOpenWebview}
          style={{
            width: "100%", padding: "16px", background: G.dark,
            border: "none", borderRadius: "14px", color: "#fff",
            fontSize: "16px", fontWeight: 800, cursor: "pointer",
            marginTop: "6px", letterSpacing: "0.03em",
            boxShadow: "0 3px 14px rgba(26,58,16,0.3)",
          }}
        >
          Cheki &gt;
        </button>
      </div>

      <p style={{ textAlign: "center", fontSize: "12px", color: G.subtle }}>
        Powered by IEBC official portal
      </p>
    </div>
  );
}

/* ─── REQUIREMENTS ───────────────────────────────────────────── */
function RequirementsScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [card, setCard] = useState<"register" | "vote">("register");
  const isReg = card === "register";

  return (
    <div style={{ padding: "28px 20px", background: G.bg, display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Toggle */}
      <div style={{ display: "flex", gap: "10px" }}>
        {(["register", "vote"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setCard(t)}
            style={{
              flex: 1, padding: "11px 8px", borderRadius: "12px",
              border: `2px solid ${card === t ? G.dark : G.border}`,
              background: card === t ? G.pale : G.surface,
              color: card === t ? G.dark : G.muted,
              fontWeight: 800, fontSize: "13px", cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {t === "register" ? "🖐️ Register" : <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}><VoteBoxIcon size={18} color="currentColor" />Vote</span>}
          </button>
        ))}
      </div>

      {/* Card */}
      <div key={card} className="slide-in" style={{
        background: G.surface, border: `1.5px solid ${G.border2}`,
        borderRadius: "20px", padding: "26px 20px",
      }}>
        {isReg ? (
          <>
            <h2 style={{ fontSize: "22px", fontWeight: 900, color: G.text, margin: "0 0 2px" }}>Register:</h2>
            <p style={{ fontSize: "16px", fontWeight: 700, color: G.mid, margin: "0 0 20px" }}>Mambo ni Matatu...</p>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "18px" }}>
              {[{ icon: "🪪", label: "National ID" }, { icon: "🔞", label: "18+" }, { icon: "🧠", label: "Akili" }].map((item) => (
                <div key={item.label} style={{ textAlign: "center", flex: 1 }}>
                  <div style={{
                    fontSize: "52px", marginBottom: "6px", lineHeight: 1,
                  }}>{item.icon}</div>
                  <p style={{ fontSize: "10px", color: G.muted, fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "14px", color: G.muted, textAlign: "center", margin: "0 0 22px", lineHeight: 1.5 }}>
              National ID or valid passport. Not registered elsewhere.
            </p>
          </>
        ) : (
          <>
            <p style={{ fontSize: "18px", fontWeight: 800, color: "#16a34a", margin: "0 0 18px", display: "flex", alignItems: "center", gap: "6px" }}>Voting ni easy! <CheckIcon size={20} color="#16a34a" /></p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "16px" }}>
              {[{ icon: "🪪" }, { arrow: true }, { check: true }].map((item, i) =>
                "arrow" in item ? (
                  <ArrowRightIcon key={i} size={28} color="#16a34a" />
                ) : "check" in item ? (
                  <CheckIcon key={i} size={64} color="#16a34a" />
                ) : (
                  <div key={i} style={{ width: "64px", height: "64px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "56px", lineHeight: 1 }}>{(item as {icon: string}).icon}</div>
                )
              )}
            </div>
            <p style={{ fontSize: "14px", color: G.muted, textAlign: "center", margin: "0 0 20px", lineHeight: 1.6 }}>
              Twanga ID au passport kwa polling station.<br />
              <strong style={{ color: "#16a34a" }}>Slip si lazima.</strong>
            </p>
          </>
        )}

        <button
          onClick={() => isReg ? setCard("vote") : onNavigate("quest")}
          style={{
            width: "100%", padding: "16px", background: G.dark,
            border: "none", borderRadius: "14px", color: "#fff",
            fontSize: "15px", fontWeight: 800, cursor: "pointer",
            letterSpacing: "0.06em", boxShadow: "0 3px 14px rgba(26,58,16,0.3)",
          }}
        >
          SAWA TUENDE →
        </button>
      </div>

      {/* suppress unused import */}
      {REQUIREMENTS && null}
    </div>
  );
}

/* ─── QUEST ──────────────────────────────────────────────────── */
function QuestScreen() {
  const [completedLevels, setCompletedLevels] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try { const s = localStorage.getItem("genz-voter-progress"); return s ? JSON.parse(s).completed || [] : []; }
    catch { return []; }
  });
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const [totalXP, setTotalXP] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    try { const s = localStorage.getItem("genz-voter-progress"); return s ? JSON.parse(s).xp || 0 : 0; }
    catch { return 0; }
  });
  const [pledged, setPledged] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("genz-voter-pledge");
  });

  const maxXP = GAME_LEVELS.reduce((s, l) => s + l.xp, 0);
  const pct = Math.round((totalXP / maxXP) * 100);

  const completeLevel = (level: (typeof GAME_LEVELS)[0]) => {
    if (completedLevels.includes(level.id)) return;
    const nc = [...completedLevels, level.id];
    const nx = totalXP + level.xp;
    setCompletedLevels(nc);
    setTotalXP(nx);
    localStorage.setItem("genz-voter-progress", JSON.stringify({ completed: nc, xp: nx }));
    import("canvas-confetti").then((m) =>
      m.default({ particleCount: 60, spread: 55, origin: { y: 0.5 }, colors: [G.dark, G.gold, "#16a34a", "#dc2626"] })
    );
  };

  const handlePledge = () => {
    localStorage.setItem("genz-voter-pledge", "true");
    setPledged(true);
    import("canvas-confetti").then((m) =>
      m.default({ particleCount: 150, spread: 100, origin: { y: 0.4 }, colors: [G.dark, G.mid, G.gold, "#dc2626", "#1d4ed8"] })
    );
  };

  return (
    <div style={{ padding: "24px 20px", background: G.bg }}>
      <h1 style={{ fontSize: "24px", fontWeight: 900, color: G.text, margin: "0 0 2px" }}>Registration Quest 🎮</h1>
      <p style={{ fontSize: "13px", color: G.muted, margin: "0 0 16px" }}>4 levels. Less steps than creating a TikTok account.</p>

      {/* Progress */}
      <div style={{ background: G.surface, border: `1.5px solid ${G.border2}`, borderRadius: "16px", padding: "14px 16px", marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "13px", fontWeight: 700, color: G.muted }}>
            Adulting Ni Gome Tu! <span style={{ color: pct === 100 ? "#16a34a" : G.dark }}>{pct}%</span>
          </span>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#b87800" }}>⚡ {totalXP} XP</span>
        </div>
        <div style={{ height: "8px", background: G.border2, borderRadius: "4px", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: pct === 100 ? "linear-gradient(90deg, #166534, #22c55e)" : `linear-gradient(90deg, ${G.dark}, ${G.light})`,
            borderRadius: "4px", transition: "width 0.6s ease",
          }} />
        </div>
        {/* Progress dots */}
        <div style={{ display: "flex", gap: "6px", marginTop: "8px", justifyContent: "center" }}>
          {GAME_LEVELS.map((l) => (
            <div key={l.id} style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: completedLevels.includes(l.id) ? G.light : G.border,
              transition: "background 0.3s ease",
            }} />
          ))}
        </div>
      </div>

      {/* Levels */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "18px" }}>
        {GAME_LEVELS.map((level, idx) => {
          const isCompleted = completedLevels.includes(level.id);
          const isLocked = idx > 0 && !completedLevels.includes(GAME_LEVELS[idx - 1].id);
          const isActive = activeLevel === level.id;

          return (
            <div
              key={level.id}
              onClick={() => !isLocked && setActiveLevel(isActive ? null : level.id)}
              style={{
                background: isCompleted ? "#f0fdf4" : G.surface,
                border: `1.5px solid ${isCompleted ? "#bbf7d0" : isLocked ? G.border2 : G.dark}`,
                borderRadius: "14px", padding: "14px 16px",
                cursor: isLocked ? "not-allowed" : "pointer",
                opacity: isLocked ? 0.5 : 1,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: isCompleted ? "#dcfce7" : isLocked ? G.border2 : G.pale,
                  border: `1.5px solid ${isCompleted ? "#bbf7d0" : isLocked ? G.border : G.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "22px", flexShrink: 0,
                }}>
                  {isLocked ? "🔒" : isCompleted ? "✅" : level.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "10px", fontWeight: 800, color: isCompleted ? "#16a34a" : G.dark, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      Level {level.id}
                    </span>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#b87800" }}>+{level.xp} XP</span>
                  </div>
                  <p style={{ fontSize: "15px", fontWeight: 800, color: isLocked ? G.muted : G.text, margin: "1px 0 0" }}>
                    {level.title.toUpperCase()}
                  </p>
                </div>
              </div>

              {isActive && !isLocked && (
                <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: `1px solid ${G.border2}` }}>
                  <ol style={{ paddingLeft: "18px", margin: "0 0 12px", color: G.muted }}>
                    {level.steps.map((step, i) => (
                      <li key={i} style={{ fontSize: "13px", marginBottom: "6px", lineHeight: 1.5 }}>{step}</li>
                    ))}
                  </ol>
                  {level.note && (
                    <div style={{ background: "#fef9c3", border: "1px solid #fde68a", borderRadius: "10px", padding: "10px 12px", marginBottom: "12px" }}>
                      <p style={{ fontSize: "12px", color: "#854d0e", margin: 0, lineHeight: 1.5 }}>💡 {level.note}</p>
                    </div>
                  )}
                  {!isCompleted && (
                    <button
                      onClick={(e) => { e.stopPropagation(); completeLevel(level); }}
                      style={{
                        width: "100%", padding: "13px", background: G.dark,
                        border: "none", borderRadius: "12px",
                        color: "#fff", fontSize: "14px", fontWeight: 800, cursor: "pointer",
                      }}
                    >
                      Mark Level {level.id} Done ✅
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pledge */}
      {pledged ? (
        <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: "16px", padding: "20px", textAlign: "center" }}>
          <p style={{ fontSize: "28px", margin: "0 0 8px" }}>🎉</p>
          <p style={{ fontSize: "16px", fontWeight: 800, color: G.text, margin: "0 0 5px" }}>Umesign! Respect. 🫡</p>
          <p style={{ fontSize: "13px", color: G.muted, margin: "0 0 14px" }}>Screenshot hii na utume squad yako.</p>
          <button
            onClick={() => {
              if (navigator.share) navigator.share({ title: "GenZ Voter 2027", text: "Nimejicommit kupiga kura 2027. Toke na mbogi 👀", url: window.location.origin });
            }}
            style={{ padding: "12px 20px", background: G.dark, border: "none", borderRadius: "12px", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
          >
            Share to Squad 💬
          </button>
        </div>
      ) : (
        <button
          onClick={handlePledge}
          className="pulse-ring"
          style={{
            width: "100%", padding: "18px", background: G.dark,
            border: "none", borderRadius: "16px", color: "#fff",
            fontSize: "15px", fontWeight: 800, cursor: "pointer",
            boxShadow: "0 5px 20px rgba(26,58,16,0.35)", letterSpacing: "0.04em",
          }}
        >
          Sawa, Nitaenda Kupiga Kura 2027 🗳️
        </button>
      )}
    </div>
  );
}
