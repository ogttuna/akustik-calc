import type { RequestedOutputId } from "@dynecho/shared";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_bt_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_bt_landed_no_runtime_selected_floor_open_box_finished_package_airborne_building_companion_gate_bu" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTED_NEXT_ACTION =
  "post_v1_floor_open_box_finished_package_airborne_building_companion_gate_bu_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-open-box-finished-package-airborne-building-companion-gate-bu-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTED_NEXT_LABEL =
  "post-V1 floor open-box finished-package airborne building companion Gate BU" as const;

const PREVIOUS_GATE_BS_LANDED_GATE = "post_v1_floor_open_box_eps_screed_field_companion_gate_bs_plan" as const;
const PREVIOUS_GATE_BS_SELECTION_STATUS =
  "post_v1_floor_open_box_eps_screed_field_companion_gate_bs_landed_selected_next_numeric_coverage_gap_gate_bt" as const;

export type PostV1GateBTCandidateId =
  | "broad_source_row_crawl"
  | "confidence_wording_or_low_confidence_surface"
  | "finite_scenario_pack"
  | "floor.open_box_timber_finished_package.airborne_building_companion_gap"
  | "floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap"
  | "floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap"
  | "generic_ui_or_report_storage_work";

export type PostV1GateBTSliceKind =
  | "accuracy_tightening"
  | "blocked_non_goal"
  | "metric_basis_boundary"
  | "runtime_coverage";

export type PostV1GateBTCandidate = {
  readonly accuracyImpact: number;
  readonly coverageImpact: number;
  readonly evidencePaths: readonly string[];
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateBTCandidateId;
  readonly implementationReadiness: number;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateBTSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly wrongNumberRisk: number;
};

export type PostV1GateBTSummary = {
  readonly blockedNonGoalIds: readonly PostV1GateBTCandidateId[];
  readonly candidateCount: number;
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousGateBS: {
    readonly landedGate: typeof PREVIOUS_GATE_BS_LANDED_GATE;
    readonly selectionStatus: typeof PREVIOUS_GATE_BS_SELECTION_STATUS;
  };
  readonly selectedCandidateId: PostV1GateBTCandidateId;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTED_NEXT_LABEL;
  readonly selectionCandidates: readonly PostV1GateBTCandidate[];
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTION_STATUS;
};

const BUILDING_AIRBORNE_TARGETS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const PACKAGE_LAB_TARGETS = ["Rw", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const ASTM_TARGETS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

export function rankPostV1GateBTNumericCoverageCandidates(): readonly PostV1GateBTCandidate[] {
  return [
    {
      accuracyImpact: 0.88,
      coverageImpact: 0.84,
      evidencePaths: [
        "packages/engine/src/open-box-timber-similarity-estimate.ts",
        "packages/engine/src/open-box-timber-eps-screed-hybrid-package-estimate.ts",
        "packages/engine/src/apply-airborne-context.ts",
        "packages/engine/src/calculate-assembly.ts"
      ],
      expectedBeforeAfter: [
        "finished open-box package lanes already own lab airborne anchors: dry package-transfer Rw 66 and EPS/screed hybrid Rw 72",
        "building-only R'w / DnT,w requests can currently fall back to generic predictor or screening airborne bases instead of the package anchor",
        "mixed lab-plus-building requests can calculate R'w / DnT,w while still marking the requested package Rw companion unsupported",
        "Gate BU must use the selected package Rw direct curve with complete building_prediction context and keep missing context as needs_input",
        "impact field outputs and ASTM IIC / AIIC remain separate owners"
      ],
      id: "floor.open_box_timber_finished_package.airborne_building_companion_gap",
      implementationReadiness: 0.76,
      reason:
        "This is the highest-ROI next calculator step because it corrects a wrong-anchor building airborne route and opens the same package anchor for R'w / Dn / DnT outputs without new source rows.",
      score: 2.24,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTED_NEXT_FILE,
      sliceKind: "runtime_coverage",
      sourceRowsRequiredForSelection: false,
      targetMetrics: BUILDING_AIRBORNE_TARGETS,
      wrongNumberRisk: 0.68
    },
    {
      accuracyImpact: 0.78,
      coverageImpact: 0.55,
      evidencePaths: [
        "packages/engine/src/broad-accuracy-floor-open-box-timber-package-transfer-residual-expansion-contract.test.ts",
        "packages/engine/src/broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "package-transfer residual work can tighten finished open-box package budgets",
        "partial and mixed staged rows still need narrow residual policy before runtime widening"
      ],
      id: "floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap",
      implementationReadiness: 0.58,
      reason:
        "Still useful accuracy work, but lower immediate ROI than correcting a live wrong-anchor building airborne path for already-owned package stacks.",
      score: 1.43,
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
        "ISO Ln,w / CI single numbers still cannot become ASTM ratings without band-curve ownership"
      ],
      id: "floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap",
      implementationReadiness: 0.48,
      reason:
        "Important boundary work, but it needs ASTM curve ownership and must not alias the ISO single-number routes.",
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

export function summarizePostV1GateBTNumericCoverageGap(): PostV1GateBTSummary {
  const selectionCandidates = rankPostV1GateBTNumericCoverageCandidates();
  const selected = selectionCandidates.find((candidate) => candidate.selected);
  if (!selected) {
    throw new Error("Gate BT requires exactly one selected calculator coverage candidate.");
  }

  return {
    blockedNonGoalIds: selectionCandidates
      .filter((candidate) => candidate.sliceKind === "blocked_non_goal")
      .map((candidate) => candidate.id),
    candidateCount: selectionCandidates.length,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousGateBS: {
      landedGate: PREVIOUS_GATE_BS_LANDED_GATE,
      selectionStatus: PREVIOUS_GATE_BS_SELECTION_STATUS
    },
    selectedCandidateId: selected.id,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTED_NEXT_LABEL,
    selectionCandidates,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BT_SELECTION_STATUS
  };
}
