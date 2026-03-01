"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

/* ─── Hand-drawn SVG icons ────────────────────────────── */

function HomeIcon({ active }: { active: boolean }) {
  const c = active ? "#f59e0b" : "#9ca3af";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M2.8 12.3 C5.2 9.8 9.1 6.1 12.1 3.4 C15.2 6.2 18.9 9.7 21.2 12.1"
        stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M5.1 10.6 L5 20.4 L9.6 20.5 L9.5 14.8 L14.5 14.7 L14.4 20.5 L19.1 20.4 L19 10.4"
        stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function RegisterIcon({ active }: { active: boolean }) {
  const c = active ? "#f59e0b" : "#9ca3af";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M8.2 3.6 L6.1 3.7 C4.3 3.8 4.1 5.1 4 5.9 L3.9 20.1 C3.9 21.4 5 22 6.2 22.1 L17.8 22 C19.1 22 20 21.2 20.1 20 L20.2 5.8 C20.3 4.7 19.5 3.7 18.1 3.6 L15.9 3.5"
        stroke={c} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M8.2 3.5 C8.3 2.1 9.5 2 12 2 C14.5 2 15.8 2.2 15.9 3.6 L15.8 5.1 L8.2 5.2 Z"
        stroke={c} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M8.2 12.8 C9.4 13.9 10.6 15.2 11.4 15.9 C13.2 13.5 15.5 11 16.8 9.6"
        stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function CentresIcon({ active }: { active: boolean }) {
  const c = active ? "#f59e0b" : "#9ca3af";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2.4 C16.9 2.2 20.6 6 20.7 10.6 C20.8 15.8 13.2 21.6 12.1 22.2 C11.0 21.5 3.2 15.6 3.3 10.5 C3.4 5.9 7.1 2.6 12 2.4"
        stroke={c} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="12" cy="10.2" r="3" stroke={c} strokeWidth="2" fill="none" />
    </svg>
  );
}

function InfoIcon({ active }: { active: boolean }) {
  const c = active ? "#f59e0b" : "#9ca3af";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2.5 C17.6 2.3 21.5 6.4 21.6 12 C21.7 17.7 17.8 21.8 12 21.7 C6.3 21.6 2.4 17.5 2.3 11.9 C2.2 6.3 6.4 2.7 12 2.5"
        stroke={c} strokeWidth="2.1" strokeLinecap="round"
      />
      <circle cx="12" cy="8" r="1.3" fill={c} />
      <path
        d="M11.2 11.2 C11.6 11.1 12.5 11 12.8 11.1 L12.6 16.8"
        stroke={c} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Profile / avatar icon ───────────────────────────── */

function ProfileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {/* Head */}
      <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      {/* Shoulders */}
      <path
        d="M3.5 20.5 C3.5 16.4 7.4 13.1 12 13.1 C16.6 13.1 20.5 16.4 20.5 20.5"
        stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"
      />
    </svg>
  );
}

const NAV_ITEMS = [
  { href: "/mobile",          label: "Home",     Icon: HomeIcon     },
  { href: "/mobile/register", label: "Register", Icon: RegisterIcon },
  { href: "/mobile/centres",  label: "Centres",  Icon: CentresIcon  },
  { href: "/mobile/info",     label: "Info",     Icon: InfoIcon     },
];

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  /* ── Dev-only: stop the Next.js DevTools button from blocking HOME ── */
  useEffect(() => {
    const injectFix = () => {
      const portal = document.querySelector("nextjs-portal");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const shadow = (portal as any)?.shadowRoot as ShadowRoot | undefined;
      if (!shadow || shadow.querySelector("#nj-nav-fix")) return;
      const style = document.createElement("style");
      style.id = "nj-nav-fix";
      style.textContent = `
        #devtools-indicator {
          bottom: 76px !important;
          left: auto  !important;
          right: 16px !important;
        }
      `;
      shadow.appendChild(style);
    };
    injectFix();
    const t = setTimeout(injectFix, 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "var(--bg)",
        maxWidth: "430px",
        margin: "0 auto",
      }}
    >
      {/* Top header bar */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "430px",
          background: "var(--header-bg)",
          zIndex: 100,
          padding: "14px 20px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo + subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          <span
            style={{
              fontFamily: "var(--font-boogaloo)",
              fontSize: "28px",
              lineHeight: 1,
              color: "var(--header-text)",
            }}
          >
            GenZVoter
          </span>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 400,
              color: "var(--header-text)",
              letterSpacing: "0.01em",
              lineHeight: 1.2,
              opacity: 0.7,
            }}
          >
            2027 General Election
          </span>
        </div>

        {/* Profile avatar — click to toggle dark/light theme */}
        <button
          onClick={toggle}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            background: "var(--surface2)",
            border: "2px solid var(--border)",
            flexShrink: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--muted)",
            padding: 0,
          }}
        >
          <ProfileIcon />
        </button>

        {/* Partial-width divider */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "20px",
            right: "20px",
            height: "1px",
            background: "var(--header-border)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        />
      </header>

      {/* Spacer for fixed header */}
      <div style={{ height: "72px", flexShrink: 0 }} />

      {/* Pages live here — no page-level scroll; pages manage their own scroll */}
      <main
        style={{ flex: 1, overflow: "hidden" }}
        className="no-scrollbar"
      >
        {children}
      </main>

      {/* Spacer so flex layout gives main exactly (100dvh - 64px) of height */}
      <div style={{ height: "64px", flexShrink: 0 }} />

      {/* 4-tab sticky bottom nav */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "430px",
          minHeight: "64px",
          background: "var(--bottom-nav-bg)",
          borderTop: "1px solid var(--bottom-nav-border)",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "10px 0 env(safe-area-inset-bottom, 14px)",
          zIndex: 100,
          boxShadow: "0 -4px 16px rgba(0,0,0,0.05)",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/mobile"
              ? pathname === "/mobile"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                textDecoration: "none",
                padding: "4px 16px 4px",
                flex: 1,
              }}
            >
              <item.Icon active={isActive} />
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  fontFamily: "var(--font-kalam)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: isActive ? "#f59e0b" : "#9ca3af",
                  lineHeight: 1,
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <span
                  style={{
                    width: "28px",
                    height: "3px",
                    borderRadius: "2px 7px 1px 6px / 6px 1px 7px 2px",
                    background: "#f59e0b",
                    display: "block",
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
