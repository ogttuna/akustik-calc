import type { ReportAssistantRuntimeStatus } from "./report-assistant-runtime-status";
import {
  createReportAssistantResultEnvelope,
  type ReportAssistantResultEnvelope
} from "./report-assistant-result-contract";

export function runtimeStatusToAssistantResult(
  status: ReportAssistantRuntimeStatus
): ReportAssistantResultEnvelope {
  const warnings = [
    ...(status.modelProvider.readinessWarnings ?? []),
    ...(status.researchProvider.readinessWarnings ?? []),
    ...(status.mutatingToolsExposed ? ["Mutating model tools are exposed."] : [])
  ];

  return createReportAssistantResultEnvelope({
    authority: "deterministic_read",
    capabilityName: "report_assistant_status_route",
    confidenceReason: "The status is assembled from local capability registry and sanitized provider configuration.",
    evidence: [
      {
        label: "Route capabilities",
        detail: String(status.routes.length)
      },
      {
        label: "Runtime tools",
        detail: String(status.tools.length)
      },
      {
        label: "Action proposals",
        detail: String(status.actionProposals.length)
      },
      {
        label: "Model provider configured",
        detail: String(status.modelProvider.configured)
      },
      {
        label: "Research provider configured",
        detail: String(status.researchProvider.configured)
      }
    ],
    routeStatus: "ready",
    sourceTrace: [
      {
        kind: "deterministic",
        label: "report_assistant_runtime_status",
        detail: status.generatedAtIso
      }
    ],
    warnings
  });
}
