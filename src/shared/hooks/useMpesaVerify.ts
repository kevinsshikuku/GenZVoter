"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { MpesaStep } from "@/lib/types";

// ── localStorage keys ────────────────────────────────────────────────────────

const TOKEN_KEY = "genz-mpesa-token";
const EXPIRY_KEY = "genz-mpesa-expiry";

// ── Legacy cleanup (old biometric keys) ──────────────────────────────────────

function cleanupLegacyKeys() {
  try {
    localStorage.removeItem("genz-biometric-committed");
    localStorage.removeItem("genz-biometric-method");
    localStorage.removeItem("genz-biometric-pin");
    localStorage.removeItem("genz-verified");
  } catch {
    // ignore
  }
}

// ── Quick client-side verification check (no network) ────────────────────────

export function isMpesaVerifiedLocal(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = localStorage.getItem(EXPIRY_KEY);
    if (!token || !expiry) return false;
    return new Date(expiry).getTime() > Date.now();
  } catch {
    return false;
  }
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export interface UseMpesaVerifyReturn {
  isVerified: boolean;
  isChecking: boolean;
  step: MpesaStep;
  error: string | null;
  waitMessage: string | null;
  initiatePayment: (phone: string) => Promise<void>;
  reset: () => void;
}

export function useMpesaVerify(): UseMpesaVerifyReturn {
  const [isVerified, setIsVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [step, setStep] = useState<MpesaStep>("idle");
  const [error, setError] = useState<string | null>(null);
  const [waitMessage, setWaitMessage] = useState<string | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slowRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // ── Cleanup on unmount ──────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (slowRef.current) clearTimeout(slowRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  // ── On mount: validate existing token ──────────────────────────────────

  useEffect(() => {
    cleanupLegacyKeys();

    async function checkToken() {
      const token = localStorage.getItem(TOKEN_KEY);
      const expiry = localStorage.getItem(EXPIRY_KEY);

      // Quick client-side check first
      if (!token || !expiry || new Date(expiry).getTime() <= Date.now()) {
        clearStoredToken();
        setIsVerified(false);
        setIsChecking(false);
        return;
      }

      // Server-side HMAC validation
      try {
        const res = await fetch("/api/mpesa/verify-token", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.valid) {
          setIsVerified(true);
        } else {
          clearStoredToken();
          setIsVerified(false);
        }
      } catch {
        // Network error — trust client-side check (token exists & not expired)
        setIsVerified(true);
      }

      setIsChecking(false);
    }

    checkToken();
  }, []);

  // ── Initiate payment ──────────────────────────────────────────────────

  const initiatePayment = useCallback(async (phone: string) => {
    setError(null);
    setWaitMessage(null);
    setStep("waiting");

    // Clean up any previous poll
    stopPolling();

    try {
      // 1. Call STK push endpoint
      const res = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "M-Pesa request failed.");
        setStep("error");
        return;
      }

      const { checkoutRequestId } = data;
      const stkSentAt = Date.now();

      // 2. Wait 7 seconds before first poll — user needs time to
      //    receive the STK push and enter their PIN. Polling too early
      //    can get false positives from sandbox or stale results.
      const controller = new AbortController();
      abortRef.current = controller;

      await new Promise((r) => setTimeout(r, 7000));

      // Check if we were aborted during the wait
      if (controller.signal.aborted) return;

      pollRef.current = setInterval(async () => {
        const elapsed = Date.now() - stkSentAt;
        try {
          const statusRes = await fetch(
            `/api/mpesa/status?id=${encodeURIComponent(checkoutRequestId)}&phone=${encodeURIComponent(phone)}&sentAt=${stkSentAt}`,
            { signal: controller.signal }
          );
          const statusData = await statusRes.json();

          if (statusData.status === "completed") {
            // PAYMENT CONFIRMED — store token and let user in
            localStorage.setItem(TOKEN_KEY, statusData.token);
            localStorage.setItem(EXPIRY_KEY, statusData.expiresAt);
            setIsVerified(true);
            setStep("success");
            stopPolling();
          } else if (statusData.status === "failed") {
            // Only stop for DEFINITIVE failures (cancelled, wrong pin, etc.)
            setError(statusData.message || "Payment haikufika. Jaribu tena.");
            setStep("error");
            stopPolling();
          } else if (statusData.status === "pending") {
            // Still processing — update message if server sends one
            if (statusData.message) {
              setWaitMessage(statusData.message);
            }
            // Keep polling — do NOT show error
          }
        } catch (err) {
          if ((err as Error).name === "AbortError") return;
          // Network error during poll — keep trying, don't give up
          setWaitMessage("Network slow... bado tunajaribu.");
        }
      }, 3000);

      // 3. After 30 seconds, show "taking longer" message (but keep polling)
      slowRef.current = setTimeout(() => {
        setWaitMessage("Safaricom inachukua muda zaidi. Bado tunasubiri...");
      }, 30000);

      // 4. Timeout after 120 seconds (2 minutes — very generous)
      // Even then, don't show "failed" — show a special timeout message
      // that acknowledges the user may have paid
      timeoutRef.current = setTimeout(() => {
        setError(
          "Safaricom hajaconfirm kwa muda mrefu. Kama ulilipa, jaribu tena — hautacharge tena."
        );
        setStep("error");
        stopPolling();
      }, 120000);
    } catch {
      setError("Network error. Check internet yako.");
      setStep("error");
    }
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────

  function stopPolling() {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    if (slowRef.current) { clearTimeout(slowRef.current); slowRef.current = null; }
    if (abortRef.current) { abortRef.current.abort(); abortRef.current = null; }
  }

  function clearStoredToken() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(EXPIRY_KEY);
    } catch {
      // ignore
    }
  }

  const reset = useCallback(() => {
    stopPolling();
    setStep("phone-input");
    setError(null);
    setWaitMessage(null);
  }, []);

  return {
    isVerified,
    isChecking,
    step,
    error,
    waitMessage,
    initiatePayment,
    reset,
  };
}
