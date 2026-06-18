import type { ReportAssistantActionProposal } from "./report-assistant-action-proposal";
import {
  createReportAssistantResultEnvelope,
  type ReportAssistantResultEnvelope,
  type ReportAssistantResultEvidence
} from "./report-assistant-result-contract";

function targetEvidence(proposal: ReportAssistantActionProposal): readonly ReportAssistantResultEvidence[] {
  const evidence: ReportAssistantResultEvidence[] = [
    {
      detail: proposal.summary,
      label: proposal.title
    }
  ];

  if (proposal.target.projectId) {
    evidence.push({
      detail: proposal.target.projectName
        ? `${proposal.target.projectName} (${proposal.target.projectId})`
        : proposal.target.projectId,
      label: "Project target"
    });
  }

  if (proposal.target.reportId) {
    evidence.push({
      detail: proposal.target.reportName
        ? `${proposal.target.reportName} (${proposal.target.reportId})`
        : proposal.target.reportId,
      label: "Report target"
    });
  }

  if (proposal.target.assemblyId) {
    evidence.push({
      detail: proposal.target.assemblyName
        ? `${proposal.target.assemblyName} (${proposal.target.assemblyId})`
        : proposal.target.assemblyId,
      label: "Assembly target"
    });
  }

  if (proposal.target.restoreRevisionId) {
    evidence.push({
      detail: proposal.target.restoreRevisionDisplayCode
        ? `${proposal.target.restoreRevisionDisplayCode} (${proposal.target.restoreRevisionId})`
        : proposal.target.restoreRevisionId,
      label: "Restore revision target"
    });
  }

  if (proposal.target.expectedReportUpdatedAtIso) {
    evidence.push({
      detail: proposal.target.expectedReportUpdatedAtIso,
      label: "Target stale guard"
    });
  }

  return evidence;
}

export function actionProposalToAssistantResult(
  proposal: ReportAssistantActionProposal
): ReportAssistantResultEnvelope {
  return createReportAssistantResultEnvelope({
    authority: "draft_only",
    capabilityName: proposal.action,
    confidenceReason: "The route produced a non-mutating preview. The later apply route requires explicit user confirmation and the target stale guard.",
    evidence: targetEvidence(proposal),
    routeStatus: "ready",
    sourceTrace: [
      {
        detail: "Typed project/report context produced the proposal; no apply route was executed.",
        kind: "deterministic",
        label: "report_assistant_action_proposal_route"
      }
    ],
    warnings: proposal.warnings
  });
}
