import type { RequestedOutputId } from "@dynecho/shared";

import { buildBroadAccuracyFloorSystemSimilarityAnchorContract } from "./broad-accuracy-floor-system-similarity-anchor";
import { buildBroadAccuracyReferenceBenchmarkExpansionContract } from "./broad-accuracy-reference-benchmark-expansion";
import {
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_LANDED_GATE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTION_STATUS,
  summarizePostV1FloorSuspendedCeilingLowerTreatmentFieldCompanionGateBF
} from "./post-v1-floor-suspended-ceiling-lower-treatment-field-companion-gate-bf";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_bg_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_bg_landed_no_runtime_selected_floor_mixed_support_family_owner_boundary_gate_bh" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_ACTION =
  "post_v1_floor_mixed_support_family_owner_boundary_gate_bh_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-mixed-support-family-owner-boundary-gate-bh-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_LABEL =
  "post-V1 floor mixed-support family owner boundary Gate BH" as const;

export type PostV1GateBGCandidateId =
  | "broad_source_row_crawl"
  | "confidence_wording_or_low_confidence_surface"
  | "finite_scenario_pack"
  | "floor.mixed_support_family.multi_family_solver_gap"
  | "generic_ui_or_report_storage_work"
  | "metric_basis_adapter_boundary_gap"
  | "post_v1_current_accuracy_residual_and_holdout_gap"
  | "source_absent_formula_family_runtime_gap";

export type PostV1GateBGSliceKind =
  | "accuracy_tightening"
  | "blocked_non_goal"
  | "metric_basis_boundary"
  | "owner_boundary"
  | "runtime_coverage";

export type PostV1GateBGCandidate = {
  readonly accuracyImpact: number;
  readonly coverageImpact: number;
  readonly evidencePaths: readonly string[];
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateBGCandidateId;
  readonly implementationReadiness: number;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateBGSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly wrongNumberRisk: number;
};

export type PostV1GateBGEvidenceSnapshot = {
  readonly broadAccuracy: {
    readonly canClaimBroadAccuracyReady: false;
    readonly holdoutResidualRows: number;
    readonly selectedSimilarityCandidateId: string;
    readonly weakLaneDebtRows: number;
  };
  readonly carriedMixedSupportEvidence: {
    readonly currentStop: "fail_closed_mixed_family";
    readonly missingOwnerField: "duplicateOwnershipGuard";
    readonly sourcePath: "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bb.ts";
  };
  readonly gateBfPinsPreserved: readonly {
    readonly id: string;
    readonly lPrimeNT50Db: number;
    readonly lPrimeNTwDb: number;
    readonly lPrimeNWDb: number;
  }[];
};

export type PostV1GateBGSummary = {
  readonly blockedNonGoalIds: readonly PostV1GateBGCandidateId[];
  readonly candidateCount: number;
  readonly evidence: PostV1GateBGEvidenceSnapshot;
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousGateBF: {
    readonly landedGate: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTION_STATUS;
  };
  readonly selectedCandidateId: PostV1GateBGCandidateId;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_LABEL;
  readonly selectionCandidates: readonly PostV1GateBGCandidate[];
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTION_STATUS;
  readonly targetMetricsForSelectedSlice: readonly RequestedOutputId[];
};

const MIXED_SUPPORT_TARGET_METRICS = [
  "Rw",
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w"
] as const satisfies readonly RequestedOutputId[];

const ACCURACY_TARGET_METRICS = [
  "Rw",
  "Ln,w",
  "DeltaLw",
  "L'nT,w"
] as const satisfies readonly RequestedOutputId[];

const METRIC_BASIS_TARGET_METRICS = [
  "IIC",
  "AIIC",
  "Dn,A",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

const SOURCE_ABSENT_RUNTIME_TARGET_METRICS = [
  "Rw",
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export function rankPostV1GateBGNumericCoverageCandidates(): readonly PostV1GateBGCandidate[] {
  const broadAccuracy = buildBroadAccuracyReferenceBenchmarkExpansionContract();
  const floorSimilarity = buildBroadAccuracyFloorSystemSimilarityAnchorContract();

  return [
    {
      accuracyImpact: 0.96,
      coverageImpact: 0.82,
      evidencePaths: [
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bb.ts",
        "packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-coverage-refresh-gate-bd-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-be.ts"
      ],
      expectedBeforeAfter: [
        "current mixed carrier/support stacks fail closed behind duplicateOwnershipGuard",
        "Gate BH must define explicit carrier/support ownership before any formula can run",
        "future Gate BI may open a safe mixed-support subset with numeric pins while unsafe duplicates stay needs_input"
      ],
      id: "floor.mixed_support_family.multi_family_solver_gap",
      implementationReadiness: 0.78,
      reason:
        "After Gate BF, the carried mixed-support gap is the clearest current wrong-number risk: it can otherwise choose or double-count the wrong floor family solver.",
      score: 1.96,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_FILE,
      sliceKind: "owner_boundary",
      sourceRowsRequiredForSelection: false,
      targetMetrics: MIXED_SUPPORT_TARGET_METRICS,
      wrongNumberRisk: 0.98
    },
    {
      accuracyImpact: 0.9,
      coverageImpact: 0.58,
      evidencePaths: [
        "packages/engine/src/broad-accuracy-reference-benchmark-expansion.ts",
        "packages/engine/src/broad-accuracy-floor-system-similarity-anchor.ts"
      ],
      expectedBeforeAfter: [
        `existing broad ledger has ${String(broadAccuracy.ledgerSummary.holdoutResidualRows)} holdout residual rows and ${String(broadAccuracy.ledgerSummary.weakLaneDebtRows)} weak-lane debt rows`,
        `existing floor similarity evidence has selected ${floorSimilarity.selectedCandidate.candidateId}`,
        "next accuracy work should reuse these artifacts instead of restarting source crawling"
      ],
      id: "post_v1_current_accuracy_residual_and_holdout_gap",
      implementationReadiness: 0.72,
      reason:
        "Accuracy residuals and similarity anchors are important, but current artifacts already provide a separate evidence base; the post-V1 handoff first needs to close the carried mixed-support owner risk.",
      score: 1.68,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_tightening",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ACCURACY_TARGET_METRICS,
      wrongNumberRisk: 0.84
    },
    {
      accuracyImpact: 0.84,
      coverageImpact: 0.42,
      evidencePaths: [
        "packages/engine/src/company-internal-calculation-grade-mainline-matrix.ts",
        "packages/engine/src/company-internal-final-internal-use-rehearsal-contract.test.ts",
        "packages/engine/src/impact-astm-e989.ts"
      ],
      expectedBeforeAfter: [
        "unsupported metric and basis rows stay visible until the standard owner exists",
        "ISO Ln,w must not be aliased to ASTM IIC or AIIC",
        "select only after a concrete standard/band-input owner is present"
      ],
      id: "metric_basis_adapter_boundary_gap",
      implementationReadiness: 0.58,
      reason:
        "Metric/basis safety is important, but current evidence does not show a complete adapter owner that outranks the mixed-support family boundary.",
      score: 1.34,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "metric_basis_boundary",
      sourceRowsRequiredForSelection: true,
      targetMetrics: METRIC_BASIS_TARGET_METRICS,
      wrongNumberRisk: 0.92
    },
    {
      accuracyImpact: 0.72,
      coverageImpact: 0.7,
      evidencePaths: [
        "packages/engine/src/company-internal-calculation-grade-mainline-matrix.ts",
        "packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts"
      ],
      expectedBeforeAfter: [
        "current matrices should be searched for source-absent rows that can move from needs_input or unsupported to owned values",
        "runtime selection requires named output pins before any value movement",
        "no generic formula widening before a family owner and error budget exist"
      ],
      id: "source_absent_formula_family_runtime_gap",
      implementationReadiness: 0.55,
      reason:
        "A direct runtime lane can increase scope, but Gate BG must not select an unnamed formula gap over the already-carried mixed-support owner boundary.",
      score: 1.28,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "runtime_coverage",
      sourceRowsRequiredForSelection: false,
      targetMetrics: SOURCE_ABSENT_RUNTIME_TARGET_METRICS,
      wrongNumberRisk: 0.76
    },
    {
      accuracyImpact: 0.22,
      coverageImpact: 0.18,
      evidencePaths: [],
      expectedBeforeAfter: [
        "may add finite exact rows later",
        "does not improve arbitrary source-absent layer-combination calculation by itself"
      ],
      id: "broad_source_row_crawl",
      implementationReadiness: 0.3,
      reason: "Source inventory is evidence, not the product goal and not the next calculator-capacity move.",
      score: 0.12,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: true,
      targetMetrics: [],
      wrongNumberRisk: 0.2
    },
    {
      accuracyImpact: 0.06,
      coverageImpact: 0.04,
      evidencePaths: [],
      expectedBeforeAfter: [
        "does not add a formula owner",
        "does not add or correct a supported acoustic output"
      ],
      id: "confidence_wording_or_low_confidence_surface",
      implementationReadiness: 0.9,
      reason: "Confidence wording cannot be selected while formula/owner gaps remain.",
      score: 0.08,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: false,
      targetMetrics: [],
      wrongNumberRisk: 0.04
    },
    {
      accuracyImpact: 0.1,
      coverageImpact: 0.1,
      evidencePaths: [],
      expectedBeforeAfter: [
        "adds finite examples",
        "does not widen the solver route for arbitrary user layer stacks"
      ],
      id: "finite_scenario_pack",
      implementationReadiness: 0.8,
      reason: "Scenario packs are regression evidence after runtime movement, not the next capability slice.",
      score: 0.07,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: false,
      targetMetrics: [],
      wrongNumberRisk: 0.06
    },
    {
      accuracyImpact: 0.02,
      coverageImpact: 0.02,
      evidencePaths: [],
      expectedBeforeAfter: [
        "does not move calculator behavior",
        "does not change formula selection or metric ownership"
      ],
      id: "generic_ui_or_report_storage_work",
      implementationReadiness: 0.86,
      reason: "UI/report/storage/auth work is outside the active calculator scope unless explicitly selected by a numeric gate.",
      score: 0.04,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: false,
      targetMetrics: [],
      wrongNumberRisk: 0.02
    }
  ];
}

export function summarizePostV1GateBGNumericCoverageGap(): PostV1GateBGSummary {
  const gateBF = summarizePostV1FloorSuspendedCeilingLowerTreatmentFieldCompanionGateBF();
  if (
    gateBF.selectedNextAction !== POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_LANDED_GATE ||
    gateBF.selectedNextFile !== "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bg-contract.test.ts"
  ) {
    throw new Error("Gate BG can only land after Gate BF selects the Gate BG numeric coverage rerank.");
  }

  const selectionCandidates = rankPostV1GateBGNumericCoverageCandidates();
  const selectedCandidates = selectionCandidates.filter((candidate) => candidate.selected);
  if (selectedCandidates.length !== 1) {
    throw new Error("Gate BG must select exactly one next calculator-capacity slice.");
  }
  const selected = selectedCandidates[0];
  const broadAccuracy = buildBroadAccuracyReferenceBenchmarkExpansionContract();
  const floorSimilarity = buildBroadAccuracyFloorSystemSimilarityAnchorContract();

  return {
    blockedNonGoalIds: selectionCandidates
      .filter((candidate) => candidate.sliceKind === "blocked_non_goal")
      .map((candidate) => candidate.id),
    candidateCount: selectionCandidates.length,
    evidence: {
      broadAccuracy: {
        canClaimBroadAccuracyReady: broadAccuracy.canClaimBroadAccuracyReady,
        holdoutResidualRows: broadAccuracy.ledgerSummary.holdoutResidualRows,
        selectedSimilarityCandidateId: floorSimilarity.selectedCandidate.candidateId,
        weakLaneDebtRows: broadAccuracy.ledgerSummary.weakLaneDebtRows
      },
      carriedMixedSupportEvidence: {
        currentStop: "fail_closed_mixed_family",
        missingOwnerField: "duplicateOwnershipGuard",
        sourcePath: "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bb.ts"
      },
      gateBfPinsPreserved: gateBF.valuePins.map((pin) => ({
        id: pin.id,
        lPrimeNT50Db: pin.lPrimeNT50Db,
        lPrimeNTwDb: pin.lPrimeNTwDb,
        lPrimeNWDb: pin.lPrimeNWDb
      }))
    },
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousGateBF: {
      landedGate: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_LANDED_GATE,
      selectedNextAction:
        POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_ACTION,
      selectedNextFile:
        POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTION_STATUS
    },
    selectedCandidateId: selected.id,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_LABEL,
    selectionCandidates,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTION_STATUS,
    targetMetricsForSelectedSlice: selected.targetMetrics
  };
}
