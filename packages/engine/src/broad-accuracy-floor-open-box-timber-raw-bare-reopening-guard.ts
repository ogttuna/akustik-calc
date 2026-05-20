import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenBoxTimberExactOnlyHybridFragmentationPolicyContract,
  type BroadAccuracyFloorOpenBoxTimberFrozenRuntimePin
} from "./broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_LANDED_GATE =
  "broad_accuracy_floor_open_box_timber_raw_bare_reopening_guard_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTION_STATUS =
  "broad_accuracy_floor_open_box_timber_raw_bare_reopening_guard_landed_no_runtime_selected_bare_carrier_owner";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_box_timber_raw_bare_carrier_owner_contract_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-carrier-owner-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_LABEL =
  "floor open-box timber raw-bare carrier owner contract";

export type BroadAccuracyFloorOpenBoxTimberRawBareProbeId =
  | "roleless_370mm_open_box_base_only"
  | "tagged_370mm_open_box_base_only"
  | "split_185_185_open_box_base_only"
  | "upper_only_dry_package_without_lower_owner"
  | "lower_only_helper_package_without_upper_owner"
  | "open_web_wrong_family_base_only";

export type BroadAccuracyFloorOpenBoxTimberRawBareOwnerGap =
  | "airborne_screening_only_not_package_transfer"
  | "bare_carrier_impact_curve_owner_missing"
  | "lower_treatment_absence_owner_missing"
  | "upper_finish_absence_owner_missing"
  | "wrong_support_family_guard";

export type BroadAccuracyFloorOpenBoxTimberRawBareProbe = {
  readonly expectedCurrentAirborneBasis: "screening_mass_law_curve_seed_v3";
  readonly expectedCurrentRw: number;
  readonly expectedSupportedOutputs: readonly ["Rw"];
  readonly expectedUnsupportedOutputs: readonly ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"];
  readonly formulaStatus: "blocked_raw_bare_open_box" | "blocked_wrong_support_family";
  readonly id: BroadAccuracyFloorOpenBoxTimberRawBareProbeId;
  readonly impactRuntimeAdmission: "blocked";
  readonly packageTransferBasisForbidden: typeof OPEN_BOX_TIMBER_SIMILARITY_BASIS;
  readonly packageTransferBorrowingAllowed: false;
  readonly requiredOwnerGaps: readonly BroadAccuracyFloorOpenBoxTimberRawBareOwnerGap[];
};

export type BroadAccuracyFloorOpenBoxTimberRawBareReopeningGuardContract = {
  readonly basisAliasBlocked: {
    readonly astmIicAiic: true;
    readonly buildingPrediction: true;
    readonly fieldImpact: true;
    readonly labAirborneFieldAliases: true;
  };
  readonly bareCarrierOwnerFieldsRequiredBeforeRuntime: readonly string[];
  readonly exactRowsStayFirst: true;
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_LANDED_GATE;
  readonly negativeBoundaries: readonly string[];
  readonly noRuntimeValueMovement: true;
  readonly packageTransferBasis: typeof OPEN_BOX_TIMBER_SIMILARITY_BASIS;
  readonly packageTransferPinsFrozen: readonly BroadAccuracyFloorOpenBoxTimberFrozenRuntimePin[];
  readonly previousExactOnlyHybridPolicy: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTION_STATUS;
  };
  readonly rawBareFormulaStatus: "blocked_raw_bare_open_box";
  readonly rawBareProbes: readonly BroadAccuracyFloorOpenBoxTimberRawBareProbe[];
  readonly runtimePromotionAllowedInGate: false;
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTION_STATUS;
};

const OPEN_BOX_RAW_BARE_OWNER_GAPS = [
  "bare_carrier_impact_curve_owner_missing",
  "airborne_screening_only_not_package_transfer",
  "lower_treatment_absence_owner_missing",
  "upper_finish_absence_owner_missing"
] as const satisfies readonly BroadAccuracyFloorOpenBoxTimberRawBareOwnerGap[];

const RAW_BARE_PROBES = [
  {
    expectedCurrentAirborneBasis: "screening_mass_law_curve_seed_v3",
    expectedCurrentRw: 42,
    expectedSupportedOutputs: ["Rw"],
    expectedUnsupportedOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
    formulaStatus: "blocked_raw_bare_open_box",
    id: "roleless_370mm_open_box_base_only",
    impactRuntimeAdmission: "blocked",
    packageTransferBasisForbidden: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
    packageTransferBorrowingAllowed: false,
    requiredOwnerGaps: OPEN_BOX_RAW_BARE_OWNER_GAPS
  },
  {
    expectedCurrentAirborneBasis: "screening_mass_law_curve_seed_v3",
    expectedCurrentRw: 42,
    expectedSupportedOutputs: ["Rw"],
    expectedUnsupportedOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
    formulaStatus: "blocked_raw_bare_open_box",
    id: "tagged_370mm_open_box_base_only",
    impactRuntimeAdmission: "blocked",
    packageTransferBasisForbidden: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
    packageTransferBorrowingAllowed: false,
    requiredOwnerGaps: OPEN_BOX_RAW_BARE_OWNER_GAPS
  },
  {
    expectedCurrentAirborneBasis: "screening_mass_law_curve_seed_v3",
    expectedCurrentRw: 42,
    expectedSupportedOutputs: ["Rw"],
    expectedUnsupportedOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
    formulaStatus: "blocked_raw_bare_open_box",
    id: "split_185_185_open_box_base_only",
    impactRuntimeAdmission: "blocked",
    packageTransferBasisForbidden: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
    packageTransferBorrowingAllowed: false,
    requiredOwnerGaps: OPEN_BOX_RAW_BARE_OWNER_GAPS
  },
  {
    expectedCurrentAirborneBasis: "screening_mass_law_curve_seed_v3",
    expectedCurrentRw: 52,
    expectedSupportedOutputs: ["Rw"],
    expectedUnsupportedOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
    formulaStatus: "blocked_raw_bare_open_box",
    id: "upper_only_dry_package_without_lower_owner",
    impactRuntimeAdmission: "blocked",
    packageTransferBasisForbidden: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
    packageTransferBorrowingAllowed: false,
    requiredOwnerGaps: [
      "bare_carrier_impact_curve_owner_missing",
      "airborne_screening_only_not_package_transfer",
      "lower_treatment_absence_owner_missing"
    ]
  },
  {
    expectedCurrentAirborneBasis: "screening_mass_law_curve_seed_v3",
    expectedCurrentRw: 43,
    expectedSupportedOutputs: ["Rw"],
    expectedUnsupportedOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
    formulaStatus: "blocked_raw_bare_open_box",
    id: "lower_only_helper_package_without_upper_owner",
    impactRuntimeAdmission: "blocked",
    packageTransferBasisForbidden: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
    packageTransferBorrowingAllowed: false,
    requiredOwnerGaps: [
      "bare_carrier_impact_curve_owner_missing",
      "airborne_screening_only_not_package_transfer",
      "upper_finish_absence_owner_missing"
    ]
  },
  {
    expectedCurrentAirborneBasis: "screening_mass_law_curve_seed_v3",
    expectedCurrentRw: 72,
    expectedSupportedOutputs: ["Rw"],
    expectedUnsupportedOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
    formulaStatus: "blocked_wrong_support_family",
    id: "open_web_wrong_family_base_only",
    impactRuntimeAdmission: "blocked",
    packageTransferBasisForbidden: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
    packageTransferBorrowingAllowed: false,
    requiredOwnerGaps: ["wrong_support_family_guard"]
  }
] as const satisfies readonly BroadAccuracyFloorOpenBoxTimberRawBareProbe[];

export function buildBroadAccuracyFloorOpenBoxTimberRawBareReopeningGuardContract():
  BroadAccuracyFloorOpenBoxTimberRawBareReopeningGuardContract {
  const previousPolicy = buildBroadAccuracyFloorOpenBoxTimberExactOnlyHybridFragmentationPolicyContract();

  return {
    basisAliasBlocked: {
      astmIicAiic: true,
      buildingPrediction: true,
      fieldImpact: true,
      labAirborneFieldAliases: true
    },
    bareCarrierOwnerFieldsRequiredBeforeRuntime: [
      "source_owned_bare_open_box_impact_curve_or_defensible_physics_owner",
      "source_owned_bare_open_box_airborne_direct_curve_or_defensible_physics_owner",
      "raw_bare_finish_absence_owner",
      "lower_treatment_absence_or_presence_owner",
      "package_transfer_exclusion_owner",
      "raw_bare_uncertainty_budget_owner"
    ],
    exactRowsStayFirst: true,
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_LANDED_GATE,
    negativeBoundaries: [
      "roleless_open_box_base_only_must_not_borrow_package_transfer_impact_values",
      "tagged_open_box_base_only_must_not_borrow_package_transfer_impact_values",
      "split_open_box_base_only_must_remain_equivalent_to_unsplit_base_only",
      "upper_only_dry_package_without_lower_owner_must_not_promote_package_transfer",
      "lower_only_helper_without_upper_owner_must_not_promote_package_transfer",
      "screening_airborne_rw_is_not_the_open_box_package_transfer_basis",
      "open_web_steel_wrong_family_must_not_borrow_tuas_open_box_rows",
      "field_building_and_astm_iic_aliases_remain_unpromoted"
    ],
    noRuntimeValueMovement: true,
    packageTransferBasis: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
    packageTransferPinsFrozen: previousPolicy.runtimePinsFrozen,
    previousExactOnlyHybridPolicy: {
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTION_STATUS
    },
    rawBareFormulaStatus: "blocked_raw_bare_open_box",
    rawBareProbes: RAW_BARE_PROBES,
    runtimePromotionAllowedInGate: false,
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_REOPENING_GUARD_SELECTION_STATUS
  };
}
