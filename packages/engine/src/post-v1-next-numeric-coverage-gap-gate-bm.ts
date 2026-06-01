import type { RequestedOutputId } from "@dynecho/shared";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_bm_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_bm_landed_runtime_selected_next_numeric_coverage_gap_gate_bn" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_bn_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bn-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate BN" as const;

export type PostV1GateBMCandidateId =
  | "broad_source_row_crawl"
  | "confidence_wording_or_low_confidence_surface"
  | "finite_scenario_pack"
  | "floor.open_box_timber_raw_bare.building_prediction_owner_gap"
  | "floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap"
  | "floor.raw_bare_floor_airborne_building_prediction_owner_gap"
  | "floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap"
  | "floor.raw_bare_open_web.building_prediction_impact_direct_flanking_runtime_gap"
  | "generic_ui_or_report_storage_work";

export type PostV1GateBMSliceKind =
  | "accuracy_tightening"
  | "blocked_non_goal"
  | "metric_basis_boundary"
  | "runtime_coverage"
  | "runtime_owner_boundary";

export type PostV1GateBMCandidate = {
  readonly accuracyImpact: number;
  readonly coverageImpact: number;
  readonly evidencePaths: readonly string[];
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateBMCandidateId;
  readonly implementationReadiness: number;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateBMSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly wrongNumberRisk: number;
};

export type PostV1GateBMFieldPin = {
  readonly carrier: "open_web_raw_bare_300";
  readonly ci50_2500Db: number;
  readonly directPathOffsetDb: number;
  readonly flankingPathLevelOffsetDb: number;
  readonly lPrimeNT50Db: number;
  readonly lPrimeNTwDb: number;
  readonly lPrimeNWDb: number;
  readonly lnWDb: number;
  readonly receivingRoomVolumeM3: number;
};

export type PostV1GateBMSummary = {
  readonly blockedNonGoalIds: readonly PostV1GateBMCandidateId[];
  readonly candidateCount: number;
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_LANDED_GATE;
  readonly noRuntimeValueMovement: false;
  readonly previousGateBLRuntime: {
    readonly landedGate: "post_v1_floor_open_box_raw_bare_field_companion_gate_bl_plan";
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_LANDED_GATE;
    readonly selectionStatus: "post_v1_floor_open_box_raw_bare_field_companion_gate_bl_landed_selected_next_numeric_coverage_gap_gate_bm";
  };
  readonly selectedAcceptancePins: readonly PostV1GateBMFieldPin[];
  readonly selectedCandidateId: PostV1GateBMCandidateId;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_LABEL;
  readonly selectionCandidates: readonly PostV1GateBMCandidate[];
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTION_STATUS;
  readonly targetMetricsForSelectedSlice: readonly RequestedOutputId[];
};

const BUILDING_IMPACT_DIRECT_FLANKING_TARGET_METRICS = [
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const BUILDING_AIRBORNE_TARGET_METRICS = [
  "R'w",
  "Dn,w",
  "DnT,w"
] as const satisfies readonly RequestedOutputId[];

const ASTM_TARGET_METRICS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const PACKAGE_TRANSFER_TARGET_METRICS = [
  "Rw",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI"
] as const satisfies readonly RequestedOutputId[];

export function rankPostV1GateBMNumericCoverageCandidates(): readonly PostV1GateBMCandidate[] {
  return [
    {
      accuracyImpact: 0.9,
      coverageImpact: 0.82,
      evidencePaths: [
        "packages/shared/src/domain/impact-field-context.ts",
        "packages/engine/src/impact-direct-flanking.ts",
        "packages/engine/src/impact-lane.ts",
        "packages/engine/src/calculate-assembly.ts",
        "packages/engine/src/post-v1-floor-open-web-raw-bare-field-companion-gate-bk-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "before Gate BM, complete raw-bare open-web building_prediction requests with explicit direct/flanking impact paths still returned no L'n,w / L'nT,w / L'nT,50",
        "Gate BM must require explicit impact flanking paths and a direct path offset or K owner; simple room-to-room K transfer is not building prediction",
        "Gate BM must support L'n,w 97.8, L'nT,w 95.4, and L'nT,50 100.6 for the pinned direct+flanking raw-bare open-web case",
        "synthetic source-absent direct+flanking inputs that uplift Ln,w by more than 12 dB must stay blocked until exact path or band evidence exists",
        "R'w, DnT,w, lab Ln,w, open-box building prediction, and ASTM IIC/AIIC remain outside this runtime until separate owners exist"
      ],
      id: "floor.raw_bare_open_web.building_prediction_impact_direct_flanking_runtime_gap",
      implementationReadiness: 0.78,
      reason:
        "The raw-bare open-web building gap is now safe to move for impact outputs only because the direct+flanking impact owner fields already exist. This adds calculator coverage without relabelling field K, lab Ln,w, or airborne building outputs.",
      score: 2.08,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_FILE,
      sliceKind: "runtime_coverage",
      sourceRowsRequiredForSelection: false,
      targetMetrics: BUILDING_IMPACT_DIRECT_FLANKING_TARGET_METRICS,
      wrongNumberRisk: 0.48
    },
    {
      accuracyImpact: 0.84,
      coverageImpact: 0.7,
      evidencePaths: [
        "packages/engine/src/open-box-timber-raw-bare-estimate.ts",
        "packages/engine/src/impact-direct-flanking.ts",
        "packages/engine/src/impact-lane.ts"
      ],
      expectedBeforeAfter: [
        "open-box raw-bare building prediction needs its own direct/flanking pins after the open-web direct+flanking slice is proven",
        "do not generalize the open-web direct+flanking runtime to open-box timber without its own carrier-family validation"
      ],
      id: "floor.open_box_timber_raw_bare.building_prediction_owner_gap",
      implementationReadiness: 0.56,
      reason:
        "Open-box building prediction is still important, but it should follow the open-web direct+flanking gate because the open-web lane has the current ranked gap and live Gate BK pins.",
      score: 1.6,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "runtime_owner_boundary",
      sourceRowsRequiredForSelection: false,
      targetMetrics: BUILDING_IMPACT_DIRECT_FLANKING_TARGET_METRICS,
      wrongNumberRisk: 0.82
    },
    {
      accuracyImpact: 0.82,
      coverageImpact: 0.58,
      evidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-floor-astm-iic-aiic-contour-rating-gate-f-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "ISO Ln,w / L'n,w rows stay unsupported for ASTM IIC and AIIC",
        "future ASTM work needs complete E492/E1007 bands or an owned contour source"
      ],
      id: "floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap",
      implementationReadiness: 0.5,
      reason:
        "ASTM coverage matters, but current raw-bare ISO weighted estimates cannot safely create IIC/AIIC without ASTM contour input ownership.",
      score: 1.38,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "metric_basis_boundary",
      sourceRowsRequiredForSelection: true,
      targetMetrics: ASTM_TARGET_METRICS,
      wrongNumberRisk: 0.95
    },
    {
      accuracyImpact: 0.76,
      coverageImpact: 0.54,
      evidencePaths: [
        "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh.ts",
        "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-runtime-corridor-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "package-transfer residual accuracy can tighten finished open-box package estimates",
        "it does not open the current raw-bare building prediction impact gap"
      ],
      id: "floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap",
      implementationReadiness: 0.62,
      reason:
        "Accuracy tightening is useful, but the immediate high-ROI gap is a calculable building-context impact continuation with explicit physical path owners.",
      score: 1.28,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_tightening",
      sourceRowsRequiredForSelection: false,
      targetMetrics: PACKAGE_TRANSFER_TARGET_METRICS,
      wrongNumberRisk: 0.66
    },
    {
      accuracyImpact: 0.68,
      coverageImpact: 0.5,
      evidencePaths: [
        "packages/engine/src/apply-airborne-context.ts",
        "packages/engine/src/dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor.ts"
      ],
      expectedBeforeAfter: [
        "floor R'w / DnT,w building outputs need a separate airborne/direct-curve owner",
        "Gate BM must not publish floor airborne building outputs while only impact direct+flanking ownership is present"
      ],
      id: "floor.raw_bare_floor_airborne_building_prediction_owner_gap",
      implementationReadiness: 0.42,
      reason:
        "Airborne building prediction remains a separate owner problem from impact direct+flanking building-context outputs.",
      score: 1.14,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "runtime_owner_boundary",
      sourceRowsRequiredForSelection: false,
      targetMetrics: BUILDING_AIRBORNE_TARGET_METRICS,
      wrongNumberRisk: 0.9
    },
    {
      accuracyImpact: 0.2,
      coverageImpact: 0.16,
      evidencePaths: [],
      expectedBeforeAfter: [
        "may add future exact rows or calibration evidence",
        "does not itself make source-absent layer combinations calculate"
      ],
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
      expectedBeforeAfter: ["adds examples without increasing formula coverage"],
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
      expectedBeforeAfter: ["does not calculate more acoustic outputs"],
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

export function summarizePostV1GateBMNumericCoverageGap(): PostV1GateBMSummary {
  const selectionCandidates = rankPostV1GateBMNumericCoverageCandidates();
  const selected = selectionCandidates.find((candidate) => candidate.selected);

  if (!selected) {
    throw new Error("Gate BM requires exactly one selected calculator coverage candidate.");
  }

  return {
    blockedNonGoalIds: selectionCandidates
      .filter((candidate) => candidate.sliceKind === "blocked_non_goal")
      .map((candidate) => candidate.id),
    candidateCount: selectionCandidates.length,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_LANDED_GATE,
    noRuntimeValueMovement: false,
    previousGateBLRuntime: {
      landedGate: "post_v1_floor_open_box_raw_bare_field_companion_gate_bl_plan",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_LANDED_GATE,
      selectionStatus:
        "post_v1_floor_open_box_raw_bare_field_companion_gate_bl_landed_selected_next_numeric_coverage_gap_gate_bm"
    },
    selectedAcceptancePins: [
      {
        carrier: "open_web_raw_bare_300",
        ci50_2500Db: 5.2,
        directPathOffsetDb: 1,
        flankingPathLevelOffsetDb: -6,
        lPrimeNT50Db: 100.6,
        lPrimeNTwDb: 95.4,
        lPrimeNWDb: 97.8,
        lnWDb: 96,
        receivingRoomVolumeM3: 55
      }
    ],
    selectedCandidateId: selected.id,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_LABEL,
    selectionCandidates,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTION_STATUS,
    targetMetricsForSelectedSlice: selected.targetMetrics
  };
}
