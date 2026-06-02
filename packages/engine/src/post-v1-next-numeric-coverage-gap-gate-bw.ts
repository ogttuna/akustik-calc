import type { RequestedOutputId } from "@dynecho/shared";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_bw_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_bw_landed_no_runtime_selected_floor_open_box_finished_package_lab_metric_projection_gate_bx" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTED_NEXT_ACTION =
  "post_v1_floor_open_box_finished_package_lab_metric_projection_gate_bx_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-open-box-finished-package-lab-metric-projection-gate-bx-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTED_NEXT_LABEL =
  "post-V1 floor open-box finished-package lab metric projection Gate BX" as const;

const PREVIOUS_GATE_BV_LANDED_GATE =
  "post_v1_floor_open_box_finished_package_mixed_lab_building_companion_gate_bv_plan" as const;
const PREVIOUS_GATE_BV_SELECTION_STATUS =
  "post_v1_floor_open_box_finished_package_mixed_lab_building_companion_gate_bv_landed_selected_next_numeric_coverage_gap_gate_bw" as const;

export type PostV1GateBWCandidateId =
  | "broad_source_row_crawl"
  | "confidence_wording_or_low_confidence_surface"
  | "finite_scenario_pack"
  | "floor.open_box_timber_finished_package.lab_metric_projection_gap"
  | "floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap"
  | "floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap"
  | "generic_ui_or_report_storage_work";

export type PostV1GateBWSliceKind =
  | "accuracy_tightening"
  | "blocked_non_goal"
  | "metric_basis_boundary";

export type PostV1GateBWCandidate = {
  readonly accuracyImpact: number;
  readonly coverageImpact: number;
  readonly evidencePaths: readonly string[];
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateBWCandidateId;
  readonly implementationReadiness: number;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateBWSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly wrongNumberRisk: number;
};

export type PostV1GateBWSummary = {
  readonly blockedNonGoalIds: readonly PostV1GateBWCandidateId[];
  readonly candidateCount: number;
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousGateBV: {
    readonly landedGate: typeof PREVIOUS_GATE_BV_LANDED_GATE;
    readonly selectionStatus: typeof PREVIOUS_GATE_BV_SELECTION_STATUS;
  };
  readonly selectedCandidateId: PostV1GateBWCandidateId;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTED_NEXT_LABEL;
  readonly selectionCandidates: readonly PostV1GateBWCandidate[];
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTION_STATUS;
};

const PACKAGE_LAB_TARGETS = ["Rw", "C"] as const satisfies readonly RequestedOutputId[];
const ASTM_TARGETS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

export function rankPostV1GateBWNumericCoverageCandidates(): readonly PostV1GateBWCandidate[] {
  return [
    {
      accuracyImpact: 0.92,
      coverageImpact: 0.62,
      evidencePaths: [
        "packages/engine/src/open-box-timber-similarity-estimate.ts",
        "packages/engine/src/open-box-timber-eps-screed-hybrid-package-estimate.ts",
        "packages/engine/src/calculate-assembly.ts",
        "packages/engine/src/post-v1-floor-open-box-eps-screed-field-companion-gate-bs-contract.test.ts",
        "packages/engine/src/post-v1-floor-open-box-finished-package-mixed-lab-building-companion-gate-bv-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "finished open-box package lanes already own lab airborne values: dry Rw 66 / C -3.9 and EPS/screed Rw 72 / C -1.3",
        "mixed lab-impact or lab-field-impact requests can currently mark Rw/C supported while the visible metrics still come from the generic dynamic airborne curve",
        "Gate BX must project the owned package lab Rw/C into visible metrics for those mixed requests without changing impact field pins",
        "Ctr remains unsupported because these package owners declare Rw+C, not a true Ctr"
      ],
      id: "floor.open_box_timber_finished_package.lab_metric_projection_gap",
      implementationReadiness: 0.84,
      reason:
        "This is the highest-ROI next calculator step because it fixes a live wrong-number display for already-supported package Rw/C mixed with impact outputs, using existing owned package values and no new source rows.",
      score: 2.28,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTED_NEXT_FILE,
      sliceKind: "accuracy_tightening",
      sourceRowsRequiredForSelection: false,
      targetMetrics: PACKAGE_LAB_TARGETS,
      wrongNumberRisk: 0.88
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
        "Useful accuracy work, but lower immediate ROI than correcting a visible wrong-number metric projection for already calculable finished packages.",
      score: 1.43,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_tightening",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["Rw", "Ln,w"],
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
        "Important boundary work, but it still needs ASTM curve ownership and must not alias ISO single-number routes.",
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

export function summarizePostV1GateBWNumericCoverageGap(): PostV1GateBWSummary {
  const selectionCandidates = rankPostV1GateBWNumericCoverageCandidates();
  const selected = selectionCandidates.find((candidate) => candidate.selected);
  if (!selected) {
    throw new Error("Gate BW requires exactly one selected calculator coverage/correctness candidate.");
  }

  return {
    blockedNonGoalIds: selectionCandidates
      .filter((candidate) => candidate.sliceKind === "blocked_non_goal")
      .map((candidate) => candidate.id),
    candidateCount: selectionCandidates.length,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousGateBV: {
      landedGate: PREVIOUS_GATE_BV_LANDED_GATE,
      selectionStatus: PREVIOUS_GATE_BV_SELECTION_STATUS
    },
    selectedCandidateId: selected.id,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTED_NEXT_LABEL,
    selectionCandidates,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BW_SELECTION_STATUS
  };
}
