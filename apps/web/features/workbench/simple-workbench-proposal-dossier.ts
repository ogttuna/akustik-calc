import type { SimpleWorkbenchProposalDocument } from "./simple-workbench-proposal";

export type SimpleWorkbenchProposalDossierItem = {
  detail: string;
  label: string;
  value: string;
};

export type SimpleWorkbenchProposalDossier = {
  headline: string;
  items: readonly SimpleWorkbenchProposalDossierItem[];
  linkedCitationCount: number;
  parkedCoverageCount: number;
  readyCoverageCount: number;
  unsupportedCoverageCount: number;
  warningCount: number;
};

function formatCount(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function isLowConfidenceFallback(document: SimpleWorkbenchProposalDocument): boolean {
  return document.validationLabel === "Low-confidence fallback";
}

export function buildSimpleWorkbenchProposalDossier(
  document: SimpleWorkbenchProposalDocument
): SimpleWorkbenchProposalDossier {
  const readyCoverageCount = document.coverageItems.filter((item) => item.status === "live" || item.status === "bound").length;
  const parkedCoverageCount = document.coverageItems.filter((item) => item.status === "needs_input").length;
  const unsupportedCoverageCount = document.coverageItems.filter((item) => item.status === "unsupported").length;
  const linkedCitationCount = document.citations.filter((citation) => typeof citation.href === "string" && citation.href.trim().length > 0).length;
  const warningCount = document.warnings.length;
  const issueHistoryCount = document.issueRegisterItems.length;
  const lowConfidenceFallback = isLowConfidenceFallback(document);
  const readyVerb = readyCoverageCount === 1 ? "travels" : "travel";
  const warningVerb = warningCount === 1 ? "remains" : "remain";
  const issueHistoryVerb = issueHistoryCount === 1 ? "sits" : "sit";
  const readyOutputNoun = lowConfidenceFallback ? "screening output" : "ready output";
  const readySummaryValue = lowConfidenceFallback
    ? `${readyCoverageCount} screening / ${parkedCoverageCount} parked`
    : `${readyCoverageCount} ready / ${parkedCoverageCount} parked`;
  const packageLabel = lowConfidenceFallback ? "screening package" : "issue package";

  return {
    headline:
      `${document.validationLabel} stays explicit on the ${lowConfidenceFallback ? "screening route" : `${document.dynamicBranchLabel.toLowerCase()} route`}. ` +
      `${formatCount(readyCoverageCount, readyOutputNoun)} ${readyVerb} with ${formatCount(parkedCoverageCount, "parked output")} and ${formatCount(
        unsupportedCoverageCount,
        "unsupported lane"
      )}.`,
    items: [
      {
        detail:
          warningCount > 0
            ? `${document.validationDetail} ${formatCount(warningCount, "live warning")} ${warningVerb} explicit on the issue sheet.`
            : lowConfidenceFallback
              ? `${document.validationDetail} No extra live warning is active, but the current issue stays in screening posture.`
              : `${document.validationDetail} No live warning is active on the current issue package.`,
        label: "Evidence posture",
        value: document.validationLabel
      },
      {
        detail: `${formatCount(unsupportedCoverageCount, "unsupported lane")} remain visible instead of being hidden inside the formal PDF.`,
        label: "Coverage posture",
        value: readySummaryValue
      },
      {
        detail:
          `${formatCount(document.citations.length, "citation")}, ${formatCount(linkedCitationCount, "linked source")}, and ${formatCount(
            document.recommendationItems.length,
            "recommended action"
          )} travel with the ${packageLabel}.`,
        label: "Audit package",
        value: `${document.decisionTrailItems.length} decisions / ${document.assumptionItems.length} assumptions`
      },
      {
        detail:
          `Base ${document.issueBaseReference}; next ${document.issueNextReference}. ` +
          `${formatCount(issueHistoryCount, "issue line")} currently ${issueHistoryVerb} in the register.`,
        label: "Issue control",
        value: `${document.proposalReference} · ${document.proposalRevision}`
      }
    ],
    linkedCitationCount,
    parkedCoverageCount,
    readyCoverageCount,
    unsupportedCoverageCount,
    warningCount
  };
}
