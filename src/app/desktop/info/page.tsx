"use client";

import { useState } from "react";
import { MYTH_CARDS } from "@/lib/data";

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

export default function DesktopInfoPage() {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ padding: "60px 0 80px" }}>
      {/* Header */}
      <div style={{ marginBottom: "56px" }}>
        <h1
          style={{
            fontSize: "44px",
            fontFamily: "var(--font-marker)",
            color: G.text,
            margin: "0 0 16px",
          }}
        >
          Myths vs Reality 🧠
        </h1>
        <p
          style={{
            fontSize: "17px",
            fontFamily: "var(--font-kalam)",
            color: G.muted,
            margin: "0 0 24px",
            maxWidth: "640px",
            lineHeight: 1.6,
          }}
        >
          These are the excuses we&apos;ve all heard — and the facts that make them collapse.
          Click a card to flip it.
        </p>
        <div
          className="sk-row"
          style={{
            display: "inline-block",
            background: "rgba(245,158,11,0.1)",
            border: `1.5px solid ${G.gold}`,
            padding: "10px 16px",
            boxShadow: "3px 3px 0px #f59e0b",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              fontFamily: "var(--font-kalam)",
              color: "#92400e",
              margin: 0,
              fontWeight: 700,
            }}
          >
            📊 In 2022, youth aged 18–24 were less than 10% of total votes.
            75% of Kenya is under 35. Make it make sense.
          </p>
        </div>
      </div>

      {/* Myth cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          marginBottom: "60px",
        }}
      >
        {MYTH_CARDS.map((card, idx) => {
          const isFlipped = flippedCards.has(card.id);
          return (
            <div
              key={card.id}
              onClick={() => toggleFlip(card.id)}
              style={{
                height: "310px",
                cursor: "pointer",
                perspective: "1000px",
                position: "relative",
              }}
            >
              {/* Front — myth, alternating sketch style */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: G.surface,
                  border: `2px solid ${G.border}`,
                  borderRadius: idx % 2 === 0
                    ? "255px 15px 225px 15px / 15px 225px 15px 255px"
                    : "15px 225px 15px 255px / 225px 15px 255px 15px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  opacity: isFlipped ? 0 : 1,
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  transition: "all 0.4s ease",
                  backfaceVisibility: "hidden",
                  pointerEvents: isFlipped ? "none" : "auto",
                  boxShadow: "4px 4px 0px #d1d5db",
                }}
              >
                <div>
                  <span style={{ fontSize: "36px", display: "block", marginBottom: "14px" }}>
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
                        letterSpacing: "0.08em",
                      }}
                    >
                      Myth
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "16px",
                      fontFamily: "var(--font-marker)",
                      color: G.text,
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    &ldquo;{card.myth}&rdquo;
                  </p>
                </div>
                <p style={{ fontSize: "12px", fontFamily: "var(--font-kalam)", color: G.muted, margin: 0 }}>
                  Click to see reality →
                </p>
              </div>

              {/* Back — reality */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: G.pale,
                  border: `2px solid ${G.mid}`,
                  borderRadius: idx % 2 === 0
                    ? "15px 255px 15px 225px / 225px 15px 255px 15px"
                    : "255px 15px 225px 15px / 15px 225px 15px 255px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  opacity: isFlipped ? 1 : 0,
                  transform: isFlipped ? "rotateY(0deg)" : "rotateY(-180deg)",
                  transition: "all 0.4s ease",
                  backfaceVisibility: "hidden",
                  pointerEvents: isFlipped ? "auto" : "none",
                  boxShadow: "4px 4px 0px #b8d4a8",
                }}
              >
                <div>
                  <div
                    className="sk-chip"
                    style={{
                      display: "inline-block",
                      background: "rgba(26,58,16,0.12)",
                      border: `1.5px solid ${G.mid}`,
                      padding: "3px 8px",
                      marginBottom: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        fontFamily: "var(--font-kalam)",
                        fontWeight: 700,
                        color: G.dark,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Reality
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      fontFamily: "var(--font-kalam)",
                      color: "#1f2937",
                      margin: "0 0 12px",
                      lineHeight: 1.6,
                    }}
                  >
                    {card.reality}
                  </p>
                  {card.stat && (
                    <div
                      className="sk-row"
                      style={{
                        background: "rgba(245,158,11,0.1)",
                        border: `1.5px solid ${G.gold}`,
                        padding: "8px 12px",
                        boxShadow: "2px 2px 0px #f59e0b",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          fontFamily: "var(--font-kalam)",
                          color: "#92400e",
                          fontWeight: 700,
                        }}
                      >
                        📊 {card.stat}
                      </span>
                    </div>
                  )}
                </div>
                <p style={{ fontSize: "12px", fontFamily: "var(--font-kalam)", color: G.muted, margin: 0 }}>
                  ← Click to flip back
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to action */}
      <div
        className="sk"
        style={{
          background: G.dark,
          border: "2px solid #0d2008",
          padding: "48px",
          textAlign: "center",
          boxShadow: "6px 6px 0px #0d2008",
        }}
      >
        <div
          style={{
            height: "3px",
            background: `linear-gradient(90deg, ${G.gold}, #dc2626, ${G.gold})`,
            borderRadius: "2px 6px 1px 5px / 5px 1px 6px 2px",
            maxWidth: "160px",
            margin: "0 auto 32px",
          }}
        />
        <h2
          style={{
            fontSize: "32px",
            fontFamily: "var(--font-marker)",
            color: "#ffffff",
            margin: "0 0 12px",
          }}
        >
          Bado una excuses? 🤨
        </h2>
        <p
          style={{
            fontSize: "16px",
            fontFamily: "var(--font-kalam)",
            color: "rgba(255,255,255,0.75)",
            margin: "0 0 32px",
            maxWidth: "500px",
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.6,
          }}
        >
          Umesoma hii yote. Unajua facts. Sasa jiregistre.
          Sisi ndio majority — lazima tufanye hii kitu.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://verify.iebc.or.ke"
            target="_blank"
            rel="noopener noreferrer"
            className="sk-btn"
            style={{
              padding: "14px 28px",
              background: G.gold,
              border: "2px solid #b87800",
              color: G.dark,
              textDecoration: "none",
              fontSize: "16px",
              fontFamily: "var(--font-marker)",
              boxShadow: "4px 4px 0px #b87800",
            }}
          >
            Cheki Status Yangu →
          </a>
          <a
            href="/desktop/register"
            className="sk-btn"
            style={{
              padding: "14px 28px",
              background: "transparent",
              border: "2px solid rgba(255,255,255,0.4)",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "16px",
              fontFamily: "var(--font-marker)",
              boxShadow: "4px 4px 0px rgba(255,255,255,0.2)",
            }}
          >
            Registration Guide
          </a>
        </div>
      </div>

      {/* Sources */}
      <div
        className="sk-row"
        style={{
          marginTop: "48px",
          padding: "24px",
          background: G.surface,
          border: `1.5px solid ${G.border}`,
          boxShadow: "3px 3px 0px #e5e7eb",
        }}
      >
        <h3
          style={{
            fontSize: "13px",
            fontFamily: "var(--font-kalam)",
            fontWeight: 800,
            color: G.muted,
            marginBottom: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Sources & Data
        </h3>
        <ul style={{ margin: 0, paddingLeft: "20px" }}>
          {[
            { text: "IEBC Official – How to Register", url: "https://www.iebc.or.ke/registration/?how" },
            { text: "Africa is a Country – Gen Z Electoral Dilemma (2026)", url: "https://africasacountry.com/2026/02/gen-zs-electoral-dilemma" },
            { text: "Nation Africa – Gen Z Power in 2027", url: "https://nation.africa/kenya/news/gen-z-power-why-7-in-10-plan-to-vote-in-2027--5273070" },
            { text: "IEBC Voter Registration Portal", url: "https://verify.iebc.or.ke" },
          ].map((source) => (
            <li key={source.url} style={{ marginBottom: "6px" }}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: G.dark, fontFamily: "var(--font-kalam)", fontSize: "13px", fontWeight: 600 }}
              >
                {source.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
