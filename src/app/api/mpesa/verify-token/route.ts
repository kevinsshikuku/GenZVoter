import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/mpesa";

/**
 * Validates an HMAC-signed M-Pesa verification token.
 * Called on app load to check if the user's stored token is still valid.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return NextResponse.json(
      { valid: false, reason: "missing" },
      { status: 401 }
    );
  }

  try {
    const { valid, expired } = await verifyToken(token);

    if (valid) {
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json({
      valid: false,
      reason: expired ? "expired" : "invalid",
    });
  } catch (err) {
    console.error("[Verify Token] Error:", err);
    return NextResponse.json(
      { valid: false, reason: "error" },
      { status: 500 }
    );
  }
}
