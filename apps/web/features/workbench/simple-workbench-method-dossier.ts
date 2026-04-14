import type { AssemblyCalculation } from "@dynecho/shared";

import type {
  SimpleWorkbenchProposalCoverageItem,
  SimpleWorkbenchProposalLayer
} from "./simple-workbench-proposal";
import { selectSimpleWorkbenchTraceNotes } from "./simple-workbench-trace-notes";

export type SimpleWorkbenchMethodDossierCard = {
  detail: string;
  label: string;
  tone: "accent" | "neutral" | "success" | "warning";
  value: string;
};

export type SimpleWorkbenchMethodTraceGroup = {
  detail: string;
  label: string;
  notes: readonly string[];
  tone: "accent" | "neutral" | "success" | "warning";
  value: string;
};

export type SimpleWorkbenchMethodDossier = {
  cards: readonly SimpleWorkbenchMethodDossierCard[];
  headline: string;
  parkedCoverageCount: number;
  readyCoverageCount: number;
  traceGroups: readonly SimpleWorkbenchMethodTraceGroup[];
  unsupportedCoverageCount: number;
};

function formatCount(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function formatDb(value: number): string {
  return `${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)} dB`;
}

function mapAirborneTone(confidenceClass: "low" | "medium" | "high"): SimpleWorkbenchMethodTraceGroup["tone"] {
  switch (confidenceClass) {
    case "high":
      return "success";
    case "low":
      return "warning";
    case "medium":
    default:
      return "accent";
  }
}

function mapImpactTone(evidenceTier: "exact" | "estimate" | "bound" | "derived"): SimpleWorkbenchMethodTraceGroup["tone"] {
  switch (evidenceTier) {
    case "exact":
      return "success";
    case "bound":
      return "warning";
    case "estimate":
      return "accent";
    case "derived":
    default:
      return "neutral";
  }
}

function buildStackValue(layers: readonly SimpleWorkbenchProposalLayer[]): string {
  if (layers.length === 0) {
    return "No visible rows";
  }

  const top = layers[0]?.label ?? "Unknown top";
  const base = layers.at(-1)?.label ?? "Unknown base";

  return `${top} -> ${base}`;
}

function buildAirborneTraceGroup(result: AssemblyCalculation | null): SimpleWorkbenchMethodTraceGroup | null {
  if (!result) {
    return null;
  }

  const trace = result.dynamicAirborneTrace ?? null;

  if (!trace) {
    const fallbackNoteSelection = selectSimpleWorkbenchTraceNotes([], {
      fallbackNotes: [
        `ISO 717 composite stays on ${result.ratings.iso717.composite}.`,
        `Surface mass ${result.metrics.surfaceMassKgM2.toFixed(0)} kg/m² and total thickness ${result.metrics.totalThicknessMm.toFixed(0)} mm are feeding the current screening curve.`
      ]
    });

    return {
      detail: `${result.calculatorLabel ?? "Screening Seed"} remains active on the airborne side through ${result.metrics.method}. No family-aware airborne trace has locked yet.`,
      label: "Airborne lane",
      notes: fallbackNoteSelection.notes,
      tone: "neutral",
      value: result.calculatorLabel ?? "Screening Seed"
    };
  }

  const noteSelection = selectSimpleWorkbenchTraceNotes(trace.notes, {
    fallbackNotes: [`Strategy ${trace.strategy.replaceAll("_", " ")} selected ${trace.selectedLabel}.`]
  });

  return {
    detail:
      `${trace.detectedFamilyLabel} with ${formatPercent(trace.confidenceScore)} ${trace.confidenceClass} confidence. ` +
      `${formatDb(trace.solverSpreadRwDb)} solver spread across ${trace.candidateMethods.length} candidate method${trace.candidateMethods.length === 1 ? "" : "s"}.`,
    label: "Airborne lane",
    notes: noteSelection.notes,
    tone: mapAirborneTone(trace.confidenceClass),
    value: trace.selectedLabel
  };
}

function buildImpactTraceGroup(result: AssemblyCalculation | null): SimpleWorkbenchMethodTraceGroup | null {
  const trace = result?.dynamicImpactTrace ?? null;

  if (!trace) {
    return null;
  }

  const formulaNotes = result?.impactSupport?.formulaNotes ?? [];
  const isFormulaEstimate =
    trace.selectionKind === "formula_estimate" || result?.impactPredictorStatus?.implementedFormulaEstimate === true;
  const traceNoteSelection = selectSimpleWorkbenchTraceNotes(trace.notes, {
    fallbackNotes: [
      `${trace.fieldContinuationLabel} keeps ${trace.availableMetricLabels.join(", ") || "the current impact companions"} on the active lane.`
    ],
    maxNotes: isFormulaEstimate && formulaNotes.length > 0 ? 1 : 4
  });
  const visibleNotes =
    isFormulaEstimate && formulaNotes.length > 0
      ? [
          ...traceNoteSelection.notes,
          // Formula lanes need derivation notes in proposal dossiers; generic trace notes can otherwise consume all visible slots.
          ...formulaNotes.slice(0, Math.max(0, 4 - traceNoteSelection.notes.length))
        ]
      : traceNoteSelection.notes;
  const supportDetail = [trace.detectedSupportFamilyLabel, trace.systemTypeLabel, trace.supportFormLabel].filter(Boolean).join(" · ");

  return {
    detail:
      `${trace.evidenceTierLabel} using ${trace.impactBasisLabel}. ` +
      `${supportDetail.length > 0 ? `${supportDetail}. ` : ""}` +
      `${trace.fieldContinuationLabel}${typeof trace.fitPercent === "number" ? ` at ${trace.fitPercent.toFixed(0)}% fit.` : "."}`,
    label: "Impact lane",
    notes: visibleNotes,
    tone: mapImpactTone(trace.evidenceTier),
    value: trace.selectedLabel
  };
}

export function buildSimpleWorkbenchMethodDossier(input: {
  branchDetail: string;
  branchLabel: string;
  contextLabel: string;
  coverageItems: readonly SimpleWorkbenchProposalCoverageItem[];
  layers: readonly SimpleWorkbenchProposalLayer[];
  result: AssemblyCalculation | null;
  stackDetail: string;
  studyModeLabel: string;
  validationDetail: string;
  validationLabel: string;
  warnings: readonly string[];
}): SimpleWorkbenchMethodDossier {
  const readyCoverageCount = input.coverageItems.filter((item) => item.status === "live" || item.status === "bound").length;
  const parkedCoverageCount = input.coverageItems.filter((item) => item.status === "needs_input").length;
  const unsupportedCoverageCount = input.coverageItems.filter((item) => item.status === "unsupported").length;
  const warningCount = input.warnings.length;
  const traceGroups = [buildAirborneTraceGroup(input.result), buildImpactTraceGroup(input.result)].filter(
    (group): group is SimpleWorkbenchMethodTraceGroup => Boolean(group)
  );
  const stackValue = buildStackValue(input.layers);
  const warningVerb = warningCount === 1 ? "stays" : "stay";
  const traceVerb = traceGroups.length === 1 ? "is" : "are";
  const parkedVerb = parkedCoverageCount === 1 ? "remains" : "remain";
  const unsupportedVerb = unsupportedCoverageCount === 1 ? "stays" : "stay";

  return {
    cards: [
      {
        detail: input.branchDetail,
        label: "Route choice",
        tone: "accent",
        value: input.branchLabel
      },
      {
        detail:
          `${readyCoverageCount} ready, ${parkedCoverageCount} parked, ${unsupportedCoverageCount} unsupported. ` +
          (warningCount > 0
            ? `${formatCount(warningCount, "live warning")} ${warningVerb} visible instead of being folded into the headline result.`
            : "No live warning is active on the current route."),
        label: "Output posture",
        tone: warningCount > 0 || unsupportedCoverageCount > 0 ? "warning" : "success",
        value: `${readyCoverageCount} ready / ${parkedCoverageCount} parked`
      },
      {
        detail: `${input.validationDetail} ${formatCount(traceGroups.length, "trace group")} ${traceVerb} currently readable on the active route.`,
        label: "Reading confidence",
        tone: warningCount > 0 ? "warning" : "neutral",
        value: input.validationLabel
      },
      {
        detail: `${input.stackDetail} Context label: ${input.contextLabel}.`,
        label: "Stack reading",
        tone: input.layers.length > 0 ? "neutral" : "warning",
        value: stackValue
      }
    ],
    headline:
      `${input.studyModeLabel} calculation is currently reading the stack through ${input.branchLabel.toLowerCase()} in ${input.contextLabel.toLowerCase()} context. ` +
      `${formatCount(readyCoverageCount, "output")} are already defensible while ${formatCount(parkedCoverageCount, "output")} ${parkedVerb} parked and ${formatCount(
        unsupportedCoverageCount,
        "lane"
      )} ${unsupportedVerb} unsupported.`,
    parkedCoverageCount,
    readyCoverageCount,
    traceGroups,
    unsupportedCoverageCount
  };
}
