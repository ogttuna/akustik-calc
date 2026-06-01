import type { RequestedOutputId } from "@dynecho/shared";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_bl_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_bl_landed_no_runtime_selected_floor_open_box_raw_bare_field_companion_gate_bl" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTED_NEXT_ACTION =
  "post_v1_floor_open_box_raw_bare_field_companion_gate_bl_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-open-box-raw-bare-field-companion-gate-bl-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTED_NEXT_LABEL =
  "post-V1 floor open-box raw-bare field companion Gate BL" as const;

export type PostV1GateBLCandidateId =
  | "broad_source_row_crawl"
  | "confidence_wording_or_low_confidence_surface"
  | "finite_scenario_pack"
  | "floor.open_box_timber_raw_bare.building_prediction_owner_gap"
  | "floor.open_box_timber_raw_bare.field_companion_runtime_gap"
  | "floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap"
  | "floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap"
  | "floor.raw_bare_open_web.building_prediction_owner_gap"
  | "generic_ui_or_report_storage_work";

export type PostV1GateBLSliceKind =
  | "accuracy_tightening"
  | "blocked_non_goal"
  | "metric_basis_boundary"
  | "runtime_coverage"
  | "runtime_owner_boundary";

export type PostV1GateBLCandidate = {
  readonly accuracyImpact: number;
  readonly coverageImpact: number;
  readonly evidencePaths: readonly string[];
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateBLCandidateId;
  readonly implementationReadiness: number;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateBLSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly wrongNumberRisk: number;
};

export type PostV1GateBLFieldPin = {
  readonly carrier: "open_box_timber_raw_bare_220" | "open_box_timber_raw_bare_370";
  readonly ci50_2500Db: number;
  readonly fieldKDb: number;
  readonly lPrimeNT50Db: number;
  readonly lPrimeNTwDb: number;
  readonly lPrimeNWDb: number;
  readonly lnWDb: number;
  readonly receivingRoomVolumeM3: number;
};

export type PostV1GateBLSummary = {
  readonly blockedNonGoalIds: readonly PostV1GateBLCandidateId[];
  readonly candidateCount: number;
  readonly evidence: {
    readonly gateBkOpenWebPinsPreserved: {
      readonly ci50_2500Db: 5.2;
      readonly lPrimeNT50Db: 100.8;
      readonly lPrimeNTwDb: 95.6;
      readonly lPrimeNWDb: 98;
      readonly lnWDb: 96;
    };
    readonly openBoxCurrentGap: {
      readonly currentSupportedOutputs: readonly RequestedOutputId[];
      readonly currentUnsupportedOutputs: readonly RequestedOutputId[];
      readonly existingLabBasis: "broad_accuracy_floor_open_box_timber_raw_bare_source_absent_formula_corridor";
      readonly existingLabPins: {
        readonly ci50_2500Db: 3.4;
        readonly ciDb: -0.9;
        readonly lnWDb: 91.1;
        readonly lnWPlusCiDb: 90.2;
      };
    };
  };
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousGateBK: {
    readonly landedGate: "post_v1_floor_open_web_raw_bare_field_companion_gate_bk_plan";
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_LANDED_GATE;
    readonly selectionStatus: "post_v1_floor_open_web_raw_bare_field_companion_gate_bk_landed_selected_next_numeric_coverage_gap_gate_bl";
  };
  readonly selectedAcceptancePins: readonly PostV1GateBLFieldPin[];
  readonly selectedCandidateId: PostV1GateBLCandidateId;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTED_NEXT_LABEL;
  readonly selectionCandidates: readonly PostV1GateBLCandidate[];
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTION_STATUS;
  readonly targetMetricsForSelectedSlice: readonly RequestedOutputId[];
};

const FIELD_COMPANION_TARGET_METRICS = [
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const BUILDING_PREDICTION_TARGET_METRICS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "L'n,w",
  "L'nT,w"
] as const satisfies readonly RequestedOutputId[];

const ASTM_TARGET_METRICS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const PACKAGE_TRANSFER_TARGET_METRICS = [
  "Rw",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI"
] as const satisfies readonly RequestedOutputId[];

export function rankPostV1GateBLNumericCoverageCandidates(): readonly PostV1GateBLCandidate[] {
  return [
    {
      accuracyImpact: 0.86,
      coverageImpact: 0.9,
      evidencePaths: [
        "packages/engine/src/open-box-timber-raw-bare-estimate.ts",
        "packages/engine/src/impact-field-context.ts",
        "packages/engine/src/impact-lane.ts",
        "packages/engine/src/post-v1-floor-open-web-raw-bare-field-companion-gate-bk-contract.test.ts",
        "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh.ts"
      ],
      expectedBeforeAfter: [
        "current open-box raw-bare 220 mm stack supports lab Ln,w 91.1 but stops L'n,w / L'nT,w / L'nT,50",
        "Gate BL must use the existing impactFieldContext adapter, not a new formula or ISO-to-ASTM alias",
        "future runtime pins: L'n,w 93.1, L'nT,w 90.7, L'nT,50 94.1 with K=2 and V=55 m3",
        "building_prediction and ASTM IIC/AIIC remain unsupported until their own owners exist"
      ],
      id: "floor.open_box_timber_raw_bare.field_companion_runtime_gap",
      implementationReadiness: 0.94,
      reason:
        "After Gate BK, the same owned lab-anchor plus explicit field-context pattern is still absent for open-box timber raw-bare floors. It directly adds calculable field impact outputs for a realistic layer stack when required inputs are present.",
      score: 2.2,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTED_NEXT_FILE,
      sliceKind: "runtime_coverage",
      sourceRowsRequiredForSelection: false,
      targetMetrics: FIELD_COMPANION_TARGET_METRICS,
      wrongNumberRisk: 0.72
    },
    {
      accuracyImpact: 0.9,
      coverageImpact: 0.78,
      evidencePaths: [
        "packages/engine/src/impact-field-context.ts",
        "packages/engine/src/calculate-assembly.ts",
        "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"
      ],
      expectedBeforeAfter: [
        "building prediction needs a direct/flanking owner, not field-apparent output reuse",
        "current open-web raw-bare lab/field values must not become R'w / DnT,w by alias",
        "select after the direct/flanking input owner and value pins are explicit"
      ],
      id: "floor.raw_bare_open_web.building_prediction_owner_gap",
      implementationReadiness: 0.52,
      reason:
        "Building prediction has high eventual value, but selecting it before explicit direct/flanking ownership would create the exact metric-basis drift the calculator rules forbid.",
      score: 1.66,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "runtime_owner_boundary",
      sourceRowsRequiredForSelection: false,
      targetMetrics: BUILDING_PREDICTION_TARGET_METRICS,
      wrongNumberRisk: 0.96
    },
    {
      accuracyImpact: 0.88,
      coverageImpact: 0.74,
      evidencePaths: [
        "packages/engine/src/open-box-timber-raw-bare-estimate.ts",
        "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh.ts"
      ],
      expectedBeforeAfter: [
        "open-box building prediction remains a separate direct/flanking owner problem",
        "field companion coverage should land first because its formula owner and field inputs already exist",
        "no building outputs move until the building adapter owner exists"
      ],
      id: "floor.open_box_timber_raw_bare.building_prediction_owner_gap",
      implementationReadiness: 0.48,
      reason:
        "This is important but should follow the lower-risk open-box field companion because building prediction needs additional ownership beyond K and room-volume normalization.",
      score: 1.54,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "runtime_owner_boundary",
      sourceRowsRequiredForSelection: false,
      targetMetrics: BUILDING_PREDICTION_TARGET_METRICS,
      wrongNumberRisk: 0.94
    },
    {
      accuracyImpact: 0.82,
      coverageImpact: 0.58,
      evidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-floor-astm-iic-aiic-contour-rating-gate-f-contract.test.ts",
        "packages/engine/src/post-v1-floor-astm-iic-aiic-surface-parity-gate-g-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "ISO Ln,w / CI rows stay unsupported for ASTM IIC and AIIC",
        "future ASTM work needs complete E492/E989 or E1007 band/contour owner inputs",
        "do not use raw-bare ISO weighted values as ASTM ratings"
      ],
      id: "floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap",
      implementationReadiness: 0.5,
      reason:
        "ASTM coverage matters, but current raw-bare ISO outputs are not enough to own IIC/AIIC without the ASTM contour inputs.",
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
        "it does not add the currently missing raw-bare field outputs",
        "select after the open-box field companion or when holdout residual evidence is the active blocker"
      ],
      id: "floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap",
      implementationReadiness: 0.62,
      reason:
        "Accuracy tightening is useful, but the immediate high-ROI missing coverage is the calculable field companion for raw-bare open-box stacks.",
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
      accuracyImpact: 0.2,
      coverageImpact: 0.16,
      evidencePaths: [],
      expectedBeforeAfter: [
        "may add future exact rows or calibration evidence",
        "does not itself make arbitrary source-absent layer combinations calculate"
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
      accuracyImpact: 0.1,
      coverageImpact: 0.1,
      evidencePaths: [],
      expectedBeforeAfter: [
        "adds finite examples",
        "does not widen the formula route for user-entered layer stacks"
      ],
      id: "finite_scenario_pack",
      implementationReadiness: 0.8,
      reason: "Scenario packs are regression support after runtime movement, not the selected next capability slice.",
      score: 0.08,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: false,
      targetMetrics: [],
      wrongNumberRisk: 0.06
    },
    {
      accuracyImpact: 0.05,
      coverageImpact: 0.04,
      evidencePaths: [],
      expectedBeforeAfter: [
        "does not add a formula owner",
        "does not add or correct a supported acoustic output"
      ],
      id: "confidence_wording_or_low_confidence_surface",
      implementationReadiness: 0.88,
      reason: "Confidence wording is not calculator coverage or correctness movement.",
      score: 0.06,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: false,
      targetMetrics: [],
      wrongNumberRisk: 0.03
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
      reason: "Generic UI/report/storage work is out of scope unless a numeric gate explicitly requires it.",
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

export function summarizePostV1GateBLNumericCoverageGap(): PostV1GateBLSummary {
  const selectionCandidates = rankPostV1GateBLNumericCoverageCandidates();
  const selectedCandidates = selectionCandidates.filter((candidate) => candidate.selected);
  if (selectedCandidates.length !== 1) {
    throw new Error("Gate BL must select exactly one next calculator-capacity slice.");
  }
  const selected = selectedCandidates[0];

  return {
    blockedNonGoalIds: selectionCandidates
      .filter((candidate) => candidate.sliceKind === "blocked_non_goal")
      .map((candidate) => candidate.id),
    candidateCount: selectionCandidates.length,
    evidence: {
      gateBkOpenWebPinsPreserved: {
        ci50_2500Db: 5.2,
        lPrimeNT50Db: 100.8,
        lPrimeNTwDb: 95.6,
        lPrimeNWDb: 98,
        lnWDb: 96
      },
      openBoxCurrentGap: {
        currentSupportedOutputs: ["Ln,w"],
        currentUnsupportedOutputs: ["L'n,w", "L'nT,w", "L'nT,50", "IIC"],
        existingLabBasis: "broad_accuracy_floor_open_box_timber_raw_bare_source_absent_formula_corridor",
        existingLabPins: {
          ci50_2500Db: 3.4,
          ciDb: -0.9,
          lnWDb: 91.1,
          lnWPlusCiDb: 90.2
        }
      }
    },
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousGateBK: {
      landedGate: "post_v1_floor_open_web_raw_bare_field_companion_gate_bk_plan",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_LANDED_GATE,
      selectionStatus: "post_v1_floor_open_web_raw_bare_field_companion_gate_bk_landed_selected_next_numeric_coverage_gap_gate_bl"
    },
    selectedAcceptancePins: [
      {
        carrier: "open_box_timber_raw_bare_220",
        ci50_2500Db: 3.4,
        fieldKDb: 2,
        lPrimeNT50Db: 94.1,
        lPrimeNTwDb: 90.7,
        lPrimeNWDb: 93.1,
        lnWDb: 91.1,
        receivingRoomVolumeM3: 55
      },
      {
        carrier: "open_box_timber_raw_bare_370",
        ci50_2500Db: 3.1,
        fieldKDb: 2,
        lPrimeNT50Db: 90.9,
        lPrimeNTwDb: 87.8,
        lPrimeNWDb: 90.2,
        lnWDb: 88.2,
        receivingRoomVolumeM3: 55
      }
    ],
    selectedCandidateId: selected.id,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTED_NEXT_LABEL,
    selectionCandidates,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BL_SELECTION_STATUS,
    targetMetricsForSelectedSlice: selected.targetMetrics
  };
}
