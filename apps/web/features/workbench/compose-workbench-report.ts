import {
  formatImpactValidationTolerance,
  getImpactValidationFamilyRegimeById,
  getImpactValidationFamilyIdFromSupportFamily,
  IMPACT_VALIDATION_CORPUS_SUMMARY,
  IMPACT_VALIDATION_FAMILY_MATRIX,
  IMPACT_VALIDATION_MODE_MATRIX,
  type ImpactGuideDerivation
} from "@dynecho/engine";
import {
  getFloorSystemCompanionLabel,
  getFloorSystemDerivedRwPlusCtr,
  type ImpactCalculation,
  type ReportProfile,
  type RequestedOutputId,
  type StudyContext
} from "@dynecho/shared";

import type { CriteriaPack } from "./criteria-packs";
import {
  DUTCH_DNTAK_REFERENCE_SOURCES,
  getDutchResidentialDnTAkComplianceReportLines
} from "./dutch-airborne-compliance";
import { getConsultantDecisionTrailReportLines } from "./consultant-decision-trail";
import {
  DUTCH_IMPACT_REFERENCE_SOURCES,
  getDutchResidentialImpactReferenceRows,
  getDutchResidentialImpactReferenceReportLines
} from "./dutch-impact-reference";
import { getDnTAkReportLine } from "./dntak-source-mode";
import { getFieldAirborneReportLines } from "./field-airborne-provenance";
import { FIELD_RISK_BY_ID, summarizeFieldRisk, type FieldRiskId } from "./field-risk-model";
import {
  formatImpactMetricBasisLabel,
  getActiveImpactMetricBasisRows
} from "./impact-metric-basis-view";
import { formatReinforcedConcreteLowConfidenceRankedRowText } from "./reinforced-concrete-low-confidence-floor-lane";
import type { PresetDefinition, StudyMode } from "./preset-definitions";
import type { EvaluatedScenario } from "./scenario-analysis";
import {
  FLOOR_ROLE_LABELS,
  REPORT_PROFILE_LABELS,
  REQUESTED_OUTPUT_LABELS,
  STUDY_CONTEXT_LABELS,
  STUDY_MODE_LABELS
} from "./workbench-data";
import { parseWorkbenchNumber } from "./parse-number";
import { summarizeTargetOutputs } from "./target-output-status";
import { getScenarioDecisionSummary } from "./scenario-corridor-summary";
import {
  describeAirborneValidationPosture,
  describeImpactValidationPosture,
  formatFieldCoverageLabel,
  formatFloorCoverageLabel,
  formatValidationFamilyBenchmarkMix,
  formatValidationModePostureLabel,
  getActiveValidationMode
} from "./validation-regime";
import { getScenarioCorridorSummary } from "./scenario-corridor-summary";

type ComposeWorkbenchReportInput = {
  activePreset: PresetDefinition;
  activeCriteriaPack: CriteriaPack;
  briefNote: string;
  clientName: string;
  currentScenario: EvaluatedScenario;
  fieldRiskIds: readonly FieldRiskId[];
  impactGuide: ImpactGuideDerivation | null;
  impactImprovementBandInput: string;
  impactReference: ImpactCalculation | null;
  impactReferenceDeltaLwDb: string;
  improvementReferenceImpact: ImpactCalculation | null;
  projectName: string;
  reportProfile: ReportProfile;
  requestedOutputs: readonly RequestedOutputId[];
  savedScenarios: readonly EvaluatedScenario[];
  studyContext: StudyContext;
  studyMode: StudyMode;
  targetLnwDb: string;
  targetRwDb: string;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseTarget(value: string): number | null {
  const parsed = parseWorkbenchNumber(value);
  return typeof parsed === "number" ? parsed : null;
}

function formatMetric(value: number): string {
  return value.toFixed(1);
}

function formatSignedMetric(value: number): string {
  return `${value >= 0 ? "+" : ""}${formatMetric(value)}`;
}

function buildFloorSystemCompanionLines(
  prefix: "Exact" | "Estimated",
  ratings: { Rw: number; RwCtr?: number; RwCtrSemantic?: "ctr_term" | "rw_plus_c" | "rw_plus_ctr" }
): string[] {
  const label = getFloorSystemCompanionLabel(ratings);

  if (typeof ratings.RwCtr !== "number") {
    return [`- ${prefix} ${label}: unavailable`];
  }

  const lines = [`- ${prefix} ${label}: ${formatMetric(ratings.RwCtr)} dB`];
  const derivedRwPlusCtr = getFloorSystemDerivedRwPlusCtr(ratings);

  if (label === "Ctr" && typeof derivedRwPlusCtr === "number") {
    lines.push(`- ${prefix} derived Rw + Ctr: ${formatMetric(derivedRwPlusCtr)} dB`);
  }

  return lines;
}

type ReportImpactBounds = {
  DeltaLwLowerBound?: number;
  LnWPlusCIUpperBound?: number;
  LnWUpperBound?: number;
  LPrimeNTwUpperBound?: number;
  LPrimeNWUpperBound?: number;
};

function buildImpactBoundReportLines(prefix: string, lowerBound: ReportImpactBounds | null | undefined): string[] {
  if (!lowerBound) {
    return [];
  }

  const labelPrefix = prefix.length > 0 ? `${prefix} ` : "";
  const lines: string[] = [];

  if (typeof lowerBound.LnWUpperBound === "number") {
    lines.push(`- ${labelPrefix}Ln,w upper bound: <= ${formatMetric(lowerBound.LnWUpperBound)} dB`);
  }

  if (typeof lowerBound.LnWPlusCIUpperBound === "number") {
    lines.push(`- ${labelPrefix}Ln,w+CI upper bound: <= ${formatMetric(lowerBound.LnWPlusCIUpperBound)} dB`);
  }

  if (typeof lowerBound.DeltaLwLowerBound === "number") {
    lines.push(`- ${labelPrefix}DeltaLw lower bound: >= ${formatMetric(lowerBound.DeltaLwLowerBound)} dB`);
  }

  if (typeof lowerBound.LPrimeNWUpperBound === "number") {
    lines.push(`- ${labelPrefix}L'n,w upper bound: <= ${formatMetric(lowerBound.LPrimeNWUpperBound)} dB`);
  }

  if (typeof lowerBound.LPrimeNTwUpperBound === "number") {
    lines.push(`- ${labelPrefix}L'nT,w upper bound: <= ${formatMetric(lowerBound.LPrimeNTwUpperBound)} dB`);
  }

  return lines;
}

function listOutputs(outputs: readonly RequestedOutputId[]): string {
  return outputs.map((output) => REQUESTED_OUTPUT_LABELS[output]).join(", ");
}

const DUTCH_IMPACT_OUTPUTS = new Set<RequestedOutputId>(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50", "LnT,A"]);

function buildImpactMetricBasisLines(impact: ImpactCalculation | null | undefined): string[] {
  return getActiveImpactMetricBasisRows(impact).map(
    (row) => `- Impact ${row.label} provenance: ${formatImpactMetricBasisLabel(row.basis)}. ${row.description}`
  );
}

function buildScenarioReportLines(input: {
  liveScenario: EvaluatedScenario;
  scenario: EvaluatedScenario;
  targetLnwDb: string;
  targetRwDb: string;
}): string[] {
  const { liveScenario, scenario, targetLnwDb, targetRwDb } = input;
  if (!scenario.result) {
    return [`### ${scenario.name}`, "- Snapshot state: invalid scenario snapshot", ""];
  }

  const summary = getScenarioCorridorSummary(scenario.result);
  const decision = getScenarioDecisionSummary({
    baselineResult: liveScenario.result,
    candidateResult: scenario.result,
    targetLnwDb,
    targetRwDb
  });

  return [
    `### ${scenario.name}`,
    `- Summary: ${scenario.result.ratings.iso717.composite}, STC ${formatMetric(scenario.result.metrics.estimatedStc)} dB, ${summary.impactHeadline}, ${formatMetric(scenario.result.metrics.surfaceMassKgM2)} kg/m², ${formatMetric(scenario.result.metrics.totalThicknessMm)} mm`,
    `- Impact posture: ${summary.impactLabel}`,
    `- Airborne posture: ${summary.airborneLabel}`,
    ...(summary.activeFamilyLabel ? [`- Active family corridor: ${summary.activeFamilyLabel}`] : []),
    ...(summary.activeModeLabel ? [`- Active benchmark mode: ${summary.activeModeLabel}`] : []),
    ...(summary.fieldContinuationLabel ? [`- Field continuation: ${summary.fieldContinuationLabel}`] : []),
    `- Live decision status: ${decision.liveStatusLabel}`,
    `- Delta versus live: ${decision.liveDeltaLabel.replace(/^Vs live: /, "")}`,
    `- Brief decision status: ${decision.briefStatusLabel}`,
    ...(decision.briefDeltaLabel ? [`- Brief gap: ${decision.briefDeltaLabel.replace(/^Brief gap: /, "")}`] : []),
    `- Scenario reading: ${summary.impactPosture.detail}`,
    `- Airborne reading: ${summary.airbornePosture.detail}`,
    ...(summary.airborneProvenanceLabel ? [`- Airborne field provenance: ${summary.airborneProvenanceLabel}`] : []),
    ...(summary.airborneProvenanceDetail ? [`- Airborne field reading: ${summary.airborneProvenanceDetail}`] : []),
    `- Corridor summary: ${summary.narrative}`,
    ""
  ];
}

export function buildReportFilename(projectName: string): string {
  const slug = slugify(projectName) || "dynecho-study";
  return `${slug}-operator-brief.md`;
}

export function composeWorkbenchReport({
  activePreset,
  activeCriteriaPack,
  briefNote,
  clientName,
  currentScenario,
  fieldRiskIds,
  impactGuide,
  impactImprovementBandInput,
  impactReference,
  impactReferenceDeltaLwDb,
  improvementReferenceImpact,
  projectName,
  reportProfile,
  requestedOutputs,
  savedScenarios,
  studyContext,
  studyMode,
  targetLnwDb,
  targetRwDb
}: ComposeWorkbenchReportInput): string {
  const fieldRiskSummary = summarizeFieldRisk(fieldRiskIds);
  const outputSummary = summarizeTargetOutputs({
    guideResult: impactGuide,
    outputs: requestedOutputs,
    result: currentScenario.result
  });
  const predictorLowerBound =
    currentScenario.result?.impactPredictorStatus?.lowerBoundImpact ?? currentScenario.result?.lowerBoundImpact ?? null;
  const targetRw = parseTarget(targetRwDb);
  const targetLnw = parseTarget(targetLnwDb);
  const currentRw = currentScenario.result?.metrics.estimatedRwDb ?? null;
  const currentBoundFloorSystem = currentScenario.result?.boundFloorSystemMatch ?? null;
  const currentBoundFloorEstimate = currentScenario.result?.boundFloorSystemEstimate ?? null;
  const currentExactFloorSystem = currentScenario.result?.floorSystemMatch ?? null;
  const currentEstimatedFloorSystem = currentScenario.result?.floorSystemEstimate ?? null;
  const currentImpactCatalogMatch = currentScenario.result?.impactCatalogMatch ?? null;
  const currentImpactCatalogImpact = currentImpactCatalogMatch?.impact ?? null;
  const currentImpactCatalogLowerBound = currentImpactCatalogMatch?.lowerBoundImpact ?? null;
  const currentLowerBoundImpact = currentScenario.result?.lowerBoundImpact ?? null;
  const currentFloorSystemRecommendations = currentScenario.result?.floorSystemRecommendations ?? [];
  const activeValidationFamily = getImpactValidationFamilyRegimeById(
    getImpactValidationFamilyIdFromSupportFamily(currentScenario.result?.dynamicImpactTrace?.detectedSupportFamily)
  );
  const activeValidationMode = getActiveValidationMode(currentScenario.result);
  const impactValidationPosture = describeImpactValidationPosture(currentScenario.result);
  const airborneValidationPosture = describeAirborneValidationPosture(currentScenario.result);
  const currentLnw = currentScenario.result?.impact?.LnW ?? currentExactFloorSystem?.impact.LnW ?? currentEstimatedFloorSystem?.impact.LnW ?? null;
  const rwDelta = currentRw !== null && targetRw !== null ? currentRw - targetRw : null;
  const lnwDelta =
    currentLnw !== null && targetLnw !== null
      ? targetLnw - currentLnw
      : currentLowerBoundImpact?.LnWUpperBound !== undefined && targetLnw !== null
        ? targetLnw - currentLowerBoundImpact.LnWUpperBound
        : null;

  const layerLines = currentScenario.rows.map(
    (row, index) =>
      `${index + 1}. ${row.materialId} - ${row.thicknessMm} mm${row.floorRole ? ` - ${FLOOR_ROLE_LABELS[row.floorRole]}` : ""}`
  );
  const scenarioLines =
    savedScenarios.length > 0
      ? [
          "- Saved scenarios are listed with their evidence class so exact rows, estimates, and bounds are not flattened into one ranking.",
          "",
          ...savedScenarios.flatMap((scenario) =>
            buildScenarioReportLines({
              liveScenario: currentScenario,
              scenario,
              targetLnwDb,
              targetRwDb
            })
          )
        ]
      : ["- No saved scenarios yet."];

  const warningLines =
    currentScenario.warnings.length > 0
      ? currentScenario.warnings.map((warning: string) => `- ${warning}`)
      : ["- No explicit warnings in the live stack."];
  const dnTAkReportLine = getDnTAkReportLine(currentScenario.result);
  const dutchDnTAkComplianceLines = getDutchResidentialDnTAkComplianceReportLines(currentScenario.result);
  const includeDutchImpactReferences =
    Boolean(currentScenario.result) &&
    (studyMode === "floor" || requestedOutputs.some((output) => DUTCH_IMPACT_OUTPUTS.has(output)));
  const dutchImpactReferenceRows = includeDutchImpactReferences
    ? getDutchResidentialImpactReferenceRows(currentScenario.result)
    : [];
  const dutchImpactReferenceLines = includeDutchImpactReferences
    ? getDutchResidentialImpactReferenceReportLines(currentScenario.result)
    : [];
  const hasExactDutchImpactChecks = dutchImpactReferenceRows.some((row) => row.statusLabel !== "Need LnT,A");
  const dutchReferenceSources = Array.from(
    new Map(
      [...DUTCH_DNTAK_REFERENCE_SOURCES, ...DUTCH_IMPACT_REFERENCE_SOURCES].map((source) => [source.url, source])
    ).values()
  );

  const currentResultBlock = currentScenario.result
    ? [
        `- Rw estimate: ${formatMetric(currentScenario.result.metrics.estimatedRwDb)} dB`,
        `- ISO 717 composite: ${currentScenario.result.ratings.iso717.composite}`,
        `- Spectrum adaptation terms: C ${formatSignedMetric(currentScenario.result.metrics.estimatedCDb)} dB, Ctr ${formatSignedMetric(currentScenario.result.metrics.estimatedCtrDb)} dB`,
        `- STC: ${formatMetric(currentScenario.result.metrics.estimatedStc)} dB`,
        ...(dnTAkReportLine ? [dnTAkReportLine] : []),
        ...getFieldAirborneReportLines(currentScenario.result),
        `- Surface mass: ${formatMetric(currentScenario.result.metrics.surfaceMassKgM2)} kg/m²`,
        `- Total thickness: ${formatMetric(currentScenario.result.metrics.totalThicknessMm)} mm`,
        `- Cavity / insulation count: ${currentScenario.result.metrics.airGapCount} / ${currentScenario.result.metrics.insulationCount}`,
        `- Method: ${currentScenario.result.metrics.method}`,
        `- Airborne calculator: ${currentScenario.result.calculatorLabel ?? "Screening Seed"}`,
        `- Curve span: ${currentScenario.result.curve.frequenciesHz[0]}-${currentScenario.result.curve.frequenciesHz.at(-1)} Hz`,
        ...(currentScenario.result.dynamicAirborneTrace
          ? [
              `- Dynamic family: ${currentScenario.result.dynamicAirborneTrace.detectedFamilyLabel}`,
              `- Dynamic confidence: ${Math.round(currentScenario.result.dynamicAirborneTrace.confidenceScore * 100)}% (${currentScenario.result.dynamicAirborneTrace.confidenceClass})`,
              `- Dynamic anchor: ${currentScenario.result.dynamicAirborneTrace.selectedLabel}`,
              `- Dynamic solver spread: ${formatMetric(currentScenario.result.dynamicAirborneTrace.solverSpreadRwDb)} dB`
            ]
          : []),
        ...(currentScenario.result.dynamicImpactTrace
          ? [
              `- Impact lane: ${currentScenario.result.dynamicImpactTrace.selectedLabel}`,
              `- Impact evidence tier: ${currentScenario.result.dynamicImpactTrace.evidenceTierLabel}`,
              `- Impact basis: ${currentScenario.result.dynamicImpactTrace.impactBasisLabel}`,
              ...(currentScenario.result.dynamicImpactTrace.detectedSupportFamilyLabel
                ? [`- Impact support family: ${currentScenario.result.dynamicImpactTrace.detectedSupportFamilyLabel}`]
                : []),
              ...(currentScenario.result.dynamicImpactTrace.systemTypeLabel
                ? [`- Impact system type: ${currentScenario.result.dynamicImpactTrace.systemTypeLabel}`]
                : []),
              `- Impact field continuation: ${currentScenario.result.dynamicImpactTrace.fieldContinuationLabel}`,
              ...(typeof currentScenario.result.dynamicImpactTrace.fitPercent === "number"
                ? [`- Impact fit: ${formatMetric(currentScenario.result.dynamicImpactTrace.fitPercent)}%`]
                : [])
            ]
          : []),
        ...(currentScenario.result.airborneOverlay
          ? [
              `- Airborne context mode: ${currentScenario.result.airborneOverlay.contextMode.replaceAll("_", " ")}`,
              `- Airborne detected family: ${currentScenario.result.airborneOverlay.detectedFamily.replaceAll("_", " ")}`,
              `- Airborne base / final Rw: ${formatMetric(currentScenario.result.airborneOverlay.baseRwDb)} / ${formatMetric(currentScenario.result.airborneOverlay.finalRwDb)} dB`,
              ...(currentScenario.result.airborneOverlay.leakagePenaltyApplied
                ? [`- Airborne leakage penalty: ${formatMetric(currentScenario.result.airborneOverlay.leakagePenaltyDb)} dB`]
                : []),
              ...(currentScenario.result.airborneOverlay.fieldFlankingPenaltyApplied
                ? [`- Airborne field-flanking penalty: ${formatMetric(currentScenario.result.airborneOverlay.fieldFlankingPenaltyDb)} dB`]
                : [])
            ]
          : []),
        ...(currentScenario.result.impact
          ? [
              ...(typeof currentScenario.result.impact.LnTA === "number"
                ? [`- Impact LnT,A: ${formatMetric(currentScenario.result.impact.LnTA)} dB`] 
                : []),
              ...(typeof currentScenario.result.impact.LnW === "number"
                ? [`- Impact Ln,w: ${formatMetric(currentScenario.result.impact.LnW)} dB`]
                : []),
              ...(typeof currentScenario.result.impact.LPrimeNW === "number"
                ? [`- Impact L'n,w: ${formatMetric(currentScenario.result.impact.LPrimeNW)} dB`]
                : []),
              ...(typeof currentScenario.result.impact.LPrimeNTw === "number"
                ? [`- Impact L'nT,w: ${formatMetric(currentScenario.result.impact.LPrimeNTw)} dB`]
                : []),
              ...(typeof currentScenario.result.impact.CI === "number"
                ? [`- Impact CI: ${formatSignedMetric(currentScenario.result.impact.CI)} dB`]
                : []),
              ...(typeof currentScenario.result.impact.CI50_2500 === "number"
                ? [`- Impact CI,50-2500: ${formatSignedMetric(currentScenario.result.impact.CI50_2500)} dB`]
                : []),
              ...(typeof currentScenario.result.impact.LnWPlusCI === "number"
                ? [`- Impact Ln,w+CI: ${formatMetric(currentScenario.result.impact.LnWPlusCI)} dB`]
                : []),
              ...(typeof currentScenario.result.impact.LPrimeNT50 === "number"
                ? [`- Impact L'nT,50: ${formatMetric(currentScenario.result.impact.LPrimeNT50)} dB`]
                : []),
              ...(currentScenario.result.impact.guideEstimateProfile
                ? [
                    "- Impact local-guide profile: tr_simple_method_lnt50_from_lnwci_plus_k_plus_hd",
                    ...(typeof currentScenario.result.impact.guideEstimateKCorrectionDb === "number"
                      ? [
                          `- Impact K correction: ${formatSignedMetric(currentScenario.result.impact.guideEstimateKCorrectionDb)} dB (${currentScenario.result.impact.guideEstimateKSource ?? "manual"})`
                        ]
                      : []),
                    ...(typeof currentScenario.result.impact.guideEstimateHdCorrectionDb === "number"
                      ? [
                          `- Impact Hd correction: ${formatSignedMetric(currentScenario.result.impact.guideEstimateHdCorrectionDb)} dB (${currentScenario.result.impact.guideEstimateHdSource ?? "manual"})`
                        ]
                      : []),
                    ...(typeof currentScenario.result.impact.guideEstimateMassRatio === "number"
                      ? [
                          `- Impact mass ratio: ${formatMetric(currentScenario.result.impact.guideEstimateMassRatio)} (${currentScenario.result.impact.guideEstimateMassRatioBracket ?? "lookup"})`
                        ]
                      : []),
                    ...(typeof currentScenario.result.impact.guideEstimateReceivingRoomVolumeM3 === "number"
                      ? [
                          `- Impact receiving-room volume: ${formatMetric(currentScenario.result.impact.guideEstimateReceivingRoomVolumeM3)} m3 (${currentScenario.result.impact.guideEstimateReceivingRoomVolumeBracket ?? "lookup"})`
                        ]
                      : [])
                  ]
                : []),
              ...(typeof currentScenario.result.impact.DeltaLw === "number"
                ? [`- DeltaLw: ${formatMetric(currentScenario.result.impact.DeltaLw)} dB`]
                : []),
              ...buildImpactMetricBasisLines(currentScenario.result.impact),
              `- Impact confidence: ${currentScenario.result.impact.confidence.level} (${Math.round(currentScenario.result.impact.confidence.score * 100)}%)`,
              `- Impact provenance: ${currentScenario.result.impact.confidence.provenance}`,
              `- Impact basis: ${currentScenario.result.impact.basis}`,
              ...(currentScenario.result.impact.estimateCandidateIds?.length
                ? [
                    currentScenario.result.impact.basis === "predictor_floor_system_low_confidence_estimate"
                      ? `- Impact nearby published row ids: ${currentScenario.result.impact.estimateCandidateIds.join(", ")}`
                      : `- Impact estimate candidate ids: ${currentScenario.result.impact.estimateCandidateIds.join(", ")}`
                  ]
                : []),
              ...(currentScenario.result.impact.basis === "predictor_floor_system_low_confidence_estimate"
                ? [
                    "- Impact nearby-row ranking: elastic-ceiling row first, rigid-ceiling row second, timber-underlay row held as a farther fallback when cavity and board geometry drift."
                  ]
                : []),
              ...(currentScenario.result.impact.bandSet ? [`- Impact band set: ${currentScenario.result.impact.bandSet}`] : []),
              `- Impact trust note: ${currentScenario.result.impact.confidence.summary}`,
              ...(typeof currentScenario.result.impact.predictorResonanceHz === "number"
                ? [`- Resonance check: ${formatMetric(currentScenario.result.impact.predictorResonanceHz)} Hz`]
                : [])
            ]
          : ["- Impact Ln,w / DeltaLw: unavailable for the current stack topology"])
          .concat(
            !currentScenario.result.impact && currentLowerBoundImpact
              ? [
                  ...buildImpactBoundReportLines("Impact", currentLowerBoundImpact),
                  `- Impact bound basis: ${currentLowerBoundImpact.basis}`
                ]
              : []
          )
      ]
    : ["- No valid live result yet. Add at least one valid layer."];

  const targetLines = [
    targetRw !== null
      ? `- Target Rw / STC: ${formatMetric(targetRw)} dB${rwDelta !== null ? ` (${rwDelta >= 0 ? "+" : ""}${formatMetric(rwDelta)} dB versus live stack)` : ""}`
      : "- Target Rw / STC: Unset",
    targetLnw !== null
      ? `- Target Ln,w: ${formatMetric(targetLnw)} dB${lnwDelta !== null ? ` (${lnwDelta >= 0 ? "+" : ""}${formatMetric(lnwDelta)} dB versus ${currentLnw !== null ? "live impact lane" : "bound support"})` : " (no live impact lane for the current stack)"}`
      : "- Target Ln,w: Unset"
  ];
  const requestedOutputCoverageLines = [
    `- Requested family: ${listOutputs(requestedOutputs) || "None selected"}`,
    `- Engine-live now: ${listOutputs(outputSummary.engineLive.map((status) => status.output)) || "None"}`,
    `- Bound-support now: ${listOutputs(outputSummary.engineBound.map((status) => status.output)) || "None"}`,
    `- Guide/manual now: ${listOutputs(outputSummary.guideReady.map((status) => status.output)) || "None"}`,
    `- Unavailable on current path: ${listOutputs(outputSummary.unavailable.map((status) => status.output)) || "None"}`,
    `- Research-only lanes: ${listOutputs(outputSummary.research.map((status) => status.output)) || "None"}`,
    `- Still staged for parity import: ${listOutputs(outputSummary.parityImport.map((status) => status.output)) || "None"}`,
    ...outputSummary.statuses.map(
      (status) => `- ${REQUESTED_OUTPUT_LABELS[status.output]}: ${status.label}. ${status.note}`
    )
  ];
  const consultantDecisionTrailLines = getConsultantDecisionTrailReportLines({
    briefNote,
    guideResult: impactGuide,
    outputs: requestedOutputs,
    result: currentScenario.result,
    warnings: currentScenario.warnings
  });

  return [
    `# ${projectName}`,
    "",
    `- Client / stream: ${clientName}`,
    `- Study mode: ${STUDY_MODE_LABELS[studyMode]}`,
    `- Preset reference: ${activePreset.label}`,
    `- Study context: ${STUDY_CONTEXT_LABELS[studyContext]}`,
    `- Report profile: ${REPORT_PROFILE_LABELS[reportProfile]}`,
    "",
    "## Brief template",
    `- Active pack: ${activeCriteriaPack.label}`,
    `- Audience: ${activeCriteriaPack.audience}`,
    `- Pack note: ${activeCriteriaPack.note}`,
    `- Pack emphasis: ${activeCriteriaPack.emphasis.join(", ")}`,
    `- Pack requested outputs: ${listOutputs(activeCriteriaPack.requestedOutputs) || "None"}`,
    "- Brief templates in DynEcho are internal starting points, not jurisdictional code defaults.",
    "",
    "## Requested outputs",
    ...requestedOutputCoverageLines,
    ...(outputSummary.research.length > 0
      ? [
          "- Research-only outputs are kept visible for briefing and auditability, but DynEcho does not fabricate ASTM or low-frequency ratings before their standards-backed adapters ship."
        ]
      : []),
    "",
    "## Decision trail",
    ...consultantDecisionTrailLines,
    "",
    "## Migration scorecard",
    "- UI / workbench migration: ~95%",
    "- Engine logic migration: ~89%",
    "- Full Acoustic2 parity: ~81%",
    "- These are operator-facing migration estimates, not formal completion guarantees.",
    "",
    "## Validation regime",
    `- Impact posture: ${impactValidationPosture.label}`,
    `- Impact reading: ${impactValidationPosture.detail}`,
    `- Airborne posture: ${airborneValidationPosture.label}`,
    `- Airborne reading: ${airborneValidationPosture.detail}`,
    `- Corpus guardrails: ${IMPACT_VALIDATION_CORPUS_SUMMARY.floorCases} floor-side cases, ${IMPACT_VALIDATION_CORPUS_SUMMARY.fieldCases} field-side cases, ${IMPACT_VALIDATION_CORPUS_SUMMARY.familiesTracked} tracked families, tolerance band ${formatImpactValidationTolerance(IMPACT_VALIDATION_CORPUS_SUMMARY.toleranceBandMaxDb)}.`,
    `- Benchmark ladder: ${IMPACT_VALIDATION_CORPUS_SUMMARY.benchmarkCases} cases across ${IMPACT_VALIDATION_CORPUS_SUMMARY.benchmarkModesTracked} tracked modes.`,
    ...(activeValidationFamily
      ? [
          `- Active family corridor: ${activeValidationFamily.label} | ${formatFloorCoverageLabel(activeValidationFamily.floorCoverage)} | ${formatFieldCoverageLabel(activeValidationFamily.fieldCoverage)} | ${activeValidationFamily.floorCaseCount} floor / ${activeValidationFamily.fieldCaseCount} field cases | tolerance ${formatImpactValidationTolerance(activeValidationFamily.maxToleranceDb)}.`,
          `- Active family benchmark mix: ${formatValidationFamilyBenchmarkMix(activeValidationFamily)} across ${activeValidationFamily.benchmarkCaseCount} benchmark cases.`,
          `- Active family note: ${activeValidationFamily.note}`
        ]
      : ["- Active family corridor: no tracked family is attached to the current live impact lane."]),
    ...(activeValidationMode
      ? [
          `- Active benchmark mode: ${activeValidationMode.label} | ${formatValidationModePostureLabel(activeValidationMode.posture)} | ${activeValidationMode.caseCount} benchmark cases.`,
          `- Active mode note: ${activeValidationMode.note}`
        ]
      : ["- Active benchmark mode: the current live lane does not map directly onto the benchmark ladder."]),
    ...IMPACT_VALIDATION_FAMILY_MATRIX.map(
      (entry: (typeof IMPACT_VALIDATION_FAMILY_MATRIX)[number]) =>
        `- ${entry.label}: ${formatFloorCoverageLabel(entry.floorCoverage)}, ${formatFieldCoverageLabel(entry.fieldCoverage)}, ${entry.floorCaseCount} floor / ${entry.fieldCaseCount} field cases, ${entry.benchmarkCaseCount} benchmark cases, tolerance ${formatImpactValidationTolerance(entry.maxToleranceDb)}, mix ${formatValidationFamilyBenchmarkMix(entry)}. ${entry.note}`
    ),
    ...IMPACT_VALIDATION_MODE_MATRIX.map(
      (entry: (typeof IMPACT_VALIDATION_MODE_MATRIX)[number]) =>
        `- ${entry.label}: ${formatValidationModePostureLabel(entry.posture)}, ${entry.caseCount} benchmark cases. ${entry.note}`
    ),
    "",
    "## Targets",
    ...targetLines,
    ...(dutchDnTAkComplianceLines.length > 0 || dutchImpactReferenceLines.length > 0
      ? [
          ...dutchReferenceSources.map((source) => `- Dutch reference source: ${source.label} | ${source.url}`),
          ...(dutchDnTAkComplianceLines.length > 0
            ? [
                "- Dutch DnT,A,k lines below are compliance-reference checks only; they do not convert brochure thresholds into exact benchmark rows.",
                ...dutchDnTAkComplianceLines
              ]
            : []),
          ...(dutchImpactReferenceLines.length > 0
            ? [
                hasExactDutchImpactChecks
                  ? "- Dutch LnT,A lines below are direct reference checks only on the narrow exact 125..2000 Hz field-octave lane; broader Ln,w / L'n,w / L'nT,w lanes still do not count as Dutch contact-sound compliance verdicts."
                  : "- Dutch LnT,A lines below stay staged until DynEcho exposes NEN 5077 LnT,A directly; current Ln,w / L'n,w / L'nT,w lanes are not treated as Dutch contact-sound compliance verdicts.",
                ...dutchImpactReferenceLines
              ]
            : [])
        ]
      : []),
    "",
    "## Live stack result",
    ...currentResultBlock,
    ...(currentScenario.result?.impactPredictorStatus || currentScenario.result?.impactSupport || currentScenario.result?.floorSystemRatings
      ? [
          "",
          "## Predictor trace",
          ...(currentScenario.result?.impactPredictorStatus
            ? [
                `- Predictor active: ${currentScenario.result.impactPredictorStatus.active ? "yes" : "no"}`,
                `- Predictor input mode: ${currentScenario.result.impactPredictorStatus.inputMode ?? "none"}`,
                `- Ready for planned solver: ${currentScenario.result.impactPredictorStatus.readyForPlannedSolver ? "yes" : "no"}`,
                `- Implemented family estimate: ${currentScenario.result.impactPredictorStatus.implementedFamilyEstimate ? "yes" : "no"}`,
                `- Implemented formula estimate: ${currentScenario.result.impactPredictorStatus.implementedFormulaEstimate ? "yes" : "no"}`,
                `- Implemented low-confidence estimate: ${currentScenario.result.impactPredictorStatus.implementedLowConfidenceEstimate ? "yes" : "no"}`,
                `- Matched floor-system id: ${currentScenario.result.impactPredictorStatus.matchedFloorSystemId ?? "None"}`,
                `- Matched catalog id: ${currentScenario.result.impactPredictorStatus.matchedCatalogCaseId ?? "None"}`,
                `- Future supported target outputs: ${listOutputs(currentScenario.result.impactPredictorStatus.futureSupportedTargetOutputs) || "None"}`,
                ...currentScenario.result.impactPredictorStatus.notes.map((line: string) => `- Predictor note: ${line}`),
                ...currentScenario.result.impactPredictorStatus.warnings.map((line: string) => `- Predictor warning: ${line}`)
              ]
            : []),
          ...(predictorLowerBound
            ? [
                `- Lower-bound basis: ${predictorLowerBound.basis}`,
                ...buildImpactBoundReportLines("", predictorLowerBound),
                `- Lower-bound confidence: ${predictorLowerBound.confidence.level} (${predictorLowerBound.confidence.score.toFixed(2)}) via ${predictorLowerBound.confidence.provenance}`,
                ...predictorLowerBound.notes.map((line: string) => `- Lower-bound note: ${line}`)
              ]
            : []),
          ...(currentScenario.result?.floorSystemRatings
            ? [
                `- Companion Rw: ${formatMetric(currentScenario.result.floorSystemRatings.Rw)} dB`,
                ...(typeof currentScenario.result.floorSystemRatings.RwCtr === "number"
                  ? [`- Companion ${getFloorSystemCompanionLabel(currentScenario.result.floorSystemRatings)}: ${formatMetric(currentScenario.result.floorSystemRatings.RwCtr)} dB`]
                  : []),
                `- Companion basis: ${currentScenario.result.floorSystemRatings.basis}`
              ]
            : []),
          ...(currentScenario.result?.impactSupport
            ? [
                `- Support basis: ${currentScenario.result.impactSupport.basis ?? "N/A"}`,
                ...(currentScenario.result.impactSupport.labOrField
                  ? [`- Support lane context: ${currentScenario.result.impactSupport.labOrField}`]
                  : []),
                ...(currentScenario.result.impactSupport.referenceFloorType
                  ? [`- Support reference floor: ${currentScenario.result.impactSupport.referenceFloorType}`]
                  : []),
                ...(typeof currentScenario.result.impactSupport.primaryCurveUnaffected === "boolean"
                  ? [`- Airborne curve unaffected: ${currentScenario.result.impactSupport.primaryCurveUnaffected ? "yes" : "no"}`]
                  : []),
                ...currentScenario.result.impactSupport.notes.map((line: string) => `- Support note: ${line}`),
                ...currentScenario.result.impactSupport.formulaNotes.map((line: string) => `- Formula note: ${line}`)
              ]
            : [])
        ]
      : []),
    "",
    "## Layer build-up",
    ...layerLines,
    "",
    "## Saved scenarios",
    ...scenarioLines,
    "",
    "## Datasheet quick derive",
    ...(impactReference
      ? [
          `- Input DeltaLw: ${formatMetric(impactReference.DeltaLw ?? Number(impactReferenceDeltaLwDb))} dB`,
          ...(typeof impactReference.LnW === "number"
            ? [`- Derived Ln,w: ${formatMetric(impactReference.LnW)} dB`]
            : ["- Derived Ln,w: unavailable"]),
          ...(typeof impactReference.bareReferenceLnW === "number"
            ? [`- Heavy reference: ${formatMetric(impactReference.bareReferenceLnW)} dB`]
            : ["- Heavy reference: unavailable"]),
          `- Basis: ${impactReference.basis}`
        ]
      : [
          impactReferenceDeltaLwDb.trim()
            ? "- DeltaLw input is present but not valid for reference derivation."
            : "- No datasheet DeltaLw shortcut recorded."
        ]),
    "",
    "## Exact DeltaLw import",
    ...(improvementReferenceImpact
      ? [
          `- Input mode: exact improvement curve`,
          `- DeltaLw: ${formatMetric(improvementReferenceImpact.DeltaLw ?? 0)} dB`,
          ...(typeof improvementReferenceImpact.LnW === "number"
            ? [`- Treated heavy-reference Ln,w: ${formatMetric(improvementReferenceImpact.LnW)} dB`]
            : []),
          ...(typeof improvementReferenceImpact.bareReferenceLnW === "number"
            ? [`- Heavy reference Ln,w: ${formatMetric(improvementReferenceImpact.bareReferenceLnW)} dB`]
            : []),
          `- Basis: ${improvementReferenceImpact.basis}`
        ]
      : [
          impactImprovementBandInput.trim()
            ? "- Improvement curve input is present but did not match the supported heavy-reference grid."
            : "- No exact improvement curve recorded."
        ]),
    "",
    "## Official product lane",
    ...(currentImpactCatalogMatch
      ? [
          `- Matched product row: ${currentImpactCatalogMatch.catalog.label}`,
          `- Match mode: ${currentImpactCatalogMatch.catalog.matchMode}`,
          `- Source: ${currentImpactCatalogMatch.catalog.source}`,
          ...(typeof currentImpactCatalogImpact?.LnW === "number"
            ? [`- Product-lane Ln,w: ${formatMetric(currentImpactCatalogImpact.LnW)} dB`]
            : ["- Product-lane Ln,w: unavailable"]),
          ...(typeof currentImpactCatalogImpact?.DeltaLw === "number"
            ? [`- Product-lane DeltaLw: ${formatMetric(currentImpactCatalogImpact.DeltaLw)} dB`]
            : ["- Product-lane DeltaLw: unavailable"]),
          ...(typeof currentImpactCatalogLowerBound?.LnWUpperBound === "number"
            ? [`- Product-lane Ln,w upper bound: <= ${formatMetric(currentImpactCatalogLowerBound.LnWUpperBound)} dB`]
            : []),
          ...(typeof currentImpactCatalogLowerBound?.LnWPlusCIUpperBound === "number"
            ? [`- Product-lane Ln,w+CI upper bound: <= ${formatMetric(currentImpactCatalogLowerBound.LnWPlusCIUpperBound)} dB`]
            : []),
          ...(typeof currentImpactCatalogLowerBound?.DeltaLwLowerBound === "number"
            ? [`- Product-lane DeltaLw lower bound: >= ${formatMetric(currentImpactCatalogLowerBound.DeltaLwLowerBound)} dB`]
            : []),
          `- Basis: ${currentImpactCatalogImpact?.basis ?? currentImpactCatalogLowerBound?.basis ?? "unavailable"}`
        ]
      : ["- No official product-row match is active for the current stack."]),
    "",
    "## Exact floor-system match",
    ...(currentExactFloorSystem
      ? [
          `- Matched family: ${currentExactFloorSystem.system.label}`,
          `- Source: ${currentExactFloorSystem.system.sourceLabel}`,
          ...(currentExactFloorSystem.system.sourceUrl ? [`- Source URL: ${currentExactFloorSystem.system.sourceUrl}`] : []),
          `- Exact Ln,w: ${formatMetric(currentExactFloorSystem.impact.LnW ?? 0)} dB`,
          `- Exact Rw: ${formatMetric(currentExactFloorSystem.system.airborneRatings.Rw)} dB`,
          ...buildFloorSystemCompanionLines("Exact", currentExactFloorSystem.system.airborneRatings),
          ...(typeof currentExactFloorSystem.impact.CI === "number"
            ? [`- Exact CI: ${formatSignedMetric(currentExactFloorSystem.impact.CI)} dB`]
            : []),
          ...(typeof currentExactFloorSystem.impact.CI50_2500 === "number"
            ? [`- Exact CI,50-2500: ${formatSignedMetric(currentExactFloorSystem.impact.CI50_2500)} dB`]
            : []),
          ...(typeof currentExactFloorSystem.impact.LnWPlusCI === "number"
            ? [`- Exact Ln,w+CI: ${formatMetric(currentExactFloorSystem.impact.LnWPlusCI)} dB`]
            : []),
          `- Basis: ${currentExactFloorSystem.impact.basis}`
          ]
      : currentBoundFloorSystem
        ? [
            `- Bound family: ${currentBoundFloorSystem.system.label}`,
            `- Source: ${currentBoundFloorSystem.system.sourceLabel}`,
            ...(currentBoundFloorSystem.system.sourceUrl ? [`- Source URL: ${currentBoundFloorSystem.system.sourceUrl}`] : []),
            ...(typeof currentBoundFloorSystem.lowerBoundImpact.LnWUpperBound === "number"
              ? [`- Exact Ln,w upper bound: <= ${formatMetric(currentBoundFloorSystem.lowerBoundImpact.LnWUpperBound)} dB`]
              : []),
            ...(typeof currentBoundFloorSystem.lowerBoundImpact.LnWPlusCIUpperBound === "number"
              ? [`- Exact Ln,w+CI upper bound: <= ${formatMetric(currentBoundFloorSystem.lowerBoundImpact.LnWPlusCIUpperBound)} dB`]
              : []),
            `- Exact Rw: ${formatMetric(currentBoundFloorSystem.system.airborneRatings.Rw)} dB`,
            ...buildFloorSystemCompanionLines("Exact", currentBoundFloorSystem.system.airborneRatings),
            `- Basis: ${currentBoundFloorSystem.lowerBoundImpact.basis}`
          ]
      : currentEstimatedFloorSystem
        ? [
            `${
              currentEstimatedFloorSystem.kind === "low_confidence"
                ? "- Low-confidence fallback family"
                : "- Estimated family"
            }: ${currentEstimatedFloorSystem.structuralFamily}`,
            `- Estimate kind: ${currentEstimatedFloorSystem.kind}`,
            `- Estimated Ln,w: ${formatMetric(currentEstimatedFloorSystem.impact.LnW ?? 0)} dB`,
            `- Estimated Rw: ${formatMetric(currentEstimatedFloorSystem.airborneRatings.Rw)} dB`,
            ...buildFloorSystemCompanionLines("Estimated", currentEstimatedFloorSystem.airborneRatings),
            ...(typeof currentEstimatedFloorSystem.impact.CI === "number"
              ? [`- Estimated CI: ${formatSignedMetric(currentEstimatedFloorSystem.impact.CI)} dB`]
              : []),
            ...(typeof currentEstimatedFloorSystem.impact.CI50_2500 === "number"
              ? [`- Estimated CI,50-2500: ${formatSignedMetric(currentEstimatedFloorSystem.impact.CI50_2500)} dB`]
              : []),
            ...(typeof currentEstimatedFloorSystem.impact.LnWPlusCI === "number"
              ? [`- Estimated Ln,w+CI: ${formatMetric(currentEstimatedFloorSystem.impact.LnWPlusCI)} dB`]
              : []),
            `${
              currentEstimatedFloorSystem.kind === "low_confidence" ? "- Nearby published rows" : "- Source rows"
            }: ${
              currentEstimatedFloorSystem.kind === "low_confidence"
                ? currentEstimatedFloorSystem.sourceSystems
                    .map((entry: { label: string }, index: number) =>
                      formatReinforcedConcreteLowConfidenceRankedRowText(index, entry.label)
                    )
                    .join("; ")
                : currentEstimatedFloorSystem.sourceSystems.map((entry: { label: string }) => entry.label).join("; ")
            }`,
            `- Basis: ${currentEstimatedFloorSystem.impact.basis}`
          ]
        : currentBoundFloorEstimate
          ? [
              `- Bound family estimate: ${currentBoundFloorEstimate.structuralFamily}`,
              `- Estimate kind: ${currentBoundFloorEstimate.kind}`,
              ...(typeof currentBoundFloorEstimate.lowerBoundImpact.LnWUpperBound === "number"
                ? [`- Estimated Ln,w upper bound: <= ${formatMetric(currentBoundFloorEstimate.lowerBoundImpact.LnWUpperBound)} dB`]
                : []),
              ...(typeof currentBoundFloorEstimate.lowerBoundImpact.LnWPlusCIUpperBound === "number"
                ? [`- Estimated Ln,w+CI upper bound: <= ${formatMetric(currentBoundFloorEstimate.lowerBoundImpact.LnWPlusCIUpperBound)} dB`]
                : []),
              `- Estimated Rw: ${formatMetric(currentBoundFloorEstimate.airborneRatings.Rw)} dB`,
              ...buildFloorSystemCompanionLines("Estimated", currentBoundFloorEstimate.airborneRatings),
              `- Source rows: ${currentBoundFloorEstimate.sourceSystems.map((entry: { label: string }) => entry.label).join("; ")}`,
              `- Basis: ${currentBoundFloorEstimate.lowerBoundImpact.basis}`
            ]
      : currentFloorSystemRecommendations.length > 0
        ? [
            "- No curated exact floor-system family matched the current role-tagged stack.",
            `- Closest family: ${currentFloorSystemRecommendations[0]?.system.label}`,
            `- Closest fit: ${currentFloorSystemRecommendations[0]?.fitPercent}%`,
            ...currentFloorSystemRecommendations
              .slice(0, 2)
              .map(
                (recommendation: { fitPercent: number; missingSignals: string[]; system: { label: string } }) =>
                  `- Recommendation: ${recommendation.system.label} (${recommendation.fitPercent}% fit, missing ${recommendation.missingSignals.join("; ")})`
              )
          ]
        : ["- No curated exact floor-system family matched the current role-tagged stack."]),
    "",
    "## Guide supplement",
    ...(impactGuide
      ? [
          `- Source: ${impactGuide.source === "live_stack" ? "Live stack Ln,w" : "Heavy-reference Ln,w"}`,
          impactGuide.baseKind === "upper_bound"
            ? `- Base Ln,w upper bound: <= ${formatMetric(impactGuide.baseLnWUpperBound ?? 0)} dB`
            : `- Base Ln,w: ${formatMetric(impactGuide.baseLnW ?? 0)} dB`,
          ...(typeof impactGuide.CI === "number"
            ? [`- CI: ${formatSignedMetric(impactGuide.CI)} dB`]
            : ["- CI: unavailable until an explicit CI input is provided"]),
          ...(typeof impactGuide.CI50_2500 === "number"
            ? [`- CI,50-2500: ${formatSignedMetric(impactGuide.CI50_2500)} dB`]
            : ["- CI,50-2500: unavailable until an explicit field-side companion input is provided"]),
          ...(typeof impactGuide.LnWPlusCI === "number"
            ? [`- Ln,w+CI: ${formatMetric(impactGuide.LnWPlusCI)} dB`]
            : ["- Ln,w+CI: unavailable until an explicit CI input is provided"]),
          ...(typeof impactGuide.LPrimeNW === "number"
            ? [`- L'n,w: ${formatMetric(impactGuide.LPrimeNW)} dB`]
            : typeof impactGuide.LPrimeNWUpperBound === "number"
              ? [`- L'n,w upper bound: <= ${formatMetric(impactGuide.LPrimeNWUpperBound)} dB`]
              : ["- L'n,w: unavailable until an explicit K correction is provided"]),
          ...(typeof impactGuide.LPrimeNTw === "number"
            ? [`- L'nT,w: ${formatMetric(impactGuide.LPrimeNTw)} dB`]
            : typeof impactGuide.LPrimeNTwUpperBound === "number"
              ? [`- L'nT,w upper bound: <= ${formatMetric(impactGuide.LPrimeNTwUpperBound)} dB`]
              : ["- L'nT,w: unavailable until either the small-room guide is enabled or V and K are provided"]),
          `- Confidence: ${impactGuide.confidence.level} (${Math.round(impactGuide.confidence.score * 100)}%)`,
          `- Trust note: ${impactGuide.confidence.summary}`,
          ...(typeof impactGuide.LPrimeNT50 === "number"
            ? [`- L'nT,50: ${formatMetric(impactGuide.LPrimeNT50)} dB`]
            : ["- L'nT,50: unavailable until either V and CI,50-2500 are provided or K and Hd are provided"])
        ]
      : ["- No guide/manual supplement recorded."]),
    "",
    "## Warnings and notes",
    ...warningLines,
    `- Assumption log: ${briefNote.trim() || "No additional note recorded."}`,
    "",
    "## Field risk board",
    `- Risk level: ${fieldRiskSummary.level}`,
    `- Risk score: ${fieldRiskSummary.score}`,
    ...(
      fieldRiskIds.length > 0
        ? fieldRiskIds.map((fieldRiskId) => `- Active flag: ${FIELD_RISK_BY_ID[fieldRiskId].label}`)
        : ["- No explicit field-risk flags are active."]
    ),
    ...fieldRiskSummary.actions.map((action) => `- Action: ${action}`),
    "",
    "## Delivery boundary",
    "- DynEcho is currently a web-first operator desk with a portable engine boundary.",
    "- Acoustic2 remains read-only and is not modified by this workspace.",
    "- Impact support in DynEcho now includes exact lab/field band import, exact heavy-reference DeltaLw import, official product catalog rows, curated exact timber, concrete, CLT, open-box timber, open-web steel, FL-28 steel interpolation, dry-floor measured families, bound-only steel support, and the scoped heavy-concrete formulas, while broad family coverage and deeper predictor chains remain staged for parity import."
  ].join("\n");
}
