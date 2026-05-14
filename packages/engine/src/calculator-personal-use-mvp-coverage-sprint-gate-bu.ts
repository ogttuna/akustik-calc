import { RatingAdapterBasisSchema, type RatingAdapterBasis, type RequestedOutputId } from "@dynecho/shared";

import {
  buildPersonalUseMvpCoverageSprintGateBTAstmRatingAdapterBasisSet,
  buildPersonalUseMvpCoverageSprintGateBTBridgeProbes,
  buildPersonalUseMvpCoverageSprintGateBTContract,
  buildPersonalUseMvpCoverageSprintGateBTCurrentRuntimeBoundary,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTION_STATUS,
  type PersonalUseMvpCoverageSprintGateBTBridgeProbe
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bt";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_LANDED_GATE =
  "gate_bu_personal_use_mvp_floor_impact_astm_iic_aiic_rating_procedure_and_exact_source_owner_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTION_STATUS =
  "gate_bu_personal_use_mvp_floor_impact_astm_iic_aiic_rating_procedure_exact_source_owner_closed_no_runtime_selected_rating_curve_owner_scaffold_gate_bv";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_ACTION =
  "gate_bv_personal_use_mvp_floor_impact_astm_iic_aiic_rating_curve_owner_scaffold_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bv-floor-impact-astm-iic-aiic-rating-curve-owner-scaffold-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_LABEL =
  "floor-impact ASTM IIC/AIIC rating curve owner scaffold";

const ASTM_IIC_OUTPUTS = ["IIC"] as const satisfies readonly RequestedOutputId[];
const ASTM_AIIC_OUTPUTS = ["AIIC"] as const satisfies readonly RequestedOutputId[];
const ASTM_IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const GATE_BU_LAB_IIC_RUNTIME_BLOCKERS = [
  "astmE492NormalizedImpactLevelCurveOwner",
  "astmE989ExecutableIicContourRatingProcedureOwner",
  "exactAstmSourcePrecedenceRuntimeOwner",
  "astmIicSourceAbsentUncertaintyOwner",
  "astmIicVisibleSurfaceParityOwner"
] as const;

const GATE_BU_FIELD_AIIC_RUNTIME_BLOCKERS = [
  "astmE1007ApparentImpactFieldCurveOwner",
  "astmE989ExecutableAiicApparentRatingProcedureOwner",
  "astmAiicFieldContextOwner",
  "exactAstmSourcePrecedenceRuntimeOwner",
  "astmAiicSourceAbsentUncertaintyOwner",
  "astmAiicVisibleSurfaceParityOwner"
] as const;

export type PersonalUseMvpCoverageSprintGateBUProbeStatus =
  | "blocked_basis_alias"
  | "exact_source_precedence_owner_missing"
  | "runtime_owner_missing";

export type PersonalUseMvpCoverageSprintGateBUOwnerProbe = {
  blockedOutputs: readonly RequestedOutputId[];
  exactAstmSourcePrecedenceOwned: false;
  id: string;
  metricId: Extract<RequestedOutputId, "AIIC" | "IIC"> | "IIC+AIIC";
  missingOwners: readonly string[];
  promotedOutputs: readonly RequestedOutputId[];
  ratingProcedureExecutable: false;
  reason: string;
  requestBasis:
    | "astm_field_aiic_bridge_payload"
    | "astm_lab_iic_bridge_payload"
    | "building_prediction_alias"
    | "iso_field_impact_alias"
    | "iso_lab_impact_alias";
  runtimePromotionAllowedAtGateBU: false;
  schemaBridgeReady: boolean;
  status: PersonalUseMvpCoverageSprintGateBUProbeStatus;
  targetOutputs: readonly RequestedOutputId[];
  unsupportedOutputs: readonly RequestedOutputId[];
};

export type PersonalUseMvpCoverageSprintGateBUExactSourceProbe = {
  acceptedAsFuturePrecedenceCandidate: boolean;
  exactSourcePrecedenceRuntimeOwnerOwned: false;
  id: string;
  metricId: Extract<RequestedOutputId, "AIIC" | "IIC">;
  missingOwners: readonly string[];
  reason: string;
  runtimePromotionAllowedAtGateBU: false;
  sourceBasis: "ASTM E413" | "ASTM E989" | "ISO 717-2";
  sourceOwnsSingleNumberRating: boolean;
  trueAssemblyMatch: boolean;
};

export type PersonalUseMvpCoverageSprintGateBVLaneId =
  | "astm_iic_aiic_rating_curve_owner_scaffold"
  | "astm_iic_aiic_surface_parity"
  | "broad_astm_source_crawl"
  | "exact_astm_source_precedence_runtime"
  | "iso_impact_adapter_reuse";

export type PersonalUseMvpCoverageSprintGateBVLaneCandidate = {
  broadSourceCrawl: boolean;
  id: PersonalUseMvpCoverageSprintGateBVLaneId;
  reason: string;
  runtimeMovementAllowedAtGateBU: false;
  score: number;
  selected: boolean;
  sourceRowsRequiredForSelection: boolean;
};

export type PersonalUseMvpCoverageSprintGateBUContract = {
  astmRuntimePromoted: false;
  bridgeFixturesUsedAsRuntimeEvidence: false;
  bridgeProbes: readonly PersonalUseMvpCoverageSprintGateBTBridgeProbe[];
  currentRuntimeStillUnsupported: {
    supportedTargetOutputs: readonly RequestedOutputId[];
    unsupportedTargetOutputs: readonly RequestedOutputId[];
  };
  exactAstmSourcePrecedenceRuntimeOwnerMissing: true;
  exactSourcePrecedenceProbes: readonly PersonalUseMvpCoverageSprintGateBUExactSourceProbe[];
  isoImpactAliasesRejected: true;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_LANDED_GATE;
  noRuntimeValueMovement: true;
  ownerProbes: readonly PersonalUseMvpCoverageSprintGateBUOwnerProbe[];
  previousGateBT: {
    landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_LANDED_GATE;
    selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_FILE;
    selectedNextLabel: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_LABEL;
    selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTION_STATUS;
  };
  ratingAdaptersAfterGateBU: readonly RatingAdapterBasis[];
  ratingProcedureRuntimeOwnerMissing: true;
  remainingRuntimeBlockers: {
    aiic: readonly string[];
    iic: readonly string[];
  };
  selectedImplementationSlice:
    "personal_use_mvp_coverage_sprint_after_gate_bt_floor_impact_astm_iic_aiic_rating_procedure_exact_source_owner";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_LABEL;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
};

const GATE_BV_LANE_CANDIDATES = [
  {
    broadSourceCrawl: false,
    id: "astm_iic_aiic_rating_curve_owner_scaffold",
    reason:
      "Gate BU proves the schema bridge is ready but the ASTM E989 rating owner still needs executable curve inputs before any runtime value can be honest.",
    runtimeMovementAllowedAtGateBU: false,
    score: 3.7,
    selected: true,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "exact_astm_source_precedence_runtime",
    reason:
      "Exact ASTM rows must win later, but exact-source precedence still needs the same ASTM basis and rating-owner boundary before runtime promotion.",
    runtimeMovementAllowedAtGateBU: false,
    score: 2.4,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "astm_iic_aiic_surface_parity",
    reason:
      "Surface parity should follow an executable rating owner so cards do not display Gate BT fixture values as runtime.",
    runtimeMovementAllowedAtGateBU: false,
    score: 1.7,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "iso_impact_adapter_reuse",
    reason:
      "ISO 717-2 impact ratings remain non-aliasable and cannot supply ASTM E989 ratings.",
    runtimeMovementAllowedAtGateBU: false,
    score: 0.2,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: true,
    id: "broad_astm_source_crawl",
    reason:
      "Broad ASTM source crawling can add future exact rows, but it cannot replace the source-absent rating-procedure owner needed by the calculator.",
    runtimeMovementAllowedAtGateBU: false,
    score: 0.1,
    selected: false,
    sourceRowsRequiredForSelection: true
  }
] as const satisfies readonly PersonalUseMvpCoverageSprintGateBVLaneCandidate[];

export function buildPersonalUseMvpCoverageSprintGateBUOwnerProbes():
  readonly PersonalUseMvpCoverageSprintGateBUOwnerProbe[] {
  return [
    {
      blockedOutputs: [],
      exactAstmSourcePrecedenceOwned: false,
      id: "gate_bu_lab_iic_bridge_ready_rating_procedure_missing",
      metricId: "IIC",
      missingOwners: GATE_BU_LAB_IIC_RUNTIME_BLOCKERS,
      promotedOutputs: [],
      ratingProcedureExecutable: false,
      reason:
        "Gate BT can carry a lab IIC metric, but Gate BU has no executable ASTM E989 contour/rating procedure or exact-source precedence owner.",
      requestBasis: "astm_lab_iic_bridge_payload",
      runtimePromotionAllowedAtGateBU: false,
      schemaBridgeReady: true,
      status: "runtime_owner_missing",
      targetOutputs: ASTM_IIC_OUTPUTS,
      unsupportedOutputs: ASTM_IIC_OUTPUTS
    },
    {
      blockedOutputs: [],
      exactAstmSourcePrecedenceOwned: false,
      id: "gate_bu_field_aiic_bridge_ready_rating_procedure_missing",
      metricId: "AIIC",
      missingOwners: GATE_BU_FIELD_AIIC_RUNTIME_BLOCKERS,
      promotedOutputs: [],
      ratingProcedureExecutable: false,
      reason:
        "Gate BT can carry a field AIIC metric, but Gate BU has no executable ASTM E989 field rating procedure, field-context owner, or exact-source precedence owner.",
      requestBasis: "astm_field_aiic_bridge_payload",
      runtimePromotionAllowedAtGateBU: false,
      schemaBridgeReady: true,
      status: "runtime_owner_missing",
      targetOutputs: ASTM_AIIC_OUTPUTS,
      unsupportedOutputs: ASTM_AIIC_OUTPUTS
    },
    {
      blockedOutputs: ASTM_IIC_OUTPUTS,
      exactAstmSourcePrecedenceOwned: false,
      id: "gate_bu_iso_lnw_delta_lw_not_iic_rating_input",
      metricId: "IIC",
      missingOwners: [],
      promotedOutputs: [],
      ratingProcedureExecutable: false,
      reason: "ISO 717-2 Ln,w or DeltaLw values cannot be copied into ASTM E989 IIC.",
      requestBasis: "iso_lab_impact_alias",
      runtimePromotionAllowedAtGateBU: false,
      schemaBridgeReady: false,
      status: "blocked_basis_alias",
      targetOutputs: ASTM_IIC_OUTPUTS,
      unsupportedOutputs: ASTM_IIC_OUTPUTS
    },
    {
      blockedOutputs: ASTM_AIIC_OUTPUTS,
      exactAstmSourcePrecedenceOwned: false,
      id: "gate_bu_iso_field_lprime_not_aiic_rating_input",
      metricId: "AIIC",
      missingOwners: [],
      promotedOutputs: [],
      ratingProcedureExecutable: false,
      reason: "ISO 717-2 field L'n,w or L'nT,w values cannot be copied into ASTM E989 AIIC.",
      requestBasis: "iso_field_impact_alias",
      runtimePromotionAllowedAtGateBU: false,
      schemaBridgeReady: false,
      status: "blocked_basis_alias",
      targetOutputs: ASTM_AIIC_OUTPUTS,
      unsupportedOutputs: ASTM_AIIC_OUTPUTS
    },
    {
      blockedOutputs: ASTM_IMPACT_OUTPUTS,
      exactAstmSourcePrecedenceOwned: false,
      id: "gate_bu_building_prediction_not_astm_iic_aiic_rating_input",
      metricId: "IIC+AIIC",
      missingOwners: [],
      promotedOutputs: [],
      ratingProcedureExecutable: false,
      reason: "Building-prediction impact outputs require their own basis and cannot become ASTM IIC or AIIC.",
      requestBasis: "building_prediction_alias",
      runtimePromotionAllowedAtGateBU: false,
      schemaBridgeReady: false,
      status: "blocked_basis_alias",
      targetOutputs: ASTM_IMPACT_OUTPUTS,
      unsupportedOutputs: ASTM_IMPACT_OUTPUTS
    }
  ];
}

export function buildPersonalUseMvpCoverageSprintGateBUExactSourcePrecedenceProbes():
  readonly PersonalUseMvpCoverageSprintGateBUExactSourceProbe[] {
  return [
    {
      acceptedAsFuturePrecedenceCandidate: true,
      exactSourcePrecedenceRuntimeOwnerOwned: false,
      id: "future_exact_astm_iic_true_match_waits_for_precedence_owner",
      metricId: "IIC",
      missingOwners: [
        "exactAstmSourcePrecedenceRuntimeOwner",
        "astmE989ExecutableIicContourRatingProcedureOwner",
        "astmIicVisibleSurfaceParityOwner"
      ],
      reason:
        "A future true-match ASTM E989 lab IIC row can become an exact precedence candidate, but Gate BU does not promote it without the precedence owner.",
      runtimePromotionAllowedAtGateBU: false,
      sourceBasis: "ASTM E989",
      sourceOwnsSingleNumberRating: true,
      trueAssemblyMatch: true
    },
    {
      acceptedAsFuturePrecedenceCandidate: true,
      exactSourcePrecedenceRuntimeOwnerOwned: false,
      id: "future_exact_astm_aiic_true_match_waits_for_precedence_owner",
      metricId: "AIIC",
      missingOwners: [
        "exactAstmSourcePrecedenceRuntimeOwner",
        "astmE989ExecutableAiicApparentRatingProcedureOwner",
        "astmAiicVisibleSurfaceParityOwner"
      ],
      reason:
        "A future true-match ASTM E989 field AIIC row can become an exact precedence candidate, but Gate BU does not promote it without the precedence owner.",
      runtimePromotionAllowedAtGateBU: false,
      sourceBasis: "ASTM E989",
      sourceOwnsSingleNumberRating: true,
      trueAssemblyMatch: true
    },
    {
      acceptedAsFuturePrecedenceCandidate: false,
      exactSourcePrecedenceRuntimeOwnerOwned: false,
      id: "iso_717_2_exact_impact_row_rejected_for_astm_iic",
      metricId: "IIC",
      missingOwners: [],
      reason: "An ISO 717-2 exact Ln,w or DeltaLw row is not an ASTM E989 single-number rating.",
      runtimePromotionAllowedAtGateBU: false,
      sourceBasis: "ISO 717-2",
      sourceOwnsSingleNumberRating: false,
      trueAssemblyMatch: true
    },
    {
      acceptedAsFuturePrecedenceCandidate: false,
      exactSourcePrecedenceRuntimeOwnerOwned: false,
      id: "astm_e413_airborne_source_rejected_for_astm_iic",
      metricId: "IIC",
      missingOwners: [],
      reason: "An ASTM E413/STC source row is airborne evidence and cannot promote an ASTM E989 impact rating.",
      runtimePromotionAllowedAtGateBU: false,
      sourceBasis: "ASTM E413",
      sourceOwnsSingleNumberRating: true,
      trueAssemblyMatch: true
    }
  ];
}

export function buildPersonalUseMvpCoverageSprintGateBUAstmRatingAdapterBasisSet():
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
      blockedReasons: [...GATE_BU_LAB_IIC_RUNTIME_BLOCKERS],
      contextBasis: "element_lab",
      implementationStatus: "planned_not_implemented",
      inputBasis: "impact_level_curve",
      metricFamily: "impact",
      metricId: "IIC",
      notes: [
        "Gate BT schema bridge is ready; Gate BU keeps runtime closed until ASTM E989 contour rating is executable."
      ],
      ratingStandard: "ASTM E989",
      requiredContextInputs: ["frequencyBandSet", "exactSourcePrecedenceCheck"],
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
      blockedReasons: [...GATE_BU_FIELD_AIIC_RUNTIME_BLOCKERS],
      contextBasis: "field_measurement",
      implementationStatus: "planned_not_implemented",
      inputBasis: "impact_field_level_curve",
      metricFamily: "impact",
      metricId: "AIIC",
      notes: [
        "Gate BT schema bridge is ready; Gate BU keeps runtime closed until ASTM E989 field AIIC rating is executable."
      ],
      ratingStandard: "ASTM E989",
      requiredContextInputs: [
        "impactFieldContext",
        "partitionAreaM2",
        "receivingRoomVolumeM3",
        "receivingRoomRt60S"
      ],
      sourceMetricIds: []
    })
  ];
}

export function rankPersonalUseMvpCoverageSprintGateBVLanes():
  readonly PersonalUseMvpCoverageSprintGateBVLaneCandidate[] {
  return GATE_BV_LANE_CANDIDATES;
}

export function buildPersonalUseMvpCoverageSprintGateBUContract():
  PersonalUseMvpCoverageSprintGateBUContract {
  const gateBT = buildPersonalUseMvpCoverageSprintGateBTContract();

  if (gateBT.selectedNextAction !== PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_LANDED_GATE) {
    throw new Error("Gate BU can only land after Gate BT selects the ASTM rating procedure owner.");
  }

  return {
    astmRuntimePromoted: false,
    bridgeFixturesUsedAsRuntimeEvidence: false,
    bridgeProbes: buildPersonalUseMvpCoverageSprintGateBTBridgeProbes(),
    currentRuntimeStillUnsupported: buildPersonalUseMvpCoverageSprintGateBTCurrentRuntimeBoundary(),
    exactAstmSourcePrecedenceRuntimeOwnerMissing: true,
    exactSourcePrecedenceProbes: buildPersonalUseMvpCoverageSprintGateBUExactSourcePrecedenceProbes(),
    isoImpactAliasesRejected: true,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_LANDED_GATE,
    noRuntimeValueMovement: true,
    ownerProbes: buildPersonalUseMvpCoverageSprintGateBUOwnerProbes(),
    previousGateBT: {
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_LANDED_GATE,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_FILE,
      selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_LABEL,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTION_STATUS
    },
    ratingAdaptersAfterGateBU: buildPersonalUseMvpCoverageSprintGateBUAstmRatingAdapterBasisSet(),
    ratingProcedureRuntimeOwnerMissing: true,
    remainingRuntimeBlockers: {
      aiic: GATE_BU_FIELD_AIIC_RUNTIME_BLOCKERS,
      iic: GATE_BU_LAB_IIC_RUNTIME_BLOCKERS
    },
    selectedImplementationSlice:
      "personal_use_mvp_coverage_sprint_after_gate_bt_floor_impact_astm_iic_aiic_rating_procedure_exact_source_owner",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_FILE,
    selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_LABEL,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}

export function buildPersonalUseMvpCoverageSprintGateBUPreviousAdapterBlockers():
  readonly string[] {
  return buildPersonalUseMvpCoverageSprintGateBTAstmRatingAdapterBasisSet().flatMap(
    (adapter) => adapter.blockedReasons
  );
}
