"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { MYTH_CARDS } from "@/lib/data";

const G = {
  dark:    "var(--green-dark)",
  mid:     "var(--green-mid)",
  pale:    "var(--green-pale)",
  gold:    "var(--gold)",
  bg:      "var(--bg)",
  surface: "var(--surface)",
  text:    "var(--text)",
  muted:   "var(--muted)",
  border:  "var(--border2)",
  border2: "var(--border)",
};

export default function MobileInfoPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const { theme } = useTheme();
  const shadow = "drop-shadow(0px 4px 10px rgba(0,0,0,0.28))";
  const cardFilter = shadow;
  const smallBtnFilter = theme === "dark" ? `invert(1) ${shadow}` : shadow;
  // Dark mode: crop BigDarkmodeButton via background-image so stroke fills the card width.
  // bg-size 318% scales the 660px stroke to fill card width; bg-position 23%/24% centres vertically.
  // Crop only the transparent canvas around the stroke, then stretch to fill the card.
  // Stroke bounds: x=524-1577, y=588-811 (1053×223px on 2100×1500 canvas).
  // background-size width: 200% → stroke width (1053/2100×2W = W) fills container width.
  // background-size height: 673% (=1500/223×100%) → stroke height fills container height.
  // background-position: 50% (stroke center x≈50% of canvas) / 46% (stroke center y).
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


      {/* Card */}
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Fixed-height card — both faces sit absolutely inside, opacity swaps on flip */}
        <div
          onClick={() => setFlipped(!flipped)}
          style={{ cursor: "pointer", position: "relative", height: "280px", marginLeft: "-20px", marginRight: "-20px", marginBottom: "-60px" }}
        >
          {/* Brush background */}
          <div aria-hidden style={{ position: "absolute", inset: 0, filter: cardFilter, ...(theme === "dark" ? darkCardBg : { backgroundImage: "url(/assets/LightModeButton_btn.png)", backgroundSize: "100% 100%" }) }} />

          {/* MYTH face */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "10px", padding: "24px 28px", textAlign: "center",
            opacity: flipped ? 0 : 1, transition: "opacity 0.2s ease", pointerEvents: flipped ? "none" : "auto",
          }}>
            <p style={{ fontSize: "clamp(14px, 4vw, 17px)", fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.3 }}>
              &ldquo;{card.myth}&rdquo;
            </p>
            <p style={{ fontSize: "11px", fontFamily: "var(--font-kalam)", color: "rgba(255,255,255,0.6)", margin: 0 }}>
              Tap to see the reality
            </p>
          </div>

          {/* REALITY face */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "10px", padding: "24px 28px", textAlign: "center",
            opacity: flipped ? 1 : 0, transition: "opacity 0.2s ease", pointerEvents: flipped ? "auto" : "none",
          }}>
            <p style={{ fontSize: "clamp(13px, 3.8vw, 16px)", fontFamily: "var(--font-kalam)", color: "#ffffff", lineHeight: 1.5, margin: 0, whiteSpace: "pre-line" }}>
              {card.reality}
            </p>
            {card.stat && (
              <p style={{ fontSize: "11px", fontFamily: "var(--font-kalam)", color: "#fde68a", margin: 0, fontWeight: 700 }}>
                {card.stat}
              </p>
            )}
            <p style={{ fontSize: "11px", fontFamily: "var(--font-kalam)", color: "rgba(255,255,255,0.6)", margin: 0 }}>
              Tap to flip back
            </p>
          </div>
        </div>

        {/* Za Cabbage credit */}
        <p style={{
          textAlign: "center",
          fontSize: "13px",
          fontFamily: "var(--font-kalam)",
          color: "var(--muted)",
          margin: "8px 0 4px",
          lineHeight: 1.4,
        }}>
          Za Cabbage tulipie server:{" "}
          <span style={{ userSelect: "all", fontWeight: 700, color: "var(--text)" }}>
            0113201208
          </span>
        </p>

        {/* Controls — BrushButton small variant row */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {(["← Prev", flipped ? "Myth 🔄" : "Reality 🔄", "Next →"] as const).map((label, i) => {
            const isMiddle = i === 1;
            const isDisabled =
              (i === 0 && currentIdx === 0) ||
              (i === 2 && currentIdx === MYTH_CARDS.length - 1);
            const handleClick = i === 0 ? goPrev : i === 2 ? goNext : () => setFlipped(!flipped);
            return (
              <div key={label} style={{ flex: isMiddle ? 1.4 : 1, position: "relative" }}>
                <Image
                  src="/assets/SmallLightButton_btn.png"
                  alt=""
                  width={683}
                  height={274}
                  loading="eager"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    filter: smallBtnFilter,
                    opacity: isDisabled ? 0.35 : 1,
                    transition: "opacity 0.2s ease",
                  }}
                />
                <button
                  onClick={isDisabled ? undefined : handleClick}
                  disabled={isDisabled}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "none",
                    border: "none",
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "clamp(11px, 3vw, 13px)",
                    fontFamily: "var(--font-kalam)",
                    fontWeight: 900,
                    color: "#ffffff",
                    padding: "0 8px",
                    textAlign: "center",
                    lineHeight: 1.2,
                  }}
                >
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
