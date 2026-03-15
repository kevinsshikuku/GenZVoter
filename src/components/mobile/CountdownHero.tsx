"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { getCountdown } from "@/lib/countdown";
import type { CountdownValues } from "@/lib/countdown";
import BrushButton from "@/components/mobile/BrushButton";
import MpesaGate from "@/components/mobile/MpesaGate";
import { useVerifiedCount } from "@/shared/hooks/useVerifiedCount";

export default function CountdownHero() {
  const [countdown, setCountdown] = useState<CountdownValues | null>(null);
  const [vibrating, setVibrating] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const confettiFired = useRef(false);
  const { count } = useVerifiedCount();

  useEffect(() => {
    setCountdown(getCountdown());
    const interval = setInterval(() => setCountdown(getCountdown()), 1000);

    const vibrateTimer = setTimeout(() => {
      setVibrating(true);
      setTimeout(() => setVibrating(false), 1200);
    }, 700);

    if (!confettiFired.current) {
      confettiFired.current = true;
      import("canvas-confetti").then((m) => {
        m.default({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.3 },
          colors: ["#2d5a1a", "#f59e0b", "#dc2626", "#1d4ed8", "#7c3aed"],
          zIndex: 9999,
        });
      });
    }

    return () => {
      clearInterval(interval);
      clearTimeout(vibrateTimer);
    };
  }, []);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "var(--surface)",
        overflow: "hidden",
      }}
    >
      {/* People counter — marker font, tight to top, above image */}
      <div style={{ textAlign: "center", lineHeight: 1, padding: "4px 0 0", flexShrink: 0, position: "relative", zIndex: 3 }}>
        <span
          style={{
            fontFamily: "var(--font-marker)",
            fontSize: "clamp(36px, 11vw, 56px)",
            color: "var(--foreground)",
            lineHeight: 1,
          }}
        >
          {count !== null ? count.toLocaleString() : "---"}
        </span>
        <span
          style={{
            fontFamily: "var(--font-marker)",
            fontSize: "clamp(22px, 6.5vw, 36px)",
            color: "var(--foreground)",
            marginLeft: "1px",
            lineHeight: 1,
          }}
        >
          people
        </span>
      </div>

      {/* GenZ image — edge to edge, no side margin */}
      <div
        style={{
          width: "100%",
          flex: "0 0 43%",
          minHeight: 0,
          position: "relative",
          overflow: "visible",
        }}
      >
        <Image
          src="/assets/GenZ1.png"
          alt="GenZ Kenya"
          fill
          style={{
            objectFit: "contain",
            objectPosition: "center center",
            transform: "scale(1.45)",
            transformOrigin: "center center",
          }}
          priority
        />
      </div>

      {/* 512 days to go… — overlaps image, zero top gap */}
      {countdown && (
        <div
          className={vibrating ? "vibrate" : ""}
          style={{
            textAlign: "center",
            marginTop: "-10px",
            zIndex: 2,
            flexShrink: 0,
            padding: "0 8px",
            fontSize: "clamp(40px, 13vw, 72px)",
            fontFamily: "var(--font-kalam)",
            fontWeight: 700,
            color: "var(--foreground)",
            lineHeight: 0.95,
            fontVariantNumeric: "tabular-nums",
            textTransform: "none",
          }}
        >
          {countdown.days} days to go…
        </div>
      )}

      {/* Ni Mbaya — tight below days */}
      <div style={{ textAlign: "center", flexShrink: 0, lineHeight: 1 }}>
        <span
          style={{
            fontSize: "clamp(20px, 6vw, 30px)",
            fontFamily: "var(--font-marker)",
            color: "var(--foreground)",
            lineHeight: 1.1,
          }}
        >
          Ni Mbaya
        </span>
      </div>


{/* Cheki hio List + subtitle */}
      <div style={{ padding: "6px 10px 2px", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <BrushButton label="Confirm Kura" onClick={() => setShowGate(true)} wiggleOnIdle />
        <p
          style={{
            fontSize: "clamp(10px, 2.8vw, 12px)",
            fontFamily: "var(--font-kalam)",
            color: "var(--subtle)",
            margin: "3px 0 0",
            textAlign: "center",
          }}
        >
          Umesota na hauna Kura! Wacha Ufala... Hi kitu ni Once in 5yrs
        </p>
      </div>

      {/* MpesaGate modal */}
      {showGate && (
        <MpesaGate
          onSuccess={() => { setShowGate(false); window.dispatchEvent(new CustomEvent("genz-navigate", { detail: "register" })); }}
          onDismiss={() => setShowGate(false)}
        />
      )}
    </div>
  );
}
