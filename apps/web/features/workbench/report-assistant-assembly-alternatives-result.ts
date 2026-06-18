import type {
  ReportAssistantAssemblyAlternativeReview,
  ReportAssistantAssemblyAlternativeReviewSource
} from "./report-assistant-assembly-alternatives";
import {
  createReportAssistantResultEnvelope,
  type ReportAssistantResultEnvelope,
  type ReportAssistantResultEvidence,
  type ReportAssistantResultSourceTrace
} from "./report-assistant-result-contract";

function compactAssemblyAlternativeEvidence(input: {
  review: ReportAssistantAssemblyAlternativeReview;
  source: ReportAssistantAssemblyAlternativeReviewSource;
}): readonly ReportAssistantResultEvidence[] {
  return [
    {
      detail: input.source,
      label: "Review source"
    },
    {
      detail: input.review.sourceQuality,
      label: "Source quality"
    },
    {
      detail: input.review.comparability,
      label: "Comparability"
    },
    {
      detail: input.review.expectedMetricDirection,
      label: "Expected metric direction"
    },
    {
      detail: String(input.review.affectedLayers.length),
      label: "Affected layer count"
    },
    {
      detail: String(input.review.suggestedAlternatives.length),
      label: "Suggested alternative count"
    },
    {
      detail: String(input.review.sources.length),
      label: "Citation count"
    }
  ];
}

export function assemblyAlternativeReviewToAssistantResult(input: {
  review: ReportAssistantAssemblyAlternativeReview;
  source: ReportAssistantAssemblyAlternativeReviewSource;
  warnings?: readonly string[];
}): ReportAssistantResultEnvelope {
  const providerBacked = input.source === "research_provider";
  const sourceTrace: ReportAssistantResultSourceTrace = providerBacked
    ? {
        detail: "Research provider output was normalized into the assembly-alternative review contract.",
        kind: "provider_review",
        label: "report_assistant_assembly_alternatives_route"
      }
    : {
        detail: "Local report context produced the assembly-alternative review.",
        kind: "deterministic",
        label: "report_assistant_assembly_alternatives_route"
      };

  return createReportAssistantResultEnvelope({
    authority: providerBacked ? "provider_review" : "deterministic_read",
    capabilityName: "report_assistant_assembly_alternatives_route",
    confidenceReason: providerBacked
      ? "This is advisory source research. It does not change report values or calibrate calculator behavior."
      : "This review is derived from local report context and does not name source-backed alternatives without evidence.",
    evidence: compactAssemblyAlternativeEvidence(input),
    routeStatus: "ready",
    sourceTrace: [sourceTrace],
    warnings: input.warnings ?? []
  });
}
