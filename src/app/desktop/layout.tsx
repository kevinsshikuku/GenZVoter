"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/desktop",          label: "Home"        },
  { href: "/desktop/register", label: "Register"    },
  { href: "/desktop/info",     label: "Info & Myths" },
];

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
};

export default function DesktopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: G.bg,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Sticky top nav */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: G.dark,
          borderBottom: `3px solid ${G.gold}`,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 32px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="/desktop"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "24px" }}>🗳️</span>
            <span
              style={{
                fontSize: "22px",
                fontFamily: "var(--font-marker)",
                color: "#ffffff",
              }}
            >
              GenZ<span style={{ color: G.gold }}>Voter</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav style={{ display: "flex", gap: "4px" }}>
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/desktop"
                  ? pathname === "/desktop"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={isActive ? "sk-chip" : ""}
                  style={{
                    padding: "8px 18px",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontFamily: "var(--font-kalam)",
                    fontWeight: 700,
                    color: isActive ? G.gold : "rgba(255,255,255,0.65)",
                    background: isActive ? "rgba(245,158,11,0.12)" : "transparent",
                    border: isActive ? `1.5px solid rgba(245,158,11,0.4)` : "1.5px solid transparent",
                    transition: "color 0.2s ease",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA button — sketchy */}
          <a
            href="https://verify.iebc.or.ke"
            target="_blank"
            rel="noopener noreferrer"
            className="sk-btn"
            style={{
              padding: "9px 18px",
              background: G.gold,
              border: `2px solid #b87800`,
              color: G.dark,
              textDecoration: "none",
              fontSize: "13px",
              fontFamily: "var(--font-kalam)",
              fontWeight: 700,
              boxShadow: "3px 3px 0px #b87800",
            }}
          >
            Check Registration →
          </a>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          padding: "0 32px",
        }}
      >
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: `2px solid ${G.border}`,
          padding: "32px",
          textAlign: "center",
          background: G.surface,
        }}
      >
        <p
          style={{
            fontSize: "13px",
            fontFamily: "var(--font-kalam)",
            color: G.muted,
            margin: 0,
          }}
        >
          GenZVoter 2027 · Not affiliated with IEBC. Data sourced from IEBC official channels. ·{" "}
          <a
            href="https://www.iebc.or.ke"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: G.dark, fontWeight: 700 }}
          >
            iebc.or.ke
          </a>
        </p>
      </footer>
    </div>
  );
}
