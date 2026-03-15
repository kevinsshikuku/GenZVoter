"use client";

import { useState, useRef } from "react";
import { REGISTRATION_CENTRES } from "@/lib/data";
import type { RegistrationCentre } from "@/lib/types";
import BrushButton from "@/components/mobile/BrushButton";
import { useCentresSearch } from "@/shared/hooks/useCentresSearch";
import {
  Search,
  Xmark,
  MapPin,
  Pin,
  Clock,
  Phone,
  InfoCircle,
  MapsArrow,
  Building,
} from "iconoir-react";

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

/* ── Search bar component ── */
function SearchBar({
  value,
  onChange,
  resultCount,
  loading,
  totalCentres,
}: {
  value: string;
  onChange: (v: string) => void;
  resultCount: number;
  loading: boolean;
  totalCentres: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ padding: "0 16px 10px", flexShrink: 0 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: G.surface,
          border: `2px solid ${value ? G.dark : G.border}`,
          borderRadius: "999px",
          padding: "9px 14px",
          transition: "border-color 0.15s",
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Search icon */}
        <Search width={17} height={17} strokeWidth={2} style={{ flexShrink: 0, color: G.muted }} />

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search any area, school, market..."
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: "clamp(13px, 3.8vw, 15px)",
            fontFamily: "var(--font-kalam)",
            color: "var(--foreground)",
            lineHeight: 1.2,
          }}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />

        {/* Clear button */}
        {value.length > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); onChange(""); inputRef.current?.focus(); }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 4px",
              color: G.muted,
              lineHeight: 1,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
            }}
            aria-label="Clear search"
          >
            <Xmark width={15} height={15} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Results count hint */}
      {value.trim().length > 0 && (
        <p
          style={{
            fontSize: "11px",
            fontFamily: "var(--font-kalam)",
            color: loading ? G.muted : (resultCount > 0 ? G.dark : "#dc2626"),
            margin: "5px 0 0 4px",
            lineHeight: 1,
          }}
        >
          {loading
            ? "Searching…"
            : resultCount > 0
              ? `${resultCount} centre${resultCount !== 1 ? "s" : ""} found`
              : `No centres match "${value.trim()}" — try shorter words`}
        </p>
      )}
      {value.trim().length === 0 && totalCentres > 0 && (
        <p
          style={{
            fontSize: "10px",
            fontFamily: "var(--font-kalam)",
            color: G.muted,
            margin: "4px 0 0 4px",
            lineHeight: 1,
          }}
        >
          {totalCentres} centres across Kenya
        </p>
      )}
    </div>
  );
}

export default function CentresTab() {
  const [view, setView] = useState<"categories" | "list">("categories");
  const [activeType, setActiveType] = useState<CatType | null>(null);
  const { query, setQuery, results, loading, totalCentres } = useCentresSearch();

  const activeCat = CATEGORIES.find((c) => c.type === activeType);
  const filteredCentres = activeType
    ? REGISTRATION_CENTRES.filter((c) => c.type === activeType)
    : [];

  const isSearching = query.trim().length > 0;

  /* ── Category list view ── */
  if (view === "list" && activeCat && !isSearching) {
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
            flexShrink: 0,
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

        {/* Search bar inside list view */}
        <div style={{ padding: "10px 16px 4px", background: G.bg, flexShrink: 0 }}>
          <SearchBar
            value={query}
            onChange={setQuery}
            resultCount={results.length}
            loading={loading}
            totalCentres={totalCentres}
          />
        </div>

        {/* Centre list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 20px" }} className="no-scrollbar">
          {filteredCentres.map((centre, i) => (
            <CentreCard key={centre.id} centre={centre} cat={activeCat} />
          ))}
        </div>
      </div>
    );
  }

  /* ── Categories view (default) + search overlay ── */
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
      {/* Sticky header + search */}
      <div style={{ padding: "16px 16px 0", flexShrink: 0 }}>
        <SearchBar
          value={query}
          onChange={setQuery}
          resultCount={results.length}
          loading={loading}
          totalCentres={totalCentres}
        />
      </div>

      {/* Body — either search results or category buttons */}
      <div style={{ flex: 1, overflowY: "auto", padding: "6px 16px 20px" }} className="no-scrollbar">
        {isSearching ? (
          /* ── Search results ── */
          <>
            {results.length === 0 && !loading && (
              <div style={{ textAlign: "center", paddingTop: "40px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <Search width={32} height={32} strokeWidth={1.5} style={{ color: G.muted }} />
                <p style={{ fontFamily: "var(--font-kalam)", color: G.muted, fontSize: "14px", margin: 0 }}>
                  Try a different word
                </p>
              </div>
            )}
            {results.map((centre, i) => {
              const cat = CATEGORIES.find((c) => c.type === centre.type) ?? CATEGORIES[0];
              return (
                <CentreCard key={centre.id} centre={centre} cat={cat} showTypeBadge />
              );
            })}
          </>
        ) : (
          /* ── Category buttons ── */
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "0", alignItems: "center" }}>
              {CATEGORIES.map((cat, i) => {
                const count = REGISTRATION_CENTRES.filter((c) => c.type === cat.type).length;
                return (
                  <div
                    key={cat.type}
                    className="cat-btn-wrap"
                    style={{ ...(i > 0 ? { marginTop: "-30px" } : {}), zIndex: i === 1 ? 1 : "auto" }}
                  >
                    <BrushButton
                      label={`${cat.icon}  ${cat.shortLabel} (${count})`}
                      subtitle={cat.description}
                      onClick={() => { setActiveType(cat.type); setView("list"); }}
                      width="min(96vw, 400px)"
                      fontSize="clamp(14px, 4vw, 20px)"
                      height="clamp(100px, calc((100dvh - 266px) / 3), 170px)"
                      style={{ height: "clamp(100px, calc((100dvh - 266px) / 3), 170px)" }}
                    />
                  </div>
                );
              })}
            </div>

            {/* IEBC link */}
            <div style={{ marginTop: "20px", padding: "0 4px" }}>
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
          </>
        )}
      </div>
    </div>
  );
}

/* ── Single centre row card ── */
function CentreCard({
  centre,
  cat,
  showTypeBadge = false,
}: {
  centre: RegistrationCentre;
  cat: typeof CATEGORIES[number];
  showTypeBadge?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      onClick={() => setOpen((p) => !p)}
      style={{
        background: G.surface,
        border: `1.5px solid ${open ? cat.accent : G.border}`,
        borderRadius: "8px",
        padding: "14px 16px",
        marginBottom: "8px",
        cursor: "pointer",
        transition: "border-color 0.15s",
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
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
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
            {showTypeBadge && (
              <span
                style={{
                  fontSize: "9px",
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  background: cat.accent,
                  color: "#fff",
                  borderRadius: "20px",
                  padding: "1px 7px",
                  lineHeight: 1.6,
                  flexShrink: 0,
                }}
              >
                {cat.shortLabel}
              </span>
            )}
          </div>
          {centre.landmark && !open && (
            <p
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-kalam)",
                color: G.muted,
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Pin width={11} height={11} strokeWidth={1.8} style={{ flexShrink: 0 }} />
              {centre.landmark}
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
              <Pin width={11} height={11} strokeWidth={1.8} style={{ color: cat.accent, flexShrink: 0 }} />
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
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <MapPin width={12} height={12} strokeWidth={1.8} style={{ flexShrink: 0 }} />
            {centre.address}
          </p>

          {/* Ward / constituency */}
          {centre.ward && (
            <p style={{ fontSize: "11px", fontFamily: "var(--font-kalam)", color: G.muted, margin: 0, display: "flex", alignItems: "center", gap: "5px" }}>
              <Building width={11} height={11} strokeWidth={1.8} style={{ flexShrink: 0 }} />
              {centre.ward} Ward · {centre.constituency}
            </p>
          )}
          {!centre.ward && (
            <p style={{ fontSize: "11px", fontFamily: "var(--font-kalam)", color: G.muted, margin: 0, display: "flex", alignItems: "center", gap: "5px" }}>
              <Building width={11} height={11} strokeWidth={1.8} style={{ flexShrink: 0 }} />
              {centre.constituency}
            </p>
          )}

          {/* Hours */}
          {centre.hours && (
            <p style={{ fontSize: "11px", fontFamily: "var(--font-kalam)", color: G.muted, margin: 0, display: "flex", alignItems: "center", gap: "5px" }}>
              <Clock width={11} height={11} strokeWidth={1.8} style={{ flexShrink: 0 }} />
              {centre.hours}
            </p>
          )}

          {/* Notes */}
          {centre.notes && (
            <p style={{ fontSize: "11px", fontFamily: "var(--font-kalam)", color: G.muted, margin: 0, fontStyle: "italic", display: "flex", alignItems: "center", gap: "5px" }}>
              <InfoCircle width={11} height={11} strokeWidth={1.8} style={{ flexShrink: 0 }} />
              {centre.notes}
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
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Phone width={12} height={12} strokeWidth={1.8} style={{ flexShrink: 0 }} />
              {centre.phone}
            </a>
          )}

          {/* Google Maps link */}
          {centre.googleMapsUrl && (
            <a
              href={centre.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                fontSize: "12px",
                fontFamily: "var(--font-kalam)",
                fontWeight: 700,
                color: cat.accent,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <MapsArrow width={12} height={12} strokeWidth={1.8} style={{ flexShrink: 0 }} />
              Get Directions
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
