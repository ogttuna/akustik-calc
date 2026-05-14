import { RatingAdapterBasisSchema, type RatingAdapterBasis, type RequestedOutputId } from "@dynecho/shared";

import {
  buildPersonalUseMvpCoverageSprintGateBUAstmRatingAdapterBasisSet,
  buildPersonalUseMvpCoverageSprintGateBUContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bu";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_LANDED_GATE =
  "gate_bv_personal_use_mvp_floor_impact_astm_iic_aiic_rating_curve_owner_scaffold_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTION_STATUS =
  "gate_bv_personal_use_mvp_floor_impact_astm_iic_aiic_rating_curve_owner_scaffold_landed_no_runtime_selected_contour_rating_owner_gate_bw";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_ACTION =
  "gate_bw_personal_use_mvp_floor_impact_astm_iic_aiic_contour_rating_owner_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bw-floor-impact-astm-iic-aiic-contour-rating-owner-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_LABEL =
  "floor-impact ASTM IIC/AIIC contour rating owner";

export const GATE_BV_ASTM_IMPACT_ONE_THIRD_OCTAVE_BAND_CENTERS_HZ = [
  100,
  125,
  160,
  200,
  250,
  315,
  400,
  500,
  630,
  800,
  1000,
  1250,
  1600,
  2000,
  2500,
  3150
] as const;

const ASTM_IIC_OUTPUTS = ["IIC"] as const satisfies readonly RequestedOutputId[];
const ASTM_AIIC_OUTPUTS = ["AIIC"] as const satisfies readonly RequestedOutputId[];
const ASTM_IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const GATE_BV_LAB_IIC_REMAINING_RUNTIME_BLOCKERS = [
  "astmE989ExecutableIicContourRatingProcedureOwner",
  "exactAstmSourcePrecedenceRuntimeOwner",
  "astmIicSourceAbsentUncertaintyOwner",
  "astmIicVisibleSurfaceParityOwner"
] as const;

const GATE_BV_FIELD_AIIC_REMAINING_RUNTIME_BLOCKERS = [
  "astmE989ExecutableAiicApparentRatingProcedureOwner",
  "exactAstmSourcePrecedenceRuntimeOwner",
  "astmAiicSourceAbsentUncertaintyOwner",
  "astmAiicVisibleSurfaceParityOwner"
] as const;

export type PersonalUseMvpCoverageSprintGateBVAstmBandCenterHz =
  (typeof GATE_BV_ASTM_IMPACT_ONE_THIRD_OCTAVE_BAND_CENTERS_HZ)[number];

export type PersonalUseMvpCoverageSprintGateBVAstmCurveBand = {
  centerHz: number;
  levelDb: number;
};

export type PersonalUseMvpCoverageSprintGateBVCurveOwnerStatus =
  | "blocked_basis_alias"
  | "curve_owner_ready_rating_owner_missing"
  | "needs_curve_input"
  | "needs_field_context";

export type PersonalUseMvpCoverageSprintGateBVCurveOwnerProbe = {
  bandSetId:
    | "astm_e1007_e989_declared_one_third_octave_100_3150_hz"
    | "astm_e492_e989_declared_one_third_octave_100_3150_hz"
    | "not_astm_impact_curve";
  blockedOutputs: readonly RequestedOutputId[];
  curveStandard: "ASTM E1007" | "ASTM E492" | "not_astm_impact_curve";
  duplicateBandCentersHz: readonly number[];
  extraBandCentersHz: readonly number[];
  fieldContextOwned: boolean;
  id: string;
  missingBandCentersHz: readonly number[];
  missingOwners: readonly string[];
  nonFiniteBandCentersHz: readonly number[];
  providedBandCentersHz: readonly number[];
  ratingCurveScaffoldReady: boolean;
  ratingProcedureExecutable: false;
  ratingStandard: "ASTM E989" | "not_astm_impact_rating";
  reason: string;
  requestBasis:
    | "astm_field_aiic_apparent_curve"
    | "astm_lab_iic_normalized_curve"
    | "building_prediction_alias"
    | "iso_field_impact_alias"
    | "iso_lab_impact_alias";
  requiredBandCentersHz: typeof GATE_BV_ASTM_IMPACT_ONE_THIRD_OCTAVE_BAND_CENTERS_HZ;
  runtimePromotionAllowedAtGateBV: false;
  status: PersonalUseMvpCoverageSprintGateBVCurveOwnerStatus;
  targetOutputs: readonly RequestedOutputId[];
  unsupportedOutputs: readonly RequestedOutputId[];
};

export type PersonalUseMvpCoverageSprintGateBVExactSourceHookProbe = {
  acceptedAsFuturePrecedenceHook: boolean;
  exactSourcePrecedenceRuntimeOwnerOwned: false;
  hookReadyAfterCurveScaffold: boolean;
  id: string;
  measuredValuesIngested: false;
  metricId: Extract<RequestedOutputId, "AIIC" | "IIC">;
  missingOwners: readonly string[];
  reason: string;
  runtimePromotionAllowedAtGateBV: false;
  sourceBasis: "ASTM E413" | "ASTM E989" | "ISO 717-2";
  sourceDocumentIngested: false;
  sourceOwnsAstmImpactRatingBasis: boolean;
  trueAssemblyMatch: boolean;
};

export type PersonalUseMvpCoverageSprintGateBWLaneId =
  | "astm_iic_aiic_contour_rating_owner"
  | "astm_iic_aiic_surface_parity"
  | "broad_astm_source_crawl"
  | "exact_astm_source_precedence_runtime"
  | "iso_impact_adapter_reuse";

export type PersonalUseMvpCoverageSprintGateBWLaneCandidate = {
  broadSourceCrawl: boolean;
  id: PersonalUseMvpCoverageSprintGateBWLaneId;
  reason: string;
  runtimeMovementAllowedAtGateBV: false;
  score: number;
  selected: boolean;
  sourceRowsRequiredForSelection: boolean;
};

export type PersonalUseMvpCoverageSprintGateBVContract = {
  astmRuntimePromoted: false;
  bridgeFixturesUsedAsRuntimeEvidence: false;
  contourRatingProcedureOwned: false;
  curveOwnerProbes: readonly PersonalUseMvpCoverageSprintGateBVCurveOwnerProbe[];
  exactSourceHookProbes: readonly PersonalUseMvpCoverageSprintGateBVExactSourceHookProbe[];
  fieldAiicCurveScaffoldReady: true;
  isoImpactAliasesRejected: true;
  labIicCurveScaffoldReady: true;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_LANDED_GATE;
  noRuntimeValueMovement: true;
  previousGateBU: {
    landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_LANDED_GATE;
    selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_FILE;
    selectedNextLabel: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_LABEL;
    selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTION_STATUS;
  };
  ratingAdaptersAfterGateBV: readonly RatingAdapterBasis[];
  remainingRuntimeBlockers: {
    aiic: readonly string[];
    iic: readonly string[];
  };
  selectedImplementationSlice:
    "personal_use_mvp_coverage_sprint_after_gate_bu_floor_impact_astm_iic_aiic_rating_curve_owner_scaffold";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_LABEL;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
};

const GATE_BW_LANE_CANDIDATES = [
  {
    broadSourceCrawl: false,
    id: "astm_iic_aiic_contour_rating_owner",
    reason:
      "Gate BV owns curve completeness, so the next blocker is the executable ASTM E989 contour/rating procedure before any IIC or AIIC value can promote.",
    runtimeMovementAllowedAtGateBV: false,
    score: 3.9,
    selected: true,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "exact_astm_source_precedence_runtime",
    reason:
      "Exact ASTM source rows should stay first later, but exact precedence still needs the same contour-rating owner before runtime promotion.",
    runtimeMovementAllowedAtGateBV: false,
    score: 2.5,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "astm_iic_aiic_surface_parity",
    reason:
      "Surface parity should follow an executable rating result so UI and reports do not display curve probes as calculator values.",
    runtimeMovementAllowedAtGateBV: false,
    score: 1.8,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "iso_impact_adapter_reuse",
    reason: "ISO impact adapters remain non-aliasable and cannot supply ASTM E989 contour ratings.",
    runtimeMovementAllowedAtGateBV: false,
    score: 0.2,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: true,
    id: "broad_astm_source_crawl",
    reason:
      "Broad ASTM source crawling can add future exact rows but cannot replace the source-absent contour rating owner needed by the calculator.",
    runtimeMovementAllowedAtGateBV: false,
    score: 0.1,
    selected: false,
    sourceRowsRequiredForSelection: true
  }
] as const satisfies readonly PersonalUseMvpCoverageSprintGateBWLaneCandidate[];

function summarizeBandCompleteness(bands: readonly PersonalUseMvpCoverageSprintGateBVAstmCurveBand[]) {
  const expected = new Set<number>(GATE_BV_ASTM_IMPACT_ONE_THIRD_OCTAVE_BAND_CENTERS_HZ);
  const counts = new Map<number, number>();

  for (const band of bands) {
    counts.set(band.centerHz, (counts.get(band.centerHz) ?? 0) + 1);
  }

  const providedBandCentersHz = [...counts.keys()].sort((a, b) => a - b);
  const missingBandCentersHz = GATE_BV_ASTM_IMPACT_ONE_THIRD_OCTAVE_BAND_CENTERS_HZ.filter(
    (band) => !counts.has(band)
  );
  const extraBandCentersHz = providedBandCentersHz.filter((band) => !expected.has(band));
  const duplicateBandCentersHz = [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([band]) => band)
    .sort((a, b) => a - b);
  const nonFiniteBandCentersHz = bands
    .filter((band) => !Number.isFinite(band.levelDb))
    .map((band) => band.centerHz)
    .sort((a, b) => a - b);

  return {
    complete:
      missingBandCentersHz.length === 0 &&
      extraBandCentersHz.length === 0 &&
      duplicateBandCentersHz.length === 0 &&
      nonFiniteBandCentersHz.length === 0,
    duplicateBandCentersHz,
    extraBandCentersHz,
    missingBandCentersHz,
    nonFiniteBandCentersHz,
    providedBandCentersHz
  };
}

function buildCompleteCurve(baseLevelDb: number): readonly PersonalUseMvpCoverageSprintGateBVAstmCurveBand[] {
  return GATE_BV_ASTM_IMPACT_ONE_THIRD_OCTAVE_BAND_CENTERS_HZ.map((centerHz, index) => ({
    centerHz,
    levelDb: baseLevelDb - index * 0.7
  }));
}

function curveProbe(input: {
  bandSetId: PersonalUseMvpCoverageSprintGateBVCurveOwnerProbe["bandSetId"];
  bands: readonly PersonalUseMvpCoverageSprintGateBVAstmCurveBand[];
  curveStandard: PersonalUseMvpCoverageSprintGateBVCurveOwnerProbe["curveStandard"];
  fieldContextOwned: boolean;
  id: string;
  metricId: Extract<RequestedOutputId, "AIIC" | "IIC"> | "IIC+AIIC";
  ratingStandard: PersonalUseMvpCoverageSprintGateBVCurveOwnerProbe["ratingStandard"];
  requestBasis: PersonalUseMvpCoverageSprintGateBVCurveOwnerProbe["requestBasis"];
  targetOutputs: readonly RequestedOutputId[];
}): PersonalUseMvpCoverageSprintGateBVCurveOwnerProbe {
  const summary = summarizeBandCompleteness(input.bands);
  const isAlias =
    input.requestBasis === "building_prediction_alias" ||
    input.requestBasis === "iso_field_impact_alias" ||
    input.requestBasis === "iso_lab_impact_alias";
  const isIic = input.metricId === "IIC";
  const missingCurveOwner = isIic
    ? "astmE492NormalizedImpactLevelCurveOwner"
    : "astmE1007ApparentImpactFieldCurveOwner";
  const ratingBlockers = isIic
    ? GATE_BV_LAB_IIC_REMAINING_RUNTIME_BLOCKERS
    : GATE_BV_FIELD_AIIC_REMAINING_RUNTIME_BLOCKERS;

  if (isAlias) {
    return {
      bandSetId: input.bandSetId,
      blockedOutputs: input.targetOutputs,
      curveStandard: input.curveStandard,
      duplicateBandCentersHz: summary.duplicateBandCentersHz,
      extraBandCentersHz: summary.extraBandCentersHz,
      fieldContextOwned: input.fieldContextOwned,
      id: input.id,
      missingBandCentersHz: summary.missingBandCentersHz,
      missingOwners: [],
      nonFiniteBandCentersHz: summary.nonFiniteBandCentersHz,
      providedBandCentersHz: summary.providedBandCentersHz,
      ratingCurveScaffoldReady: false,
      ratingProcedureExecutable: false,
      ratingStandard: input.ratingStandard,
      reason: "This request is not an ASTM E989 impact curve and must stay outside IIC/AIIC.",
      requestBasis: input.requestBasis,
      requiredBandCentersHz: GATE_BV_ASTM_IMPACT_ONE_THIRD_OCTAVE_BAND_CENTERS_HZ,
      runtimePromotionAllowedAtGateBV: false,
      status: "blocked_basis_alias",
      targetOutputs: input.targetOutputs,
      unsupportedOutputs: input.targetOutputs
    };
  }

  if (!summary.complete) {
    return {
      bandSetId: input.bandSetId,
      blockedOutputs: [],
      curveStandard: input.curveStandard,
      duplicateBandCentersHz: summary.duplicateBandCentersHz,
      extraBandCentersHz: summary.extraBandCentersHz,
      fieldContextOwned: input.fieldContextOwned,
      id: input.id,
      missingBandCentersHz: summary.missingBandCentersHz,
      missingOwners: [missingCurveOwner],
      nonFiniteBandCentersHz: summary.nonFiniteBandCentersHz,
      providedBandCentersHz: summary.providedBandCentersHz,
      ratingCurveScaffoldReady: false,
      ratingProcedureExecutable: false,
      ratingStandard: input.ratingStandard,
      reason: "ASTM IIC/AIIC curve ownership needs one finite level for every declared band center.",
      requestBasis: input.requestBasis,
      requiredBandCentersHz: GATE_BV_ASTM_IMPACT_ONE_THIRD_OCTAVE_BAND_CENTERS_HZ,
      runtimePromotionAllowedAtGateBV: false,
      status: "needs_curve_input",
      targetOutputs: input.targetOutputs,
      unsupportedOutputs: input.targetOutputs
    };
  }

  if (!isIic && !input.fieldContextOwned) {
    return {
      bandSetId: input.bandSetId,
      blockedOutputs: [],
      curveStandard: input.curveStandard,
      duplicateBandCentersHz: summary.duplicateBandCentersHz,
      extraBandCentersHz: summary.extraBandCentersHz,
      fieldContextOwned: input.fieldContextOwned,
      id: input.id,
      missingBandCentersHz: summary.missingBandCentersHz,
      missingOwners: ["astmAiicFieldContextOwner"],
      nonFiniteBandCentersHz: summary.nonFiniteBandCentersHz,
      providedBandCentersHz: summary.providedBandCentersHz,
      ratingCurveScaffoldReady: false,
      ratingProcedureExecutable: false,
      ratingStandard: input.ratingStandard,
      reason: "A complete field curve still needs AIIC field-context ownership before it can feed a rating.",
      requestBasis: input.requestBasis,
      requiredBandCentersHz: GATE_BV_ASTM_IMPACT_ONE_THIRD_OCTAVE_BAND_CENTERS_HZ,
      runtimePromotionAllowedAtGateBV: false,
      status: "needs_field_context",
      targetOutputs: input.targetOutputs,
      unsupportedOutputs: input.targetOutputs
    };
  }

  return {
    bandSetId: input.bandSetId,
    blockedOutputs: [],
    curveStandard: input.curveStandard,
    duplicateBandCentersHz: summary.duplicateBandCentersHz,
    extraBandCentersHz: summary.extraBandCentersHz,
    fieldContextOwned: input.fieldContextOwned,
    id: input.id,
    missingBandCentersHz: summary.missingBandCentersHz,
    missingOwners: ratingBlockers,
    nonFiniteBandCentersHz: summary.nonFiniteBandCentersHz,
    providedBandCentersHz: summary.providedBandCentersHz,
    ratingCurveScaffoldReady: true,
    ratingProcedureExecutable: false,
    ratingStandard: input.ratingStandard,
    reason:
      "The ASTM impact curve scaffold is complete, but Gate BV still has no executable ASTM E989 contour/rating owner.",
    requestBasis: input.requestBasis,
    requiredBandCentersHz: GATE_BV_ASTM_IMPACT_ONE_THIRD_OCTAVE_BAND_CENTERS_HZ,
    runtimePromotionAllowedAtGateBV: false,
    status: "curve_owner_ready_rating_owner_missing",
    targetOutputs: input.targetOutputs,
    unsupportedOutputs: input.targetOutputs
  };
}

export function buildPersonalUseMvpCoverageSprintGateBVCurveOwnerProbes():
  readonly PersonalUseMvpCoverageSprintGateBVCurveOwnerProbe[] {
  return [
    curveProbe({
      bandSetId: "astm_e492_e989_declared_one_third_octave_100_3150_hz",
      bands: buildCompleteCurve(78),
      curveStandard: "ASTM E492",
      fieldContextOwned: false,
      id: "gate_bv_complete_lab_iic_curve_scaffold_ready_rating_owner_missing",
      metricId: "IIC",
      ratingStandard: "ASTM E989",
      requestBasis: "astm_lab_iic_normalized_curve",
      targetOutputs: ASTM_IIC_OUTPUTS
    }),
    curveProbe({
      bandSetId: "astm_e1007_e989_declared_one_third_octave_100_3150_hz",
      bands: buildCompleteCurve(74),
      curveStandard: "ASTM E1007",
      fieldContextOwned: true,
      id: "gate_bv_complete_field_aiic_curve_scaffold_ready_rating_owner_missing",
      metricId: "AIIC",
      ratingStandard: "ASTM E989",
      requestBasis: "astm_field_aiic_apparent_curve",
      targetOutputs: ASTM_AIIC_OUTPUTS
    }),
    curveProbe({
      bandSetId: "astm_e492_e989_declared_one_third_octave_100_3150_hz",
      bands: buildCompleteCurve(78).slice(0, -1),
      curveStandard: "ASTM E492",
      fieldContextOwned: false,
      id: "gate_bv_partial_lab_iic_curve_missing_declared_band",
      metricId: "IIC",
      ratingStandard: "ASTM E989",
      requestBasis: "astm_lab_iic_normalized_curve",
      targetOutputs: ASTM_IIC_OUTPUTS
    }),
    curveProbe({
      bandSetId: "astm_e1007_e989_declared_one_third_octave_100_3150_hz",
      bands: buildCompleteCurve(74),
      curveStandard: "ASTM E1007",
      fieldContextOwned: false,
      id: "gate_bv_complete_field_aiic_curve_missing_field_context",
      metricId: "AIIC",
      ratingStandard: "ASTM E989",
      requestBasis: "astm_field_aiic_apparent_curve",
      targetOutputs: ASTM_AIIC_OUTPUTS
    }),
    curveProbe({
      bandSetId: "not_astm_impact_curve",
      bands: [],
      curveStandard: "not_astm_impact_curve",
      fieldContextOwned: false,
      id: "gate_bv_iso_lnw_delta_lw_curve_alias_rejected_for_iic",
      metricId: "IIC",
      ratingStandard: "not_astm_impact_rating",
      requestBasis: "iso_lab_impact_alias",
      targetOutputs: ASTM_IIC_OUTPUTS
    }),
    curveProbe({
      bandSetId: "not_astm_impact_curve",
      bands: [],
      curveStandard: "not_astm_impact_curve",
      fieldContextOwned: false,
      id: "gate_bv_building_prediction_curve_alias_rejected_for_iic_aiic",
      metricId: "IIC+AIIC",
      ratingStandard: "not_astm_impact_rating",
      requestBasis: "building_prediction_alias",
      targetOutputs: ASTM_IMPACT_OUTPUTS
    })
  ];
}

export function buildPersonalUseMvpCoverageSprintGateBVExactSourceHookProbes():
  readonly PersonalUseMvpCoverageSprintGateBVExactSourceHookProbe[] {
  return [
    {
      acceptedAsFuturePrecedenceHook: true,
      exactSourcePrecedenceRuntimeOwnerOwned: false,
      hookReadyAfterCurveScaffold: true,
      id: "future_exact_astm_iic_true_match_hook_ready_after_curve_scaffold",
      measuredValuesIngested: false,
      metricId: "IIC",
      missingOwners: [
        "exactAstmSourcePrecedenceRuntimeOwner",
        "astmE989ExecutableIicContourRatingProcedureOwner",
        "astmIicVisibleSurfaceParityOwner"
      ],
      reason:
        "A future true-match ASTM E989 lab IIC row can attach to the curve scaffold, but Gate BV still does not promote exact-source runtime.",
      runtimePromotionAllowedAtGateBV: false,
      sourceBasis: "ASTM E989",
      sourceDocumentIngested: false,
      sourceOwnsAstmImpactRatingBasis: true,
      trueAssemblyMatch: true
    },
    {
      acceptedAsFuturePrecedenceHook: true,
      exactSourcePrecedenceRuntimeOwnerOwned: false,
      hookReadyAfterCurveScaffold: true,
      id: "future_exact_astm_aiic_true_match_hook_ready_after_curve_scaffold",
      measuredValuesIngested: false,
      metricId: "AIIC",
      missingOwners: [
        "exactAstmSourcePrecedenceRuntimeOwner",
        "astmE989ExecutableAiicApparentRatingProcedureOwner",
        "astmAiicVisibleSurfaceParityOwner"
      ],
      reason:
        "A future true-match ASTM E989 field AIIC row can attach to the curve scaffold, but Gate BV still does not promote exact-source runtime.",
      runtimePromotionAllowedAtGateBV: false,
      sourceBasis: "ASTM E989",
      sourceDocumentIngested: false,
      sourceOwnsAstmImpactRatingBasis: true,
      trueAssemblyMatch: true
    },
    {
      acceptedAsFuturePrecedenceHook: false,
      exactSourcePrecedenceRuntimeOwnerOwned: false,
      hookReadyAfterCurveScaffold: false,
      id: "iso_717_2_exact_impact_row_rejected_for_astm_curve_hook",
      measuredValuesIngested: false,
      metricId: "IIC",
      missingOwners: [],
      reason: "An ISO 717-2 exact impact row is not an ASTM E989 curve or rating hook.",
      runtimePromotionAllowedAtGateBV: false,
      sourceBasis: "ISO 717-2",
      sourceDocumentIngested: false,
      sourceOwnsAstmImpactRatingBasis: false,
      trueAssemblyMatch: true
    },
    {
      acceptedAsFuturePrecedenceHook: false,
      exactSourcePrecedenceRuntimeOwnerOwned: false,
      hookReadyAfterCurveScaffold: false,
      id: "astm_e413_airborne_source_rejected_for_astm_curve_hook",
      measuredValuesIngested: false,
      metricId: "IIC",
      missingOwners: [],
      reason: "An ASTM E413/STC source row is airborne evidence and cannot become an ASTM E989 impact hook.",
      runtimePromotionAllowedAtGateBV: false,
      sourceBasis: "ASTM E413",
      sourceDocumentIngested: false,
      sourceOwnsAstmImpactRatingBasis: false,
      trueAssemblyMatch: true
    }
  ];
}

export function buildPersonalUseMvpCoverageSprintGateBVAstmRatingAdapterBasisSet():
  readonly RatingAdapterBasis[] {
  return [
    RatingAdapterBasisSchema.parse({
      adapterId: "astm_e989_iic_from_impact_level_curve",
      aliasBlocks: [
        {
          fromMetricId: "Ln,w",
          reason: "ISO 717-2 Ln,w cannot be copied into ASTM E989 IIC.",
          toMetricId: "IIC"
        },
        {
          fromMetricId: "DeltaLw",
          reason: "ISO 717-2 DeltaLw cannot be copied into ASTM E989 IIC.",
          toMetricId: "IIC"
        }
      ],
      blockedReasons: [...GATE_BV_LAB_IIC_REMAINING_RUNTIME_BLOCKERS],
      contextBasis: "element_lab",
      implementationStatus: "planned_not_implemented",
      inputBasis: "impact_level_curve",
      metricFamily: "impact",
      metricId: "IIC",
      notes: [
        "Gate BV owns the declared band-set completeness scaffold; Gate BW must own the ASTM E989 contour rating before runtime can promote."
      ],
      ratingStandard: "ASTM E989",
      requiredContextInputs: [
        "astmE492NormalizedImpactLevelCurve",
        "astmImpactOneThirdOctaveBandSet",
        "exactSourcePrecedenceCheck"
      ],
      sourceMetricIds: []
    }),
    RatingAdapterBasisSchema.parse({
      adapterId: "astm_e989_aiic_from_field_impact_curve",
      aliasBlocks: [
        {
          fromMetricId: "L'n,w",
          reason: "ISO 717-2 apparent impact ratings cannot be copied into ASTM E989 AIIC.",
          toMetricId: "AIIC"
        },
        {
          fromMetricId: "L'nT,w",
          reason: "ISO 717-2 standardized field impact ratings cannot be copied into ASTM E989 AIIC.",
          toMetricId: "AIIC"
        }
      ],
      blockedReasons: [...GATE_BV_FIELD_AIIC_REMAINING_RUNTIME_BLOCKERS],
      contextBasis: "field_measurement",
      implementationStatus: "planned_not_implemented",
      inputBasis: "impact_field_level_curve",
      metricFamily: "impact",
      metricId: "AIIC",
      notes: [
        "Gate BV owns the declared field curve completeness scaffold; Gate BW must own the ASTM E989 contour rating before runtime can promote."
      ],
      ratingStandard: "ASTM E989",
      requiredContextInputs: [
        "astmE1007ApparentImpactLevelCurve",
        "astmImpactOneThirdOctaveBandSet",
        "impactFieldContext",
        "partitionAreaM2",
        "receivingRoomVolumeM3",
        "receivingRoomRt60S"
      ],
      sourceMetricIds: []
    })
  ];
}

export function buildPersonalUseMvpCoverageSprintGateBVPreviousAdapterBlockers():
  readonly string[] {
  return buildPersonalUseMvpCoverageSprintGateBUAstmRatingAdapterBasisSet().flatMap(
    (adapter) => adapter.blockedReasons
  );
}

export function rankPersonalUseMvpCoverageSprintGateBWLanes():
  readonly PersonalUseMvpCoverageSprintGateBWLaneCandidate[] {
  return GATE_BW_LANE_CANDIDATES;
}

export function buildPersonalUseMvpCoverageSprintGateBVContract():
  PersonalUseMvpCoverageSprintGateBVContract {
  const gateBU = buildPersonalUseMvpCoverageSprintGateBUContract();

  if (gateBU.selectedNextAction !== PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_LANDED_GATE) {
    throw new Error("Gate BV can only land after Gate BU selects the ASTM rating curve owner scaffold.");
  }

  const curveProbes = buildPersonalUseMvpCoverageSprintGateBVCurveOwnerProbes();
  const labProbe = curveProbes.find(
    (probe) => probe.id === "gate_bv_complete_lab_iic_curve_scaffold_ready_rating_owner_missing"
  );
  const fieldProbe = curveProbes.find(
    (probe) => probe.id === "gate_bv_complete_field_aiic_curve_scaffold_ready_rating_owner_missing"
  );

  if (!labProbe?.ratingCurveScaffoldReady || !fieldProbe?.ratingCurveScaffoldReady) {
    throw new Error("Gate BV expected complete lab and field curve scaffold probes.");
  }

  return {
    astmRuntimePromoted: false,
    bridgeFixturesUsedAsRuntimeEvidence: false,
    contourRatingProcedureOwned: false,
    curveOwnerProbes: curveProbes,
    exactSourceHookProbes: buildPersonalUseMvpCoverageSprintGateBVExactSourceHookProbes(),
    fieldAiicCurveScaffoldReady: true,
    isoImpactAliasesRejected: true,
    labIicCurveScaffoldReady: true,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousGateBU: {
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_LANDED_GATE,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_FILE,
      selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_LABEL,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTION_STATUS
    },
    ratingAdaptersAfterGateBV: buildPersonalUseMvpCoverageSprintGateBVAstmRatingAdapterBasisSet(),
    remainingRuntimeBlockers: {
      aiic: GATE_BV_FIELD_AIIC_REMAINING_RUNTIME_BLOCKERS,
      iic: GATE_BV_LAB_IIC_REMAINING_RUNTIME_BLOCKERS
    },
    selectedImplementationSlice:
      "personal_use_mvp_coverage_sprint_after_gate_bu_floor_impact_astm_iic_aiic_rating_curve_owner_scaffold",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_FILE,
    selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_LABEL,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}
