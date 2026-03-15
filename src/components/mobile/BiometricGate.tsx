"use client";

import { useState, useEffect, useRef } from "react";
import BrushButton from "@/components/mobile/BrushButton";
import { useBiometric } from "@/shared/hooks/useBiometric";

interface BiometricGateProps {
  onSuccess: () => void;
  onDismiss: () => void;
}

type Step =
  | "prompt"
  | "verifying"
  | "pin-setup"
  | "pin-verify"
  | "success"
  | "error";

export default function BiometricGate({ onSuccess, onDismiss }: BiometricGateProps) {
  const { support, isReady, isVerifying, error, register, verify, setPinFallback, verifyPin } =
    useBiometric();

  const isCommitted = typeof window !== "undefined" &&
    localStorage.getItem("genz-biometric-committed") === "true";
  const storedMethod =
    typeof window !== "undefined"
      ? localStorage.getItem("genz-biometric-method")
      : null;

  const [step, setStep] = useState<Step>("prompt");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [localError, setLocalError] = useState<string | null>(null);
  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Auto-advance to correct prompt once biometric detection is ready
  useEffect(() => {
    if (isReady && step === "prompt") {
      if (isCommitted && storedMethod === "pin") {
        setStep("pin-verify");
      }
      // else: always show fingerprint prompt first — PIN accessible as fallback
    }
  }, [isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-advance after success flash
  useEffect(() => {
    if (step === "success") {
      const t = setTimeout(() => onSuccess(), 700);
      return () => clearTimeout(t);
    }
  }, [step, onSuccess]);

  const displayError = localError ?? error;

  // ── Actions ────────────────────────────────────────────────────────────────

  async function handleBiometric() {
    setLocalError(null);
    setStep("verifying");
    const ok = isCommitted ? await verify() : await register();
    if (ok) {
      markVerified();
      setStep("success");
    } else {
      setStep("error");
    }
  }

  async function handlePinSetup() {
    const full = pin.join("");
    if (full.length !== 4) {
      setLocalError("Weka nambari 4 za PIN.");
      return;
    }
    setLocalError(null);
    const ok = await setPinFallback(full);
    if (ok) { markVerified(); setStep("success"); }
  }

  async function handlePinVerify() {
    const full = pin.join("");
    if (full.length !== 4) {
      setLocalError("Weka nambari 4 za PIN.");
      return;
    }
    setLocalError(null);
    const ok = await verifyPin(full);
    if (ok) {
      markVerified();
      setStep("success");
    } else {
      setPin(["", "", "", ""]);
      pinRefs[0].current?.focus();
    }
  }

  function handlePinInput(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...pin];
    next[index] = digit;
    setPin(next);
    if (digit && index < 3) {
      pinRefs[index + 1].current?.focus();
    }
  }

  function handlePinKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  }

  function markVerified() {
    localStorage.setItem("genz-verified", "true");
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const showLoading = isVerifying || step === "verifying" || !isReady;

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

        {/* ── Verifying ─────────────────────────────────────────────── */}
        {showLoading && step !== "success" && step !== "error" && (
          <>
            <div style={{
              width: 40,
              height: 40,
              border: "4px solid var(--border)",
              borderTopColor: "var(--green-dark)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
            <p style={{ fontFamily: "var(--font-boogaloo)", fontSize: 20, color: "var(--text)", margin: 0 }}>
              inacheck...
            </p>
          </>
        )}

        {/* ── Prompt (WebAuthn) ──────────────────────────────────────── */}
        {!showLoading && (step === "prompt") && (
          <>
            <button
              onClick={handleBiometric}
              aria-label="Scan fingerprint"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                fontSize: 88,
                lineHeight: 1,
                transition: "transform 0.15s ease",
              }}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.92)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
              onTouchStart={e => (e.currentTarget.style.transform = "scale(0.92)")}
              onTouchEnd={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              🫆
            </button>
            <h2 style={{
              fontFamily: "var(--font-boogaloo)",
              fontSize: "clamp(22px, 6vw, 28px)",
              color: "var(--text)",
              margin: 0,
              textAlign: "center",
            }}>
              Confirm Wewe sio Robot
            </h2>
            <p style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 12,
              color: "var(--subtle)",
              margin: 0,
              textAlign: "center",
            }}>
              Tap the fingerprint above
            </p>

            <button
              onClick={() => setStep("pin-setup")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted)",
                fontSize: 13,
                fontFamily: "system-ui, -apple-system, sans-serif",
                textDecoration: "underline",
                padding: "4px 0",
              }}
            >
              Huna biometrics? Use PIN instead
            </button>
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

        {/* ── PIN Setup ─────────────────────────────────────────────── */}
        {!showLoading && step === "pin-setup" && (
          <>
            <div style={{ fontSize: 48, lineHeight: 1 }}>🔐</div>
            <h2 style={{
              fontFamily: "var(--font-boogaloo)",
              fontSize: "clamp(20px, 5vw, 24px)",
              color: "var(--text)",
              margin: 0,
              textAlign: "center",
            }}>
              Set a 4-digit PIN
            </h2>
            <p style={{
              fontSize: 13,
              color: "var(--muted)",
              margin: 0,
              textAlign: "center",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}>
              Itabaki kwenye phone yako tu.
            </p>
            <PinInput pin={pin} refs={pinRefs} onInput={handlePinInput} onKeyDown={handlePinKeyDown} />
            {displayError && <ErrorMsg msg={displayError} />}
            <BrushButton label="Set PIN" onClick={handlePinSetup} showArrow width="min(80vw, 260px)" />
          </>
        )}

        {/* ── PIN Verify ────────────────────────────────────────────── */}
        {!showLoading && step === "pin-verify" && (
          <>
            <h2 style={{
              fontFamily: "var(--font-boogaloo)",
              fontSize: "clamp(20px, 5vw, 24px)",
              color: "var(--text)",
              margin: 0,
              textAlign: "center",
            }}>
              Weka any number
            </h2>
            <PinInput pin={pin} refs={pinRefs} onInput={handlePinInput} onKeyDown={handlePinKeyDown} />
            {displayError && <ErrorMsg msg={displayError} />}
            <BrushButton label="Confirm" onClick={handlePinVerify} showArrow width="min(80vw, 260px)" />
            <button
              onClick={onDismiss}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--subtle)",
                fontSize: 12,
                fontFamily: "system-ui, -apple-system, sans-serif",
                padding: "4px 0",
              }}
            >
              Cancel
            </button>
          </>
        )}

        {/* ── Error ─────────────────────────────────────────────────── */}
        {step === "error" && (
          <>
            <div style={{ fontSize: 64, lineHeight: 1 }}>❌</div>
            <h2 style={{
              fontFamily: "var(--font-boogaloo)",
              fontSize: "clamp(18px, 5vw, 22px)",
              color: "var(--text)",
              margin: 0,
              textAlign: "center",
            }}>
              Haikufanya kazi
            </h2>
            {displayError && <ErrorMsg msg={displayError} />}
            <BrushButton label="Retry" onClick={handleBiometric} showArrow width="min(80vw, 260px)" />
            <button
              onClick={() => { setStep("pin-setup"); setLocalError(null); }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted)",
                fontSize: 13,
                fontFamily: "system-ui, -apple-system, sans-serif",
                textDecoration: "underline",
                padding: "4px 0",
              }}
            >
              Use PIN instead
            </button>
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

        {/* ── Success ───────────────────────────────────────────────── */}
        {step === "success" && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            padding: "16px 0",
          }}>
            <div style={{ fontSize: 80, lineHeight: 1, animation: "successPop 0.4s ease" }}>✅</div>
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
      </div>
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function PinInput({
  pin,
  refs,
  onInput,
  onKeyDown,
}: {
  pin: string[];
  refs: React.RefObject<HTMLInputElement | null>[];
  onInput: (i: number, v: string) => void;
  onKeyDown: (i: number, e: React.KeyboardEvent) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
      {pin.map((digit, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="number"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => onInput(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          style={{
            width: 52,
            height: 64,
            borderRadius: 12,
            border: `2px solid ${digit ? "var(--green-dark)" : "var(--border)"}`,
            background: "var(--bg)",
            color: "var(--text)",
            fontSize: 28,
            fontWeight: 900,
            textAlign: "center",
            outline: "none",
            transition: "border-color 0.15s",
            // hide number spinners
            MozAppearance: "textfield",
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

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
