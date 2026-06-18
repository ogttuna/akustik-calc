import { NextResponse } from "next/server";

import {
  createReportAssistantActionProposal,
  isReportAssistantActionProposalName
} from "@/features/workbench/report-assistant-action-proposal";
import { actionProposalToAssistantResult } from "@/features/workbench/report-assistant-action-proposal-result";
import { parseReportAssistantContextPayload } from "@/features/workbench/report-assistant-instruction";
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

function parseSelectedRevision(value: unknown): { displayCode?: string; id: string } | undefined {
  if (!isRecord(value) || typeof value.id !== "string") {
    return undefined;
  }

  return {
    displayCode: typeof value.displayCode === "string" ? value.displayCode : undefined,
    id: value.id
  };
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
          capabilityName: "report_assistant_action_proposal_route",
          code: input.code,
          errors: input.errors,
          routeStatus,
          warnings: input.warnings
        })
      ],
      code: input.code,
      errors: input.errors,
      mutates: false,
      ok: false,
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
            capabilityName: "report_assistant_action_proposal_route",
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
      code: "invalid_report_assistant_action_proposal_payload",
      errors: ["Report assistant action proposal request must include an instruction string."],
      status: 400
    });
  }

  const context = parseReportAssistantContextPayload(payload.context);
  if (!context) {
    return routeFailure({
      code: "invalid_report_assistant_action_proposal_context",
      errors: ["Report assistant action proposal request must include a valid current report context."],
      status: 400
    });
  }

  const document = parseSimpleWorkbenchProposalDocument(payload.document);
  if (!document) {
    return routeFailure({
      code: "invalid_report_assistant_action_proposal_document",
      errors: ["Report assistant action proposal request must include a valid current report document."],
      status: 400
    });
  }

  if (payload.action !== undefined && !isReportAssistantActionProposalName(payload.action)) {
    return routeFailure({
      code: "unsupported_report_assistant_action_proposal",
      errors: [`Unsupported assistant action proposal: ${String(payload.action)}.`],
      routeStatus: "unsupported",
      status: 400
    });
  }

  const result = createReportAssistantActionProposal({
    action: payload.action,
    context,
    document,
    instruction: payload.instruction,
    selectedRevision: parseSelectedRevision(payload.selectedRevision),
    sourceStackAvailable: payload.sourceStackAvailable === true
  });

  if (!result.ok) {
    return routeFailure({
      code: result.code,
      errors: result.errors,
      status: result.statusCode,
      warnings: result.warnings
    });
  }

  return NextResponse.json({
    assistantResults: [actionProposalToAssistantResult(result.proposal)],
    mutates: false,
    ok: true,
    proposal: result.proposal,
    warnings: result.warnings
  });
}
