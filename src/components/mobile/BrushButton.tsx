"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";

interface BrushButtonProps {
  label: string;
  onClick: () => void;
  /** Enable the 3-second idle wiggle (default false) */
  wiggleOnIdle?: boolean;
  /** CSS width override — defaults to "min(80vw, 300px)" */
  width?: string;
  /** Show the trailing → arrow (default true) */
  showArrow?: boolean;
  /** Dim the button to indicate inactive/unselected state */
  inactive?: boolean;
  /** Font size override */
  fontSize?: string;
  /** "default" uses the large brush assets; "small" uses SmallLight/DarkButton assets */
  variant?: "default" | "small";
}

export default function BrushButton({
  label,
  onClick,
  wiggleOnIdle = false,
  width,
  showArrow = true,
  inactive = false,
  fontSize,
  variant = "default",
}: BrushButtonProps) {
  const [wiggling, setWiggling] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const usedRef = useRef(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (!wiggleOnIdle) return;
    function schedule() {
      timerRef.current = setTimeout(() => {
        if (!usedRef.current) {
          setWiggling(true);
          setTimeout(() => { setWiggling(false); schedule(); }, 800);
        }
      }, 3000);
    }
    schedule();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [wiggleOnIdle]);

  // Pre-cropped button assets
  const isSmall = variant === "small";
  const btnSrc = isSmall
    ? (theme === "dark" ? "/assets/SmallDarkButton_btn.png" : "/assets/SmallLightButton_btn.png")
    : (theme === "dark" ? "/assets/DarkModeButton_btn.png" : "/assets/LightModeButton_btn.png");
  // SmallLight/Dark are both 683×274; large: Light=1175×344, Dark=814×276
  const imgW = isSmall ? 683 : (theme === "light" ? 1175 : 814);
  const imgH = isSmall ? 274 : (theme === "light" ? 344 : 276);
  // Small buttons: dark stroke on white bg → white text; grey stroke on dark bg → dark text
  const textColor = isSmall
    ? (theme === "dark" ? "#1a3a10" : "#ffffff")
    : (theme === "light" ? "#ffffff" : "var(--green-dark)");
  const defaultWidth = isSmall ? "calc(50% - 5px)" : "min(80vw, 300px)";
  const resolvedWidth = width ?? defaultWidth;

  return (
    <button
      className={wiggling ? "wiggle" : ""}
      onClick={() => { usedRef.current = true; onClick(); }}
      aria-label={label}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        width: resolvedWidth,
        display: "block",
        position: "relative",
        opacity: inactive ? 0.45 : 1,
        transition: "opacity 0.2s ease",
      }}
    >
      <Image
        src={btnSrc}
        alt=""
        width={imgW}
        height={imgH}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          filter: isSmall ? "drop-shadow(0px 3px 5px rgba(0,0,0,0.35))" : undefined,
        }}
        priority
      />
      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          color: textColor,
          fontSize: fontSize ?? (isSmall ? "clamp(12px, 3.5vw, 15px)" : "clamp(16px, 5vw, 22px)"),
          fontFamily: "var(--font-marker)",
          fontWeight: 900,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          pointerEvents: "none",
          lineHeight: 1,
        }}
      >
        {label}{showArrow && <span style={{ fontSize: "0.85em" }}> →</span>}
      </span>
    </button>
  );
}
