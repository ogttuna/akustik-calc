import { NextResponse } from "next/server";

import {
  parseReportAssistantContextPayload
} from "@/features/workbench/report-assistant-instruction";
import { createReportAssistantPatchProposal } from "@/features/workbench/report-assistant-model";
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
  if (!isObjectRecord(payload) || typeof payload.instruction !== "string") {
    return NextResponse.json(
      {
        error: "Invalid report assistant request.",
        ok: false
      },
      {
        status: 400
      }
    );
  }

  const context = parseReportAssistantContextPayload(payload.context);
  const document = parseSimpleWorkbenchProposalDocument(payload.document);

  if (!context || !document) {
    return NextResponse.json(
      {
        error: "Report assistant request must include a current report context and proposal document.",
        ok: false
      },
      {
        status: 400
      }
    );
  }

  const generated = await createReportAssistantPatchProposal({
    context,
    instruction: payload.instruction
  });

  if (!generated.ok) {
    return NextResponse.json(
      {
        errors: generated.errors,
        ok: false,
        source: generated.source,
        warnings: generated.warnings
      },
      {
        status: 400
      }
    );
  }

  const validation = validateReportAssistantPatch({
    context,
    document,
    patch: generated.patch
  });

  if (validation.status === "rejected") {
    return NextResponse.json(
      {
        errors: validation.errors,
        ok: false,
        patch: generated.patch,
        source: generated.source,
        validation,
        warnings: [...generated.warnings, ...validation.warnings]
      },
      {
        status: 400
      }
    );
  }

  return NextResponse.json({
    ok: true,
    patch: generated.patch,
    source: generated.source,
    validation,
    warnings: generated.warnings
  });
}
