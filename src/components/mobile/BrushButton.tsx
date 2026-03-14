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
  /** Optional smaller subtitle line rendered inside the button below the label */
  subtitle?: string;
  /** Override the brush image height (default: auto from aspect ratio) */
  height?: string;
  /** Extra style applied to the outer button element */
  style?: React.CSSProperties;
  /** Text transform for the label (default: "uppercase") */
  textTransform?: React.CSSProperties["textTransform"];
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
  subtitle,
  height,
  style: styleProp,
  textTransform: textTransformProp = "uppercase",
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
  // Large variant: light mode → LightModeButton_btn (dark stroke, white text)
  //                dark mode  → BigDarkmodeButton (dark stroke, white text, no invert needed)
  // Small variant: always SmallLightButton_btn with invert(1) in dark mode
  const isSmall = variant === "small";
  // Large dark mode uses BigDarkmodeButton via CSS background-image crop (see below).
  // Small dark mode inverts the light asset.
  const btnSrc = isSmall ? "/assets/SmallLightButton_btn.png" : "/assets/LightModeButton_btn.png";
  const imgW = isSmall ? 683 : 1175;
  const imgH = isSmall ? 274 : 344;
  const textColor = "#ffffff";
  const shadow = "drop-shadow(0px 4px 8px rgba(0,0,0,0.28)) drop-shadow(0px 1px 3px rgba(0,0,0,0.18))";
  const imgFilter = (isSmall && theme === "dark") ? `invert(1) ${shadow}` : shadow;
  // BigDarkmodeButton (2100×1500): stroke x=524-1577, y=588-811 (1053×223px).
  // LightModeButton_btn.png has 60px transparent padding on all sides (5.1% H, 17.4% V).
  // Match that padding: stroke rendered = 89.8%W wide, 65.2%H tall.
  // 179% → (1053/2100)×1.79W = 0.898W ✓  439% → (223/1500)×4.39H = 0.652H ✓
  // backgroundPosition 50%/46% centres stroke; 15px transparent edge contains drop-shadow.
  const useDarkBg = !isSmall && theme === "dark";
  const defaultWidth = isSmall ? "calc(50% - 5px)" : "min(80vw, 320px)";
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
        // In dark mode, height is set by aspectRatio instead of the Image component.
        ...(useDarkBg ? { aspectRatio: `${imgW} / ${imgH}` } : {}),
        ...styleProp,
      }}
    >
      {useDarkBg ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/assets/BigDarkmodeButton.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "179% 439%",
            backgroundPosition: "50% 46%",
            filter: shadow,
          }}
        />
      ) : (
        <Image
          src={btnSrc}
          alt=""
          width={imgW}
          height={imgH}
          style={{
            width: "100%",
            height: height ?? "auto",
            display: "block",
            filter: imgFilter,
          }}
          priority
        />
      )}
      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "3px",
          color: textColor,
          pointerEvents: "none",
        }}
      >
        <span style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: fontSize ?? (isSmall ? "clamp(12px, 3.5vw, 15px)" : "clamp(16px, 5vw, 22px)"),
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontWeight: 900,
          letterSpacing: "0.02em",
          textTransform: textTransformProp,
          lineHeight: 1,
        }}>
          {label}{showArrow && <span style={{ fontSize: "0.85em" }}> →</span>}
        </span>
        {subtitle && (
          <span style={{
            fontSize: "clamp(9px, 2.5vw, 11px)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 700,
            letterSpacing: "0em",
            textTransform: "none",
            lineHeight: 1.2,
            opacity: 0.9,
            maxWidth: "80%",
            textAlign: "center",
          }}>
            {subtitle}
          </span>
        )}
      </span>
    </button>
  );
}
