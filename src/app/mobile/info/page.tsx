"use client";

import { useState, useRef } from "react";
import { MYTH_CARDS } from "@/lib/data";

const G = {
  dark: "#1a3a10",
  mid: "#2d5a1a",
  pale: "#e6f0de",
  gold: "#f59e0b",
  bg: "#f5f5f0",
  surface: "#ffffff",
  text: "#111111",
  muted: "#6b7280",
  border: "#e5e7eb",
  border2: "#d1d5db",
};

export default function MobileInfoPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const touchStartX = useRef<number | null>(null);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) diff > 0 ? goNext() : goPrev();
    touchStartX.current = null;
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "24px 20px",
        background: G.bg,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "18px" }}>
        <p
          style={{
            fontSize: "11px",
            fontWeight: 700,
            fontFamily: "var(--font-kalam)",
            color: G.dark,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            margin: "0 0 5px",
          }}
        >
          Swipa Memes 👀
        </p>
        <h1
          style={{
            fontSize: "26px",
            fontFamily: "var(--font-marker)",
            color: G.text,
            margin: "0 0 4px",
            lineHeight: 1.1,
          }}
        >
          Myths vs Reality
        </h1>
        <p style={{ fontSize: "13px", fontFamily: "var(--font-kalam)", color: G.muted, margin: 0 }}>
          Make it make sense. {MYTH_CARDS.length} cards.
        </p>
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: "5px", marginBottom: "18px" }}>
        {MYTH_CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrentIdx(i); setFlipped(false); }}
            style={{
              height: "4px",
              flex: 1,
              border: "none",
              padding: 0,
              /* Sketchy progress pip */
              borderRadius: "2px 6px 1px 5px / 5px 1px 6px 2px",
              cursor: "pointer",
              background:
                i === currentIdx
                  ? G.dark
                  : i < currentIdx
                  ? "rgba(26,58,16,0.3)"
                  : G.border2,
              transition: "background 0.2s ease",
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: "14px" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          onClick={() => setFlipped(!flipped)}
          style={{ flex: 1, minHeight: "320px", cursor: "pointer", position: "relative" }}
        >
          {/* MYTH side — white card, sketchy border */}
          <div
            key={`myth-${currentIdx}`}
            className="slide-in sk"
            style={{
              position: "absolute",
              inset: 0,
              background: G.surface,
              border: `2px solid ${G.border}`,
              padding: "28px 22px",
              display: flipped ? "none" : "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              textAlign: "center",
              boxShadow: "3px 3px 0px #d1d5db",
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "14px",
              }}
            >
              <span style={{ fontSize: "56px" }}>{card.emoji}</span>
              {/* MYTH badge — sketchy chip */}
              <div
                className="sk-chip"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1.5px solid rgba(239,68,68,0.3)",
                  padding: "3px 10px",
                  display: "inline-block",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    fontFamily: "var(--font-kalam)",
                    color: "#dc2626",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  MYTH
                </span>
              </div>
              <h2
                style={{
                  fontSize: "clamp(18px, 5vw, 22px)",
                  fontFamily: "var(--font-marker)",
                  color: G.text,
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                &ldquo;{card.myth}&rdquo;
              </h2>
            </div>
            <p style={{ fontSize: "12px", fontFamily: "var(--font-kalam)", color: G.muted, margin: 0 }}>
              Tap card to see the reality 👇
            </p>
          </div>

          {/* REALITY side — pale green, sketchy border */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: G.pale,
              border: `2px solid ${G.mid}`,
              /* Different sketchy radius — alt variant */
              borderRadius: "15px 255px 15px 225px / 225px 15px 255px 15px",
              padding: "28px 22px",
              display: flipped ? "flex" : "none",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              textAlign: "center",
              boxShadow: "3px 3px 0px #b8d4a8",
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "14px",
              }}
            >
              <div
                className="sk-chip"
                style={{
                  background: "rgba(26,58,16,0.1)",
                  border: `1.5px solid ${G.mid}`,
                  padding: "3px 10px",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    fontFamily: "var(--font-kalam)",
                    color: G.dark,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  REALITY: Si ukweli!
                </span>
              </div>
              <p
                style={{
                  fontSize: "clamp(15px, 4vw, 17px)",
                  fontFamily: "var(--font-kalam)",
                  color: "#1f2937",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {card.reality}
              </p>
              {card.stat && (
                <div
                  className="sk-row"
                  style={{
                    background: "rgba(245,158,11,0.12)",
                    border: `1.5px solid ${G.gold}`,
                    padding: "8px 14px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "13px",
                      fontFamily: "var(--font-kalam)",
                      color: "#92400e",
                      margin: 0,
                      fontWeight: 700,
                    }}
                  >
                    📊 {card.stat}
                  </p>
                </div>
              )}
            </div>
            <p style={{ fontSize: "12px", fontFamily: "var(--font-kalam)", color: G.muted, margin: 0 }}>
              Tap to flip back ←
            </p>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={goPrev}
            disabled={currentIdx === 0}
            className="sk-btn"
            style={{
              flex: 1,
              padding: "14px",
              border: `1.5px solid ${G.border}`,
              background: G.surface,
              color: currentIdx === 0 ? G.border2 : G.muted,
              fontSize: "15px",
              fontFamily: "var(--font-kalam)",
              fontWeight: 700,
              cursor: currentIdx === 0 ? "not-allowed" : "pointer",
              boxShadow: currentIdx === 0 ? "none" : "2px 2px 0px #d1d5db",
            }}
          >
            ← Prev
          </button>
          <button
            onClick={() => setFlipped(!flipped)}
            className="sk-btn"
            style={{
              flex: 1,
              padding: "14px",
              border: `1.5px solid ${G.dark}`,
              background: G.pale,
              color: G.dark,
              fontSize: "15px",
              fontFamily: "var(--font-kalam)",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "2px 2px 0px #1a3a10",
            }}
          >
            {flipped ? "Myth 🔄" : "Reality 🔄"}
          </button>
          <button
            onClick={goNext}
            disabled={currentIdx === MYTH_CARDS.length - 1}
            className="sk-btn"
            style={{
              flex: 1,
              padding: "14px",
              border: `1.5px solid ${G.border}`,
              background: G.surface,
              color: currentIdx === MYTH_CARDS.length - 1 ? G.border2 : G.muted,
              fontSize: "15px",
              fontFamily: "var(--font-kalam)",
              fontWeight: 700,
              cursor: currentIdx === MYTH_CARDS.length - 1 ? "not-allowed" : "pointer",
              boxShadow: currentIdx === MYTH_CARDS.length - 1 ? "none" : "2px 2px 0px #d1d5db",
            }}
          >
            Next →
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: "11px", fontFamily: "var(--font-kalam)", color: G.muted }}>
          {currentIdx + 1} / {MYTH_CARDS.length} · Swipe or tap
        </p>

        {currentIdx === MYTH_CARDS.length - 1 && flipped && (
          <div
            className="sk-md"
            style={{
              background: G.pale,
              border: `2px solid ${G.dark}`,
              padding: "16px",
              textAlign: "center",
              boxShadow: "3px 3px 0px #1a3a10",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                fontFamily: "var(--font-kalam)",
                color: G.dark,
                margin: "0 0 12px",
                lineHeight: 1.5,
                fontWeight: 700,
              }}
            >
              Umesoma hii yote? Basi huna sababu ya kutopiga kura 2027 🇰🇪
            </p>
            <a
              href="/mobile/register"
              className="sk-btn"
              style={{
                display: "inline-block",
                padding: "12px 20px",
                background: G.dark,
                border: "2px solid #0d2008",
                color: "#fff",
                fontFamily: "var(--font-marker)",
                fontSize: "14px",
                textDecoration: "none",
                boxShadow: "3px 3px 0px #0d2008",
              }}
            >
              Jiregistre Sasa 🎮
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
