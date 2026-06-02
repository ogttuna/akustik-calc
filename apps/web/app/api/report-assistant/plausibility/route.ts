import { NextResponse } from "next/server";

import { parseReportAssistantContextPayload } from "@/features/workbench/report-assistant-instruction";
import {
  parseReportAssistantPlausibilityRequest,
} from "@/features/workbench/report-assistant-plausibility";
import { createReportAssistantPlausibilityReview } from "@/features/workbench/report-assistant-plausibility-research";
import { validateReportAssistantPatch } from "@/features/workbench/report-assistant-patch";
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
    return NextResponse.json({
      ok: true,
      patchValidation,
      review: {
        ...result.review,
        rationale: [
          ...result.review.rationale,
          "Suggested report patch was rejected by the shared patch validator and was not returned."
        ],
        suggestedReportPatch: undefined
      },
      source: result.source,
      warnings: result.warnings
    });
  }

  return NextResponse.json({
    ok: true,
    patchValidation,
    review: result.review,
    source: result.source,
    warnings: result.warnings
  });
}
