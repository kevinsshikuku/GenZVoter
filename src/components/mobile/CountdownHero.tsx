"use client";

import Image from "next/image";
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
        background: "var(--surface)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Kenya flag — home page only */}
      <div
        style={{
          width: "100%",
          background: "var(--surface)",
          flex: "0 0 30%",
          minHeight: 0,
          position: "relative",
        }}
      >
        <Image
          src="/assets/kenyan-flag.png"
          alt="Kenya flag"
          fill
          style={{ objectFit: "contain" }}
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
          justifyContent: "center",
          padding: "0 24px 16px",
          gap: "12px",
          textAlign: "center",
        }}
      >
        {/* Big number block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
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
                  fontSize: "clamp(60px, 19vw, 86px)",
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
                  fontSize: "clamp(12px, 3vw, 15px)",
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

          {/* NI MBAYA! — Permanent Marker */}
          <div
            style={{
              fontSize: "clamp(28px, 8vw, 42px)",
              fontFamily: "var(--font-marker)",
              color: "var(--green-dark)",
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
              color: "var(--muted)",
              margin: "12px 0 0",
              lineHeight: 1.55,
            }}
          >
            Ukilalisha usiwai lia aty hakuna change bro!!
          </p>

          {/* HRS / MIN / SEC ticker — sketchy container */}
          {countdown && (
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              {[
                { v: countdown.hours,   l: "HRS" },
                { v: countdown.minutes, l: "MIN" },
                { v: countdown.seconds, l: "SEC" },
              ].map(({ v, l }) => (
                <div
                  key={l}
                  style={{
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  <div
                    style={{
                      fontSize: "22px",
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
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <SwipeCTA onClick={() => router.push("/mobile/register")} />
          <p
            style={{
              fontSize: "12px",
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
        width: "65%",
        padding: "18px 24px",
        background: "var(--green-dark)",
        border: "2.5px solid var(--green-dark)",
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
      Cheki hio List <span style={{ fontSize: "16px" }}>→</span>
    </button>
  );
}
