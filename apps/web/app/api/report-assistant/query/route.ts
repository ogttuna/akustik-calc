import { NextResponse } from "next/server";

import { parseReportAssistantContextPayload } from "@/features/workbench/report-assistant-instruction";
import {
  answerReportAssistantQuery,
  parseReportAssistantQueryAllowedReadActions
} from "@/features/workbench/report-assistant-query";
import { routeFailureToAssistantResult } from "@/features/workbench/report-assistant-route-failure-result";
import { parseSimpleWorkbenchProposalDocument } from "@/features/workbench/simple-workbench-proposal";
import { getAuthState } from "@/lib/auth";
import {
  resolveProjectRouteOwner
} from "@/lib/project-route-auth";

export const runtime = "nodejs";

async function readRequestJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function routeFailure(input: {
  code: string;
  errors: readonly string[];
  routeStatus?: "error" | "needs_input" | "unsupported";
  status: number;
  warnings?: readonly string[];
}) {
  const routeStatus = input.routeStatus ?? (input.code.startsWith("unsupported_") ? "unsupported" : "needs_input");

  return NextResponse.json(
    {
      assistantResults: [
        routeFailureToAssistantResult({
          capabilityName: "report_assistant_query_route",
          code: input.code,
          errors: input.errors,
          routeStatus,
          warnings: input.warnings
        })
      ],
      code: input.code,
      errors: input.errors,
      evidence: [],
      mutates: false,
      ok: false,
      usedReads: [],
      warnings: input.warnings ?? []
    },
    {
      status: input.status
    }
  );
}

export async function POST(request: Request) {
  const owner = resolveProjectRouteOwner(await getAuthState());

  if (!owner.ok) {
    return NextResponse.json(
      {
        assistantResults: [
          routeFailureToAssistantResult({
            capabilityName: "report_assistant_query_route",
            code: owner.status === 401 ? "assistant_auth_required" : "assistant_owner_scope_required",
            errors: [owner.error],
            routeStatus: owner.status === 401 ? "auth_failed" : "error"
          })
        ],
        error: owner.error,
        ok: false
      },
      {
        status: owner.status
      }
    );
  }

  const payload = await readRequestJson(request);
  if (!isRecord(payload) || typeof payload.instruction !== "string") {
    return routeFailure({
      code: "invalid_report_assistant_query_payload",
      errors: ["Report assistant query request must include an instruction string."],
      status: 400
    });
  }

  const context = parseReportAssistantContextPayload(payload.context);
  if (!context) {
    return routeFailure({
      code: "invalid_report_assistant_query_context",
      errors: ["Report assistant query request must include a valid current report context."],
      status: 400
    });
  }

  const parsedDocument = payload.document === undefined
    ? undefined
    : parseSimpleWorkbenchProposalDocument(payload.document);
  if (payload.document !== undefined && !parsedDocument) {
    return routeFailure({
      code: "invalid_report_assistant_query_document",
      errors: ["Report assistant query document could not be parsed."],
      status: 400
    });
  }
  const document = parsedDocument ?? undefined;

  const allowedReadActions = parseReportAssistantQueryAllowedReadActions(payload.allowedReadActions);
  if (!allowedReadActions.ok) {
    return routeFailure({
      code: "unsupported_report_assistant_query_read_action",
      errors: allowedReadActions.errors,
      routeStatus: "unsupported",
      status: 400
    });
  }

  const result = await answerReportAssistantQuery({
    allowedReadActions: allowedReadActions.actions,
    context,
    document,
    instruction: payload.instruction,
    owner: owner.scope
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        assistantResults: [
          routeFailureToAssistantResult({
            capabilityName: "report_assistant_query_route",
            code: result.code,
            errors: result.errors,
            evidence: result.evidence,
            routeStatus: result.code.startsWith("unsupported_") ? "unsupported" : "error",
            warnings: result.warnings
          })
        ],
        code: result.code,
        errors: result.errors,
        evidence: result.evidence,
        mutates: false,
        ok: false,
        usedReads: result.usedReads,
        warnings: result.warnings
      },
      {
        status: result.statusCode
      }
    );
  }

  return NextResponse.json({
    answer: result.answer,
    assistantResults: result.assistantResults,
    ...(result.calculatorPreview ? { calculatorPreview: result.calculatorPreview } : {}),
    evidence: result.evidence,
    mutates: false,
    ok: true,
    usedReads: result.usedReads,
    warnings: result.warnings
  });
}
