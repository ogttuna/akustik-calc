import type { RequestedOutputId } from "@dynecho/shared";

import {
  FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_OUTPUTS
} from "./floor-raw-bare-airborne-building-prediction-runtime";
import {
  POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_LANDED_GATE,
  POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTION_STATUS,
  summarizePostV1FloorOpenBoxRawBareBuildingPredictionOwnerGateBO
} from "./post-v1-floor-open-box-raw-bare-building-prediction-owner-gate-bo";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_bp_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_bp_landed_no_runtime_selected_floor_raw_bare_airborne_building_prediction_gate_bq" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_ACTION =
  "post_v1_floor_raw_bare_airborne_building_prediction_gate_bq_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-raw-bare-airborne-building-prediction-gate-bq-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_LABEL =
  "post-V1 floor raw-bare airborne building prediction Gate BQ" as const;

export type PostV1GateBPCandidateId =
  | "broad_source_row_crawl"
  | "confidence_wording_or_low_confidence_surface"
  | "finite_scenario_pack"
  | "floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap"
  | "floor.raw_bare_floor_airborne_building_prediction_owner_gap"
  | "floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap"
  | "generic_ui_or_report_storage_work";

export type PostV1GateBPSliceKind =
  | "accuracy_tightening"
  | "blocked_non_goal"
  | "metric_basis_boundary"
  | "runtime_coverage";

export type PostV1GateBPCandidate = {
  readonly accuracyImpact: number;
  readonly coverageImpact: number;
  readonly evidencePaths: readonly string[];
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateBPCandidateId;
  readonly implementationReadiness: number;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateBPSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly wrongNumberRisk: number;
};

export type PostV1GateBPSummary = {
  readonly blockedNonGoalIds: readonly PostV1GateBPCandidateId[];
  readonly candidateCount: number;
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousGateBO: {
    readonly landedGate: typeof POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTION_STATUS;
  };
  readonly selectedCandidateId: PostV1GateBPCandidateId;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_LABEL;
  readonly selectionCandidates: readonly PostV1GateBPCandidate[];
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTION_STATUS;
};

const ASTM_TARGETS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const RAW_BARE_LAB_TARGETS = [
  "Rw",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI"
] as const satisfies readonly RequestedOutputId[];

export function rankPostV1GateBPNumericCoverageCandidates(): readonly PostV1GateBPCandidate[] {
  return [
    {
      accuracyImpact: 0.9,
      coverageImpact: 0.86,
      evidencePaths: [
        "packages/engine/src/calculate-assembly.ts",
        "packages/engine/src/apply-airborne-context.ts",
        "packages/engine/src/open-box-timber-raw-bare-estimate.ts",
        "packages/engine/src/open-web-raw-bare-estimate.ts",
        "packages/engine/src/post-v1-floor-open-box-raw-bare-building-prediction-owner-gate-bo-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "after Gate BO, raw-bare building_prediction can calculate impact L'n,w / L'nT,w / L'nT,50 but still leaves airborne R'w / Dn / DnT blocked",
        "the current generic airborne overlay can over-read raw-bare floors because it is seeded from screening Rw instead of the raw-bare floor direct Rw",
        "Gate BQ must bind building airborne outputs to the owned raw-bare floor direct Rw before applying flanking and room normalization",
        "lab Rw/STC/C/Ctr, lab Ln,w, and ASTM IIC/AIIC must remain separate owners"
      ],
      id: "floor.raw_bare_floor_airborne_building_prediction_owner_gap",
      implementationReadiness: 0.8,
      reason:
        "This is the highest-ROI next calculator step because it opens core building airborne outputs and also prevents a wrong high R'w/DnT result from the generic screening curve.",
      score: 2.38,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_FILE,
      sliceKind: "runtime_coverage",
      sourceRowsRequiredForSelection: false,
      targetMetrics: FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_OUTPUTS,
      wrongNumberRisk: 0.9
    },
    {
      accuracyImpact: 0.76,
      coverageImpact: 0.54,
      evidencePaths: [
        "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh.ts",
        "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-runtime-corridor-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "package-transfer residual work can tighten finished open-box package estimates",
        "it does not open the current building airborne output gap"
      ],
      id: "floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap",
      implementationReadiness: 0.62,
      reason:
        "Useful accuracy work, but lower ROI than first opening and correcting the core building airborne route.",
      score: 1.28,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_tightening",
      sourceRowsRequiredForSelection: false,
      targetMetrics: RAW_BARE_LAB_TARGETS,
      wrongNumberRisk: 0.66
    },
    {
      accuracyImpact: 0.82,
      coverageImpact: 0.58,
      evidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-floor-astm-iic-aiic-contour-rating-gate-f-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "ISO weighted impact outputs still cannot become ASTM IIC/AIIC",
        "future ASTM work needs complete E492/E1007/E989 contour ownership"
      ],
      id: "floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap",
      implementationReadiness: 0.5,
      reason:
        "ASTM coverage remains valuable, but it is a separate band/contour owner and must not alias ISO single numbers.",
      score: 1.38,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "metric_basis_boundary",
      sourceRowsRequiredForSelection: true,
      targetMetrics: ASTM_TARGETS,
      wrongNumberRisk: 0.95
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

export function summarizePostV1GateBPNumericCoverageGap(): PostV1GateBPSummary {
  const gateBO = summarizePostV1FloorOpenBoxRawBareBuildingPredictionOwnerGateBO();
  if (gateBO.selectedNextAction !== POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_LANDED_GATE) {
    throw new Error("Gate BP can only land after Gate BO selects the next numeric coverage gap.");
  }

  const selectionCandidates = rankPostV1GateBPNumericCoverageCandidates();
  const selected = selectionCandidates.find((candidate) => candidate.selected);
  if (!selected) {
    throw new Error("Gate BP requires exactly one selected calculator coverage candidate.");
  }

  return {
    blockedNonGoalIds: selectionCandidates
      .filter((candidate) => candidate.sliceKind === "blocked_non_goal")
      .map((candidate) => candidate.id),
    candidateCount: selectionCandidates.length,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousGateBO: {
      landedGate: POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_OPEN_BOX_RAW_BARE_BUILDING_PREDICTION_OWNER_GATE_BO_SELECTION_STATUS
    },
    selectedCandidateId: selected.id,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTED_NEXT_LABEL,
    selectionCandidates,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BP_SELECTION_STATUS
  };
}
