import type { ReportAssistantFindingRecord } from "./report-assistant-finding";
import {
  createReportAssistantResultEnvelope,
  type ReportAssistantResultEnvelope,
  type ReportAssistantResultEvidence,
  type ReportAssistantResultTask
} from "./report-assistant-result-contract";

function findingEvidence(input: {
  queuePath?: string;
  record: ReportAssistantFindingRecord;
}): readonly ReportAssistantResultEvidence[] {
  const evidence: ReportAssistantResultEvidence[] = [
    {
      detail: input.record.id,
      label: "Finding id"
    },
    {
      detail: input.record.metricId,
      label: "Metric id"
    },
    {
      detail: input.record.verdict,
      label: "Finding verdict"
    },
    {
      detail: input.record.severity,
      label: "Finding severity"
    },
    {
      detail: String(input.record.sources.length),
      label: "Citation count"
    }
  ];

  if (input.record.projectId) {
    evidence.push({
      detail: input.record.projectId,
      label: "Project id"
    });
  }

  if (input.record.scenarioId) {
    evidence.push({
      detail: input.record.scenarioId,
      label: "Scenario id"
    });
  }

  if (input.queuePath) {
    evidence.push({
      detail: input.queuePath,
      label: "Finding queue"
    });
  }

  return evidence;
}

function tasks(input: {
  code: string;
  errors: readonly string[];
  severity?: "error" | "warning";
}): readonly ReportAssistantResultTask[] {
  const severity = input.severity ?? "error";

  return input.errors.length > 0
    ? input.errors.map((message) => ({
        code: input.code,
        message,
        severity
      }))
    : [
        {
          code: input.code,
          message: input.code,
          severity
        }
      ];
}

export function findingRecordToAssistantResult(input: {
  queuePath: string;
  record: ReportAssistantFindingRecord;
}): ReportAssistantResultEnvelope {
  return createReportAssistantResultEnvelope({
    authority: "user_confirmed",
    capabilityName: "report_assistant_findings_route",
    confidenceReason: "The finding was written only after explicit user confirmation and records local calculator/report context for later review.",
    evidence: findingEvidence(input),
    routeStatus: "ready",
    sourceTrace: [
      {
        detail: "The route received confirmed: true and appended the prepared finding record to the local review queue.",
        kind: "user_confirmation",
        label: "report_assistant_findings_route"
      }
    ]
  });
}

export function findingRouteNeedsInputToAssistantResult(input: {
  code: string;
  errors: readonly string[];
}): ReportAssistantResultEnvelope {
  return createReportAssistantResultEnvelope({
    authority: "needs_input",
    capabilityName: "report_assistant_findings_route",
    confidenceReason: "The finding route did not write because required confirmation, context, or draft input was missing.",
    routeStatus: "needs_input",
    sourceTrace: [
      {
        detail: input.code,
        kind: "deterministic",
        label: "report_assistant_findings_route"
      }
    ],
    tasks: tasks({
      code: input.code,
      errors: input.errors,
      severity: "warning"
    })
  });
}

export function findingRouteFailureToAssistantResult(input: {
  code: string;
  errors: readonly string[];
}): ReportAssistantResultEnvelope {
  return createReportAssistantResultEnvelope({
    authority: "error",
    capabilityName: "report_assistant_findings_route",
    confidenceReason: "The confirmed finding route did not complete successfully, so no successful finding authority is published.",
    routeStatus: "error",
    sourceTrace: [
      {
        detail: input.code,
        kind: "deterministic",
        label: "report_assistant_findings_route"
      }
    ],
    tasks: tasks(input)
  });
}
