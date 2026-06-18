import { NextResponse } from "next/server";

import { routeFailureToAssistantResult } from "@/features/workbench/report-assistant-route-failure-result";
import { getReportAssistantRuntimeStatus } from "@/features/workbench/report-assistant-runtime-status";
import { runtimeStatusToAssistantResult } from "@/features/workbench/report-assistant-runtime-status-result";
import { getAuthState } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const authState = await getAuthState();

  if (authState.configured && !authState.session) {
    return NextResponse.json(
      {
        assistantResults: [
          routeFailureToAssistantResult({
            capabilityName: "report_assistant_status_route",
            code: "assistant_auth_required",
            errors: ["Authentication required."],
            routeStatus: "auth_failed"
          })
        ],
        error: "Authentication required.",
        ok: false
      },
      {
        status: 401
      }
    );
  }

  const status = getReportAssistantRuntimeStatus();

  return NextResponse.json({
    assistantResults: [
      runtimeStatusToAssistantResult(status)
    ],
    ok: true,
    status
  });
}
