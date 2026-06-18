import { NextResponse } from "next/server";

import { parseReportAssistantContextPayload } from "@/features/workbench/report-assistant-instruction";
import {
  parseReportAssistantPlausibilityRequest,
} from "@/features/workbench/report-assistant-plausibility";
import { plausibilityReviewToAssistantResult } from "@/features/workbench/report-assistant-plausibility-result";
import { createReportAssistantPlausibilityReview } from "@/features/workbench/report-assistant-plausibility-research";
import { validateReportAssistantPatch } from "@/features/workbench/report-assistant-patch";
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
            capabilityName: "report_assistant_plausibility_route",
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
            capabilityName: "report_assistant_plausibility_route",
            code: "invalid_plausibility_payload",
            errors: ["Invalid plausibility review request."],
            routeStatus: "needs_input"
          })
        ],
        error: "Invalid plausibility review request.",
        ok: false
      },
      {
        status: 400
      }
    );
  }

  const context = parseReportAssistantContextPayload(payload.context);
  const document = parseSimpleWorkbenchProposalDocument(payload.document);
  const reviewRequest = parseReportAssistantPlausibilityRequest(payload.review);

  if (!context || !document || !reviewRequest) {
    return NextResponse.json(
      {
        assistantResults: [
          routeFailureToAssistantResult({
            capabilityName: "report_assistant_plausibility_route",
            code: "missing_plausibility_context",
            errors: ["Plausibility review requires a current report context, proposal document, and review request."],
            routeStatus: "needs_input"
          })
        ],
        error: "Plausibility review requires a current report context, proposal document, and review request.",
        ok: false
      },
      {
        status: 400
      }
    );
  }

  const result = await createReportAssistantPlausibilityReview({
    context,
    request: reviewRequest
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        assistantResults: [
          routeFailureToAssistantResult({
            capabilityName: "report_assistant_plausibility_route",
            code: "plausibility_review_failed",
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

  const suggestedReportPatch = result.review.suggestedReportPatch;
  if (!suggestedReportPatch) {
    return NextResponse.json({
      assistantResults: [
        plausibilityReviewToAssistantResult({
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

  const patchValidation = validateReportAssistantPatch({
    context,
    document,
    patch: suggestedReportPatch
  });

  if (patchValidation.status === "rejected") {
    const sanitizedReview = {
      ...result.review,
      rationale: [
        ...result.review.rationale,
        "Suggested report patch was rejected by the shared patch validator and was not returned."
      ],
      suggestedReportPatch: undefined
    };

    return NextResponse.json({
      assistantResults: [
        plausibilityReviewToAssistantResult({
          patchValidationStatus: patchValidation.status,
          review: sanitizedReview,
          source: result.source,
          warnings: result.warnings
        })
      ],
      ok: true,
      patchValidation,
      review: sanitizedReview,
      source: result.source,
      warnings: result.warnings
    });
  }

  return NextResponse.json({
    assistantResults: [
      plausibilityReviewToAssistantResult({
        patchValidationStatus: patchValidation.status,
        review: result.review,
        source: result.source,
        warnings: result.warnings
      })
    ],
    ok: true,
    patchValidation,
    review: result.review,
    source: result.source,
    warnings: result.warnings
  });
}
