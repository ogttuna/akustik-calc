import { NextResponse } from "next/server";

import {
  createReportAssistantAssemblyAlternativeReview,
  parseReportAssistantAssemblyAlternativeRequest
} from "@/features/workbench/report-assistant-assembly-alternatives";
import { assemblyAlternativeReviewToAssistantResult } from "@/features/workbench/report-assistant-assembly-alternatives-result";
import { parseReportAssistantContextPayload } from "@/features/workbench/report-assistant-instruction";
import { routeFailureToAssistantResult } from "@/features/workbench/report-assistant-route-failure-result";
import { parseSimpleWorkbenchProposalDocument } from "@/features/workbench/simple-workbench-proposal";
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
            capabilityName: "report_assistant_assembly_alternatives_route",
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
  if (!isObjectRecord(payload)) {
    return NextResponse.json(
      {
        assistantResults: [
          routeFailureToAssistantResult({
            capabilityName: "report_assistant_assembly_alternatives_route",
            code: "invalid_assembly_alternatives_payload",
            errors: ["Invalid assembly alternative research request."],
            routeStatus: "needs_input"
          })
        ],
        error: "Invalid assembly alternative research request.",
        ok: false
      },
      {
        status: 400
      }
    );
  }

  const context = parseReportAssistantContextPayload(payload.context);
  const document = parseSimpleWorkbenchProposalDocument(payload.document);
  const assemblyRequest = parseReportAssistantAssemblyAlternativeRequest(payload.request);

  if (!context || !document || !assemblyRequest) {
    return NextResponse.json(
      {
        assistantResults: [
          routeFailureToAssistantResult({
            capabilityName: "report_assistant_assembly_alternatives_route",
            code: "missing_assembly_alternatives_context",
            errors: ["Assembly alternative research requires a current report context, proposal document, and user instruction."],
            routeStatus: "needs_input"
          })
        ],
        error: "Assembly alternative research requires a current report context, proposal document, and user instruction.",
        ok: false
      },
      {
        status: 400
      }
    );
  }

  const result = await createReportAssistantAssemblyAlternativeReview({
    context,
    request: assemblyRequest
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        assistantResults: [
          routeFailureToAssistantResult({
            capabilityName: "report_assistant_assembly_alternatives_route",
            code: "assembly_alternatives_review_failed",
            errors: result.errors,
            routeStatus: result.source === "research_provider" ? "provider_failed" : "error",
            sourceTraceKind: result.source === "research_provider" ? "provider_review" : "deterministic",
            warnings: result.warnings
          })
        ],
        errors: result.errors,
        ok: false,
        source: result.source,
        warnings: result.warnings
      },
      {
        status: 400
      }
    );
  }

  return NextResponse.json({
    assistantResults: [
      assemblyAlternativeReviewToAssistantResult({
        review: result.review,
        source: result.source,
        warnings: result.warnings
      })
    ],
    ok: true,
    review: result.review,
    source: result.source,
    warnings: result.warnings
  });
}
