"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getCountdown } from "@/lib/countdown";
import type { CountdownValues } from "@/lib/countdown";
import BrushButton from "@/components/mobile/BrushButton";
import MpesaGate from "@/components/mobile/MpesaGate";

export default function CountdownHero() {
  const [countdown, setCountdown] = useState<CountdownValues | null>(null);
  const [vibrating, setVibrating] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const router = useRouter();
  const confettiFired = useRef(false);

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
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* GenZ image — home page only */}
      <div
        style={{
          width: "100%",
          flex: "0 0 50%",
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
            objectPosition: "bottom center",
            transform: "scale(1.18)",
            transformOrigin: "bottom center",
          }}
          priority
        />
      </div>

      {/* Content */}
      <div
        style={{
          flex: "1 1 0",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          padding: "0 20px 8px",
          marginTop: "-80px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* IN X DAYS */}
        {countdown && (
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "8px",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "clamp(10px, 2.5vw, 14px)",
                fontFamily: "var(--font-kalam)",
                fontWeight: 700,
                color: "var(--subtle)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              IN
            </span>
            <span
              className={vibrating ? "vibrate" : ""}
              style={{
                fontSize: "clamp(48px, 15vw, 86px)",
                fontFamily: "var(--font-marker)",
                color: "var(--green-dark)",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {countdown.days}
            </span>
            <span
              style={{
                fontSize: "clamp(10px, 2.5vw, 14px)",
                fontFamily: "var(--font-kalam)",
                fontWeight: 700,
                color: "var(--subtle)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              DAYS
            </span>
          </div>
        )}

        {/* NI MBAYA! */}
        <div
          style={{
            fontSize: "clamp(22px, 6.5vw, 42px)",
            fontFamily: "var(--font-marker)",
            color: "var(--green-dark)",
            borderBottom: "3px solid #f59e0b",
            paddingBottom: "2px",
          }}
        >
          NI MBAYA! 😤
        </div>

        {/* Subline */}
        <p
          style={{
            fontSize: "clamp(11px, 3.2vw, 14px)",
            fontFamily: "var(--font-kalam)",
            color: "var(--muted)",
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          Ukilalisha usiwai lia aty hakuna change bro!!
        </p>

        {/* HRS / MIN / SEC ticker */}
        {countdown && (
          <div style={{ display: "flex", gap: "16px" }}>
            {[
              { v: countdown.hours,   l: "HRS" },
              { v: countdown.minutes, l: "MIN" },
              { v: countdown.seconds, l: "SEC" },
            ].map(({ v, l }) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "clamp(18px, 5vw, 24px)",
                    fontFamily: "var(--font-marker)",
                    color: "var(--green-dark)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1,
                  }}
                >
                  {String(v).padStart(2, "0")}
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    fontFamily: "var(--font-kalam)",
                    color: "var(--subtle)",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    marginTop: "2px",
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {showGate && (
          <MpesaGate
            onSuccess={() => { setShowGate(false); router.push("/mobile/register"); }}
            onDismiss={() => setShowGate(false)}
          />
        )}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <BrushButton label="Cheki hio List" onClick={() => setShowGate(true)} wiggleOnIdle />
          <p
            style={{
              fontSize: "clamp(10px, 2.8vw, 12px)",
              fontFamily: "var(--font-kalam)",
              color: "var(--subtle)",
              margin: 0,
              textAlign: "center",
            }}
          >
            Umesota na hauna Kura! Wacha Ufala... Hi kitu ni Once in 5yrs
          </p>
        </div>
      </div>
    </div>
  );
}
