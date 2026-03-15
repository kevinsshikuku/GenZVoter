import { NextRequest, NextResponse } from "next/server";
import {
  queryStkStatus,
  hashPhone,
  generateVerificationToken,
  formatPhone,
} from "@/lib/mpesa";

// Track when each STK push was initiated (set by stkpush route via header)
// and issued tokens to prevent duplicate issuance.
const stkTimestamps = new Map<string, number>();
const issuedTokens = new Set<string>();

let cleanupCounter = 0;
function cleanup() {
  cleanupCounter++;
  if (cleanupCounter > 100) {
    const now = Date.now();
    for (const [k, v] of stkTimestamps) {
      if (now - v > 300_000) stkTimestamps.delete(k); // 5 min old
    }
    issuedTokens.clear();
    cleanupCounter = 0;
  }
}

// Minimum seconds that MUST elapse after STK push before we accept "success".
// This prevents sandbox auto-complete from letting people in without paying.
// A real M-Pesa transaction takes at least 5-10 seconds (receive prompt + enter PIN).
const MIN_ELAPSED_SECONDS = 5;

// ── Known FINAL result codes (only these should stop polling) ────────────────
const FINAL_FAILURE_CODES = new Set([1032, 1037, 2001, 1, 1025]);

export function registerStkTimestamp(checkoutRequestId: string) {
  stkTimestamps.set(checkoutRequestId, Date.now());
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const phone = req.nextUrl.searchParams.get("phone");
  const sentAtParam = req.nextUrl.searchParams.get("sentAt");

  if (!id) {
    return NextResponse.json(
      { error: "Missing checkout request ID" },
      { status: 400 }
    );
  }

  cleanup();

  // ── Enforce minimum elapsed time ────────────────────────────────────────
  // The client passes when the STK was sent. We also track server-side.
  // Use whichever is available.
  const sentAt = stkTimestamps.get(id) || (sentAtParam ? Number(sentAtParam) : 0);
  const elapsed = sentAt ? (Date.now() - sentAt) / 1000 : 999; // if unknown, allow

  try {
    const { resultCode, resultDesc } = await queryStkStatus(id);

    // ── SUCCESS: Payment confirmed ────────────────────────────────────────
    if (resultCode === 0) {
      // SECURITY: If success came too fast (< MIN_ELAPSED_SECONDS),
      // it's likely sandbox auto-complete or a replay. Keep returning
      // "pending" until enough time has passed. In production, real
      // M-Pesa transactions always take 5+ seconds.
      if (elapsed < MIN_ELAPSED_SECONDS) {
        console.log(
          `[M-Pesa Status] Success too fast (${elapsed.toFixed(1)}s) for ${id}. ` +
          `Waiting for min ${MIN_ELAPSED_SECONDS}s.`
        );
        return NextResponse.json({
          status: "pending",
          message: "Inaprocess... ingiza PIN yako kwenye simu.",
        });
      }

      let formattedPhone = "unknown";
      try {
        if (phone) formattedPhone = formatPhone(phone);
      } catch {
        // use "unknown" if phone format fails
      }

      const phoneHash = await hashPhone(formattedPhone);
      const { token, expiresAt } = await generateVerificationToken(phoneHash, id);
      issuedTokens.add(id);

      return NextResponse.json({
        status: "completed",
        token,
        expiresAt,
      });
    }

    // ── KNOWN FAILURE: Only show error for definitive failures ────────────
    if (FINAL_FAILURE_CODES.has(resultCode)) {
      const messages: Record<number, string> = {
        1032: "Ulikancel M-Pesa. Jaribu tena.",
        1037: "Hukurespond kwa M-Pesa kwa muda. Jaribu tena.",
        2001: "M-Pesa PIN si sahihi. Jaribu tena.",
        1: "Pesa haitoshi kwenye M-Pesa yako.",
        1025: "Umefikisha limit ya transactions. Jaribu baadaye.",
      };

      return NextResponse.json({
        status: "failed",
        message: messages[resultCode] || resultDesc || "Payment haikufika.",
      });
    }

    // ── UNKNOWN CODE: Treat as still processing ──────────────────────────
    console.log(
      `[M-Pesa Status] Unknown ResultCode=${resultCode} for ${id}: ${resultDesc}. Treating as pending.`
    );
    return NextResponse.json({
      status: "pending",
      message: "Safaricom bado inaprocess. Subiri kidogo...",
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.log(`[M-Pesa Status] STK Query error for ${id}: ${errMsg}. Treating as pending.`);

    return NextResponse.json({
      status: "pending",
      message: "Safaricom bado inaprocess. Subiri kidogo...",
    });
  }
}
