import type { ReportAssistantPlausibilityReview } from "./report-assistant-plausibility";
import type { ReportAssistantPlausibilityReviewSource } from "./report-assistant-plausibility-research";
import {
  createReportAssistantResultEnvelope,
  type ReportAssistantResultEnvelope,
  type ReportAssistantResultEvidence,
  type ReportAssistantResultSourceTrace
} from "./report-assistant-result-contract";

function compactPlausibilityEvidence(input: {
  patchValidationStatus?: string;
  review: ReportAssistantPlausibilityReview;
  source: ReportAssistantPlausibilityReviewSource;
}): readonly ReportAssistantResultEvidence[] {
  const evidence: ReportAssistantResultEvidence[] = [
    {
      detail: input.review.metricId,
      label: "Metric reviewed"
    },
    {
      detail: input.review.verdict,
      label: "Review verdict"
    },
    {
      detail: input.review.severity,
      label: "Review severity"
    },
    {
      detail: input.review.sourceQuality,
      label: "Source quality"
    },
    {
      detail: String(input.review.sources.length),
      label: "Citation count"
    },
    {
      detail: input.source,
      label: "Review source"
    }
  ];

  if (input.patchValidationStatus) {
    evidence.push({
      detail: input.patchValidationStatus,
      label: "Patch validation status"
    });
  }

  return evidence;
}

export function plausibilityReviewToAssistantResult(input: {
  patchValidationStatus?: string;
  review: ReportAssistantPlausibilityReview;
  source: ReportAssistantPlausibilityReviewSource;
  warnings?: readonly string[];
}): ReportAssistantResultEnvelope {
  const providerBacked = input.source === "research_provider";
  const sourceTrace: ReportAssistantResultSourceTrace = providerBacked
    ? {
        detail: "Research provider output was normalized into the plausibility review contract.",
        kind: "provider_review",
        label: "report_assistant_plausibility_route"
      }
    : {
        detail: "Local report context produced the plausibility review.",
        kind: "deterministic",
        label: "report_assistant_plausibility_route"
      };

  return createReportAssistantResultEnvelope({
    authority: providerBacked ? "provider_review" : "deterministic_read",
    capabilityName: "report_assistant_plausibility_route",
    confidenceReason: providerBacked
      ? "This is advisory source research. It does not calibrate calculator values or publish calculator-backed authority."
      : "This review is derived from local report context and engine/display drift metadata.",
    evidence: compactPlausibilityEvidence(input),
    routeStatus: "ready",
    sourceTrace: [sourceTrace],
    warnings: input.warnings ?? []
  });
}
