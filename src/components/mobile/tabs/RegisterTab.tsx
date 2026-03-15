"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { REQUIREMENTS, GAME_LEVELS, MYTH_CARDS } from "@/lib/data";
import BrushButton from "@/components/mobile/BrushButton";
import { useTheme } from "@/components/ThemeProvider";


type Screen = "status" | "requirements" | "myths";

const SCREENS: { id: Screen; label: string; icon: string }[] = [
  { id: "status",       label: "Am I Reg?",   icon: "🔍" },
  { id: "requirements", label: "What I Need", icon: "📋" },
  { id: "myths",        label: "Myths",        icon: "🃏" },
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

export default function RegisterTab() {
  const [screen, setScreen] = useState<Screen>("status");

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: G.bg, overflowX: "hidden", overflowY: screen === "requirements" ? "visible" : "hidden" }}>

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

      <div style={{ flex: 1, overflow: screen === "requirements" ? "hidden" : screen === "myths" ? "hidden" : "auto", WebkitOverflowScrolling: "touch", display: "flex", flexDirection: "column" } as React.CSSProperties} key={screen} className="no-scrollbar">
        {screen === "status"       && <StatusScreen />}
        {screen === "requirements" && <RequirementsScreen />}
        {screen === "myths"        && <MythsScreen />}
      </div>
    </div>
  );
}

/* ─── STATUS ─────────────────────────────────────────────────── */
function StatusScreen() {
  return (
    <div style={{ padding: "28px 20px", display: "flex", flexDirection: "column", gap: "0" }}>
      <div>
        <p style={{ fontSize: "14px", color: G.muted, margin: "0 0 2px" }}>
          Chapia wasee ni ...
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
            background: "transparent", borderRadius: "6px", padding: "6px 14px",
            marginBottom: "0",
          }}>
            <span style={{ fontSize: "22px" }}>{item.icon}</span>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 700, color: G.text, margin: 0 }}>{item.label}</p>
              <p style={{ fontSize: "12px", color: G.muted, margin: 0 }}>{item.sub}</p>
            </div>
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "center", marginTop: "6px" }}>
          <a
            href="https://verify.iebc.or.ke"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <BrushButton label="IEBC Portal ↗" onClick={() => {}} textColor="#22c55e" />
          </a>
        </div>
      </div>

      <p style={{ textAlign: "center", fontSize: "12px", color: G.subtle }}>
        Powered by IEBC official portal
      </p>
    </div>
  );
}

/* ─── REQUIREMENTS ───────────────────────────────────────────── */
function RequirementsScreen() {
  const [card, setCard] = useState<"register" | "vote">("register");
  const isReg = card === "register";

  return (
    <div style={{
      padding: "16px 20px 0",
      background: G.bg,
      display: "flex",
      flexDirection: "column",
      flex: 1,
      minHeight: 0,
      overflow: "hidden",
      gap: "10px",
    }}>
      {/* Toggle */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexShrink: 0 }}>
        {(["register", "vote"] as const).map((t) => (
          <BrushButton
            key={t}
            label={t === "register" ? "To Register" : "To Vote"}
            onClick={() => setCard(t)}
            variant="small"
            showArrow={false}
            inactive={card !== t}
          />
        ))}
      </div>

      {/* Card */}
      <div key={card} style={{
        padding: "4px 4px 0",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
      }}>
        {isReg ? (
          <>
            <h2 style={{ fontSize: "20px", fontWeight: 900, color: G.text, margin: "0 0 2px", flexShrink: 0 }}>Register:</h2>
            <p style={{ fontSize: "15px", fontWeight: 700, color: G.mid, margin: "0 0 10px", flexShrink: 0 }}>Mambo ni Matatu...</p>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", flexShrink: 0 }}>
              {[{ icon: "🪪", label: "National ID" }, { icon: "🔞", label: "18+" }, { icon: "🧠", label: "Akili" }].map((item) => (
                <div key={item.label} style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ fontSize: "42px", marginBottom: "4px", lineHeight: 1 }}>{item.icon}</div>
                  <p style={{ fontSize: "10px", color: G.muted, fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "13px", color: G.muted, textAlign: "center", margin: "0 0 8px", lineHeight: 1.4, flexShrink: 0 }}>
              National ID or valid passport. Not registered elsewhere.
            </p>
          </>
        ) : (
          <>
            <p style={{ fontSize: "18px", fontWeight: 800, color: "#16a34a", margin: "0 0 4px", flexShrink: 0 }}>Voting ni easy man!</p>
            <p style={{ fontSize: "13px", color: G.muted, textAlign: "center", margin: "0 0 8px", lineHeight: 1.5, flexShrink: 0 }}>
              Tokea na ID au passport kwa polling station.<br />
              <strong style={{ color: "#16a34a" }}>Slip si lazima.</strong>
            </p>
          </>
        )}

        {/* Image fills remaining space + extends 64px into nav spacer so no gap shows */}
        <div style={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          marginLeft: "-20px",
          marginRight: "-20px",
          marginBottom: "-64px",
          overflow: "hidden",
        }}>
          <Image
            src={isReg ? "/assets/Genz3.png" : "/assets/Genz2.png"}
            alt="Gen Z youth holding Kenyan flag"
            fill
            style={{
              objectFit: "cover",
              objectPosition: isReg ? "top center" : "center center",
              display: "block",
            }}
            priority
          />
        </div>
      </div>

      {/* suppress unused import */}
      {REQUIREMENTS && null}
    </div>
  );
}

/* ─── MYTHS ──────────────────────────────────────────────────── */
function MythsScreen() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const { theme } = useTheme();

  const shadow = "drop-shadow(0px 4px 10px rgba(0,0,0,0.28))";
  const cardFilter = shadow;
  const smallBtnFilter = theme === "dark" ? `invert(1) ${shadow}` : shadow;
  const darkCardBg: React.CSSProperties = theme === "dark" ? {
    backgroundImage: "url(/assets/BigDarkmodeButton.png)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "179% 439%",
    backgroundPosition: "50% 46%",
  } : {};

  const card = MYTH_CARDS[currentIdx];

  const goNext = () => {
    if (currentIdx < MYTH_CARDS.length - 1) {
      setFlipped(false);
      setTimeout(() => setCurrentIdx((i) => i + 1), 50);
    }
  };

  const goPrev = () => {
    if (currentIdx > 0) {
      setFlipped(false);
      setTimeout(() => setCurrentIdx((i) => i - 1), 50);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) { if (diff > 0) goNext(); else goPrev(); }
    touchStartX.current = null;
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "24px 20px", background: G.bg, overflow: "hidden" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

        {/* Card */}
        <div
          onClick={() => setFlipped(!flipped)}
          style={{ cursor: "pointer", position: "relative", height: "280px", marginLeft: "-20px", marginRight: "-20px", marginBottom: "-60px" }}
        >
          <div aria-hidden style={{ position: "absolute", inset: 0, filter: cardFilter, ...(theme === "dark" ? darkCardBg : { backgroundImage: "url(/assets/LightModeButton_btn.png)", backgroundSize: "100% 100%" }) }} />

          {/* MYTH face */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", padding: "24px 28px", textAlign: "center", opacity: flipped ? 0 : 1, transition: "opacity 0.2s ease", pointerEvents: flipped ? "none" : "auto" }}>
            <p style={{ fontSize: "clamp(14px, 4vw, 17px)", fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.3 }}>
              &ldquo;{card.myth}&rdquo;
            </p>
            <p style={{ fontSize: "11px", fontFamily: "var(--font-kalam)", color: "rgba(255,255,255,0.6)", margin: 0 }}>Tap to see the reality</p>
          </div>

          {/* REALITY face */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", padding: "24px 28px", textAlign: "center", opacity: flipped ? 1 : 0, transition: "opacity 0.2s ease", pointerEvents: flipped ? "auto" : "none" }}>
            <p style={{ fontSize: "clamp(13px, 3.8vw, 16px)", fontFamily: "var(--font-kalam)", color: "#ffffff", lineHeight: 1.5, margin: 0, whiteSpace: "pre-line" }}>
              {card.reality}
            </p>
            {card.stat && <p style={{ fontSize: "11px", fontFamily: "var(--font-kalam)", color: "#fde68a", margin: 0, fontWeight: 700 }}>{card.stat}</p>}
            <p style={{ fontSize: "11px", fontFamily: "var(--font-kalam)", color: "rgba(255,255,255,0.6)", margin: 0 }}>Tap to flip back</p>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {(["← Prev", flipped ? "Myth 🔄" : "Reality 🔄", "Next →"] as const).map((label, i) => {
            const isMiddle = i === 1;
            const isDisabled = (i === 0 && currentIdx === 0) || (i === 2 && currentIdx === MYTH_CARDS.length - 1);
            const handleClick = i === 0 ? goPrev : i === 2 ? goNext : () => setFlipped(!flipped);
            return (
              <div key={label} style={{ flex: isMiddle ? 1.4 : 1, position: "relative" }}>
                <Image src="/assets/SmallLightButton_btn.png" alt="" width={683} height={274} loading="eager" style={{ width: "100%", height: "auto", display: "block", filter: smallBtnFilter, opacity: isDisabled ? 0.35 : 1, transition: "opacity 0.2s ease" }} />
                <button onClick={isDisabled ? undefined : handleClick} disabled={isDisabled} style={{ position: "absolute", inset: 0, background: "none", border: "none", cursor: isDisabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(11px, 3vw, 13px)", fontFamily: "var(--font-kalam)", fontWeight: 900, color: "#ffffff", padding: "0 8px", textAlign: "center", lineHeight: 1.2 }}>
                  {label}
                </button>
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: "center", fontSize: "11px", fontFamily: "var(--font-kalam)", color: G.muted }}>
          {currentIdx + 1} / {MYTH_CARDS.length} · Swipe or tap
        </p>
      </div>
    </div>
  );
}

/* ─── QUEST (wired up when the game screen is added to the sub-nav) ── */
export function QuestScreen() {
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
    <div style={{ padding: "0 20px 24px", background: G.bg }}>
      {/* Progress — sticky at top */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: G.bg,
        padding: "14px 0 10px",
        marginBottom: "4px",
      }}>
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

      <h1 style={{ fontSize: "24px", fontWeight: 900, color: G.text, margin: "0 0 2px" }}>Registration Quest 🎮</h1>
      <p style={{ fontSize: "13px", color: G.muted, margin: "0 0 16px" }}>4 levels. Less steps than creating a TikTok account.</p>

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
                    <div style={{ display: "flex", justifyContent: "center" }} onClick={(e) => e.stopPropagation()}>
                      <BrushButton
                        label={`Mark Level ${level.id} Done ✅`}
                        onClick={() => completeLevel(level)}
                        variant="small"
                        showArrow={false}
                        width="min(100%, 280px)"
                        fontSize="clamp(11px, 3.2vw, 13px)"
                      />
                    </div>
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <BrushButton
              label="Share na Squadi"
              variant="small"
              showArrow={false}
              width="min(100%, 260px)"
              fontSize="clamp(11px, 3.2vw, 13px)"
              textTransform="capitalize"
              onClick={() => {
                if (navigator.share) navigator.share({ title: "GenZ Voter 2027", text: "Nimejicommit kupiga kura 2027. Toke na mbogi 👀", url: window.location.origin });
              }}
            />
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <BrushButton label="Occupy Polling Station 🗳️" onClick={handlePledge} />
        </div>
      )}
    </div>
  );
}

