import {
  createReportAssistantResultEnvelope,
  type ReportAssistantResultAuthority,
  type ReportAssistantResultEnvelope,
  type ReportAssistantResultEvidence,
  type ReportAssistantResultRouteStatus,
  type ReportAssistantResultSourceTrace,
  type ReportAssistantResultTask
} from "./report-assistant-result-contract";

function authorityForRouteStatus(routeStatus: ReportAssistantResultRouteStatus): ReportAssistantResultAuthority {
  if (routeStatus === "needs_input") {
    return "needs_input";
  }

  if (routeStatus === "unsupported") {
    return "unsupported";
  }

  return "error";
}

function severityForRouteStatus(routeStatus: ReportAssistantResultRouteStatus): ReportAssistantResultTask["severity"] {
  return routeStatus === "needs_input" || routeStatus === "unsupported" ? "warning" : "error";
}

function failureTasks(input: {
  code: string;
  errors: readonly string[];
  routeStatus: ReportAssistantResultRouteStatus;
}): readonly ReportAssistantResultTask[] {
  const severity = severityForRouteStatus(input.routeStatus);

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

export function routeFailureToAssistantResult(input: {
  capabilityName: string;
  code: string;
  confidenceReason?: string;
  errors: readonly string[];
  evidence?: readonly ReportAssistantResultEvidence[];
  routeStatus: ReportAssistantResultRouteStatus;
  sourceTraceKind?: ReportAssistantResultSourceTrace["kind"];
  sourceTraceLabel?: string;
  warnings?: readonly string[];
}): ReportAssistantResultEnvelope {
  return createReportAssistantResultEnvelope({
    authority: authorityForRouteStatus(input.routeStatus),
    capabilityName: input.capabilityName,
    confidenceReason:
      input.confidenceReason ??
      "The route did not produce a successful assistant result; the typed failure boundary prevents it from being summarized as a successful answer.",
    evidence: input.evidence,
    routeStatus: input.routeStatus,
    sourceTrace: [
      {
        detail: input.code,
        kind: input.sourceTraceKind ?? "deterministic",
        label: input.sourceTraceLabel ?? input.capabilityName
      }
    ],
    tasks: failureTasks(input),
    warnings: input.warnings ?? []
  });
}
