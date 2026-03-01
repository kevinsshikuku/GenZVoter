"use client";

import { useState, useEffect } from "react";
import { GAME_LEVELS } from "@/lib/data";
import type { GameLevel } from "@/lib/types";

export default function MobileGamePage() {
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const [showBadge, setShowBadge] = useState<number | null>(null);
  const [totalXP, setTotalXP] = useState(0);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("genz-voter-progress");
    if (saved) {
      const { completed, xp } = JSON.parse(saved);
      setCompletedLevels(completed || []);
      setTotalXP(xp || 0);
    }
  }, []);

  const completeLevel = (level: GameLevel) => {
    if (completedLevels.includes(level.id)) return;
    const newCompleted = [...completedLevels, level.id];
    const newXP = totalXP + level.xp;
    setCompletedLevels(newCompleted);
    setTotalXP(newXP);
    setShowBadge(level.id);
    localStorage.setItem(
      "genz-voter-progress",
      JSON.stringify({ completed: newCompleted, xp: newXP })
    );

    // Confetti on level complete
    import("canvas-confetti").then((m) => {
      m.default({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.5 },
        colors: ["#7c3aed", "#a855f7", "#10b981", "#f59e0b"],
      });
    });

    setTimeout(() => setShowBadge(null), 2000);
  };

  const maxXP = GAME_LEVELS.reduce((sum, l) => sum + l.xp, 0);
  const progressPct = Math.round((totalXP / maxXP) * 100);

  return (
    <div style={{ padding: "24px 20px", minHeight: "100dvh", background: "var(--bg)" }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontSize: "12px", color: "#a855f7", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
          Voter Quest 🎮
        </p>
        <h1 style={{ fontSize: "26px", fontWeight: 900, color: "var(--text)", margin: "0 0 6px" }}>
          Jiregistre — 4 Levels
        </h1>
        <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>
          Complete all levels na uwe mtu kamili wa Kenya 🇰🇪
        </p>
      </div>

      {/* XP Progress bar */}
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <div>
            <span style={{ fontSize: "13px", color: "#94a3b8" }}>Adulting Level</span>
            <span
              style={{
                marginLeft: "8px",
                fontSize: "15px",
                fontWeight: 800,
                color: progressPct === 100 ? "#10b981" : "#a855f7",
              }}
            >
              {progressPct}%
            </span>
          </div>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#f59e0b" }}>
            ⚡ {totalXP} XP
          </span>
        </div>
        <div
          style={{
            height: "8px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressPct}%`,
              background: progressPct === 100
                ? "linear-gradient(90deg, #10b981, #34d399)"
                : "linear-gradient(90deg, #7c3aed, #a855f7)",
              borderRadius: "4px",
              transition: "width 0.5s ease",
            }}
          />
        </div>
        {progressPct === 100 && (
          <p style={{ textAlign: "center", fontSize: "13px", color: "#10b981", marginTop: "10px", fontWeight: 700 }}>
            🎉 Umemaliza! You&apos;re a certified 2027 voter.
          </p>
        )}
      </div>

      {/* Levels */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {GAME_LEVELS.map((level, idx) => {
          const isCompleted = completedLevels.includes(level.id);
          const isLocked = idx > 0 && !completedLevels.includes(GAME_LEVELS[idx - 1].id);
          const isActive = activeLevel === level.id;

          return (
            <div key={level.id}>
              {/* Badge flash */}
              {showBadge === level.id && (
                <div
                  className="badge-in"
                  style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    zIndex: 300,
                    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                    borderRadius: "20px",
                    padding: "24px 32px",
                    textAlign: "center",
                    boxShadow: "0 20px 60px rgba(124,58,237,0.6)",
                  }}
                >
                  <div style={{ fontSize: "48px" }}>{level.emoji}</div>
                  <p style={{ color: "#fff", fontWeight: 800, fontSize: "16px", margin: "8px 0 4px" }}>
                    Badge Unlocked!
                  </p>
                  <p style={{ color: "#d8b4fe", fontSize: "13px", margin: 0 }}>
                    {level.badge} · +{level.xp} XP
                  </p>
                </div>
              )}

              <div
                onClick={() => !isLocked && setActiveLevel(isActive ? null : level.id)}
                style={{
                  background: isCompleted
                    ? "rgba(16,185,129,0.08)"
                    : isLocked
                    ? "rgba(255,255,255,0.02)"
                    : "rgba(124,58,237,0.08)",
                  border: `1px solid ${
                    isCompleted
                      ? "rgba(16,185,129,0.3)"
                      : isLocked
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(124,58,237,0.3)"
                  }`,
                  borderRadius: "18px",
                  padding: "18px",
                  cursor: isLocked ? "not-allowed" : "pointer",
                  opacity: isLocked ? 0.5 : 1,
                  transition: "all 0.2s ease",
                }}
              >
                {/* Level header */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      background: isCompleted
                        ? "rgba(16,185,129,0.2)"
                        : isLocked
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(124,58,237,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      flexShrink: 0,
                    }}
                  >
                    {isLocked ? "🔒" : isCompleted ? "✅" : level.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ fontSize: "11px", color: isCompleted ? "#10b981" : "#a855f7", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 3px" }}>
                        Level {level.id}
                      </p>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#f59e0b" }}>
                        +{level.xp} XP
                      </span>
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: 800, color: isLocked ? "var(--subtle)" : "var(--text)", margin: "0 0 2px" }}>
                      {level.title}
                    </h3>
                    <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                      {level.subtitle}
                    </p>
                  </div>
                </div>

                {/* Expanded steps */}
                {isActive && !isLocked && (
                  <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                      {level.steps.map((step, i) => (
                        <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                          <span
                            style={{
                              width: "22px",
                              height: "22px",
                              borderRadius: "50%",
                              background: "rgba(124,58,237,0.3)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "11px",
                              fontWeight: 700,
                              color: "#a855f7",
                              flexShrink: 0,
                            }}
                          >
                            {i + 1}
                          </span>
                          <span style={{ fontSize: "14px", color: "#e2e8f0", lineHeight: 1.5, paddingTop: "2px" }}>
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>

                    {level.note && (
                      <div style={{
                        background: "rgba(245,158,11,0.1)",
                        border: "1px solid rgba(245,158,11,0.25)",
                        borderRadius: "12px",
                        padding: "12px",
                        marginBottom: "16px",
                      }}>
                        <p style={{ fontSize: "13px", color: "#fcd34d", margin: 0, lineHeight: 1.5 }}>
                          💡 {level.note}
                        </p>
                      </div>
                    )}

                    {!isCompleted && (
                      <button
                        onClick={(e) => { e.stopPropagation(); completeLevel(level); }}
                        style={{
                          width: "100%",
                          padding: "14px",
                          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                          border: "none",
                          borderRadius: "14px",
                          color: "#fff",
                          fontSize: "14px",
                          fontWeight: 700,
                          cursor: "pointer",
                          boxShadow: "0 4px 16px rgba(124,58,237,0.4)",
                        }}
                      >
                        Mark Level {level.id} Done ✅
                      </button>
                    )}
                    {isCompleted && (
                      <div style={{ textAlign: "center", padding: "12px" }}>
                        <span style={{ fontSize: "20px" }}>✅</span>
                        <p style={{ fontSize: "13px", color: "#10b981", fontWeight: 700, margin: "4px 0 0" }}>
                          Completed! Badge earned: {level.badge}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pledge section */}
      {completedLevels.length === GAME_LEVELS.length && (
        <PledgeSection />
      )}
    </div>
  );
}

function PledgeSection() {
  const [pledged, setPledged] = useState(false);

  useEffect(() => {
    setPledged(!!localStorage.getItem("genz-voter-pledge"));
  }, []);

  const handlePledge = () => {
    localStorage.setItem("genz-voter-pledge", "true");
    setPledged(true);
    import("canvas-confetti").then((m) => {
      m.default({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.4 },
        colors: ["#7c3aed", "#a855f7", "#ec4899", "#f59e0b", "#10b981"],
      });
      setTimeout(() => {
        m.default({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#7c3aed", "#a855f7", "#ec4899"],
        });
      }, 400);
    });
  };

  return (
    <div
      style={{
        marginTop: "28px",
        background: "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(124,58,237,0.1))",
        border: "1px solid rgba(236,72,153,0.3)",
        borderRadius: "20px",
        padding: "24px",
        textAlign: "center",
      }}
    >
      {pledged ? (
        <>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎉</div>
          <h2 style={{ fontSize: "20px", fontWeight: 900, color: "var(--text)", margin: "0 0 8px" }}>
            Umesign! Respect. 🫡
          </h2>
          <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 16px" }}>
            Screenshot hii na utume squad yako. Lazima tuongeze kura.
          </p>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "GenZ Voter 2027",
                  text: "Nimejicommit kujiregistar na kupiga kura 2027. Toke na mbogi 👀 Check genzvoter.ke",
                  url: window.location.origin,
                });
              }
            }}
            style={{
              padding: "14px 24px",
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              border: "none",
              borderRadius: "14px",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Share to WhatsApp Squad 💬
          </button>
        </>
      ) : (
        <>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🫡</div>
          <h2 style={{ fontSize: "20px", fontWeight: 900, color: "var(--text)", margin: "0 0 8px" }}>
            Commit to Vote 2027
          </h2>
          <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 20px", lineHeight: 1.6 }}>
            Tap below. Get confetti. Screenshot na utume squad.
          </p>
          <button
            onClick={handlePledge}
            className="pulse-ring"
            style={{
              width: "100%",
              padding: "18px",
              background: "linear-gradient(135deg, #ec4899, #a855f7)",
              border: "none",
              borderRadius: "16px",
              color: "#fff",
              fontSize: "16px",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 6px 24px rgba(236,72,153,0.5)",
            }}
          >
            Sawa, Nitaenda Kupiga Kura 2027 🗳️
          </button>
        </>
      )}
    </div>
  );
}
