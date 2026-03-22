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

export function buildSimpleWorkbenchProposalDossier(
  document: SimpleWorkbenchProposalDocument
): SimpleWorkbenchProposalDossier {
  const readyCoverageCount = document.coverageItems.filter((item) => item.status === "live" || item.status === "bound").length;
  const parkedCoverageCount = document.coverageItems.filter((item) => item.status === "needs_input").length;
  const unsupportedCoverageCount = document.coverageItems.filter((item) => item.status === "unsupported").length;
  const linkedCitationCount = document.citations.filter((citation) => typeof citation.href === "string" && citation.href.trim().length > 0).length;
  const warningCount = document.warnings.length;
  const issueHistoryCount = document.issueRegisterItems.length;
  const readyVerb = readyCoverageCount === 1 ? "travels" : "travel";
  const warningVerb = warningCount === 1 ? "remains" : "remain";
  const issueHistoryVerb = issueHistoryCount === 1 ? "sits" : "sit";

  return {
    headline:
      `${document.validationLabel} stays explicit on the ${document.dynamicBranchLabel.toLowerCase()} route. ` +
      `${formatCount(readyCoverageCount, "ready output")} ${readyVerb} with ${formatCount(parkedCoverageCount, "parked output")} and ${formatCount(
        unsupportedCoverageCount,
        "unsupported lane"
      )}.`,
    items: [
      {
        detail:
          warningCount > 0
            ? `${document.validationDetail} ${formatCount(warningCount, "live warning")} ${warningVerb} explicit on the issue sheet.`
            : `${document.validationDetail} No live warning is active on the current issue package.`,
        label: "Evidence posture",
        value: document.validationLabel
      },
      {
        detail: `${formatCount(unsupportedCoverageCount, "unsupported lane")} remain visible instead of being hidden inside the formal PDF.`,
        label: "Coverage posture",
        value: `${readyCoverageCount} ready / ${parkedCoverageCount} parked`
      },
      {
        detail:
          `${formatCount(document.citations.length, "citation")}, ${formatCount(linkedCitationCount, "linked source")}, and ${formatCount(
            document.recommendationItems.length,
            "recommended action"
          )} travel with the issue package.`,
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
