import { NextResponse } from "next/server";

import {
  appendReportAssistantFindingRecord,
  parseReportAssistantFindingDraft,
  prepareReportAssistantFindingRecord,
  REPORT_ASSISTANT_FINDINGS_RELATIVE_PATH
} from "@/features/workbench/report-assistant-finding";
import {
  findingRecordToAssistantResult,
  findingRouteFailureToAssistantResult,
  findingRouteNeedsInputToAssistantResult
} from "@/features/workbench/report-assistant-finding-result";
import { parseReportAssistantContextPayload } from "@/features/workbench/report-assistant-instruction";
import { routeFailureToAssistantResult } from "@/features/workbench/report-assistant-route-failure-result";
import { getAuthState } from "@/lib/auth";

export const runtime = "nodejs";

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function readRequestJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const authState = await getAuthState();

  if (authState.configured && !authState.session) {
    return NextResponse.json(
      {
        assistantResults: [
          routeFailureToAssistantResult({
            capabilityName: "report_assistant_findings_route",
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

  const payload = await readRequestJson(request);
  if (!isObjectRecord(payload) || payload.confirmed !== true) {
    return NextResponse.json(
      {
        assistantResults: [
          findingRouteNeedsInputToAssistantResult({
            code: "finding_confirmation_required",
            errors: ["Review finding logging requires explicit confirmation."]
          })
        ],
        error: "Review finding logging requires explicit confirmation.",
        ok: false
      },
      {
        status: 400
      }
    );
  }

  const context = parseReportAssistantContextPayload(payload.context);
  const draft = parseReportAssistantFindingDraft(payload.finding);

  if (!context || !draft) {
    return NextResponse.json(
      {
        assistantResults: [
          findingRouteNeedsInputToAssistantResult({
            code: "finding_context_or_draft_required",
            errors: ["Review finding request must include a current report context and finding draft."]
          })
        ],
        error: "Review finding request must include a current report context and finding draft.",
        ok: false
      },
      {
        status: 400
      }
    );
  }

  const prepared = prepareReportAssistantFindingRecord({
    context,
    draft
  });

  if (!prepared.ok) {
    return NextResponse.json(
      {
        assistantResults: [
          findingRouteFailureToAssistantResult({
            code: "finding_preparation_failed",
            errors: prepared.errors
          })
        ],
        errors: prepared.errors,
        ok: false
      },
      {
        status: 400
      }
    );
  }

  try {
    await appendReportAssistantFindingRecord(prepared.record);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Review finding could not be written.";
    return NextResponse.json(
      {
        assistantResults: [
          findingRouteFailureToAssistantResult({
            code: "finding_write_failed",
            errors: [message]
          })
        ],
        error: message,
        ok: false
      },
      {
        status: 500
      }
    );
  }

  return NextResponse.json(
    {
      assistantResults: [
        findingRecordToAssistantResult({
          queuePath: REPORT_ASSISTANT_FINDINGS_RELATIVE_PATH,
          record: prepared.record
        })
      ],
      ok: true,
      queuePath: REPORT_ASSISTANT_FINDINGS_RELATIVE_PATH,
      record: prepared.record
    },
    {
      status: 201
    }
  );
}
