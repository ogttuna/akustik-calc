import { NextResponse } from "next/server";

import {
  REPORT_ASSISTANT_PROJECT_READ_TOOL_DEFINITIONS,
  runReportAssistantProjectReadTool,
  type ReportAssistantProjectReadToolName
} from "@/features/workbench/report-assistant-project-tools";
import {
  projectReadFailureToAssistantResult,
  projectReadRouteFailureToAssistantResult,
  projectReadToAssistantResult
} from "@/features/workbench/report-assistant-project-read-result";
import { routeFailureToAssistantResult } from "@/features/workbench/report-assistant-route-failure-result";
import { getAuthState } from "@/lib/auth";
import {
  resolveProjectRouteOwner
} from "@/lib/project-route-auth";

export const runtime = "nodejs";

const PROJECT_READ_ACTIONS = new Set<ReportAssistantProjectReadToolName>(
  REPORT_ASSISTANT_PROJECT_READ_TOOL_DEFINITIONS.map((tool) => tool.name)
);

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

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function isProjectReadAction(value: unknown): value is ReportAssistantProjectReadToolName {
  return typeof value === "string" && PROJECT_READ_ACTIONS.has(value as ReportAssistantProjectReadToolName);
}

function routeFailure(input: {
  action?: string;
  code: string;
  errors: readonly string[];
  status: number;
}) {
  return NextResponse.json(
    {
      action: input.action,
      assistantResults: [
        projectReadRouteFailureToAssistantResult({
          action: input.action,
          code: input.code,
          errors: input.errors
        })
      ],
      code: input.code,
      errors: input.errors,
      mutates: false,
      ok: false
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
            capabilityName: "report_assistant_project_read_route",
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
  if (!isRecord(payload)) {
    return routeFailure({
      code: "invalid_project_read_payload",
      errors: ["Assistant project read payload must be a JSON object."],
      status: 400
    });
  }

  const action = readString(payload.action);
  if (!isProjectReadAction(action)) {
    return routeFailure({
      action,
      code: "unsupported_project_read_action",
      errors: ["Unsupported assistant project read action."],
      status: 400
    });
  }

  const projectId = readString(payload.projectId);
  const assemblyId = readString(payload.assemblyId);
  const reportId = readString(payload.reportId);
  const revisionId = readString(payload.revisionId);
  const result = await (async () => {
    switch (action) {
      case "list_projects":
        return runReportAssistantProjectReadTool({
          name: action,
          owner: owner.scope
        });

      case "read_project_summary":
      case "list_project_assemblies":
      case "list_project_verified_calculated_references":
      case "list_project_reports":
        return runReportAssistantProjectReadTool({
          name: action,
          owner: owner.scope,
          projectId
        });

      case "read_project_assembly_snapshot":
        return runReportAssistantProjectReadTool({
          assemblyId,
          name: action,
          owner: owner.scope,
          projectId
        });

      case "read_project_report_document":
      case "list_project_report_revisions":
        return runReportAssistantProjectReadTool({
          name: action,
          owner: owner.scope,
          projectId,
          reportId
        });

      case "read_project_report_revision":
        return runReportAssistantProjectReadTool({
          name: action,
          owner: owner.scope,
          projectId,
          reportId,
          revisionId
        });
    }
  })();

  if (!result.ok) {
    return NextResponse.json(
      {
        action: result.name,
        assistantResults: [
          projectReadFailureToAssistantResult({
            action: result.name,
            code: result.code,
            errors: result.errors
          })
        ],
        code: result.code,
        errors: result.errors,
        mutates: false,
        ok: false
      },
      {
        status: result.statusCode
      }
    );
  }

  return NextResponse.json({
    action: result.name,
    assistantResults: [
      projectReadToAssistantResult({
        action: result.name,
        result: result.result
      })
    ],
    mutates: false,
    ok: true,
    result: result.result
  });
}
