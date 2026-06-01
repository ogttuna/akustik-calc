import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_LANDED_GATE,
  POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTION_STATUS,
  summarizePostV1FloorRawBareAirborneBuildingPredictionGateBQ
} from "./post-v1-floor-raw-bare-airborne-building-prediction-gate-bq";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_br_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_br_landed_no_runtime_selected_floor_open_box_eps_screed_field_companion_gate_bs" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTED_NEXT_ACTION =
  "post_v1_floor_open_box_eps_screed_field_companion_gate_bs_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-open-box-eps-screed-field-companion-gate-bs-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTED_NEXT_LABEL =
  "post-V1 floor open-box EPS/screed field companion Gate BS" as const;

export type PostV1GateBRCandidateId =
  | "broad_source_row_crawl"
  | "confidence_wording_or_low_confidence_surface"
  | "finite_scenario_pack"
  | "floor.open_box_timber_finished_package.airborne_building_companion_gap"
  | "floor.open_box_timber_eps_screed_hybrid.field_companion_runtime_gap"
  | "floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap"
  | "floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap"
  | "generic_ui_or_report_storage_work";

export type PostV1GateBRSliceKind =
  | "accuracy_tightening"
  | "blocked_non_goal"
  | "metric_basis_boundary"
  | "runtime_coverage";

export type PostV1GateBRCandidate = {
  readonly accuracyImpact: number;
  readonly coverageImpact: number;
  readonly evidencePaths: readonly string[];
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateBRCandidateId;
  readonly implementationReadiness: number;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateBRSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly wrongNumberRisk: number;
};

export type PostV1GateBRSummary = {
  readonly blockedNonGoalIds: readonly PostV1GateBRCandidateId[];
  readonly candidateCount: number;
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousGateBQ: {
    readonly landedGate: typeof POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTION_STATUS;
  };
  readonly selectedCandidateId: PostV1GateBRCandidateId;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTED_NEXT_LABEL;
  readonly selectionCandidates: readonly PostV1GateBRCandidate[];
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTION_STATUS;
};

const FIELD_IMPACT_TARGETS = ["L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];
const BUILDING_AIRBORNE_TARGETS = ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const ASTM_TARGETS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const PACKAGE_LAB_TARGETS = [
  "Rw",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI"
] as const satisfies readonly RequestedOutputId[];

export function rankPostV1GateBRNumericCoverageCandidates(): readonly PostV1GateBRCandidate[] {
  return [
    {
      accuracyImpact: 0.82,
      coverageImpact: 0.9,
      evidencePaths: [
        "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-runtime-corridor-contract.test.ts",
        "packages/engine/src/broad-accuracy-open-box-timber-post-eps-screed-hybrid-matrix-refresh-contract.test.ts",
        "packages/engine/src/impact-field-context.ts",
        "packages/engine/src/calculate-assembly.ts"
      ],
      expectedBeforeAfter: [
        "complete open-box package-transfer and EPS/screed hybrid stacks already calculate owned lab Ln,w / CI / CI,50-2500 anchors",
        "dry package-transfer mixed requests calculate field companions from the correct package anchor, but field-only requests currently publish a mismatched field tuple from a different anchor path",
        "EPS/screed hybrid package requests still leave L'n,w / L'nT,w / L'nT,50 unsupported even when the lab anchor is requested",
        "Gate BS must make dry package-transfer field-only outputs match the mixed-request anchor path and apply the same adapter to the owned EPS/screed lab anchor",
        "lab Ln,w, airborne R'w / DnT,w, ASTM IIC / AIIC, and exact rows must remain separate owners"
      ],
      id: "floor.open_box_timber_eps_screed_hybrid.field_companion_runtime_gap",
      implementationReadiness: 0.84,
      reason:
        "This is the highest-ROI next calculator step because it fixes a wrong field-only package-transfer tuple and opens the same owned field-impact formula path for the EPS/screed open-box package.",
      score: 2.35,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTED_NEXT_FILE,
      sliceKind: "runtime_coverage",
      sourceRowsRequiredForSelection: false,
      targetMetrics: FIELD_IMPACT_TARGETS,
      wrongNumberRisk: 0.52
    },
    {
      accuracyImpact: 0.76,
      coverageImpact: 0.72,
      evidencePaths: [
        "packages/engine/src/open-box-timber-similarity-estimate.ts",
        "packages/engine/src/open-box-timber-eps-screed-hybrid-package-estimate.ts",
        "packages/engine/src/apply-airborne-context.ts"
      ],
      expectedBeforeAfter: [
        "finished open-box packages own lab Rw or Rw+C companions",
        "building airborne R'w / Dn / DnT needs a separate room/flanking owner and Rw+C semantic guard"
      ],
      id: "floor.open_box_timber_finished_package.airborne_building_companion_gap",
      implementationReadiness: 0.62,
      reason:
        "Useful follow-up, but it has more semantic risk around Rw versus Rw+C and should follow the lower-risk field-impact companion.",
      score: 1.62,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "runtime_coverage",
      sourceRowsRequiredForSelection: false,
      targetMetrics: BUILDING_AIRBORNE_TARGETS,
      wrongNumberRisk: 0.72
    },
    {
      accuracyImpact: 0.78,
      coverageImpact: 0.55,
      evidencePaths: [
        "packages/engine/src/broad-accuracy-floor-open-box-timber-package-transfer-residual-expansion-contract.test.ts",
        "packages/engine/src/broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy.ts"
      ],
      expectedBeforeAfter: [
        "package-transfer residual work can tighten finished open-box package budgets",
        "current residual policy still keeps partial and mixed staged rows outside runtime"
      ],
      id: "floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap",
      implementationReadiness: 0.58,
      reason:
        "Accuracy work remains valuable, but it is lower immediate ROI than opening stopped field outputs from already-owned anchors.",
      score: 1.38,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_tightening",
      sourceRowsRequiredForSelection: false,
      targetMetrics: PACKAGE_LAB_TARGETS,
      wrongNumberRisk: 0.58
    },
    {
      accuracyImpact: 0.84,
      coverageImpact: 0.58,
      evidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-floor-astm-iic-aiic-contour-rating-gate-f-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "ASTM IIC / AIIC support exists for complete ASTM E492 / E1007 band curves",
        "source-absent ISO Ln,w and CI single numbers still cannot become ASTM ratings without band-curve ownership"
      ],
      id: "floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap",
      implementationReadiness: 0.48,
      reason:
        "Important metric boundary work, but it needs ASTM band/contour ownership and must not alias the ISO single-number routes.",
      score: 1.34,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "metric_basis_boundary",
      sourceRowsRequiredForSelection: true,
      targetMetrics: ASTM_TARGETS,
      wrongNumberRisk: 0.96
    },
    {
      accuracyImpact: 0.2,
      coverageImpact: 0.16,
      evidencePaths: [],
      expectedBeforeAfter: ["may support future exact rows but does not itself calculate source-absent layer combinations"],
      id: "broad_source_row_crawl",
      implementationReadiness: 0.3,
      reason: "Source crawling is evidence support, not the active calculator-capacity slice.",
      score: 0.12,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: true,
      targetMetrics: [],
      wrongNumberRisk: 0.18
    },
    {
      accuracyImpact: 0.12,
      coverageImpact: 0.08,
      evidencePaths: [],
      expectedBeforeAfter: ["adds examples without increasing formula coverage or numeric correctness"],
      id: "finite_scenario_pack",
      implementationReadiness: 0.4,
      reason: "Finite examples are not a substitute for formula/runtime coverage.",
      score: 0.06,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: false,
      targetMetrics: [],
      wrongNumberRisk: 0.2
    },
    {
      accuracyImpact: 0.04,
      coverageImpact: 0.02,
      evidencePaths: [],
      expectedBeforeAfter: ["does not calculate more acoustic outputs or correct formulas"],
      id: "confidence_wording_or_low_confidence_surface",
      implementationReadiness: 0.9,
      reason: "Confidence wording is explicitly not the selected product goal.",
      score: 0.02,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: false,
      targetMetrics: [],
      wrongNumberRisk: 0.1
    },
    {
      accuracyImpact: 0.04,
      coverageImpact: 0.02,
      evidencePaths: [],
      expectedBeforeAfter: ["does not change calculator scope or correctness"],
      id: "generic_ui_or_report_storage_work",
      implementationReadiness: 0.86,
      reason: "Generic surface/storage work is out of scope unless a numeric gate requires it.",
      score: 0.02,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: false,
      targetMetrics: [],
      wrongNumberRisk: 0.08
    }
  ];
}

export function summarizePostV1GateBRNumericCoverageGap(): PostV1GateBRSummary {
  const gateBQ = summarizePostV1FloorRawBareAirborneBuildingPredictionGateBQ();
  if (gateBQ.selectedNextAction !== POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_LANDED_GATE) {
    throw new Error("Gate BR can only land after Gate BQ selects the next numeric coverage gap.");
  }

  const selectionCandidates = rankPostV1GateBRNumericCoverageCandidates();
  const selected = selectionCandidates.find((candidate) => candidate.selected);
  if (!selected) {
    throw new Error("Gate BR requires exactly one selected calculator coverage candidate.");
  }

  return {
    blockedNonGoalIds: selectionCandidates
      .filter((candidate) => candidate.sliceKind === "blocked_non_goal")
      .map((candidate) => candidate.id),
    candidateCount: selectionCandidates.length,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousGateBQ: {
      landedGate: POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_GATE_BQ_SELECTION_STATUS
    },
    selectedCandidateId: selected.id,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTED_NEXT_LABEL,
    selectionCandidates,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BR_SELECTION_STATUS
  };
}
