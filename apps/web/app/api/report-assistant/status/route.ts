import { NextResponse } from "next/server";

import { getReportAssistantRuntimeStatus } from "@/features/workbench/report-assistant-runtime-status";
import { getAuthState } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const authState = await getAuthState();

  if (authState.configured && !authState.session) {
    return NextResponse.json(
      {
        error: "Authentication required.",
        ok: false
      },
      {
        status: 401
      }
    );
  }

  return NextResponse.json({
    ok: true,
    status: getReportAssistantRuntimeStatus()
  });
}
