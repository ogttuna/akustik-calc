import type { AssemblyCalculation } from "@dynecho/shared";

import { getFieldAirborneProvenanceSummary } from "./field-airborne-provenance";
import type { StudyMode } from "./preset-definitions";
import { getScenarioCorridorSummary, getValidationPostureTone } from "./scenario-corridor-summary";
import {
  describeAirborneValidationPosture,
  describeImpactValidationPosture,
  formatFieldCoverageLabel,
  formatFloorCoverageLabel,
  formatImpactValidationTolerance,
  formatValidationFamilyBenchmarkMix,
  formatValidationModePostureLabel,
  getActiveValidationFamily,
  getActiveValidationMode,
  IMPACT_VALIDATION_CORPUS_SUMMARY
} from "./validation-regime";

export type SimpleWorkbenchCorridorDossierCard = {
  detail: string;
  label: string;
  tone: "accent" | "neutral" | "success" | "warning";
  value: string;
};

export type SimpleWorkbenchCorridorDossier = {
  cards: readonly SimpleWorkbenchCorridorDossierCard[];
  headline: string;
};

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function formatCount(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function mapCoverageTone(
  value:
    | "bound"
    | "estimate"
    | "exact"
    | "field"
    | "inactive"
    | "live"
    | "low_confidence"
    | "staged"
    | "unsupported"
): SimpleWorkbenchCorridorDossierCard["tone"] {
  switch (value) {
    case "exact":
    case "live":
      return "success";
    case "field":
      return "accent";
    case "estimate":
      return "accent";
    case "bound":
    case "low_confidence":
    case "unsupported":
      return "warning";
    case "inactive":
    case "staged":
    default:
      return "neutral";
  }
}

function mapToleranceTone(value: number): SimpleWorkbenchCorridorDossierCard["tone"] {
  if (value <= 0) {
    return "success";
  }

  if (value <= 1) {
    return "accent";
  }

  return "warning";
}

function mapAirborneConfidenceTone(confidenceClass: "high" | "low" | "medium"): SimpleWorkbenchCorridorDossierCard["tone"] {
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

function mapSolverSpreadTone(value: number): SimpleWorkbenchCorridorDossierCard["tone"] {
  if (value <= 1) {
    return "success";
  }

  if (value <= 3) {
    return "accent";
  }

  return "warning";
}

function buildWaitingCorridorDossier(studyMode: StudyMode): SimpleWorkbenchCorridorDossier {
  if (studyMode === "wall") {
    return {
      cards: [
        {
          detail: "No live wall result is attached yet, so DynEcho cannot name the current airborne lane.",
          label: "Airborne lane",
          tone: "neutral",
          value: "Waiting for wall route"
        },
        {
          detail: "Build a supported wall stack first so the current route can move from placeholder copy into an explicit airborne posture.",
          label: "Route posture",
          tone: "neutral",
          value: "No live wall route"
        },
        {
          detail: "Solver spread becomes readable only after the family-aware airborne selector has locked onto a valid wall stack.",
          label: "Solver spread",
          tone: "neutral",
          value: "Waiting for family screening"
        },
        {
          detail: "No apparent-field or room-standardized airborne continuation is active yet.",
          label: "Field route",
          tone: "neutral",
          value: "Waiting for geometry path"
        }
      ],
      headline:
        "No airborne validation corridor is attached yet. Build a supported wall route first so DynEcho can name the active airborne lane, route posture, selector spread, and any field-side continuation."
    };
  }

  return {
    cards: [
      {
        detail: "No live result is attached yet, so DynEcho cannot lock a tracked family corridor.",
        label: "Active family",
        tone: "neutral",
        value: "Waiting for supported route"
      },
      {
        detail: "Build a supported topology first so the validation mode can move from placeholder copy into a named benchmark branch.",
        label: "Benchmark mode",
        tone: "neutral",
        value: "No benchmark mode"
      },
      {
        detail: `Repo-wide fallback guardrail remains ${formatImpactValidationTolerance(IMPACT_VALIDATION_CORPUS_SUMMARY.toleranceBandMaxDb)} until a narrower live family corridor is attached.`,
        label: "Tolerance band",
        tone: mapToleranceTone(IMPACT_VALIDATION_CORPUS_SUMMARY.toleranceBandMaxDb),
        value: formatImpactValidationTolerance(IMPACT_VALIDATION_CORPUS_SUMMARY.toleranceBandMaxDb)
      },
      {
        detail: "No field continuation or airborne provenance chain is active yet.",
        label: "Field continuation",
        tone: "neutral",
        value: "Waiting for supported route"
      }
    ],
    headline:
      "No validation corridor is attached yet. Build a supported route first so DynEcho can name the active family, benchmark mode, tolerance band, and field continuation posture."
  };
}

function buildFloorCorridorDossier(result: AssemblyCalculation): SimpleWorkbenchCorridorDossier {
  const corridorSummary = getScenarioCorridorSummary(result);
  const activeFamily = getActiveValidationFamily(result);
  const activeMode = getActiveValidationMode(result);
  const impactPosture = describeImpactValidationPosture(result);
  const toleranceLabel = formatImpactValidationTolerance(activeFamily?.maxToleranceDb ?? IMPACT_VALIDATION_CORPUS_SUMMARY.toleranceBandMaxDb);
  const primaryRouteLabel =
    activeMode?.label ??
    (impactPosture.posture !== "inactive" ? corridorSummary.impactLabel : corridorSummary.airborneLabel);

  return {
    cards: [
      {
        detail: activeFamily
          ? `${formatFloorCoverageLabel(activeFamily.floorCoverage)} · ${formatFieldCoverageLabel(activeFamily.fieldCoverage)}. ${formatValidationFamilyBenchmarkMix(activeFamily)} across ${formatCount(activeFamily.benchmarkCaseCount, "tracked benchmark case")}. ${activeFamily.note}`
          : `No tracked floor-family corridor is attached on the current route. ${corridorSummary.airborneLabel} remains the readable airborne side while the route stays outside the explicit family matrix.`,
        label: "Active family",
        tone: activeFamily ? mapCoverageTone(activeFamily.floorCoverage) : "neutral",
        value: activeFamily?.label ?? "No tracked family"
      },
      {
        detail: activeMode
          ? `${formatValidationModePostureLabel(activeMode.posture)} with ${formatCount(activeMode.caseCount, "tracked case")}. ${activeMode.note}`
          : `${impactPosture.detail} No tracked benchmark mode is attached beyond the current visible route label.`,
        label: "Benchmark mode",
        tone: activeMode ? mapCoverageTone(activeMode.posture) : getValidationPostureTone(impactPosture.posture),
        value: primaryRouteLabel
      },
      {
        detail: activeFamily
          ? `${toleranceLabel} across ${activeFamily.floorCaseCount} floor and ${activeFamily.fieldCaseCount} field case${activeFamily.fieldCaseCount === 1 ? "" : "s"} on the active family.`
          : `${toleranceLabel} repo-wide fallback guardrail. No narrower family tolerance is attached to the current route yet.`,
        label: "Tolerance band",
        tone: mapToleranceTone(activeFamily?.maxToleranceDb ?? IMPACT_VALIDATION_CORPUS_SUMMARY.toleranceBandMaxDb),
        value: toleranceLabel
      },
      {
        detail: corridorSummary.fieldContinuationLabel
          ? `${corridorSummary.fieldContinuationLabel} is active on the impact side. ${corridorSummary.airborneProvenanceDetail ?? "Airborne provenance remains explicit on the current route."}`
          : corridorSummary.airborneProvenanceDetail ??
            "No field continuation is active on the current route. Read this result as lab-side only until the required geometry or room inputs are present.",
        label: "Field continuation",
        tone: corridorSummary.fieldContinuationLabel ? "accent" : corridorSummary.airborneProvenanceLabel ? "neutral" : "neutral",
        value: corridorSummary.fieldContinuationLabel ?? corridorSummary.airborneProvenanceLabel ?? "Lab-side only"
      }
    ],
    headline:
      `${primaryRouteLabel} is the active benchmark mode${activeFamily ? ` on ${activeFamily.label}` : ""}. ` +
      `${activeFamily ? `${toleranceLabel} family tolerance remains attached to this route.` : `${toleranceLabel} repo-wide fallback guardrail is active because no tracked family corridor is attached.`} ` +
      `${corridorSummary.fieldContinuationLabel ? `${corridorSummary.fieldContinuationLabel} is live on the field-side chain.` : corridorSummary.airborneProvenanceLabel ? `${corridorSummary.airborneProvenanceLabel} remains explicit on the airborne side.` : "Field continuation is currently lab-side only or still staged."}`
  };
}

function buildWallCorridorDossier(result: AssemblyCalculation): SimpleWorkbenchCorridorDossier {
  const airbornePosture = describeAirborneValidationPosture(result);
  const provenance = getFieldAirborneProvenanceSummary(result);
  const trace = result.dynamicAirborneTrace ?? null;
  const laneValue = trace?.selectedLabel ?? result.calculatorLabel ?? "Screening seed";
  const fieldRouteValue = provenance?.modeLabel ?? "Lab-side only";
  const spreadValue = trace ? `${trace.solverSpreadRwDb} dB` : "Local curve only";

  return {
    cards: [
      {
        detail: trace
          ? `${trace.detectedFamilyLabel} is the current airborne family read across ${formatCount(trace.candidateMethods.length, "candidate method")} with ${formatPercent(trace.confidenceScore)} confidence.`
          : `${laneValue} remains the local airborne curve anchor. No family-ranked dynamic selector is attached yet.`,
        label: "Airborne lane",
        tone: trace ? mapAirborneConfidenceTone(trace.confidenceClass) : "neutral",
        value: laneValue
      },
      {
        detail: trace
          ? `${airbornePosture.detail} ${trace.selectedLabel} is the current ranked anchor on this wall route.`
          : airbornePosture.detail,
        label: "Route posture",
        tone: getValidationPostureTone(airbornePosture.posture),
        value: airbornePosture.label
      },
      {
        detail: trace
          ? `${formatCount(trace.candidateMethods.length, "candidate method")} remain in the active family set. Lower spread means the current wall read is less sensitive to selector choice.`
          : "Without a family-ranked airborne trace, DynEcho cannot report selector spread on this wall route yet.",
        label: "Solver spread",
        tone: trace ? mapSolverSpreadTone(trace.solverSpreadRwDb) : "neutral",
        value: spreadValue
      },
      {
        detail: provenance
          ? `${provenance.label}. ${provenance.detail}`
          : "No apparent-field or room-standardized airborne continuation is active on this wall route yet. Add geometry and room context before treating the read as an on-site apparent-field claim.",
        label: "Field route",
        tone: provenance ? "accent" : "neutral",
        value: fieldRouteValue
      }
    ],
    headline:
      `${airbornePosture.label} is the active wall validation posture. ` +
      `${
        trace
          ? `${trace.selectedLabel} is screening ${trace.detectedFamilyLabel} at ${formatPercent(trace.confidenceScore)} confidence with ${trace.solverSpreadRwDb} dB selector spread. `
          : `${laneValue} remains the active local curve anchor without a family-ranked airborne selector. `
      }` +
      `${provenance ? `${provenance.modeLabel} stays explicit on the field-side airborne chain.` : "No field-side airborne continuation is active, so this route should still be read as lab-side only."}`
  };
}

export function buildSimpleWorkbenchCorridorDossier(
  result: AssemblyCalculation | null,
  studyMode: StudyMode = "floor"
): SimpleWorkbenchCorridorDossier {
  if (!result) {
    return buildWaitingCorridorDossier(studyMode);
  }

  return studyMode === "wall" ? buildWallCorridorDossier(result) : buildFloorCorridorDossier(result);
}
