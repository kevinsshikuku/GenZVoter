import { NextRequest, NextResponse } from "next/server";

/**
 * M-Pesa STK Push callback endpoint.
 * Safaricom POSTs here after user completes or cancels the payment.
 *
 * On Vercel serverless this callback may land on a different instance
 * than the one handling status polls. The status route uses Daraja's
 * STK Query API as primary check, so this callback is best-effort.
 * We always return 200 to Safaricom regardless.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const callback = body?.Body?.stkCallback;

    if (callback) {
      const { ResultCode, ResultDesc, CheckoutRequestID } = callback;
      console.log(
        `[M-Pesa Callback] CheckoutRequestID=${CheckoutRequestID} ResultCode=${ResultCode} ResultDesc=${ResultDesc}`
      );
    }
  } catch (err) {
    console.error("[M-Pesa Callback] Failed to parse body:", err);
  }

  // Always acknowledge to Safaricom
  return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
}
