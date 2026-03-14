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
        {/* BrushButton-style card — grid trick animates height on flip and card change */}
        <div onClick={() => setFlipped(!flipped)} style={{ cursor: "pointer" }}>
          {/* MYTH face */}
          <div style={{ display: "grid", gridTemplateRows: flipped ? "0fr" : "1fr", transition: "grid-template-rows 0.25s ease" }}>
            <div style={{ overflow: "hidden", position: "relative" }}>
              <div aria-hidden style={{ position: "absolute", inset: 0, filter: cardFilter, ...(theme === "dark" ? darkCardBg : { backgroundImage: "url(/assets/LightModeButton_btn.png)", backgroundSize: "100% 100%" }) }} />
              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", padding: "24px 28px", textAlign: "center" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, fontFamily: "var(--font-kalam)", color: "#fca5a5", textTransform: "uppercase", letterSpacing: "0.12em", background: "rgba(220,38,38,0.25)", border: "1px solid rgba(239,68,68,0.5)", borderRadius: "4px", padding: "2px 8px" }}>
                  MYTH
                </span>
                <p style={{ fontSize: "clamp(15px, 4.2vw, 18px)", fontFamily: "var(--font-marker)", color: "#ffffff", margin: 0, lineHeight: 1.3 }}>
                  &ldquo;{card.myth}&rdquo;
                </p>
                <p style={{ fontSize: "11px", fontFamily: "var(--font-kalam)", color: "rgba(255,255,255,0.6)", margin: 0 }}>
                  Tap to see the reality
                </p>
              </div>
            </div>
          </div>

          {/* REALITY face */}
          <div style={{ display: "grid", gridTemplateRows: flipped ? "1fr" : "0fr", transition: "grid-template-rows 0.25s ease" }}>
            <div style={{ overflow: "hidden", position: "relative" }}>
              <div aria-hidden style={{ position: "absolute", inset: 0, filter: cardFilter, ...(theme === "dark" ? darkCardBg : { backgroundImage: "url(/assets/LightModeButton_btn.png)", backgroundSize: "100% 100%" }) }} />
              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", padding: "24px 28px", textAlign: "center" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, fontFamily: "var(--font-kalam)", color: "#86efac", textTransform: "uppercase", letterSpacing: "0.12em", background: "rgba(22,163,74,0.25)", border: "1px solid rgba(34,197,94,0.5)", borderRadius: "4px", padding: "2px 8px" }}>
                  REALITY: Si ukweli!
                </span>
                <p style={{ fontSize: "clamp(14px, 4vw, 16px)", fontFamily: "var(--font-kalam)", color: "#ffffff", lineHeight: 1.5, margin: 0 }}>
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
          </div>
        </div>

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
