"use client";

import { useState } from "react";
import { REQUIREMENTS, GAME_LEVELS, REGISTRATION_CENTRES } from "@/lib/data";

const COUNTIES = Array.from(
  new Set(REGISTRATION_CENTRES.map((c) => c.county))
).sort();

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

export default function DesktopRegisterPage() {
  const [selectedCounty, setSelectedCounty] = useState<string>("Nairobi");
  const [expandedLevel, setExpandedLevel] = useState<number | null>(1);

  const filteredCentres = REGISTRATION_CENTRES.filter(
    (c) => c.county === selectedCounty
  );

  return (
    <div style={{ padding: "60px 0 80px" }}>
      <div style={{ marginBottom: "48px" }}>
        <h1
          style={{
            fontSize: "44px",
            fontFamily: "var(--font-marker)",
            color: G.text,
            margin: "0 0 12px",
          }}
        >
          Jiregistre — Hatua kwa Hatua
        </h1>
        <p
          style={{
            fontSize: "17px",
            fontFamily: "var(--font-kalam)",
            color: G.muted,
            margin: 0,
            maxWidth: "600px",
            lineHeight: 1.6,
          }}
        >
          Voter registration is straightforward. Less steps than creating a
          TikTok account. Here&apos;s exactly what you need and what to do.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "48px",
          alignItems: "start",
        }}
      >
        {/* Left: Quest Steps */}
        <div>
          <h2
            style={{
              fontSize: "22px",
              fontFamily: "var(--font-marker)",
              color: G.text,
              marginBottom: "20px",
            }}
          >
            🎮 The 4-Level Quest
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {GAME_LEVELS.map((level) => (
              <div
                key={level.id}
                className={expandedLevel === level.id ? "sk" : "sk-row"}
                style={{
                  background: G.surface,
                  border: `2px solid ${expandedLevel === level.id ? G.dark : G.border}`,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "border-color 0.2s ease",
                  boxShadow: expandedLevel === level.id
                    ? "4px 4px 0px #1a3a10"
                    : "2px 2px 0px #d1d5db",
                }}
                onClick={() =>
                  setExpandedLevel(expandedLevel === level.id ? null : level.id)
                }
              >
                <div
                  style={{
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <span style={{ fontSize: "28px" }}>{level.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <p
                        style={{
                          fontSize: "11px",
                          fontFamily: "var(--font-kalam)",
                          fontWeight: 700,
                          color: G.mid,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          margin: "0 0 4px",
                        }}
                      >
                        Level {level.id}
                      </p>
                      <span
                        style={{
                          fontSize: "12px",
                          fontFamily: "var(--font-kalam)",
                          fontWeight: 700,
                          color: "#92400e",
                          background: "rgba(245,158,11,0.1)",
                          padding: "2px 8px",
                          borderRadius: "8px 2px 6px 2px/2px 6px 2px 8px",
                        }}
                      >
                        +{level.xp} XP
                      </span>
                    </div>
                    <h3
                      style={{
                        fontSize: "17px",
                        fontFamily: "var(--font-marker)",
                        color: G.text,
                        margin: "0 0 2px",
                      }}
                    >
                      {level.title}
                    </h3>
                    <p style={{ fontSize: "13px", fontFamily: "var(--font-kalam)", color: G.muted, margin: 0 }}>
                      {level.subtitle}
                    </p>
                  </div>
                  <span style={{ color: G.border2, fontSize: "13px" }}>
                    {expandedLevel === level.id ? "▲" : "▼"}
                  </span>
                </div>

                {expandedLevel === level.id && (
                  <div style={{ padding: "0 24px 20px", borderTop: `1.5px solid ${G.border}` }}>
                    <div style={{ paddingTop: "16px" }}>
                      <ol
                        style={{
                          paddingLeft: "20px",
                          margin: "0 0 16px",
                          color: "#374151",
                          fontFamily: "var(--font-kalam)",
                        }}
                      >
                        {level.steps.map((step, i) => (
                          <li key={i} style={{ marginBottom: "8px", fontSize: "15px", lineHeight: 1.5 }}>
                            {step}
                          </li>
                        ))}
                      </ol>
                      {level.note && (
                        <div
                          className="sk-row"
                          style={{
                            background: "rgba(245,158,11,0.08)",
                            border: "1.5px solid rgba(245,158,11,0.3)",
                            padding: "14px",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "14px",
                              fontFamily: "var(--font-kalam)",
                              color: "#92400e",
                              margin: 0,
                              lineHeight: 1.5,
                              fontWeight: 700,
                            }}
                          >
                            💡 {level.note}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Requirements + Centres */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* Requirements */}
          <div>
            <h2
              style={{
                fontSize: "22px",
                fontFamily: "var(--font-marker)",
                color: G.text,
                marginBottom: "20px",
              }}
            >
              📋 What You Need
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
              {/* To Register */}
              <div
                className="sk"
                style={{
                  background: G.surface,
                  border: `2px solid ${G.border}`,
                  padding: "20px",
                  boxShadow: "3px 3px 0px #d1d5db",
                }}
              >
                <h3
                  style={{
                    fontSize: "13px",
                    fontFamily: "var(--font-kalam)",
                    fontWeight: 800,
                    color: G.dark,
                    marginBottom: "14px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  🖐️ To Register
                </h3>
                {REQUIREMENTS.toRegister.map((r) => (
                  <div key={r.text} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "16px" }}>{r.icon}</span>
                    <span style={{ fontSize: "13px", fontFamily: "var(--font-kalam)", color: "#374151", lineHeight: 1.4 }}>
                      {r.text}
                    </span>
                  </div>
                ))}
              </div>
              {/* To Vote */}
              <div
                className="sk-alt"
                style={{
                  background: G.pale,
                  border: `2px solid ${G.border2}`,
                  padding: "20px",
                  boxShadow: "3px 3px 0px #b8d4a8",
                }}
              >
                <h3
                  style={{
                    fontSize: "13px",
                    fontFamily: "var(--font-kalam)",
                    fontWeight: 800,
                    color: G.dark,
                    marginBottom: "14px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  🗳️ To Vote
                </h3>
                {REQUIREMENTS.toVote.map((r) => (
                  <div key={r.text} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "16px" }}>{r.icon}</span>
                    <span style={{ fontSize: "13px", fontFamily: "var(--font-kalam)", color: "#374151", lineHeight: 1.4 }}>
                      {r.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status check CTA */}
            <div
              className="sk-md"
              style={{
                background: G.dark,
                border: "2px solid #0d2008",
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "4px 4px 0px #0d2008",
              }}
            >
              <div>
                <h3 style={{ fontSize: "16px", fontFamily: "var(--font-marker)", color: "#ffffff", margin: "0 0 4px" }}>
                  Tayari umeshajiregistra?
                </h3>
                <p style={{ fontSize: "13px", fontFamily: "var(--font-kalam)", color: "rgba(255,255,255,0.6)", margin: 0 }}>
                  Verify your status on the official IEBC portal.
                </p>
              </div>
              <a
                href="https://verify.iebc.or.ke"
                target="_blank"
                rel="noopener noreferrer"
                className="sk-btn"
                style={{
                  padding: "10px 18px",
                  background: G.gold,
                  border: "2px solid #b87800",
                  color: G.dark,
                  textDecoration: "none",
                  fontSize: "13px",
                  fontFamily: "var(--font-kalam)",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  boxShadow: "2px 2px 0px #b87800",
                }}
              >
                Check Status →
              </a>
            </div>
          </div>

          {/* Centres by county */}
          <div>
            <h2
              style={{
                fontSize: "22px",
                fontFamily: "var(--font-marker)",
                color: G.text,
                marginBottom: "16px",
              }}
            >
              📍 Registration Centres
            </h2>

            {/* County filter buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              {COUNTIES.map((county) => (
                <button
                  key={county}
                  onClick={() => setSelectedCounty(county)}
                  className={selectedCounty === county ? "sk-chip" : ""}
                  style={{
                    padding: "7px 14px",
                    border: `1.5px solid ${selectedCounty === county ? G.dark : G.border}`,
                    background: selectedCounty === county ? G.pale : G.surface,
                    color: selectedCounty === county ? G.dark : G.muted,
                    fontSize: "12px",
                    fontFamily: "var(--font-kalam)",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    borderRadius: selectedCounty === county ? undefined : "6px",
                    boxShadow: selectedCounty === county ? "2px 2px 0px #1a3a10" : "none",
                  }}
                >
                  {county}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {filteredCentres.length === 0 ? (
                <p style={{ color: G.muted, fontFamily: "var(--font-kalam)", fontSize: "14px", padding: "16px" }}>
                  No centres listed for this county yet. Check iebc.or.ke for the full directory.
                </p>
              ) : (
                filteredCentres.map((centre) => (
                  <div
                    key={centre.id}
                    className="sk-row"
                    style={{
                      background: G.surface,
                      border: `1.5px solid ${G.border}`,
                      padding: "16px",
                      boxShadow: "2px 2px 0px #e5e7eb",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span
                        style={{
                          width: "7px",
                          height: "7px",
                          borderRadius: "50%",
                          background: centre.status === "open" ? "#16a34a" : "#dc2626",
                          display: "inline-block",
                          flexShrink: 0,
                        }}
                      />
                      <h3 style={{ fontSize: "15px", fontFamily: "var(--font-kalam)", fontWeight: 700, color: G.text, margin: 0 }}>
                        {centre.name}
                      </h3>
                    </div>
                    <p style={{ fontSize: "13px", fontFamily: "var(--font-kalam)", color: G.muted, margin: "4px 0 0" }}>
                      📍 {centre.address}
                    </p>
                    {centre.hours && (
                      <p style={{ fontSize: "12px", fontFamily: "var(--font-kalam)", color: G.muted, margin: "4px 0 0" }}>
                        🕐 {centre.hours}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
