"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCountdown } from "@/lib/countdown";
import type { CountdownValues } from "@/lib/countdown";
import { MYTH_CARDS, GAME_LEVELS } from "@/lib/data";

const G = {
  dark:    "#1a3a10",
  mid:     "#2d5a1a",
  pale:    "#e6f0de",
  gold:    "#f59e0b",
  bg:      "#f5f5f0",
  surface: "#ffffff",
  text:    "#111111",
  muted:   "#6b7280",
  border:  "#e5e7eb",
  border2: "#d1d5db",
};

export default function DesktopHome() {
  const [countdown, setCountdown] = useState<CountdownValues | null>(null);

  useEffect(() => {
    setCountdown(getCountdown());
    const id = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section
        style={{
          padding: "80px 0 60px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "60px",
          alignItems: "center",
        }}
      >
        <div>
          {/* Kenya badge */}
          <div
            className="sk-sm"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: G.pale,
              border: `2px solid ${G.mid}`,
              padding: "6px 14px",
              marginBottom: "24px",
            }}
          >
            <span style={{ fontSize: "12px" }}>🇰🇪</span>
            <span
              style={{
                fontSize: "12px",
                fontFamily: "var(--font-kalam)",
                fontWeight: 700,
                color: G.dark,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Kenya 2027 Elections
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(40px, 4vw, 64px)",
              fontFamily: "var(--font-marker)",
              lineHeight: 1.1,
              color: G.text,
              margin: "0 0 20px",
            }}
          >
            2027 Toke na{" "}
            <span style={{ color: G.dark }}>Mbogi</span> 👀
          </h1>
          <p
            style={{
              fontSize: "18px",
              fontFamily: "var(--font-kalam)",
              color: G.muted,
              lineHeight: 1.6,
              margin: "0 0 32px",
              maxWidth: "480px",
            }}
          >
            Sisi ndio majority — 75% of Kenya is under 35. Lakini youth ni
            chini ya 10% ya kura. Hii lazima ibadilike 2027.
          </p>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <Link
              href="/desktop/register"
              className="sk-btn"
              style={{
                padding: "14px 28px",
                background: G.dark,
                border: `2px solid #0d2008`,
                color: "#fff",
                textDecoration: "none",
                fontSize: "16px",
                fontFamily: "var(--font-marker)",
                boxShadow: "4px 4px 0px #0d2008",
              }}
            >
              Jiregistre Sasa →
            </Link>
            <Link
              href="/desktop/info"
              className="sk-btn"
              style={{
                padding: "14px 28px",
                background: "transparent",
                border: `2px solid ${G.dark}`,
                color: G.dark,
                textDecoration: "none",
                fontSize: "16px",
                fontFamily: "var(--font-marker)",
                boxShadow: "4px 4px 0px #1a3a10",
              }}
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Countdown card */}
        <div
          className="sk"
          style={{
            background: G.surface,
            border: `2px solid ${G.border2}`,
            padding: "40px",
            textAlign: "center",
            boxShadow: "6px 6px 0px #d1d5db",
          }}
        >
          <div
            style={{
              height: "4px",
              background: `linear-gradient(90deg, ${G.dark} 0%, ${G.gold} 50%, #dc2626 100%)`,
              borderRadius: "2px 6px 1px 5px / 5px 1px 6px 2px",
              marginBottom: "24px",
            }}
          />
          <p
            style={{
              fontSize: "13px",
              fontFamily: "var(--font-kalam)",
              color: G.muted,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 700,
              marginBottom: "24px",
            }}
          >
            Elections in
          </p>
          {countdown && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              {[
                { value: countdown.days,    label: "Days"    },
                { value: countdown.hours,   label: "Hours"   },
                { value: countdown.minutes, label: "Minutes" },
                { value: countdown.seconds, label: "Seconds" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="sk-md"
                  style={{
                    background: G.pale,
                    border: `2px solid ${G.border2}`,
                    padding: "18px 8px",
                    boxShadow: "2px 2px 0px #c0d4b0",
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(28px, 3vw, 40px)",
                      fontFamily: "var(--font-marker)",
                      color: G.dark,
                      fontVariantNumeric: "tabular-nums",
                      lineHeight: 1,
                    }}
                  >
                    {String(value).padStart(2, "0")}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      fontFamily: "var(--font-kalam)",
                      color: G.muted,
                      marginTop: "6px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div
            className="sk-row"
            style={{
              background: G.pale,
              padding: "12px 16px",
              border: `1.5px solid ${G.border2}`,
            }}
          >
            <p
              style={{
                fontSize: "13px",
                fontFamily: "var(--font-kalam)",
                color: G.dark,
                margin: 0,
                fontStyle: "italic",
                fontWeight: 700,
              }}
            >
              &ldquo;If you can queue for Nyege Nyege, you can queue once to vote.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section
        style={{
          padding: "40px 0",
          borderTop: `2px solid ${G.border}`,
          borderBottom: `2px solid ${G.border}`,
          marginBottom: "60px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "40px",
            textAlign: "center",
          }}
        >
          {[
            { stat: "< 10%", desc: "Youth votes in 2022 election", emoji: "📉" },
            { stat: "75%",   desc: "Of Kenya is under 35 years old", emoji: "📊" },
            { stat: "2.3M",  desc: "Youth aged 18–24 registered in 2022", emoji: "🗳️" },
          ].map((item) => (
            <div key={item.stat}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>{item.emoji}</div>
              <div
                style={{
                  fontSize: "36px",
                  fontFamily: "var(--font-marker)",
                  color: G.dark,
                  marginBottom: "8px",
                }}
              >
                {item.stat}
              </div>
              <p style={{ fontSize: "14px", fontFamily: "var(--font-kalam)", color: G.muted, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "0 0 60px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2
            style={{
              fontSize: "36px",
              fontFamily: "var(--font-marker)",
              color: G.text,
              margin: "0 0 12px",
            }}
          >
            Jinsi ya Kujiregistra 🎮
          </h2>
          <p style={{ fontSize: "16px", fontFamily: "var(--font-kalam)", color: G.muted, margin: 0 }}>
            4 levels. Less than a TikTok account to create.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
          }}
        >
          {GAME_LEVELS.map((level, idx) => (
            <div
              key={level.id}
              /* Alternate sketch rotation per card for variety */
              className={idx % 2 === 0 ? "sk-md" : "sk-alt"}
              style={{
                background: G.surface,
                border: `2px solid ${G.border}`,
                padding: "28px 20px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "3px 3px 0px #d1d5db",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0,
                  height: "3px",
                  background: G.dark,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "14px",
                  fontSize: "11px",
                  fontFamily: "var(--font-kalam)",
                  fontWeight: 700,
                  color: "#92400e",
                  background: "rgba(245,158,11,0.12)",
                  padding: "2px 7px",
                  borderRadius: "8px 2px 6px 2px / 2px 6px 2px 8px",
                }}
              >
                +{level.xp} XP
              </div>
              <div style={{ fontSize: "36px", marginBottom: "14px" }}>{level.emoji}</div>
              <div
                style={{
                  fontSize: "11px",
                  fontFamily: "var(--font-kalam)",
                  fontWeight: 700,
                  color: G.mid,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "6px",
                }}
              >
                Level {level.id}
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontFamily: "var(--font-marker)",
                  color: G.text,
                  margin: "0 0 8px",
                }}
              >
                {level.title}
              </h3>
              <ul style={{ paddingLeft: "16px", margin: 0 }}>
                {level.steps.slice(0, 2).map((step, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: "13px",
                      fontFamily: "var(--font-kalam)",
                      color: G.muted,
                      marginBottom: "4px",
                      lineHeight: 1.4,
                    }}
                  >
                    {step}
                  </li>
                ))}
                {level.steps.length > 2 && (
                  <li style={{ fontSize: "12px", fontFamily: "var(--font-kalam)", color: G.border2 }}>
                    +{level.steps.length - 2} more steps
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <Link
            href="/desktop/register"
            className="sk-btn"
            style={{
              display: "inline-block",
              padding: "14px 32px",
              background: G.dark,
              border: `2px solid #0d2008`,
              color: "#fff",
              textDecoration: "none",
              fontSize: "16px",
              fontFamily: "var(--font-marker)",
              boxShadow: "4px 4px 0px #0d2008",
            }}
          >
            Start Registration Guide →
          </Link>
        </div>
      </section>

      {/* Myths preview */}
      <section style={{ padding: "0 0 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2
            style={{
              fontSize: "32px",
              fontFamily: "var(--font-marker)",
              color: G.text,
              margin: "0 0 12px",
            }}
          >
            Myths Debunked 🧠
          </h2>
          <p style={{ fontSize: "15px", fontFamily: "var(--font-kalam)", color: G.muted }}>
            Common excuses, kai reality check.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {MYTH_CARDS.slice(0, 3).map((card, idx) => (
            <div
              key={card.id}
              className={idx % 2 === 0 ? "sk" : "sk-alt"}
              style={{
                background: G.surface,
                border: `2px solid ${G.border}`,
                padding: "24px",
                boxShadow: "3px 3px 0px #d1d5db",
              }}
            >
              <span style={{ fontSize: "32px", display: "block", marginBottom: "12px" }}>
                {card.emoji}
              </span>
              <div
                className="sk-chip"
                style={{
                  display: "inline-block",
                  background: "rgba(239,68,68,0.08)",
                  border: "1.5px solid rgba(239,68,68,0.25)",
                  padding: "3px 8px",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontFamily: "var(--font-kalam)",
                    fontWeight: 700,
                    color: "#dc2626",
                    textTransform: "uppercase",
                  }}
                >
                  Myth
                </span>
              </div>
              <p
                style={{
                  fontSize: "15px",
                  fontFamily: "var(--font-marker)",
                  color: G.text,
                  margin: "0 0 12px",
                  lineHeight: 1.4,
                }}
              >
                &ldquo;{card.myth}&rdquo;
              </p>
              <p style={{ fontSize: "13px", fontFamily: "var(--font-kalam)", color: G.muted, margin: 0, lineHeight: 1.5 }}>
                {card.reality.slice(0, 100)}...
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "28px" }}>
          <Link
            href="/desktop/info"
            className="sk-btn"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              border: `2px solid ${G.dark}`,
              background: "transparent",
              color: G.dark,
              textDecoration: "none",
              fontSize: "14px",
              fontFamily: "var(--font-marker)",
              boxShadow: "3px 3px 0px #1a3a10",
            }}
          >
            See All {MYTH_CARDS.length} Myths →
          </Link>
        </div>
      </section>
    </div>
  );
}
