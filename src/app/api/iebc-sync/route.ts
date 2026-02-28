import { NextResponse } from "next/server";

/**
 * POST /api/iebc-sync — Cron job endpoint to sync IEBC data
 *
 * This endpoint is called by Vercel Cron Jobs (or any cron service) to
 * fetch the latest registration centre statuses from IEBC official sources.
 *
 * Vercel cron.json config (add to /vercel.json):
 * {
 *   "crons": [
 *     {
 *       "path": "/api/iebc-sync",
 *       "schedule": "0 6 * * *"   // Daily at 6am
 *     }
 *   ]
 * }
 *
 * Secure with CRON_SECRET env var:
 * Authorization: Bearer <CRON_SECRET>
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Verify cron secret if set
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // TODO: Implement actual IEBC data scraping/API call here
    // Example flow:
    // 1. Fetch https://www.iebc.or.ke/news/?Register_Today for registration phase dates
    // 2. Fetch https://kiongozi.online/iebc-constituency-offices for centre list
    // 3. Parse and normalise the data
    // 4. Store in your CMS / database
    // 5. Revalidate Next.js cache: revalidatePath('/api/centres')

    // For now, return a stub response
    return NextResponse.json({
      success: true,
      message: "IEBC sync completed",
      syncedAt: new Date().toISOString(),
      centresUpdated: 0, // Replace with actual count
      note: "Implement actual IEBC scraping logic in this handler.",
    });
  } catch (error) {
    console.error("IEBC sync error:", error);
    return NextResponse.json(
      { error: "Sync failed", details: String(error) },
      { status: 500 }
    );
  }
}

// Also expose GET for health checks
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/iebc-sync",
    description: "IEBC data sync cron job endpoint",
    schedule: "Daily at 06:00 EAT",
  });
}
