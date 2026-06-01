import type { RequestedOutputId } from "@dynecho/shared";

import { summarizePostV1FloorMixedSupportFamilySurfaceParityGateBJ } from "./post-v1-floor-mixed-support-family-surface-parity-gate-bj";
import { summarizePostV1FloorSuspendedCeilingLowerTreatmentFieldCompanionGateBF } from "./post-v1-floor-suspended-ceiling-lower-treatment-field-companion-gate-bf";
import { POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS } from "./post-v1-floor-tuas-c11c-iso-impact-gate-ay";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTION_STATUS,
  summarizePostV1GateBMNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-bm";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_bn_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_bn_landed_no_runtime_selected_floor_open_box_raw_bare_building_prediction_owner_gate_bo" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_ACTION =
  "post_v1_floor_open_box_raw_bare_building_prediction_owner_gate_bo_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-open-box-raw-bare-building-prediction-owner-gate-bo-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_LABEL =
  "post-V1 floor open-box raw-bare building prediction owner Gate BO" as const;

export const POST_V1_GATE_BN_MAX_SOURCE_ABSENT_SINGLE_NUMBER_UPLIFT_DB = 12 as const;

export type PostV1GateBNCandidateId =
  | "broad_source_row_crawl"
  | "calculator.numeric_plausibility_and_calibration_sweep.source_absent_field_building_routes"
  | "confidence_wording_or_low_confidence_surface"
  | "finite_scenario_pack"
  | "floor.open_box_timber_raw_bare.building_prediction_owner_gap"
  | "floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap"
  | "floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap"
  | "generic_ui_or_report_storage_work";

export type PostV1GateBNSliceKind =
  | "accuracy_guard"
  | "accuracy_tightening"
  | "blocked_non_goal"
  | "metric_basis_boundary"
  | "runtime_coverage";

export type PostV1GateBNCandidate = {
  readonly accuracyImpact: number;
  readonly coverageImpact: number;
  readonly evidencePaths: readonly string[];
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateBNCandidateId;
  readonly implementationReadiness: number;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateBNSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly wrongNumberRisk: number;
};

export type PostV1GateBNPlausibilityRowId =
  | "c11c_weighted_tuple_field_guarded"
  | "lower_treatment_acoustic_hanger_field"
  | "mixed_support_single_primary_carrier_field"
  | "open_box_raw_bare_220_field_context"
  | "open_box_raw_bare_370_field_context"
  | "open_web_raw_bare_300_building_direct_flanking"
  | "open_web_raw_bare_300_field_context"
  | "open_web_raw_bare_300_severe_direct_flanking_blocked";

export type PostV1GateBNPlausibilityStatus =
  | "blocked_as_outlier"
  | "published_admissible";

export type PostV1GateBNPlausibilityRow = {
  readonly astmAliasesBlocked: true;
  readonly ci50OwnerPresent: boolean;
  readonly complianceStyleClaimBlocked: boolean;
  readonly exactBandOrPathEvidencePresent: boolean;
  readonly family: string;
  readonly id: PostV1GateBNPlausibilityRowId;
  readonly lPrimeNT50Db?: number;
  readonly lPrimeNTwDb?: number;
  readonly lPrimeNWDb?: number;
  readonly labAnchorBasis: string;
  readonly lnWDb: number;
  readonly maxSourceAbsentSingleNumberUpliftDb: number;
  readonly rawBareHighLnWAdmissible: boolean;
  readonly roomVolumeOwnerPresent: boolean;
  readonly sourceAbsentSingleNumber: boolean;
  readonly status: PostV1GateBNPlausibilityStatus;
  readonly unsupportedOutputs: readonly RequestedOutputId[];
  readonly upliftOverLnWDb?: number;
};

export type PostV1GateBNSummary = {
  readonly blockedNonGoalIds: readonly PostV1GateBNCandidateId[];
  readonly blockedOutlierRowIds: readonly PostV1GateBNPlausibilityRowId[];
  readonly candidateCount: number;
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_LANDED_GATE;
  readonly matrixPassed: boolean;
  readonly noRuntimeValueMovement: true;
  readonly plausibilityMatrix: readonly PostV1GateBNPlausibilityRow[];
  readonly previousGateBM: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTION_STATUS;
  };
  readonly selectedCandidateId: PostV1GateBNCandidateId;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_ACTION;
  readonly selectedNextCandidateId: PostV1GateBNCandidateId;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_LABEL;
  readonly selectionCandidates: readonly PostV1GateBNCandidate[];
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTION_STATUS;
  readonly unsafePublishedOutlierIds: readonly PostV1GateBNPlausibilityRowId[];
};

const FIELD_AND_BUILDING_IMPACT_TARGETS = [
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const ASTM_TARGETS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const RAW_BARE_ACCURACY_TARGETS = [
  "Rw",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI"
] as const satisfies readonly RequestedOutputId[];

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function uplift(lnWDb: number, lPrimeNWDb: number): number {
  return round1(lPrimeNWDb - lnWDb);
}

function row(input: Omit<PostV1GateBNPlausibilityRow, "maxSourceAbsentSingleNumberUpliftDb">):
  PostV1GateBNPlausibilityRow {
  return {
    ...input,
    maxSourceAbsentSingleNumberUpliftDb: POST_V1_GATE_BN_MAX_SOURCE_ABSENT_SINGLE_NUMBER_UPLIFT_DB
  };
}

export function buildPostV1GateBNPlausibilityMatrix(): readonly PostV1GateBNPlausibilityRow[] {
  const lowerTreatment = summarizePostV1FloorSuspendedCeilingLowerTreatmentFieldCompanionGateBF()
    .valuePins.find((pin) => pin.id === "acoustic_hanger_assembly_field_only");
  const mixedSupport = summarizePostV1FloorMixedSupportFamilySurfaceParityGateBJ().surfaceSnapshots[0];

  if (!lowerTreatment || !mixedSupport) {
    throw new Error("Gate BN requires landed lower-treatment and mixed-support field pins.");
  }

  return [
    row({
      astmAliasesBlocked: true,
      ci50OwnerPresent: true,
      complianceStyleClaimBlocked: true,
      exactBandOrPathEvidencePresent: false,
      family: "raw_bare_open_web_steel",
      id: "open_web_raw_bare_300_field_context",
      lPrimeNT50Db: 100.8,
      lPrimeNTwDb: 95.6,
      lPrimeNWDb: 98,
      labAnchorBasis: "broad_accuracy_floor_open_web_raw_bare_source_absent_formula_corridor",
      lnWDb: 96,
      rawBareHighLnWAdmissible: true,
      roomVolumeOwnerPresent: true,
      sourceAbsentSingleNumber: true,
      status: "published_admissible",
      unsupportedOutputs: ASTM_TARGETS,
      upliftOverLnWDb: uplift(96, 98)
    }),
    row({
      astmAliasesBlocked: true,
      ci50OwnerPresent: true,
      complianceStyleClaimBlocked: true,
      exactBandOrPathEvidencePresent: false,
      family: "raw_bare_open_web_steel",
      id: "open_web_raw_bare_300_building_direct_flanking",
      lPrimeNT50Db: 100.6,
      lPrimeNTwDb: 95.4,
      lPrimeNWDb: 97.8,
      labAnchorBasis: "broad_accuracy_floor_open_web_raw_bare_source_absent_formula_corridor",
      lnWDb: 96,
      rawBareHighLnWAdmissible: true,
      roomVolumeOwnerPresent: true,
      sourceAbsentSingleNumber: true,
      status: "published_admissible",
      unsupportedOutputs: ["R'w", "DnT,w", "IIC", "AIIC"],
      upliftOverLnWDb: uplift(96, 97.8)
    }),
    row({
      astmAliasesBlocked: true,
      ci50OwnerPresent: true,
      complianceStyleClaimBlocked: true,
      exactBandOrPathEvidencePresent: false,
      family: "raw_bare_open_web_steel",
      id: "open_web_raw_bare_300_severe_direct_flanking_blocked",
      lPrimeNWDb: 112.1,
      labAnchorBasis: "broad_accuracy_floor_open_web_raw_bare_source_absent_formula_corridor",
      lnWDb: 96,
      rawBareHighLnWAdmissible: false,
      roomVolumeOwnerPresent: true,
      sourceAbsentSingleNumber: true,
      status: "blocked_as_outlier",
      unsupportedOutputs: FIELD_AND_BUILDING_IMPACT_TARGETS,
      upliftOverLnWDb: uplift(96, 112.1)
    }),
    row({
      astmAliasesBlocked: true,
      ci50OwnerPresent: true,
      complianceStyleClaimBlocked: true,
      exactBandOrPathEvidencePresent: false,
      family: "raw_bare_open_box_timber",
      id: "open_box_raw_bare_220_field_context",
      lPrimeNT50Db: 94.1,
      lPrimeNTwDb: 90.7,
      lPrimeNWDb: 93.1,
      labAnchorBasis: "broad_accuracy_floor_open_box_timber_raw_bare_source_absent_formula_corridor",
      lnWDb: 91.1,
      rawBareHighLnWAdmissible: true,
      roomVolumeOwnerPresent: true,
      sourceAbsentSingleNumber: true,
      status: "published_admissible",
      unsupportedOutputs: ASTM_TARGETS,
      upliftOverLnWDb: uplift(91.1, 93.1)
    }),
    row({
      astmAliasesBlocked: true,
      ci50OwnerPresent: true,
      complianceStyleClaimBlocked: true,
      exactBandOrPathEvidencePresent: false,
      family: "raw_bare_open_box_timber",
      id: "open_box_raw_bare_370_field_context",
      lPrimeNT50Db: 90.9,
      lPrimeNTwDb: 87.8,
      lPrimeNWDb: 90.2,
      labAnchorBasis: "broad_accuracy_floor_open_box_timber_raw_bare_source_absent_formula_corridor",
      lnWDb: 88.2,
      rawBareHighLnWAdmissible: false,
      roomVolumeOwnerPresent: true,
      sourceAbsentSingleNumber: true,
      status: "published_admissible",
      unsupportedOutputs: ASTM_TARGETS,
      upliftOverLnWDb: uplift(88.2, 90.2)
    }),
    row({
      astmAliasesBlocked: true,
      ci50OwnerPresent: true,
      complianceStyleClaimBlocked: true,
      exactBandOrPathEvidencePresent: false,
      family: "heavy_concrete_lower_treatment",
      id: "lower_treatment_acoustic_hanger_field",
      lPrimeNT50Db: lowerTreatment.lPrimeNT50Db,
      lPrimeNTwDb: lowerTreatment.lPrimeNTwDb,
      lPrimeNWDb: lowerTreatment.lPrimeNWDb,
      labAnchorBasis: "predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate",
      lnWDb: lowerTreatment.lnWDb,
      rawBareHighLnWAdmissible: false,
      roomVolumeOwnerPresent: true,
      sourceAbsentSingleNumber: true,
      status: "published_admissible",
      unsupportedOutputs: ASTM_TARGETS,
      upliftOverLnWDb: uplift(lowerTreatment.lnWDb, lowerTreatment.lPrimeNWDb)
    }),
    row({
      astmAliasesBlocked: true,
      ci50OwnerPresent: true,
      complianceStyleClaimBlocked: true,
      exactBandOrPathEvidencePresent: false,
      family: "mixed_support_single_primary_carrier",
      id: "mixed_support_single_primary_carrier_field",
      lPrimeNT50Db: mixedSupport.lPrimeNT50Db,
      lPrimeNTwDb: mixedSupport.lPrimeNTwDb,
      lPrimeNWDb: mixedSupport.lPrimeNWDb,
      labAnchorBasis: mixedSupport.basis,
      lnWDb: mixedSupport.lnWDb,
      rawBareHighLnWAdmissible: false,
      roomVolumeOwnerPresent: true,
      sourceAbsentSingleNumber: true,
      status: "published_admissible",
      unsupportedOutputs: ASTM_TARGETS,
      upliftOverLnWDb: uplift(mixedSupport.lnWDb, mixedSupport.lPrimeNWDb)
    }),
    row({
      astmAliasesBlocked: true,
      ci50OwnerPresent: true,
      complianceStyleClaimBlocked: true,
      exactBandOrPathEvidencePresent: false,
      family: "tuas_c11c_weighted_tuple_guarded",
      id: "c11c_weighted_tuple_field_guarded",
      lPrimeNT50Db: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.field["L'nT,50"],
      lPrimeNTwDb: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.field["L'nT,w"],
      lPrimeNWDb: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.field["L'n,w"],
      labAnchorBasis: "tuas_c11c_visible_iso_weighted_impact_tuple_guarded",
      lnWDb: POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.lab["Ln,w"],
      rawBareHighLnWAdmissible: false,
      roomVolumeOwnerPresent: true,
      sourceAbsentSingleNumber: false,
      status: "published_admissible",
      unsupportedOutputs: ["DeltaLw", "IIC", "AIIC"],
      upliftOverLnWDb: uplift(
        POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.lab["Ln,w"],
        POST_V1_GATE_AY_TUAS_C11C_VALUE_PINS.field["L'n,w"]
      )
    })
  ];
}

export function rankPostV1GateBNNumericCoverageCandidates(): readonly PostV1GateBNCandidate[] {
  return [
    {
      accuracyImpact: 0.96,
      coverageImpact: 0.62,
      evidencePaths: [
        "packages/engine/src/impact-direct-flanking.ts",
        "packages/engine/src/impact-field-context.ts",
        "packages/engine/src/impact-lane.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bm-contract.test.ts",
        "docs/calculator/POST_V1_GATE_BN_NUMERIC_PLAUSIBILITY_AND_CALIBRATION_PLAN_2026-06-01.md"
      ],
      expectedBeforeAfter: [
        "Gate BM corrected the suspicious 112.1 source-absent direct+flanking value by blocking uplifts above 12 dB",
        "Gate BN must make that numeric admissibility rule visible across all active source-absent field/building impact lanes",
        "Gate BN moves no runtime values; it selects the next runtime only after the plausibility matrix is green"
      ],
      id: "calculator.numeric_plausibility_and_calibration_sweep.source_absent_field_building_routes",
      implementationReadiness: 0.96,
      reason:
        "This is the highest-ROI next step because it prevents wrong calculator answers before opening another source-absent building route.",
      score: 2.46,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_FILE,
      sliceKind: "accuracy_guard",
      sourceRowsRequiredForSelection: false,
      targetMetrics: FIELD_AND_BUILDING_IMPACT_TARGETS,
      wrongNumberRisk: 0.98
    },
    {
      accuracyImpact: 0.88,
      coverageImpact: 0.82,
      evidencePaths: [
        "packages/engine/src/open-box-timber-raw-bare-estimate.ts",
        "packages/engine/src/impact-direct-flanking.ts",
        "packages/engine/src/impact-lane.ts"
      ],
      expectedBeforeAfter: [
        "after Gate BN, open-box building prediction can be selected only with explicit direct/flanking owner semantics",
        "open-box raw-bare building outputs must not reuse simple field K or publish ASTM aliases"
      ],
      id: "floor.open_box_timber_raw_bare.building_prediction_owner_gap",
      implementationReadiness: 0.66,
      reason:
        "This is the next value-moving coverage candidate once Gate BN proves the source-absent field/building matrix is numerically admissible.",
      score: 2.02,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "runtime_coverage",
      sourceRowsRequiredForSelection: false,
      targetMetrics: FIELD_AND_BUILDING_IMPACT_TARGETS,
      wrongNumberRisk: 0.72
    },
    {
      accuracyImpact: 0.82,
      coverageImpact: 0.58,
      evidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-floor-astm-iic-aiic-contour-rating-gate-f-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "ISO impact rows still cannot become ASTM IIC/AIIC",
        "future ASTM work needs complete E492/E1007/E989 contour ownership"
      ],
      id: "floor.raw_bare_impact.astm_iic_aiic_rating_curve_owner_gap",
      implementationReadiness: 0.5,
      reason:
        "ASTM coverage is valuable, but Gate BN confirms it remains a separate contour/band owner, not an ISO alias.",
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
      accuracyImpact: 0.76,
      coverageImpact: 0.54,
      evidencePaths: [
        "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh.ts",
        "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-runtime-corridor-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "raw-bare package transfer residual work can tighten formulas after current field/building boundaries are safe",
        "it does not open the next building prediction route by itself"
      ],
      id: "floor.open_box_timber_raw_bare.package_transfer_residual_accuracy_gap",
      implementationReadiness: 0.62,
      reason:
        "Useful accuracy work, but lower ROI than first proving and then opening the current building prediction gap.",
      score: 1.28,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_tightening",
      sourceRowsRequiredForSelection: false,
      targetMetrics: RAW_BARE_ACCURACY_TARGETS,
      wrongNumberRisk: 0.66
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

function isUnsafePublishedOutlier(row: PostV1GateBNPlausibilityRow): boolean {
  return row.status === "published_admissible" &&
    row.sourceAbsentSingleNumber &&
    !row.exactBandOrPathEvidencePresent &&
    typeof row.upliftOverLnWDb === "number" &&
    row.upliftOverLnWDb > row.maxSourceAbsentSingleNumberUpliftDb;
}

export function summarizePostV1GateBNNumericPlausibilityAndCalibration():
  PostV1GateBNSummary {
  const gateBM = summarizePostV1GateBMNumericCoverageGap();
  if (gateBM.selectedNextAction !== POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_LANDED_GATE) {
    throw new Error("Gate BN can only land after Gate BM selects the numeric plausibility/calibration sweep.");
  }

  const selectionCandidates = rankPostV1GateBNNumericCoverageCandidates();
  const selected = selectionCandidates.find((candidate) => candidate.selected);
  const next = selectionCandidates.find((candidate) =>
    candidate.id === "floor.open_box_timber_raw_bare.building_prediction_owner_gap"
  );

  if (!selected || !next) {
    throw new Error("Gate BN requires one selected accuracy guard and one next runtime candidate.");
  }

  const plausibilityMatrix = buildPostV1GateBNPlausibilityMatrix();
  const unsafePublishedOutlierIds = plausibilityMatrix
    .filter(isUnsafePublishedOutlier)
    .map((row) => row.id);
  const blockedOutlierRowIds = plausibilityMatrix
    .filter((row) => row.status === "blocked_as_outlier")
    .map((row) => row.id);

  return {
    blockedNonGoalIds: selectionCandidates
      .filter((candidate) => candidate.sliceKind === "blocked_non_goal")
      .map((candidate) => candidate.id),
    blockedOutlierRowIds,
    candidateCount: selectionCandidates.length,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_LANDED_GATE,
    matrixPassed: unsafePublishedOutlierIds.length === 0 &&
      blockedOutlierRowIds.includes("open_web_raw_bare_300_severe_direct_flanking_blocked"),
    noRuntimeValueMovement: true,
    plausibilityMatrix,
    previousGateBM: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_LANDED_GATE,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BM_SELECTION_STATUS
    },
    selectedCandidateId: selected.id,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_ACTION,
    selectedNextCandidateId: next.id,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTED_NEXT_LABEL,
    selectionCandidates,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BN_SELECTION_STATUS,
    unsafePublishedOutlierIds
  };
}
