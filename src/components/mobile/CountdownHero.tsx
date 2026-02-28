"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getCountdown } from "@/lib/countdown";
import type { CountdownValues } from "@/lib/countdown";

export default function CountdownHero() {
  const [countdown, setCountdown] = useState<CountdownValues | null>(null);
  const [vibrating, setVibrating] = useState(false);
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
        background: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Confetti-coloured top strip */}
      <div
        style={{
          height: "5px",
          background: "linear-gradient(90deg, #2d5a1a 0%, #f59e0b 33%, #dc2626 66%, #1d4ed8 100%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "40px 24px 28px",
          textAlign: "center",
        }}
      >
        {/* Kenya badge — hand-drawn pill */}
        <div
          className="sk-sm"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "#e6f0de",
            border: "2px solid #2d5a1a",
            padding: "5px 14px",
          }}
        >
          <span style={{ fontSize: "14px" }}>🇰🇪</span>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              fontFamily: "var(--font-kalam)",
              color: "#1a3a10",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Kenya General Elections
          </span>
        </div>

        {/* Big number block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {/* 2027 — Permanent Marker */}
          <div
            style={{
              fontSize: "clamp(86px, 26vw, 120px)",
              fontFamily: "var(--font-marker)",
              lineHeight: 0.85,
              color: "#111111",
              letterSpacing: "-0.02em",
            }}
          >
            2027
          </div>

          <div
            style={{
              fontSize: "clamp(11px, 3vw, 14px)",
              fontFamily: "var(--font-kalam)",
              fontWeight: 700,
              color: "#6b7280",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            ELECTIONS
          </div>

          {/* IN X DAYS */}
          {countdown && (
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(12px, 3vw, 15px)",
                  fontFamily: "var(--font-kalam)",
                  fontWeight: 700,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                IN
              </span>
              <span
                className={vibrating ? "vibrate" : ""}
                style={{
                  fontSize: "clamp(60px, 19vw, 86px)",
                  fontFamily: "var(--font-marker)",
                  color: "#1a3a10",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {countdown.days}
              </span>
              <span
                style={{
                  fontSize: "clamp(12px, 3vw, 15px)",
                  fontFamily: "var(--font-kalam)",
                  fontWeight: 700,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                DAYS
              </span>
            </div>
          )}

          {/* NI MBAYA! — Permanent Marker */}
          <div
            style={{
              fontSize: "clamp(28px, 8vw, 42px)",
              fontFamily: "var(--font-marker)",
              color: "#1a3a10",
              borderBottom: "4px solid #f59e0b",
              paddingBottom: "4px",
              marginTop: "4px",
            }}
          >
            NI MBAYA! 😤
          </div>

          {/* Subline */}
          <p
            style={{
              fontSize: "14px",
              fontFamily: "var(--font-kalam)",
              color: "#6b7280",
              margin: "12px 0 0",
              lineHeight: 1.55,
            }}
          >
            Uisjifiche, IEBC haitakukula.
          </p>

          {/* HRS / MIN / SEC ticker — sketchy container */}
          {countdown && (
            <div
              className="sk-md"
              style={{
                display: "flex",
                gap: "0",
                background: "#f0f0eb",
                border: "2px solid #d1d5db",
                overflow: "hidden",
                marginTop: "16px",
              }}
            >
              {[
                { v: countdown.hours,   l: "HRS" },
                { v: countdown.minutes, l: "MIN" },
                { v: countdown.seconds, l: "SEC" },
              ].map(({ v, l }, i) => (
                <div
                  key={l}
                  style={{
                    textAlign: "center",
                    padding: "10px 18px",
                    borderRight: i < 2 ? "2px solid #d1d5db" : "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: "22px",
                      fontFamily: "var(--font-marker)",
                      color: "#1a3a10",
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
                      color: "#9ca3af",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      marginTop: "3px",
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
          <SwipeCTA onClick={() => router.push("/mobile/register")} />
          <p
            style={{
              fontSize: "12px",
              fontFamily: "var(--font-kalam)",
              color: "#9ca3af",
              margin: 0,
              textAlign: "center",
            }}
          >
            If you can queue for Nyege Nyege, queue once to vote.
          </p>
        </div>
      </div>
    </div>
  );
}

function SwipeCTA({ onClick }: { onClick: () => void }) {
  const [wiggling, setWiggling] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const usedRef = useRef(false);

  useEffect(() => {
    function schedule() {
      timerRef.current = setTimeout(() => {
        if (!usedRef.current) {
          setWiggling(true);
          setTimeout(() => {
            setWiggling(false);
            schedule();
          }, 800);
        }
      }, 3000);
    }
    schedule();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <button
      className={`sk-btn ${wiggling ? "wiggle" : ""}`}
      onClick={() => {
        usedRef.current = true;
        onClick();
      }}
      style={{
        width: "100%",
        padding: "18px 24px",
        background: "#1a3a10",
        border: "2.5px solid #1a3a10",
        color: "#ffffff",
        fontSize: "17px",
        fontFamily: "var(--font-marker)",
        cursor: "pointer",
        letterSpacing: "0.06em",
        /* Hard drop shadow = hand-drawn stamp feel */
        boxShadow: "4px 4px 0px #0d2008",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
      }}
    >
      SWIPE <span style={{ fontSize: "20px" }}>→</span>
    </button>
  );
}
