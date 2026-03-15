"use client";

import { useEffect, useState } from "react";

function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return true; // SSR: assume mobile, gate runs client-side
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export default function MobileGate({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  // While detecting, render nothing to avoid flash
  if (isMobile === null) return null;

  if (!isMobile) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1a1a",
          flexDirection: "column",
          gap: "24px",
          padding: "32px",
          textAlign: "center",
          fontFamily: "var(--font-kalam), cursive",
        }}
      >
        <h1
          style={{
            color: "#f0fdf0",
            fontSize: "28px",
            fontWeight: 800,
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          The app is in development for computer users
        </h1>
        <p
          style={{
            color: "#86efac",
            fontSize: "16px",
            margin: 0,
            maxWidth: "400px",
            lineHeight: 1.6,
          }}
        >
          Open this on your phone for the full experience.
        </p>
        <div
          style={{
            padding: "20px 40px",
            background: "#2a2a2a",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <p
            style={{
              color: "#aaaaaa",
              fontSize: "14px",
              margin: 0,
              fontFamily: "var(--font-kalam), cursive",
              fontWeight: 700,
            }}
          >
            To support development:
          </p>
          <p
            style={{
              color: "#ffffff",
              fontSize: "26px",
              fontWeight: 700,
              margin: 0,
              fontFamily: "Arial, Helvetica, sans-serif",
              letterSpacing: "0.04em",
              WebkitUserSelect: "text",
              MozUserSelect: "text",
              msUserSelect: "text",
              userSelect: "text",
              cursor: "text",
            }}
          >
            Mpesa · 0113201208
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
