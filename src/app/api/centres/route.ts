import { NextResponse } from "next/server";
import { REGISTRATION_CENTRES } from "@/lib/data";

// GET /api/centres — returns all registration centres
// Can be filtered by ?county=Nairobi or ?status=open
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const county = searchParams.get("county");
  const status = searchParams.get("status");

  let centres = REGISTRATION_CENTRES;

  if (county) {
    centres = centres.filter(
      (c) => c.county.toLowerCase() === county.toLowerCase()
    );
  }

  if (status) {
    centres = centres.filter((c) => c.status === status);
  }

  return NextResponse.json(
    {
      data: centres,
      total: centres.length,
      lastUpdated: new Date().toISOString(),
      source: "IEBC official records (cached)",
    },
    {
      headers: {
        // Cache for 1 hour – cron job should refresh the source data
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
