"use client";

import { useState } from "react";
import { REGISTRATION_CENTRES } from "@/lib/data";
import type { RegistrationCentre } from "@/lib/types";
import BrushButton from "@/components/mobile/BrushButton";

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

/* ── Category definitions ── */
const CATEGORIES = [
  {
    type: "constituency" as const,
    label: "Constituency Offices",
    shortLabel: "Constituency",
    description: "Official IEBC offices — one per constituency. Permanent & always staffed.",
    icon: "🏛️",
    accent: G.dark,
    accentPale: G.pale,
    sketchBorder: "255px 15px 225px 15px / 15px 225px 15px 255px",
    shadowColor: "var(--green-dark)",
  },
  {
    type: "ward" as const,
    label: "Ward Registration Points",
    shortLabel: "Ward Points",
    description: "Schools & community halls at ward level — within each constituency.",
    icon: "🏫",
    accent: "#1d4ed8",
    accentPale: "#eff6ff",
    sketchBorder: "15px 225px 15px 255px / 225px 15px 255px 15px",
    shadowColor: "#1d4ed8",
  },
  {
    type: "dynamic" as const,
    label: "Dynamic Centres",
    shortLabel: "Dynamic",
    description: "Markets, malls & stadiums. Open only during special IEBC registration exercises.",
    icon: "⚡",
    accent: "#b45309",
    accentPale: "#fffbeb",
    sketchBorder: "120px 10px 100px 12px / 10px 100px 12px 120px",
    shadowColor: "#b45309",
  },
] as const;

type CatType = typeof CATEGORIES[number]["type"];

/* ── Status dot colour ── */
function statusColor(s: RegistrationCentre["status"]) {
  if (s === "open")     return "#16a34a";
  if (s === "seasonal") return "#f59e0b";
  return "#dc2626";
}
function statusLabel(s: RegistrationCentre["status"]) {
  if (s === "open")     return "Open";
  if (s === "seasonal") return "Exercise only";
  return "Closed";
}

export default function CentresPage() {
  const [view, setView] = useState<"categories" | "list">("categories");
  const [activeType, setActiveType] = useState<CatType | null>(null);

  const activeCat = CATEGORIES.find((c) => c.type === activeType);
  const filteredCentres = activeType
    ? REGISTRATION_CENTRES.filter((c) => c.type === activeType)
    : [];

  /* ── Category selection ── */
  if (view === "list" && activeCat) {
    return (
      <div
        style={{
          height: "100%",
          background: G.bg,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: activeCat.accent,
            padding: "8px 16px 10px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {/* Back */}
          <BrushButton
            label="← Back"
            onClick={() => { setView("categories"); setActiveType(null); }}
            variant="small"
            showArrow={false}
            fontSize="clamp(9px, 2.5vw, 11px)"
            width="clamp(80px, 22vw, 110px)"
            height="34px"
          />

          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: "20px", flexShrink: 0 }}>{activeCat.icon}</span>
            <div>
              <h1
                style={{
                  fontSize: "17px",
                  fontFamily: "var(--font-marker)",
                  color: "#ffffff",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                {activeCat.label}
              </h1>
              <p
                style={{
                  fontSize: "11px",
                  fontFamily: "var(--font-kalam)",
                  color: "rgba(255,255,255,0.75)",
                  margin: "1px 0 0",
                }}
              >
                {filteredCentres.length} centre{filteredCentres.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>


        {/* Centre list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 20px" }} className="no-scrollbar">
          {filteredCentres.map((centre, i) => (
            <CentreCard key={centre.id} centre={centre} cat={activeCat} index={i} />
          ))}
        </div>
      </div>
    );
  }

  /* ── Categories view (default) ── */
  return (
    <div
      style={{
        height: "100%",
        background: G.bg,
        padding: "24px 20px 16px",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
      className="no-scrollbar"
    >
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <p
          style={{
            fontSize: "11px",
            fontFamily: "var(--font-kalam)",
            fontWeight: 700,
            color: G.dark,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            margin: "0 0 5px",
          }}
        >
          Registration Centres 📍
        </p>
        <h1
          style={{
            fontSize: "28px",
            fontFamily: "var(--font-marker)",
            color: G.text,
            margin: "0 0 5px",
            lineHeight: 1.1,
          }}
        >
          Find a Centre
        </h1>
        <p
          style={{
            fontSize: "13px",
            fontFamily: "var(--font-kalam)",
            color: G.muted,
            margin: 0,
          }}
        >
          {REGISTRATION_CENTRES.length} centres across Kenya. Pick a type below.
        </p>
      </div>

      {/* 3 category buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0", alignItems: "center" }}>
        {CATEGORIES.map((cat, i) => {
          const count = REGISTRATION_CENTRES.filter((c) => c.type === cat.type).length;
          return (
            <BrushButton
              key={cat.type}
              label={`${cat.icon}  ${cat.shortLabel} (${count})`}
              subtitle={cat.description}
              onClick={() => { setActiveType(cat.type); setView("list"); }}
              width="min(96vw, 400px)"
              fontSize="clamp(14px, 4vw, 20px)"
              height="clamp(100px, calc((100dvh - 266px) / 3), 170px)"
              style={{ height: "clamp(100px, calc((100dvh - 266px) / 3), 170px)", ...(i > 0 ? { marginTop: "-30px" } : {}) }}
            />
          );
        })}
      </div>

      {/* IEBC link */}
      <div
        style={{
          marginTop: "20px",
          padding: "12px 16px",
          background: G.surface,
          border: `1.5px solid ${G.border}`,
          borderRadius: "6px 20px 5px 18px / 18px 5px 20px 6px",
          boxShadow: "2px 2px 0px #d1d5db",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontFamily: "var(--font-kalam)",
            color: G.muted,
            margin: "0 0 4px",
          }}
        >
          Need the full national list?
        </p>
        <a
          href="https://kiongozi.online/iebc-constituency-offices"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "13px",
            fontFamily: "var(--font-kalam)",
            fontWeight: 700,
            color: G.dark,
            textDecoration: "underline",
          }}
        >
          All IEBC Offices → kiongozi.online
        </a>
      </div>
    </div>
  );
}

/* ── Single centre row card ── */
function CentreCard({
  centre,
  cat,
  index,
}: {
  centre: RegistrationCentre;
  cat: typeof CATEGORIES[number];
  index: number;
}) {
  const [open, setOpen] = useState(false);

  /* Alternate sketchy border per card for variety */
  const radius = index % 2 === 0
    ? "255px 12px 225px 12px / 12px 225px 12px 255px"
    : "12px 225px 12px 255px / 225px 12px 255px 12px";

  return (
    <div
      onClick={() => setOpen((p) => !p)}
      style={{
        background: G.surface,
        border: `2px solid ${open ? cat.accent : G.border}`,
        borderRadius: radius,
        padding: "14px 16px",
        marginBottom: "10px",
        cursor: "pointer",
        boxShadow: open
          ? `3px 3px 0px ${cat.accent}`
          : "2px 2px 0px #d1d5db",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
    >
      {/* Row header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
        {/* Status dot */}
        <span
          style={{
            width: "9px",
            height: "9px",
            borderRadius: "50%",
            background: statusColor(centre.status),
            display: "inline-block",
            flexShrink: 0,
            marginTop: "5px",
          }}
        />

        {/* Name + landmark preview */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: "14px",
              fontFamily: "var(--font-kalam)",
              fontWeight: 700,
              color: G.text,
              margin: "0 0 2px",
              lineHeight: 1.25,
            }}
          >
            {centre.name}
          </h3>
          {centre.landmark && !open && (
            <p
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-kalam)",
                color: G.muted,
                margin: 0,
              }}
            >
              📌 {centre.landmark}
            </p>
          )}
        </div>

        {/* Expand chevron */}
        <span
          style={{
            fontSize: "12px",
            color: open ? cat.accent : G.muted,
            fontFamily: "var(--font-kalam)",
            fontWeight: 700,
            flexShrink: 0,
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          ›
        </span>
      </div>

      {/* Expanded detail */}
      {open && (
        <div
          style={{
            marginTop: "10px",
            paddingTop: "10px",
            borderTop: `1.5px dashed ${G.border}`,
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {/* Landmark */}
          {centre.landmark && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: cat.accentPale,
                border: `1.5px solid ${cat.accent}`,
                borderRadius: "20px 4px 18px 4px / 4px 18px 4px 20px",
                padding: "3px 10px",
                alignSelf: "flex-start",
              }}
            >
              <span style={{ fontSize: "11px" }}>📌</span>
              <span
                style={{
                  fontSize: "11px",
                  fontFamily: "var(--font-kalam)",
                  fontWeight: 700,
                  color: cat.accent,
                }}
              >
                {centre.landmark}
              </span>
            </div>
          )}

          {/* Address */}
          <p
            style={{
              fontSize: "12px",
              fontFamily: "var(--font-kalam)",
              color: G.muted,
              margin: 0,
            }}
          >
            📍 {centre.address}
          </p>

          {/* Ward / constituency */}
          {centre.ward && (
            <p style={{ fontSize: "11px", fontFamily: "var(--font-kalam)", color: G.muted, margin: 0 }}>
              🗂 {centre.ward} Ward · {centre.constituency}
            </p>
          )}
          {!centre.ward && (
            <p style={{ fontSize: "11px", fontFamily: "var(--font-kalam)", color: G.muted, margin: 0 }}>
              🗂 {centre.constituency}
            </p>
          )}

          {/* Hours */}
          {centre.hours && (
            <p style={{ fontSize: "11px", fontFamily: "var(--font-kalam)", color: G.muted, margin: 0 }}>
              🕐 {centre.hours}
            </p>
          )}

          {/* Phone */}
          {centre.phone && (
            <a
              href={`tel:${centre.phone}`}
              onClick={(e) => e.stopPropagation()}
              style={{
                fontSize: "12px",
                fontFamily: "var(--font-kalam)",
                fontWeight: 700,
                color: cat.accent,
                textDecoration: "none",
              }}
            >
              📞 {centre.phone}
            </a>
          )}

          {/* Status pill */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
            <span
              style={{
                width: "7px", height: "7px",
                borderRadius: "50%",
                background: statusColor(centre.status),
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-kalam)",
                fontWeight: 700,
                color: statusColor(centre.status),
              }}
            >
              {statusLabel(centre.status)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
