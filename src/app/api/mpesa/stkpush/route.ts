import { NextRequest, NextResponse } from "next/server";
import {
  getAccessToken,
  formatPhone,
  validatePhone,
  formatTimestamp,
  generatePassword,
  checkRateLimit,
  getMpesaConfig,
} from "@/lib/mpesa";
import { registerStkTimestamp } from "@/lib/stk-timestamps";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone } = body;

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { error: "Phone number required" },
        { status: 400 }
      );
    }

    if (!validatePhone(phone)) {
      return NextResponse.json(
        { error: "Nambari ya simu si sahihi. Use format 07XX or 01XX." },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhone(phone);

    // Rate limit check
    const { allowed, retryAfterMs } = checkRateLimit(formattedPhone);
    if (!allowed) {
      const retrySeconds = Math.ceil(retryAfterMs / 1000);
      return NextResponse.json(
        { error: `Subiri kidogo. Jaribu tena baada ya sekunde ${retrySeconds}.` },
        { status: 429 }
      );
    }

    const { SHORTCODE, CALLBACK_URL, BASE_URL } = getMpesaConfig();

    if (!SHORTCODE || !CALLBACK_URL) {
      console.error("M-Pesa config missing: SHORTCODE or CALLBACK_URL");
      return NextResponse.json(
        { error: "M-Pesa configuration error. Contact admin." },
        { status: 500 }
      );
    }

    const accessToken = await getAccessToken();
    const timestamp = formatTimestamp();
    const password = generatePassword(timestamp);

    const stkRes = await fetch(
      `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: process.env.MPESA_ENV === "production"
            ? "CustomerBuyGoodsOnline"   // Till number in production
            : "CustomerPayBillOnline",   // Sandbox only supports PayBill
          Amount: 1,
          PartyA: formattedPhone,
          PartyB: SHORTCODE,
          PhoneNumber: formattedPhone,
          CallBackURL: CALLBACK_URL,
          AccountReference: "GenZVoter",
          TransactionDesc: "Verify",
        }),
      }
    );

    if (!stkRes.ok) {
      const errText = await stkRes.text();
      console.error("Daraja STK Push error:", errText);
      return NextResponse.json(
        { error: "M-Pesa request failed. Jaribu tena." },
        { status: 502 }
      );
    }

    const stkData = await stkRes.json();

    if (stkData.ResponseCode !== "0") {
      console.error("STK Push rejected:", stkData);
      return NextResponse.json(
        { error: stkData.ResponseDescription || "M-Pesa request rejected." },
        { status: 502 }
      );
    }

    // Register when this STK push was sent (for minimum elapsed time check)
    registerStkTimestamp(stkData.CheckoutRequestID);

    return NextResponse.json({
      checkoutRequestId: stkData.CheckoutRequestID,
      merchantRequestId: stkData.MerchantRequestID,
    });
  } catch (err) {
    console.error("STK Push route error:", err);
    return NextResponse.json(
      { error: "Server error. Jaribu tena." },
      { status: 500 }
    );
  }
}
