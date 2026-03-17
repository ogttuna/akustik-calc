import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "dynecho-web",
    upstreamPolicy: "acoustic2_read_only"
  });
}

