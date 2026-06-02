import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { BoundFloorSystem, ExactFloorSystem, FloorSystemMatchCriteria } from "@dynecho/shared";

import {
  BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTION_STATUS
} from "./broad-accuracy-open-box-timber-post-eps-screed-hybrid-matrix-refresh";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_LANDED_GATE =
  "broad_accuracy_floor_open_web_raw_bare_carrier_owner_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTION_STATUS =
  "broad_accuracy_floor_open_web_raw_bare_carrier_owner_landed_no_runtime_selected_formula_corridor";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_web_raw_bare_formula_corridor_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-formula-corridor-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_LABEL =
  "floor open-web raw-bare formula corridor";

export type BroadAccuracyFloorOpenWebRawBareOwnerTermId =
  | "airborne_screening_replacement_owner"
  | "bare_impact_curve_owner"
  | "bare_reference_surface_owner"
  | "basis_boundary_owner"
  | "carrier_geometry_owner"
  | "direct_fixed_negative_boundary_owner"
  | "exact_source_precedence_owner"
  | "hostile_topology_owner"
  | "open_web_support_form_owner"
  | "package_evidence_exclusion_owner"
  | "source_absent_budget_owner"
  | "suspended_ceiling_negative_boundary_owner";

export type BroadAccuracyFloorOpenWebRawBareOwnerTerm = {
  readonly id: BroadAccuracyFloorOpenWebRawBareOwnerTermId;
  readonly requiredPhysicalFields: readonly string[];
  readonly runtimeRole: string;
  readonly status: "owned_for_formula_corridor" | "owned_for_negative_boundary" | "runtime_blocked_until_formula_corridor";
};

export type BroadAccuracyFloorOpenWebRawBareEvidenceInventory = {
  readonly allRowsHaveCeilingOrDeckPackage: true;
  readonly boundRows: number;
  readonly carrierOnlyRows: 0;
  readonly deckMaterial: "inex_floor_panel";
  readonly exactRows: number;
  readonly familyIds: readonly ["fl23", "fl24", "fl25", "fl26", "fl27", "fl28", "fl33"];
  readonly lowerTreatmentCounts: {
    readonly directFixedCeiling: number;
    readonly packagedNoLowerTreatmentOwner: number;
    readonly suspendedCeilingElasticHanger: number;
  };
  readonly sourceLabel: "UBIQ official system table PDF";
  readonly supportDepthsMm: readonly [200, 300, 400];
  readonly supportMaterial: "open_web_steel_floor";
  readonly totalRows: number;
};

export type BroadAccuracyFloorOpenWebRawBareProbeId =
  | "raw_open_web_300"
  | "raw_open_web_safe_split_150_150"
  | "open_web_inex_deck_only"
  | "open_web_lower_only_packaged_system";

export type BroadAccuracyFloorOpenWebRawBareProbePosture = {
  readonly id: BroadAccuracyFloorOpenWebRawBareProbeId;
  readonly expectedCurrentAirborneBasis: "screening_mass_law_curve_seed_v3" | "predictor_floor_system_family_general_estimate";
  readonly expectedCurrentImpactBasis: null | "predictor_floor_system_family_general_estimate";
  readonly expectedCurrentRw: number;
  readonly expectedImpactAdmission: "blocked_partial_package" | "blocked_raw_bare" | "packaged_lane_only";
  readonly rawBareRuntimeAdmission: false;
};

export type BroadAccuracyFloorOpenWebRawBareCarrierOwnerContract = {
  readonly basisAliasBlocked: {
    readonly astmIicAiic: true;
    readonly buildingPrediction: true;
    readonly fieldImpact: true;
    readonly labAirborneFieldAliases: true;
  };
  readonly evidenceInventory: BroadAccuracyFloorOpenWebRawBareEvidenceInventory;
  readonly exactRowsStayFirst: true;
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_LANDED_GATE;
  readonly negativeBoundaries: readonly string[];
  readonly noRuntimeValueMovement: true;
  readonly ownerTerms: readonly BroadAccuracyFloorOpenWebRawBareOwnerTerm[];
  readonly previousMatrixRefresh: {
    readonly landedGate: typeof BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTION_STATUS;
  };
  readonly rawBareProbePosture: readonly BroadAccuracyFloorOpenWebRawBareProbePosture[];
  readonly runtimePromotionAllowedInGate: false;
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTION_STATUS;
};

const PACKAGE_ROLE_KEYS = [
  "floorCovering",
  "resilientLayer",
  "upperFill",
  "floatingScreed",
  "ceilingCavity",
  "ceilingFill",
  "ceilingBoard"
] as const satisfies readonly (keyof FloorSystemMatchCriteria)[];

const OWNER_TERMS = [
  {
    id: "open_web_support_form_owner",
    requiredPhysicalFields: [
      "supportFamily=lightweight_steel",
      "supportForm=open_web_or_rolled",
      "supportMaterial=open_web_steel_floor",
      "carrierDepthMm",
      "carrierSpacingMm",
      "carrierGaugeOrMassKgM2"
    ],
    runtimeRole: "separate raw open-web steel carriers from open-box timber and generic lightweight-steel fallback",
    status: "owned_for_formula_corridor"
  },
  {
    id: "carrier_geometry_owner",
    requiredPhysicalFields: [
      "webDepthMm",
      "chordWidthMm",
      "openWebVoidRatio",
      "joistSpacingMm",
      "spanClass",
      "bareCarrierSurfaceMassKgM2"
    ],
    runtimeRole: "own the structural mobility inputs before any bare open-web Ln,w prediction can run",
    status: "runtime_blocked_until_formula_corridor"
  },
  {
    id: "bare_reference_surface_owner",
    requiredPhysicalFields: [
      "deckAbsenceOrExplicitBareWalkingSurface",
      "inexDeckAbsence=true",
      "floorCoveringAbsence=true",
      "floatingScreedAbsence=true",
      "ceilingBoardAbsence=true"
    ],
    runtimeRole: "prove the stack is truly raw bare instead of a stripped UBIQ package row",
    status: "owned_for_formula_corridor"
  },
  {
    id: "bare_impact_curve_owner",
    requiredPhysicalFields: [
      "bareOpenWebNormalizedImpactCurve",
      "bareSteelReferenceSurfaceClass",
      "structuralMobilityModel",
      "impactRadiationEfficiency",
      "iso717ImpactRatingAdapter"
    ],
    runtimeRole: "own raw-bare open-web Ln,w/CI/Ln,w+CI physics before supported impact outputs can open",
    status: "runtime_blocked_until_formula_corridor"
  },
  {
    id: "airborne_screening_replacement_owner",
    requiredPhysicalFields: [
      "bareOpenWebReductionIndexCurve",
      "criticalFrequencyHz",
      "modalDensityOrBendingStiffness",
      "radiationEfficiency",
      "iso717AirborneRatingAdapter"
    ],
    runtimeRole: "replace the current screening_mass_law_curve_seed_v3 Rw-only posture with a named family basis",
    status: "runtime_blocked_until_formula_corridor"
  },
  {
    id: "package_evidence_exclusion_owner",
    requiredPhysicalFields: [
      "noInexDeckPackage",
      "noFirestopBoardPackage",
      "noDirectFixedCeilingPackage",
      "noSuspendedCeilingPackage",
      "noSourceEquivalentPackageSchedule"
    ],
    runtimeRole: "keep UBIQ package rows from being treated as bare-carrier evidence",
    status: "owned_for_negative_boundary"
  },
  {
    id: "direct_fixed_negative_boundary_owner",
    requiredPhysicalFields: ["lowerTreatment.type=direct_fixed_ceiling", "deckPanel=INEX", "firestopBoardSchedule"],
    runtimeRole: "keep FL-23/FL-25/FL-27 direct-fixed rows in their package-transfer lane",
    status: "owned_for_negative_boundary"
  },
  {
    id: "suspended_ceiling_negative_boundary_owner",
    requiredPhysicalFields: ["lowerTreatment.type=suspended_ceiling_elastic_hanger", "cavityDepthMm", "hangerClass"],
    runtimeRole: "keep FL-24/FL-26/FL-28 suspended rows out of raw-bare carrier calibration",
    status: "owned_for_negative_boundary"
  },
  {
    id: "exact_source_precedence_owner",
    requiredPhysicalFields: ["sameStackExactSourceId", "metricBasis", "supportFamily"],
    runtimeRole: "ensure exact UBIQ package rows still win before any source-absent formula",
    status: "owned_for_negative_boundary"
  },
  {
    id: "source_absent_budget_owner",
    requiredPhysicalFields: [
      "RwToleranceBudgetOwner",
      "LnWToleranceBudgetOwner",
      "CIBudgetOwner",
      "LnWPlusCIBudgetOwner",
      "inputPrecisionBudgetOwner",
      "packageExclusionUncertaintyOwner"
    ],
    runtimeRole: "attach visible not-measured budgets to any source-absent raw open-web values",
    status: "runtime_blocked_until_formula_corridor"
  },
  {
    id: "basis_boundary_owner",
    requiredPhysicalFields: ["elementLabBasis", "fieldBasis", "buildingPredictionBasis", "astmIicAiicBasis"],
    runtimeRole: "block field/building and ASTM/IIC aliases until separate metric owners exist",
    status: "owned_for_negative_boundary"
  },
  {
    id: "hostile_topology_owner",
    requiredPhysicalFields: [
      "safeSplitEquivalencePolicy",
      "duplicateCarrierPolicy",
      "deckOnlyPackageBoundary",
      "lowerOnlyPackageBoundary",
      "rolelessInferencePolicy"
    ],
    runtimeRole: "keep safe carrier splits stable while refusing ambiguous or partial package ownership",
    status: "owned_for_negative_boundary"
  }
] as const satisfies readonly BroadAccuracyFloorOpenWebRawBareOwnerTerm[];

function hasAnyPackagedRole(match: FloorSystemMatchCriteria): boolean {
  return PACKAGE_ROLE_KEYS.some((role) => match[role] !== undefined);
}

function isOpenWebSystem(system: BoundFloorSystem | ExactFloorSystem): boolean {
  return (
    system.id.includes("_open_web_steel_") &&
    system.match.baseStructure?.materialIds?.includes("open_web_steel_floor") === true
  );
}

function getOpenWebRows(): readonly (BoundFloorSystem | ExactFloorSystem)[] {
  return [...EXACT_FLOOR_SYSTEMS, ...BOUND_FLOOR_SYSTEMS].filter(isOpenWebSystem);
}

function getEstimateMatch(system: BoundFloorSystem | ExactFloorSystem): ExactFloorSystem["estimateMatch"] {
  return "estimateMatch" in system ? system.estimateMatch : undefined;
}

function lowerTreatmentKey(system: BoundFloorSystem | ExactFloorSystem):
  | "directFixedCeiling"
  | "packagedNoLowerTreatmentOwner"
  | "suspendedCeilingElasticHanger" {
  const type = getEstimateMatch(system)?.lowerTreatment?.type;

  if (type === "direct_fixed_ceiling") {
    return "directFixedCeiling";
  }
  if (type === "suspended_ceiling_elastic_hanger") {
    return "suspendedCeilingElasticHanger";
  }

  return "packagedNoLowerTreatmentOwner";
}

export function buildBroadAccuracyFloorOpenWebRawBareEvidenceInventory():
  BroadAccuracyFloorOpenWebRawBareEvidenceInventory {
  const rows = getOpenWebRows();
  const exactRows = EXACT_FLOOR_SYSTEMS.filter(isOpenWebSystem);
  const boundRows = BOUND_FLOOR_SYSTEMS.filter(isOpenWebSystem);
  const lowerTreatmentCounts = rows.reduce(
    (counts, row) => {
      const key = lowerTreatmentKey(row);

      return { ...counts, [key]: counts[key] + 1 };
    },
    { directFixedCeiling: 0, packagedNoLowerTreatmentOwner: 0, suspendedCeilingElasticHanger: 0 }
  );

  return {
    allRowsHaveCeilingOrDeckPackage: rows.every(
      (row) =>
        hasAnyPackagedRole(row.match) &&
        row.match.floatingScreed?.materialIds?.includes("inex_floor_panel") === true &&
        row.match.ceilingBoard?.materialIds?.includes("firestop_board") === true
    ) as true,
    boundRows: boundRows.length,
    carrierOnlyRows: 0,
    deckMaterial: "inex_floor_panel",
    exactRows: exactRows.length,
    familyIds: ["fl23", "fl24", "fl25", "fl26", "fl27", "fl28", "fl33"],
    lowerTreatmentCounts,
    sourceLabel: "UBIQ official system table PDF",
    supportDepthsMm: [200, 300, 400],
    supportMaterial: "open_web_steel_floor",
    totalRows: rows.length
  };
}

export function buildBroadAccuracyFloorOpenWebRawBareCarrierOwnerContract():
  BroadAccuracyFloorOpenWebRawBareCarrierOwnerContract {
  return {
    basisAliasBlocked: {
      astmIicAiic: true,
      buildingPrediction: true,
      fieldImpact: true,
      labAirborneFieldAliases: true
    },
    evidenceInventory: buildBroadAccuracyFloorOpenWebRawBareEvidenceInventory(),
    exactRowsStayFirst: true,
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_LANDED_GATE,
    negativeBoundaries: [
      "open_web_raw_bare_owner_contract_does_not_promote_runtime_values",
      "raw_open_web_impact_outputs_remain_unsupported_until_bare_impact_curve_owner_lands",
      "raw_open_web_airborne_remains_screening_until_direct_curve_owner_lands",
      "ubiq_inex_deck_and_firestop_rows_are_package_evidence_not_bare_carrier_evidence",
      "direct_fixed_and_suspended_ceiling_rows_stay_separate_package_lanes",
      "lower_only_partial_open_web_package_inputs_remain_fail_closed",
      "open_box_timber_package_transfer_raw_bare_and_eps_screed_values_remain_frozen",
      "field_building_and_astm_iic_aliases_remain_unpromoted",
      "raw_open_web_screening_postures_remain_blocked_until_geometry_owner_lands"
    ],
    noRuntimeValueMovement: true,
    ownerTerms: OWNER_TERMS,
    previousMatrixRefresh: {
      landedGate: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTION_STATUS
    },
    rawBareProbePosture: [
      {
        expectedCurrentAirborneBasis: "screening_mass_law_curve_seed_v3",
        expectedCurrentImpactBasis: null,
        expectedCurrentRw: 79,
        expectedImpactAdmission: "blocked_raw_bare",
        id: "raw_open_web_300",
        rawBareRuntimeAdmission: false
      },
      {
        expectedCurrentAirborneBasis: "screening_mass_law_curve_seed_v3",
        expectedCurrentImpactBasis: null,
        expectedCurrentRw: 79,
        expectedImpactAdmission: "blocked_raw_bare",
        id: "raw_open_web_safe_split_150_150",
        rawBareRuntimeAdmission: false
      },
      {
        expectedCurrentAirborneBasis: "screening_mass_law_curve_seed_v3",
        expectedCurrentImpactBasis: null,
        expectedCurrentRw: 79,
        expectedImpactAdmission: "blocked_raw_bare",
        id: "open_web_inex_deck_only",
        rawBareRuntimeAdmission: false
      },
      {
        expectedCurrentAirborneBasis: "screening_mass_law_curve_seed_v3",
        expectedCurrentImpactBasis: null,
        expectedCurrentRw: 34,
        expectedImpactAdmission: "blocked_partial_package",
        id: "open_web_lower_only_packaged_system",
        rawBareRuntimeAdmission: false
      }
    ],
    runtimePromotionAllowedInGate: false,
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_CARRIER_OWNER_SELECTION_STATUS
  };
}
