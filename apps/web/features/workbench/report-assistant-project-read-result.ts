import type { JsonValue } from "@dynecho/shared";

import type { ReportAssistantProjectReadToolName } from "./report-assistant-project-tools";
import {
  createReportAssistantResultEnvelope,
  type ReportAssistantResultEnvelope,
  type ReportAssistantResultEvidence
} from "./report-assistant-result-contract";

const MISSING_INPUT_CODES = new Set([
  "missing_assembly_id",
  "missing_project_id",
  "missing_report_id",
  "missing_revision_id"
]);

function isRecord(value: JsonValue | undefined): value is Record<string, JsonValue> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getRecord(value: JsonValue | undefined, key: string): Record<string, JsonValue> | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const child = value[key];
  return isRecord(child) ? child : undefined;
}

function getArray(value: JsonValue | undefined, key: string): readonly JsonValue[] | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const child = value[key];
  return Array.isArray(child) ? child : undefined;
}

function getString(value: Record<string, JsonValue> | undefined, key: string): string | undefined {
  const child = value?.[key];
  return typeof child === "string" && child.trim().length > 0 ? child : undefined;
}

function countEvidence(label: string, values: readonly JsonValue[] | undefined): ReportAssistantResultEvidence | undefined {
  if (!values) {
    return undefined;
  }

  return {
    detail: String(values.length),
    label
  };
}

function compactProjectReadEvidence(
  action: ReportAssistantProjectReadToolName,
  result: JsonValue
): readonly ReportAssistantResultEvidence[] {
  const evidence: ReportAssistantResultEvidence[] = [
    {
      detail: action,
      label: "Project read action"
    }
  ];
  const project = getRecord(result, "project");
  const report = getRecord(result, "report");
  const revision = getRecord(result, "revision");
  const assembly = getRecord(result, "assembly");

  const projectId = getString(project, "id") ?? getString(report, "projectId") ?? getString(revision, "projectId") ?? getString(assembly, "projectId");
  if (projectId) {
    evidence.push({
      detail: projectId,
      label: "Project id"
    });
  }

  const reportId = getString(report, "id") ?? getString(revision, "reportId");
  if (reportId) {
    evidence.push({
      detail: reportId,
      label: "Report id"
    });
  }

  const revisionId = getString(revision, "id");
  if (revisionId) {
    evidence.push({
      detail: revisionId,
      label: "Revision id"
    });
  }

  const assemblyId = getString(assembly, "id");
  if (assemblyId) {
    evidence.push({
      detail: assemblyId,
      label: "Assembly id"
    });
  }

  for (const entry of [
    countEvidence("Project count", getArray(result, "projects")),
    countEvidence("Assembly count", getArray(result, "assemblies")),
    countEvidence("Verified calculated reference count", getArray(result, "verifiedCalculatedReferences")),
    countEvidence("Report count", getArray(result, "reports")),
    countEvidence("Revision count", getArray(result, "revisions"))
  ]) {
    if (entry) {
      evidence.push(entry);
    }
  }

  return evidence;
}

export function projectReadToAssistantResult(input: {
  action: ReportAssistantProjectReadToolName;
  result: JsonValue;
}): ReportAssistantResultEnvelope {
  return createReportAssistantResultEnvelope({
    authority: "saved_project_state",
    capabilityName: input.action,
    confidenceReason: "The response is a read-only owner-scoped project payload copied from local project storage. Saved report prose is treated as evidence data, not instructions.",
    evidence: compactProjectReadEvidence(input.action, input.result),
    routeStatus: "ready",
    sourceTrace: [
      {
        detail: "Owner-scoped project read route returned a typed local payload.",
        kind: "project_read",
        label: input.action
      }
    ]
  });
}

function failureTasks(input: {
  code: string;
  errors: readonly string[];
}): Array<{ code: string; message: string; severity: "error" | "warning" }> {
  return input.errors.length > 0
    ? input.errors.map((message) => ({
      code: input.code,
      message,
      severity: MISSING_INPUT_CODES.has(input.code) ? "warning" : "error"
    }))
    : [
      {
        code: input.code,
        message: input.code,
        severity: MISSING_INPUT_CODES.has(input.code) ? "warning" : "error"
      }
    ];
}

export function projectReadFailureToAssistantResult(input: {
  action: ReportAssistantProjectReadToolName;
  code: string;
  errors: readonly string[];
}): ReportAssistantResultEnvelope {
  const needsInput = MISSING_INPUT_CODES.has(input.code);

  return createReportAssistantResultEnvelope({
    authority: needsInput ? "needs_input" : "error",
    capabilityName: input.action,
    confidenceReason: needsInput
      ? "The read tool did not run because a required project/report/assembly/revision id was missing."
      : "The read tool did not return a successful owner-scoped project payload.",
    routeStatus: needsInput ? "needs_input" : "error",
    sourceTrace: [
      {
        detail: input.code,
        kind: "project_read",
        label: input.action
      }
    ],
    tasks: failureTasks(input)
  });
}

export function projectReadRouteFailureToAssistantResult(input: {
  action?: string;
  code: string;
  errors: readonly string[];
}): ReportAssistantResultEnvelope {
  const unsupported = input.code === "unsupported_project_read_action";

  return createReportAssistantResultEnvelope({
    authority: unsupported ? "unsupported" : "error",
    capabilityName: "report_assistant_project_read_route",
    confidenceReason: unsupported
      ? "The requested project-read action is not registered as a supported assistant capability."
      : "The project-read route rejected the request before a read tool could run.",
    evidence: input.action
      ? [
        {
          detail: input.action,
          label: "Rejected action"
        }
      ]
      : [],
    routeStatus: unsupported ? "unsupported" : "error",
    sourceTrace: [
      {
        detail: input.code,
        kind: "project_read",
        label: "report_assistant_project_read_route"
      }
    ],
    tasks: failureTasks(input)
  });
}
