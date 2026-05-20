import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberRawBareReopeningGuardContract,
  type BroadAccuracyFloorOpenBoxTimberRawBareProbe
} from "./broad-accuracy-floor-open-box-timber-raw-bare-reopening-guard";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_LANDED_GATE =
  "broad_accuracy_floor_open_box_timber_raw_bare_carrier_owner_contract_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTION_STATUS =
  "broad_accuracy_floor_open_box_timber_raw_bare_carrier_owner_landed_no_runtime_selected_formula_corridor";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_box_timber_raw_bare_formula_corridor_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-formula-corridor-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_LABEL =
  "floor open-box timber raw-bare formula corridor";

export type BroadAccuracyFloorOpenBoxTimberRawBareCarrierOwnerTermId =
  | "airborne_direct_curve_owner"
  | "basis_boundary_owner"
  | "bare_impact_curve_owner"
  | "exact_source_precedence_owner"
  | "finish_absence_owner"
  | "hostile_topology_owner"
  | "lower_treatment_state_owner"
  | "package_transfer_exclusion_owner"
  | "source_or_physics_basis_owner"
  | "support_family_and_geometry_owner"
  | "uncertainty_budget_owner";

export type BroadAccuracyFloorOpenBoxTimberRawBareCarrierOwnerTerm = {
  readonly acceptedBasis: readonly string[];
  readonly id: BroadAccuracyFloorOpenBoxTimberRawBareCarrierOwnerTermId;
  readonly requiredPhysicalFields: readonly string[];
  readonly runtimeRole: string;
  readonly status: "owned_for_formula_corridor" | "owned_for_negative_boundary" | "runtime_blocked_until_formula_corridor";
};

export type BroadAccuracyFloorOpenBoxTimberRawBareCarrierOwnerProbePosture = {
  readonly currentAirborneBasis: BroadAccuracyFloorOpenBoxTimberRawBareProbe["expectedCurrentAirborneBasis"];
  readonly currentRw: BroadAccuracyFloorOpenBoxTimberRawBareProbe["expectedCurrentRw"];
  readonly id: BroadAccuracyFloorOpenBoxTimberRawBareProbe["id"];
  readonly impactRuntimeAdmission: BroadAccuracyFloorOpenBoxTimberRawBareProbe["impactRuntimeAdmission"];
  readonly packageTransferBorrowingAllowed: BroadAccuracyFloorOpenBoxTimberRawBareProbe["packageTransferBorrowingAllowed"];
};

export type BroadAccuracyFloorOpenBoxTimberRawBareCarrierOwnerContract = {
  readonly acceptedRuntimeBasisRoutes: readonly [
    "source_owned_bare_open_box_measurement_packet",
    "defensible_source_absent_bare_carrier_physics_model"
  ];
  readonly basisAliasBlocked: {
    readonly astmIicAiic: true;
    readonly buildingPrediction: true;
    readonly fieldImpact: true;
    readonly labAirborneFieldAliases: true;
  };
  readonly carrierOwnerTerms: readonly BroadAccuracyFloorOpenBoxTimberRawBareCarrierOwnerTerm[];
  readonly exactRowsStayFirst: true;
  readonly forbiddenBorrowedPackageTransferBasis: typeof OPEN_BOX_TIMBER_SIMILARITY_BASIS;
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_LANDED_GATE;
  readonly negativeBoundaries: readonly string[];
  readonly noRuntimeValueMovement: true;
  readonly packageTransferPinsStillFrozen: ReturnType<
    typeof buildBroadAccuracyFloorOpenBoxTimberRawBareReopeningGuardContract
  >["packageTransferPinsFrozen"];
  readonly previousRawBareGuard: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTION_STATUS;
  };
  readonly rawBareProbePosture: readonly BroadAccuracyFloorOpenBoxTimberRawBareCarrierOwnerProbePosture[];
  readonly runtimePromotionAllowedInGate: false;
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTION_STATUS;
};

const CARRIER_OWNER_TERMS = [
  {
    acceptedBasis: ["open_box_timber_slab", "raw_bare_open_box_timber"],
    id: "support_family_and_geometry_owner",
    requiredPhysicalFields: [
      "supportFamily=open_box_timber",
      "supportForm=open_box_timber_slab",
      "carrierDepthMm",
      "surfaceMassKgM2",
      "panelPlateSchedule",
      "ribOrWebSpacingMm",
      "voidFractionOrCavityDepthMm",
      "densityKgM3",
      "lossFactor"
    ],
    runtimeRole: "separate raw open-box timber from open-web steel, CLT, massive timber, and package-transfer stacks",
    status: "owned_for_formula_corridor"
  },
  {
    acceptedBasis: ["direct_reduction_index_curve", "source_absent_sharp_davy_or_mass_law_delegate"],
    id: "airborne_direct_curve_owner",
    requiredPhysicalFields: [
      "bareCarrierReductionIndexCurve",
      "criticalFrequencyHz",
      "bendingStiffnessNm",
      "radiationEfficiency",
      "iso717AirborneRatingAdapter"
    ],
    runtimeRole: "own bare-carrier Rw/C/Ctr physics before replacing screening_mass_law_curve_seed_v3",
    status: "runtime_blocked_until_formula_corridor"
  },
  {
    acceptedBasis: ["bare_impact_reference_curve", "source_absent_mobility_or_mass_spring_delegate"],
    id: "bare_impact_curve_owner",
    requiredPhysicalFields: [
      "bareCarrierNormalizedImpactCurve",
      "walkingSurfaceHardnessClass",
      "structuralMobilityModel",
      "impactRadiationEfficiency",
      "iso717ImpactRatingAdapter"
    ],
    runtimeRole: "own raw-bare Ln,w/CI/CI,50-2500 physics instead of borrowing finished package-transfer impact values",
    status: "runtime_blocked_until_formula_corridor"
  },
  {
    acceptedBasis: ["explicit_no_finish_roles"],
    id: "finish_absence_owner",
    requiredPhysicalFields: [
      "floorCoveringAbsence=true",
      "resilientLayerAbsence=true",
      "upperFillAbsence=true",
      "floatingScreedAbsence=true"
    ],
    runtimeRole: "prove the stack is truly raw bare rather than a partial package with missing user inputs",
    status: "owned_for_formula_corridor"
  },
  {
    acceptedBasis: ["explicit_none", "explicit_ceiling_or_lower_treatment_schedule"],
    id: "lower_treatment_state_owner",
    requiredPhysicalFields: [
      "ceilingBoardAbsenceOrSchedule",
      "ceilingCavityAbsenceOrDepthMm",
      "ceilingFillAbsenceOrThicknessMm",
      "lowerSupportClass"
    ],
    runtimeRole: "separate bare underside, helper-only lower packages, and complete lower treatment routes",
    status: "owned_for_formula_corridor"
  },
  {
    acceptedBasis: ["package_transfer_exclusion"],
    id: "package_transfer_exclusion_owner",
    requiredPhysicalFields: [
      "noCompleteUpperPackage",
      "noCompleteLowerPackage",
      "noSourceEquivalentPackageSchedule",
      "forbiddenBasis=broad_accuracy_floor_open_box_timber_similarity_package_transfer_formula_corridor"
    ],
    runtimeRole: "keep raw-bare cases off the Ln,w 50.8 / CI,50-2500 3.3 / Rw 66 package-transfer lane",
    status: "owned_for_negative_boundary"
  },
  {
    acceptedBasis: ["source_owned_measurement", "defensible_physics_model"],
    id: "source_or_physics_basis_owner",
    requiredPhysicalFields: [
      "sourceOwnedBarePacketOrPhysicsModelId",
      "metricScope",
      "supportFamilyScope",
      "topologyScope",
      "basisCompatibility"
    ],
    runtimeRole: "allow source rows or source-absent physics to promote only when their metric and topology scope is owned",
    status: "owned_for_formula_corridor"
  },
  {
    acceptedBasis: ["source_absent_formula_error_budget"],
    id: "uncertainty_budget_owner",
    requiredPhysicalFields: [
      "RwToleranceBudgetOwner",
      "LnWToleranceBudgetOwner",
      "CIBudgetOwner",
      "CI50_2500BudgetOwner",
      "inputPrecisionBudgetOwner",
      "topologySimplificationBudgetOwner"
    ],
    runtimeRole: "require metric-specific error budgets before any source-absent raw-bare value can be shown as supported",
    status: "runtime_blocked_until_formula_corridor"
  },
  {
    acceptedBasis: ["exact_measured_floor_system_exact_match"],
    id: "exact_source_precedence_owner",
    requiredPhysicalFields: ["exactSystemId", "sourceEquivalentLayerSchedule", "requestedMetricBasis"],
    runtimeRole: "ensure exact TUAS package rows still beat raw-bare source-absent formulas",
    status: "owned_for_negative_boundary"
  },
  {
    acceptedBasis: ["basis_specific_metric_boundaries"],
    id: "basis_boundary_owner",
    requiredPhysicalFields: ["elementLabBasis", "fieldBasis", "buildingPredictionBasis", "astmIicAiicBasis"],
    runtimeRole: "block field/building and ASTM/IIC aliases until metric-specific adapters own them",
    status: "owned_for_negative_boundary"
  },
  {
    acceptedBasis: ["hostile_input_guard"],
    id: "hostile_topology_owner",
    requiredPhysicalFields: [
      "duplicateBaseStructurePolicy",
      "safeSplitEquivalencePolicy",
      "unsafeOverlapPolicy",
      "rolelessInferencePolicy"
    ],
    runtimeRole: "keep safe raw-bare splits stable while refusing duplicate or ambiguous ownership",
    status: "owned_for_negative_boundary"
  }
] as const satisfies readonly BroadAccuracyFloorOpenBoxTimberRawBareCarrierOwnerTerm[];

export function buildBroadAccuracyFloorOpenBoxTimberRawBareCarrierOwnerContract():
  BroadAccuracyFloorOpenBoxTimberRawBareCarrierOwnerContract {
  const previousGuard = buildBroadAccuracyFloorOpenBoxTimberRawBareReopeningGuardContract();

  return {
    acceptedRuntimeBasisRoutes: [
      "source_owned_bare_open_box_measurement_packet",
      "defensible_source_absent_bare_carrier_physics_model"
    ],
    basisAliasBlocked: previousGuard.basisAliasBlocked,
    carrierOwnerTerms: CARRIER_OWNER_TERMS,
    exactRowsStayFirst: true,
    forbiddenBorrowedPackageTransferBasis: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_LANDED_GATE,
    negativeBoundaries: [
      "raw_bare_owner_contract_does_not_promote_runtime_values",
      "raw_bare_airborne_screening_remains_screening_until_direct_curve_owner_lands",
      "raw_bare_impact_outputs_remain_unsupported_until_bare_impact_curve_owner_lands",
      "upper_only_and_lower_only_packages_do_not_become_complete_package_transfer",
      "package_transfer_values_Lnw_50_8_CI50_2500_3_3_Rw_66_remain_forbidden",
      "exact_tuas_package_rows_remain_first",
      "field_building_and_astm_iic_aliases_remain_unpromoted",
      "safe_split_base_only_stays_equivalent_to_unsplit_base_only"
    ],
    noRuntimeValueMovement: true,
    packageTransferPinsStillFrozen: previousGuard.packageTransferPinsFrozen,
    previousRawBareGuard: {
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTION_STATUS
    },
    rawBareProbePosture: previousGuard.rawBareProbes.map((probe) => ({
      currentAirborneBasis: probe.expectedCurrentAirborneBasis,
      currentRw: probe.expectedCurrentRw,
      id: probe.id,
      impactRuntimeAdmission: probe.impactRuntimeAdmission,
      packageTransferBorrowingAllowed: probe.packageTransferBorrowingAllowed
    })),
    runtimePromotionAllowedInGate: false,
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_CARRIER_OWNER_SELECTION_STATUS
  };
}
