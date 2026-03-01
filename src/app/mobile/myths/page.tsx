"use client";

import { useState, useRef } from "react";
import { MYTH_CARDS } from "@/lib/data";

export default function MobileMythsPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const touchStartX = useRef<number | null>(null);

  const card = MYTH_CARDS[currentIdx];

  const goNext = () => {
    if (currentIdx < MYTH_CARDS.length - 1) {
      setDirection("left");
      setFlipped(false);
      setTimeout(() => {
        setCurrentIdx((i) => i + 1);
        setDirection(null);
      }, 280);
    }
  };

  const goPrev = () => {
    if (currentIdx > 0) {
      setDirection("right");
      setFlipped(false);
      setTimeout(() => {
        setCurrentIdx((i) => i - 1);
        setDirection(null);
      }, 280);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  return (
    <div style={{ padding: "24px 20px", minHeight: "100dvh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontSize: "12px", color: "#a855f7", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
          Myths vs Reality
        </p>
        <h1 style={{ fontSize: "24px", fontWeight: 900, color: "var(--text)", margin: "0 0 6px" }}>
          Make it make sense 👀
        </h1>
        <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>
          Swipe to flip. {MYTH_CARDS.length} myths debunked.
        </p>
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
        {MYTH_CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrentIdx(i); setFlipped(false); }}
            style={{
              height: "4px",
              flex: 1,
              borderRadius: "2px",
              border: "none",
              background: i === currentIdx ? "#a855f7" : i < currentIdx ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.1)",
              cursor: "pointer",
              padding: 0,
              transition: "background 0.2s ease",
            }}
          />
        ))}
      </div>

      {/* Card area */}
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Flip card */}
        <div
          onClick={() => setFlipped(!flipped)}
          className={direction === "left" ? "slide-out" : direction === "right" ? "slide-in" : ""}
          style={{
            flex: 1,
            minHeight: "280px",
            borderRadius: "24px",
            overflow: "hidden",
            cursor: "pointer",
            position: "relative",
            perspective: "1000px",
          }}
        >
          {/* Front – myth */}
          {!flipped && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(145deg, rgba(124,58,237,0.2), rgba(168,85,247,0.1))",
                border: "1px solid rgba(124,58,237,0.35)",
                borderRadius: "24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px 24px",
                textAlign: "center",
                gap: "16px",
              }}
            >
              <span style={{ fontSize: "52px" }}>{card.emoji}</span>
              <div
                style={{
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "8px",
                  padding: "4px 10px",
                  display: "inline-block",
                }}
              >
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#f87171", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Myth
                </span>
              </div>
              <h2 style={{ fontSize: "clamp(18px, 5vw, 22px)", fontWeight: 800, color: "var(--text)", margin: 0, lineHeight: 1.3 }}>
                &ldquo;{card.myth}&rdquo;
              </h2>
              <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                Tap to see the reality 👇
              </p>
            </div>
          )}

          {/* Back – reality */}
          {flipped && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(145deg, rgba(16,185,129,0.15), rgba(52,211,153,0.08))",
                border: "1px solid rgba(16,185,129,0.35)",
                borderRadius: "24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px 24px",
                textAlign: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  background: "rgba(16,185,129,0.15)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  borderRadius: "8px",
                  padding: "4px 10px",
                  display: "inline-block",
                }}
              >
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Reality
                </span>
              </div>
              <p style={{ fontSize: "clamp(15px, 4vw, 17px)", color: "var(--text2)", lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                {card.reality}
              </p>
              {card.stat && (
                <div
                  style={{
                    background: "rgba(245,158,11,0.1)",
                    border: "1px solid rgba(245,158,11,0.25)",
                    borderRadius: "12px",
                    padding: "10px 16px",
                  }}
                >
                  <p style={{ fontSize: "13px", color: "#fcd34d", margin: 0, fontWeight: 700 }}>
                    📊 {card.stat}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={goPrev}
            disabled={currentIdx === 0}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent",
              color: currentIdx === 0 ? "#334155" : "#94a3b8",
              fontSize: "15px",
              fontWeight: 700,
              cursor: currentIdx === 0 ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
            }}
          >
            ← Prev
          </button>

          <button
            onClick={() => setFlipped(!flipped)}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "14px",
              border: "1px solid rgba(124,58,237,0.4)",
              background: "rgba(124,58,237,0.1)",
              color: "#a855f7",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {flipped ? "Myth 🔄" : "Reality 🔄"}
          </button>

          <button
            onClick={goNext}
            disabled={currentIdx === MYTH_CARDS.length - 1}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent",
              color: currentIdx === MYTH_CARDS.length - 1 ? "#334155" : "#94a3b8",
              fontSize: "15px",
              fontWeight: 700,
              cursor: currentIdx === MYTH_CARDS.length - 1 ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Next →
          </button>
        </div>

        {/* Card counter */}
        <p style={{ textAlign: "center", fontSize: "12px", color: "#475569" }}>
          {currentIdx + 1} / {MYTH_CARDS.length} · Swipe left/right or tap
        </p>

        {/* Closing line */}
        {currentIdx === MYTH_CARDS.length - 1 && flipped && (
          <div style={{
            background: "rgba(124,58,237,0.1)",
            border: "1px solid rgba(124,58,237,0.25)",
            borderRadius: "16px",
            padding: "16px",
            textAlign: "center",
          }}>
            <p style={{ fontSize: "14px", color: "#c4b5fd", margin: "0 0 12px", lineHeight: 1.5 }}>
              Umesoma hii yote? Basi huna sababu ya kutopiga kura 2027. 🇰🇪
            </p>
            <a
              href="/mobile/game"
              style={{
                display: "inline-block",
                padding: "12px 20px",
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                borderRadius: "12px",
                color: "#fff",
                fontWeight: 700,
                fontSize: "14px",
                textDecoration: "none",
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
