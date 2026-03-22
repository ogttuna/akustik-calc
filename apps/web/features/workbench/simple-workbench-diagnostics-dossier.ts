import type { AssemblyCalculation } from "@dynecho/shared";

import type {
  SimpleWorkbenchProposalCitation,
  SimpleWorkbenchProposalDecisionItem
} from "./simple-workbench-evidence";

export type SimpleWorkbenchDiagnosticsDossierCard = {
  detail: string;
  label: string;
  tone: "accent" | "neutral" | "success" | "warning";
  value: string;
};

export type SimpleWorkbenchDiagnosticsDossier = {
  cards: readonly SimpleWorkbenchDiagnosticsDossierCard[];
  headline: string;
  linkedCitationCount: number;
  traceCount: number;
  warningCount: number;
};

function formatCount(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function getValidationTone(validationLabel: string): SimpleWorkbenchDiagnosticsDossierCard["tone"] {
  switch (validationLabel) {
    case "Exact evidence":
      return "success";
    case "Conservative bound":
    case "Low-confidence fallback":
      return "warning";
    case "Scoped estimate":
      return "accent";
    default:
      return "neutral";
  }
}

export function buildSimpleWorkbenchDiagnosticsDossier(input: {
  branchLabel: string;
  citations: readonly SimpleWorkbenchProposalCitation[];
  decisionTrailHeadline: string;
  decisionTrailItems: readonly SimpleWorkbenchProposalDecisionItem[];
  result: AssemblyCalculation | null;
  validationDetail: string;
  validationLabel: string;
  warnings: readonly string[];
}): SimpleWorkbenchDiagnosticsDossier {
  const linkedCitationCount = input.citations.filter((citation) => typeof citation.href === "string" && citation.href.trim().length > 0).length;
  const traceCount = [
    input.result?.dynamicAirborneTrace ? "airborne" : null,
    input.result?.dynamicImpactTrace ? "impact" : null,
    input.result?.airborneOverlay ? "overlay" : null
  ].filter(Boolean).length;
  const warningCount = input.warnings.length;
  const validationTone = getValidationTone(input.validationLabel);

  return {
    cards: [
      {
        detail: input.validationDetail,
        label: "Validation posture",
        tone: validationTone,
        value: input.validationLabel
      },
      {
        detail:
          traceCount > 0
            ? `${formatCount(traceCount, "live trace")} are available for audit. Dynamic airborne, dynamic impact, and airborne overlay remain separate instead of being collapsed into one confidence claim.`
            : "No explicit trace block is active yet. Build a supported route first so diagnostics can expose the solver lineage.",
        label: "Trace coverage",
        tone: traceCount > 0 ? "success" : "warning",
        value: `${traceCount} live`
      },
      {
        detail:
          `${formatCount(input.decisionTrailItems.length, "decision line")} and ${formatCount(input.citations.length, "citation")} travel with the guided package. ` +
          `${formatCount(linkedCitationCount, "linked source")} are directly openable from the diagnostics surface.`,
        label: "Evidence courier",
        tone: input.citations.length > 0 ? "accent" : "warning",
        value: `${input.decisionTrailItems.length} decisions / ${input.citations.length} citations`
      },
      {
        detail:
          warningCount > 0
            ? `${formatCount(warningCount, "live warning")} remain explicit. First signal: ${input.warnings[0]}`
            : "No live warning is active on the current route.",
        label: "Warning board",
        tone: warningCount > 0 ? "warning" : "success",
        value: warningCount > 0 ? `${warningCount} active` : "Clear"
      }
    ],
    headline:
      `${input.branchLabel} is active with ${input.validationLabel.toLowerCase()} posture. ` +
      `${formatCount(traceCount, "trace group")} and ${formatCount(input.citations.length, "citation line")} remain visible so the guided flow can explain why the current route was chosen.`,
    linkedCitationCount,
    traceCount,
    warningCount
  };
}
