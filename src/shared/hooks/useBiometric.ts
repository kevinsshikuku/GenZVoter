"use client";

import { useState, useEffect, useCallback } from "react";
import type { BiometricSupport } from "@/lib/types";

// ── IndexedDB helpers ──────────────────────────────────────────────────────────

const DB_NAME = "genz-voter";
const STORE_NAME = "biometric";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE_NAME);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbGet(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function dbPut(key: string, value: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const req = tx.objectStore(STORE_NAME).put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // silently fail — PIN fallback will be used
  }
}

async function dbDelete(key: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).delete(key);
      tx.oncomplete = () => resolve();
    });
  } catch {
    // ignore
  }
}

// ── Base64url helpers ──────────────────────────────────────────────────────────

function bufferToBase64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function base64urlToBuffer(b64: string): ArrayBuffer {
  const padded = b64.replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(padded);
  const buf = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i);
  return buf.buffer;
}

function randomBytes(n: number): Uint8Array<ArrayBuffer> {
  const arr = new Uint8Array(new ArrayBuffer(n));
  crypto.getRandomValues(arr);
  return arr;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

interface UseBiometricReturn {
  support: BiometricSupport;
  isReady: boolean;
  isVerifying: boolean;
  error: string | null;
  register: () => Promise<boolean>;
  verify: () => Promise<boolean>;
  setPinFallback: (pin: string) => Promise<boolean>;
  verifyPin: (pin: string) => Promise<boolean>;
  clearCredential: () => Promise<void>;
}

export function useBiometric(): UseBiometricReturn {
  const [support, setSupport] = useState<BiometricSupport>("pin-fallback");
  const [isReady, setIsReady] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function detect() {
      if (
        typeof window !== "undefined" &&
        window.PublicKeyCredential &&
        typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === "function"
      ) {
        try {
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setSupport(available ? "webauthn" : "pin-fallback");
        } catch {
          setSupport("pin-fallback");
        }
      } else {
        setSupport("pin-fallback");
      }
      setIsReady(true);
    }
    detect();
  }, []);

  const register = useCallback(async (): Promise<boolean> => {
    setError(null);
    setIsVerifying(true);
    try {
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: randomBytes(16),
          rp: { id: window.location.hostname, name: "GenZ Voter" },
          user: {
            id: randomBytes(8),
            name: "voter",
            displayName: "GenZ Voter",
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 },   // ES256
            { type: "public-key", alg: -257 },  // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
          },
          timeout: 60000,
        },
      }) as PublicKeyCredential | null;

      if (!credential) throw new Error("No credential returned");

      const credId = bufferToBase64url(credential.rawId);
      await dbPut("credential-id", credId);
      localStorage.setItem("genz-biometric-committed", "true");
      localStorage.setItem("genz-biometric-method", "webauthn");
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("NotAllowedError") || msg.includes("not allowed")) {
        setError("Ulikataa scan. Jaribu tena.");
      } else {
        setError("Fingerprint haikufanya kazi. Jaribu tena.");
      }
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, []);

  const verify = useCallback(async (): Promise<boolean> => {
    setError(null);
    setIsVerifying(true);
    try {
      const credId = await dbGet("credential-id");
      if (!credId) throw new Error("No credential stored");

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: randomBytes(16),
          allowCredentials: [
            { type: "public-key", id: base64urlToBuffer(credId) },
          ],
          userVerification: "required",
          timeout: 60000,
        },
      }) as PublicKeyCredential | null;

      if (!credential) throw new Error("Verification failed");
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("NotAllowedError") || msg.includes("not allowed")) {
        setError("Ulikataa scan. Jaribu tena.");
      } else {
        setError("Fingerprint haikufanya kazi. Jaribu tena.");
      }
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, []);

  const setPinFallback = useCallback(async (pin: string): Promise<boolean> => {
    try {
      const encoded = new TextEncoder().encode(pin);
      const hashBuf = await crypto.subtle.digest("SHA-256", encoded);
      const hashHex = Array.from(new Uint8Array(hashBuf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      localStorage.setItem("genz-biometric-pin", hashHex);
      localStorage.setItem("genz-biometric-committed", "true");
      localStorage.setItem("genz-biometric-method", "pin");
      return true;
    } catch {
      setError("PIN haikuweza kusavishwa. Jaribu tena.");
      return false;
    }
  }, []);

  const verifyPin = useCallback(async (pin: string): Promise<boolean> => {
    try {
      const stored = localStorage.getItem("genz-biometric-pin");
      if (!stored) return false;
      const encoded = new TextEncoder().encode(pin);
      const hashBuf = await crypto.subtle.digest("SHA-256", encoded);
      const hashHex = Array.from(new Uint8Array(hashBuf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      if (hashHex !== stored) {
        setError("PIN si sahihi. Jaribu tena.");
        return false;
      }
      return true;
    } catch {
      setError("Hitilafu ya PIN. Jaribu tena.");
      return false;
    }
  }, []);

  const clearCredential = useCallback(async () => {
    await dbDelete("credential-id");
    localStorage.removeItem("genz-biometric-pin");
    localStorage.removeItem("genz-biometric-committed");
    localStorage.removeItem("genz-biometric-method");
  }, []);

  return {
    support,
    isReady,
    isVerifying,
    error,
    register,
    verify,
    setPinFallback,
    verifyPin,
    clearCredential,
  };
}
