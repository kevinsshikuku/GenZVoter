/**
 * Server-side M-Pesa Daraja API utilities.
 * NEVER import this file from client components — it uses secrets.
 */

// ── Environment ─────────────────────────────────────────────────────────────────

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY ?? "";
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET ?? "";
const PASSKEY = process.env.MPESA_PASSKEY ?? "";
const SHORTCODE = process.env.MPESA_SHORTCODE ?? "";
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL ?? "";
const ENV = process.env.MPESA_ENV ?? "sandbox";
const VERIFICATION_SECRET = process.env.VERIFICATION_SECRET ?? "dev-fallback-secret-change-in-production";

const BASE_URL =
  ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

export function getMpesaConfig() {
  return { SHORTCODE, CALLBACK_URL, BASE_URL };
}

// ── OAuth Token (cached) ────────────────────────────────────────────────────────

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
  const res = await fetch(
    `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: "GET",
      headers: { Authorization: `Basic ${auth}` },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Daraja OAuth failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + 55 * 60 * 1000, // cache for 55 min (token lasts 60)
  };
  return cachedToken.token;
}

// ── Phone Number Utils ──────────────────────────────────────────────────────────

/**
 * Normalize Kenyan phone input to 254XXXXXXXXX format.
 * Accepts: 0712345678, +254712345678, 254712345678, 712345678
 */
export function formatPhone(input: string): string {
  const cleaned = input.replace(/[\s\-()]/g, "").replace(/^\+/, "");
  if (/^0[17]\d{8}$/.test(cleaned)) return `254${cleaned.slice(1)}`;
  if (/^254[17]\d{8}$/.test(cleaned)) return cleaned;
  if (/^[17]\d{8}$/.test(cleaned)) return `254${cleaned}`;
  throw new Error("Invalid phone number format");
}

/**
 * Validate that a string looks like a Kenyan phone number.
 */
export function validatePhone(input: string): boolean {
  try {
    formatPhone(input);
    return true;
  } catch {
    return false;
  }
}

// ── STK Push Helpers ────────────────────────────────────────────────────────────

export function formatTimestamp(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}` +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

export function generatePassword(timestamp: string): string {
  return Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString("base64");
}

// ── HMAC Verification Token ─────────────────────────────────────────────────────

async function hmacSign(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(VERIFICATION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return bufferToBase64url(sig);
}

async function hmacVerify(payload: string, signature: string): Promise<boolean> {
  const expected = await hmacSign(payload);
  return expected === signature;
}

function bufferToBase64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Hash a phone number with SHA-256 (never store raw phone in tokens).
 */
export async function hashPhone(phone: string): Promise<string> {
  const enc = new TextEncoder();
  const hash = await crypto.subtle.digest("SHA-256", enc.encode(phone));
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Generate an HMAC-signed verification token with 24hr expiry.
 * Format: base64url(payload).base64url(hmac-sha256)
 */
export async function generateVerificationToken(
  phoneHash: string,
  checkoutId: string
): Promise<{ token: string; expiresAt: string }> {
  const exp = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload = JSON.stringify({ ph: phoneHash, cid: checkoutId, exp });
  const payloadB64 = btoa(payload).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  const signature = await hmacSign(payload);
  return {
    token: `${payloadB64}.${signature}`,
    expiresAt: new Date(exp).toISOString(),
  };
}

/**
 * Verify an HMAC-signed token. Returns validity and expiry status.
 */
export async function verifyToken(
  token: string
): Promise<{ valid: boolean; expired: boolean }> {
  try {
    const [payloadB64, signature] = token.split(".");
    if (!payloadB64 || !signature) return { valid: false, expired: false };

    // Decode payload
    const padded = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    const payload = atob(padded);
    const data = JSON.parse(payload);

    // Check HMAC
    const sigValid = await hmacVerify(payload, signature);
    if (!sigValid) return { valid: false, expired: false };

    // Check expiry
    if (typeof data.exp !== "number" || Date.now() > data.exp) {
      return { valid: false, expired: true };
    }

    return { valid: true, expired: false };
  } catch {
    return { valid: false, expired: false };
  }
}

// ── Rate Limiting (best-effort on serverless) ───────────────────────────────────

const rateLimitStore = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX = 3;

export function checkRateLimit(phone: string): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(phone);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(phone, { count: 1, windowStart: now });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfterMs = RATE_LIMIT_WINDOW - (now - entry.windowStart);
    return { allowed: false, retryAfterMs };
  }

  entry.count++;
  return { allowed: true, retryAfterMs: 0 };
}

// ── STK Query (primary status check for serverless) ─────────────────────────────

export async function queryStkStatus(checkoutRequestId: string): Promise<{
  resultCode: number;
  resultDesc: string;
}> {
  const token = await getAccessToken();
  const timestamp = formatTimestamp();
  const password = generatePassword(timestamp);

  const res = await fetch(`${BASE_URL}/mpesa/stkpushquery/v1/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    }),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`STK Query failed (${res.status}): ${text}`);
  }

  // Parse the response — Daraja can return various structures
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`STK Query returned invalid JSON: ${text}`);
  }

  console.log("[M-Pesa STK Query] Response:", JSON.stringify(data));

  // If ResponseCode is not "0", the query itself failed (transaction still processing)
  if (data.ResponseCode && data.ResponseCode !== "0") {
    throw new Error(`STK Query ResponseCode=${data.ResponseCode}: ${data.ResponseDescription || text}`);
  }

  // ResultCode might be missing if still processing
  const resultCode = data.ResultCode;
  if (resultCode === undefined || resultCode === null || resultCode === "") {
    throw new Error("ResultCode not yet available — still processing");
  }

  return {
    resultCode: Number(resultCode),
    resultDesc: data.ResultDesc ?? "",
  };
}
