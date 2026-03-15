"use client";

import { useState, useEffect, useRef } from "react";
import BrushButton from "@/components/mobile/BrushButton";
import { useMpesaVerify } from "@/shared/hooks/useMpesaVerify";

interface MpesaGateProps {
  onSuccess: () => void;
  onDismiss: () => void;
}

export default function MpesaGate({ onSuccess, onDismiss }: MpesaGateProps) {
  const { step, error, waitMessage, initiatePayment, reset } = useMpesaVerify();
  const [phone, setPhone] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  // Show phone input on mount
  useEffect(() => {
    if (step === "idle") reset();
  }, [step, reset]);

  // Auto-advance after success flash
  useEffect(() => {
    if (step === "success") {
      const t = setTimeout(() => onSuccess(), 700);
      return () => clearTimeout(t);
    }
  }, [step, onSuccess]);

  // Focus phone input when showing
  useEffect(() => {
    if (step === "phone-input") {
      setTimeout(() => phoneRef.current?.focus(), 300);
    }
  }, [step]);

  const displayError = localError ?? error;

  // ── Validate & submit ──────────────────────────────────────────────────

  function handleSubmit() {
    setLocalError(null);

    // Strip spaces/dashes
    const cleaned = phone.replace(/[\s\-]/g, "");

    // Validate: should be 9 digits (we prepend 254)
    if (!/^\d{9}$/.test(cleaned)) {
      setLocalError("Weka number ya Mpesa");
      return;
    }

    // Validate starts with 7 or 1 (Safaricom, Airtel, etc.)
    if (!/^[17]/.test(cleaned)) {
      setLocalError("Nambari lazima ianze na 7 au 1.");
      return;
    }

    initiatePayment(`0${cleaned}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @keyframes gateSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes successPop {
          0%   { transform: scale(0.5); opacity: 0; }
          60%  { transform: scale(1.2); }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
          50%      { box-shadow: 0 0 0 12px rgba(76, 175, 80, 0); }
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onDismiss}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 199,
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          background: "var(--surface)",
          borderRadius: "20px 20px 0 0",
          padding: "28px 24px 40px",
          animation: "gateSlideUp 0.3s ease",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        {/* Drag handle */}
        <div style={{
          width: 40,
          height: 4,
          borderRadius: 2,
          background: "var(--border)",
          marginBottom: 4,
        }} />

        {/* ── Phone Input Step ────────────────────────────────────── */}
        {step === "phone-input" && (
          <>
            <h2 style={{
              fontFamily: "var(--font-boogaloo)",
              fontSize: "clamp(22px, 6vw, 28px)",
              color: "var(--text)",
              margin: 0,
              textAlign: "center",
            }}>
              Verify wewe sio Bot
            </h2>

            <p style={{
              fontFamily: "var(--font-boogaloo)",
              fontSize: "clamp(16px, 4vw, 20px)",
              color: "var(--green-dark)",
              margin: "-4px 0 0",
              textAlign: "center",
              fontWeight: 400,
            }}>
              Mpesa 1bob 💰
            </p>

            <p style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 12,
              color: "var(--subtle)",
              margin: 0,
              textAlign: "center",
              lineHeight: 1.4,
            }}>
              Utatumia 1 bob via M-Pesa kuverify wewe ni mtu halisi.
            </p>

            {/* Phone input with +254 prefix */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              width: "min(85vw, 300px)",
              border: "2px solid var(--border)",
              borderRadius: 12,
              background: "var(--bg)",
              overflow: "hidden",
              transition: "border-color 0.15s",
            }}>
              {/* Country prefix */}
              <div style={{
                padding: "14px 12px",
                background: "var(--surface2, var(--bg))",
                borderRight: "2px solid var(--border)",
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: 16,
                fontWeight: 600,
                color: "var(--text)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexShrink: 0,
              }}>
                <span>🇰🇪</span>
                <span>+254</span>
              </div>

              {/* Number input */}
              <input
                ref={phoneRef}
                type="tel"
                inputMode="numeric"
                maxLength={9}
                value={phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 9);
                  setPhone(val);
                  setLocalError(null);
                }}
                onKeyDown={handleKeyDown}
                placeholder="712345678"
                style={{
                  flex: 1,
                  padding: "14px 12px",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "var(--text)",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: "0.05em",
                  width: "100%",
                }}
              />
            </div>

            {displayError && <ErrorMsg msg={displayError} />}

            <BrushButton
              label="Confirm"
              onClick={handleSubmit}
              showArrow
              width="min(80vw, 260px)"
            />

            <button
              onClick={onDismiss}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--subtle)",
                fontSize: 12,
                fontFamily: "system-ui, -apple-system, sans-serif",
                padding: "2px 0",
              }}
            >
              Cancel
            </button>
          </>
        )}

        {/* ── Waiting Step ────────────────────────────────────────── */}
        {step === "waiting" && (
          <>
            <div style={{
              width: 48,
              height: 48,
              border: "4px solid var(--border)",
              borderTopColor: "var(--green-dark)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />

            <h2 style={{
              fontFamily: "var(--font-boogaloo)",
              fontSize: "clamp(20px, 5vw, 24px)",
              color: "var(--text)",
              margin: 0,
              textAlign: "center",
            }}>
              Check simu yako...
            </h2>

            <p style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 14,
              color: "var(--muted)",
              margin: 0,
              textAlign: "center",
              lineHeight: 1.5,
            }}>
              Ingiza M-Pesa PIN yako 📱
            </p>

            <div style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "var(--green-dark)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "pulseGlow 2s ease infinite",
              marginTop: 8,
            }}>
              <span style={{ fontSize: 28 }}>💰</span>
            </div>

            <p style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 11,
              color: waitMessage ? "var(--muted)" : "var(--subtle)",
              margin: "4px 0 0",
              textAlign: "center",
              transition: "color 0.3s",
            }}>
              {waitMessage || "Inaprocess... subiri kidogo"}
            </p>
          </>
        )}

        {/* ── Success Step ────────────────────────────────────────── */}
        {step === "success" && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            padding: "16px 0",
          }}>
            <div style={{ fontSize: 80, lineHeight: 1, animation: "successPop 0.4s ease" }}>
              ✅
            </div>
            <p style={{
              fontFamily: "var(--font-boogaloo)",
              fontSize: "clamp(20px, 5vw, 26px)",
              color: "var(--text)",
              margin: 0,
            }}>
              Verified! Uko sawa.
            </p>
          </div>
        )}

        {/* ── Error Step ──────────────────────────────────────────── */}
        {step === "error" && (
          <>
            <div style={{ fontSize: 64, lineHeight: 1 }}>
              {displayError?.includes("Kama ulilipa") ? "⏳" : "❌"}
            </div>
            <h2 style={{
              fontFamily: "var(--font-boogaloo)",
              fontSize: "clamp(18px, 5vw, 22px)",
              color: "var(--text)",
              margin: 0,
              textAlign: "center",
            }}>
              {displayError?.includes("Kama ulilipa") ? "Safaricom inadelay" : "Haikufanya kazi"}
            </h2>
            {displayError && <ErrorMsg msg={displayError} />}
            <BrushButton label="Retry" onClick={reset} showArrow width="min(80vw, 260px)" />
            <button
              onClick={onDismiss}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--subtle)",
                fontSize: 12,
                fontFamily: "system-ui, -apple-system, sans-serif",
                padding: "2px 0",
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────────

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <p style={{
      fontSize: 13,
      color: "#ef4444",
      margin: 0,
      textAlign: "center",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      {msg}
    </p>
  );
}
