import type { RequestedOutputId } from "@dynecho/shared";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_ca_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_ca_landed_no_runtime_selected_floor_open_box_eps_screed_full_mixed_field_building_gate_cb" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTED_NEXT_ACTION =
  "post_v1_floor_open_box_eps_screed_full_mixed_field_building_gate_cb_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-open-box-eps-screed-full-mixed-field-building-gate-cb-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTED_NEXT_LABEL =
  "post-V1 floor open-box EPS/screed full mixed field/building Gate CB" as const;

const PREVIOUS_GATE_BZ_LANDED_GATE =
  "post_v1_floor_open_box_finished_package_full_mixed_building_impact_gate_bz_plan" as const;
const PREVIOUS_GATE_BZ_SELECTION_STATUS =
  "post_v1_floor_open_box_finished_package_full_mixed_building_impact_gate_bz_landed_selected_next_numeric_coverage_gap_gate_ca" as const;

export type PostV1GateCACandidateId =
  | "broad_source_row_crawl"
  | "confidence_wording_or_low_confidence_surface"
  | "finite_scenario_pack"
  | "floor.open_box_timber_eps_screed_hybrid.full_mixed_field_building_gap"
  | "floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap"
  | "floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap"
  | "generic_ui_or_report_storage_work";

export type PostV1GateCASliceKind =
  | "accuracy_tightening"
  | "blocked_non_goal"
  | "metric_basis_boundary"
  | "scope_accuracy_bridge";

export type PostV1GateCACandidate = {
  readonly accuracyImpact: number;
  readonly coverageImpact: number;
  readonly evidencePaths: readonly string[];
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateCACandidateId;
  readonly implementationReadiness: number;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateCASliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly wrongNumberRisk: number;
};

export type PostV1GateCASummary = {
  readonly blockedNonGoalIds: readonly PostV1GateCACandidateId[];
  readonly candidateCount: number;
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousGateBZ: {
    readonly landedGate: typeof PREVIOUS_GATE_BZ_LANDED_GATE;
    readonly selectionStatus: typeof PREVIOUS_GATE_BZ_SELECTION_STATUS;
  };
  readonly selectedCandidateId: PostV1GateCACandidateId;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTED_NEXT_LABEL;
  readonly selectionCandidates: readonly PostV1GateCACandidate[];
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTION_STATUS;
};

const FIELD_IMPACT_TARGETS = ["L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];
const ASTM_TARGETS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

export function rankPostV1GateCANumericCoverageCandidates(): readonly PostV1GateCACandidate[] {
  return [
    {
      accuracyImpact: 0.86,
      coverageImpact: 0.9,
      evidencePaths: [
        "packages/engine/src/impact-lane.ts",
        "packages/engine/src/open-box-timber-eps-screed-hybrid-package-estimate.ts",
        "packages/engine/src/post-v1-floor-open-box-eps-screed-field-companion-gate-bs-contract.test.ts",
        "packages/engine/src/post-v1-floor-open-box-finished-package-full-mixed-building-impact-gate-bz-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "EPS/screed hybrid already calculates L'n,w, L'nT,w, and L'nT,50 on the explicit impactFieldContext field route",
        "before Gate CB the same complete full mixed building+impact request keeps only lab impact values because building_prediction bypasses the field-context adapter",
        "Gate CB must publish EPS/screed hybrid L'n,w 49, L'nT,w 46.6, and L'nT,50 47.6 beside Rw/R'w/DnT,w and lab impact values",
        "missing impactFieldContext still keeps EPS/screed field impact outputs unsupported",
        "Ctr, IIC, and AIIC remain unsupported because their owners are separate metric-basis routes"
      ],
      id: "floor.open_box_timber_eps_screed_hybrid.full_mixed_field_building_gap",
      implementationReadiness: 0.9,
      reason:
        "This is the highest-ROI calculator step because it applies an already-owned EPS/screed field-impact adapter in the complete full mixed building route, increasing calculable outputs without new source rows or unsafe metric aliases.",
      score: 2.64,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTED_NEXT_FILE,
      sliceKind: "scope_accuracy_bridge",
      sourceRowsRequiredForSelection: false,
      targetMetrics: FIELD_IMPACT_TARGETS,
      wrongNumberRisk: 0.62
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
        "Useful accuracy work, but lower immediate ROI than filling field-impact metrics that are already computable from complete user inputs.",
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
        "Important metric-basis boundary work, but it still needs ASTM curve ownership and must not alias ISO single-number routes.",
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

export function summarizePostV1GateCANumericCoverageGap(): PostV1GateCASummary {
  const selectionCandidates = rankPostV1GateCANumericCoverageCandidates();
  const selected = selectionCandidates.find((candidate) => candidate.selected);
  if (!selected) {
    throw new Error("Gate CA requires exactly one selected calculator coverage/correctness candidate.");
  }

  return {
    blockedNonGoalIds: selectionCandidates
      .filter((candidate) => candidate.sliceKind === "blocked_non_goal")
      .map((candidate) => candidate.id),
    candidateCount: selectionCandidates.length,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousGateBZ: {
      landedGate: PREVIOUS_GATE_BZ_LANDED_GATE,
      selectionStatus: PREVIOUS_GATE_BZ_SELECTION_STATUS
    },
    selectedCandidateId: selected.id,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTED_NEXT_LABEL,
    selectionCandidates,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CA_SELECTION_STATUS
  };
}
