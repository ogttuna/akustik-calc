import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import { getFloorSystemDerivedRwPlusC, type ExactFloorSystem } from "@dynecho/shared";

import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTION_STATUS
} from "./broad-accuracy-floor-open-box-timber-similarity-coverage-refresh";
import {
  buildBroadAccuracyFloorOpenBoxTimberSimilarityRuntimeCorridorContract,
  type BroadAccuracyFloorOpenBoxTimberRuntimeScenario
} from "./broad-accuracy-floor-open-box-timber-similarity-runtime-corridor";
import type { BroadAccuracyFloorOpenBoxTimberPackageId } from "./broad-accuracy-floor-open-box-timber-similarity-transfer-owner";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_LANDED_GATE =
  "broad_accuracy_floor_open_box_timber_exact_only_hybrid_fragmentation_policy_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTION_STATUS =
  "broad_accuracy_floor_open_box_timber_exact_only_hybrid_fragmentation_policy_landed_no_runtime_selected_raw_bare_reopening_guard";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_box_timber_raw_bare_reopening_guard_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-reopening-guard-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_LABEL =
  "floor open-box timber raw-bare reopening guard";

export type BroadAccuracyFloorOpenBoxTimberExactOnlyHybridSourceId =
  | "tuas_r2c_open_box_timber_measured_2026"
  | "tuas_r7b_open_box_timber_measured_2026"
  | "tuas_r8b_open_box_timber_measured_2026"
  | "tuas_r9b_open_box_timber_measured_2026"
  | "tuas_r10a_open_box_timber_measured_2026";

export type BroadAccuracyFloorOpenBoxTimberExactOnlyHybridPolicyDecision =
  | "exact_only_hybrid_residual_evidence_lower_wet_dry_owner_required"
  | "lower_ceiling_interaction_missing_mass_boundary"
  | "mixed_staged_upper_package_owner_gap"
  | "partial_finish_no_finish_residual_boundary"
  | "screed_only_hybrid_residual_boundary";

export type BroadAccuracyFloorOpenBoxTimberExactOnlyHybridResidualAdmissionStatus =
  | "blocked_owner_gap"
  | "residual_readiness_only";

export type BroadAccuracyFloorOpenBoxTimberExactOnlyHybridMeasuredMetrics = {
  readonly CI: number;
  readonly CI50_2500: number;
  readonly LnW: number;
  readonly LnWPlusCI: number;
  readonly Rw: number;
  readonly RwPlusC: number;
};

export type BroadAccuracyFloorOpenBoxTimberExactOnlyHybridPolicyRow = {
  readonly absentRoles: readonly string[];
  readonly blockedRuntimeReason: string;
  readonly exactSourcePrecedence: true;
  readonly fragmentedExactEquivalenceMustStayExact: true;
  readonly measuredMetrics: BroadAccuracyFloorOpenBoxTimberExactOnlyHybridMeasuredMetrics;
  readonly packageId: BroadAccuracyFloorOpenBoxTimberPackageId;
  readonly policyDecision: BroadAccuracyFloorOpenBoxTimberExactOnlyHybridPolicyDecision;
  readonly requiredOwnersBeforeAdmission: readonly string[];
  readonly residualAdmissionStatus: BroadAccuracyFloorOpenBoxTimberExactOnlyHybridResidualAdmissionStatus;
  readonly runtimeAnchorAdmission: "blocked";
  readonly sourceId: BroadAccuracyFloorOpenBoxTimberExactOnlyHybridSourceId;
  readonly toleranceMovementAllowed: false;
};

export type BroadAccuracyFloorOpenBoxTimberFrozenRuntimePin = {
  readonly anchorSourceIds: readonly string[];
  readonly CI: number;
  readonly CI50_2500: number;
  readonly id: string;
  readonly LnW: number;
  readonly LnWPlusCI: number;
  readonly packageId: string;
  readonly Rw: number;
  readonly RwPlusC: number;
};

export type BroadAccuracyFloorOpenBoxTimberExactOnlyHybridFragmentationPolicyContract = {
  readonly basisAliasBlocked: {
    readonly astmIicAiic: true;
    readonly buildingPrediction: true;
    readonly fieldImpact: true;
    readonly labAirborneFieldAliases: true;
  };
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly excludedRuntimeAnchorSourceIds: readonly BroadAccuracyFloorOpenBoxTimberExactOnlyHybridSourceId[];
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_LANDED_GATE;
  readonly negativeBoundaries: readonly string[];
  readonly noRuntimeValueMovement: true;
  readonly policyRows: readonly BroadAccuracyFloorOpenBoxTimberExactOnlyHybridPolicyRow[];
  readonly previousCoverageRefresh: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTION_STATUS;
  };
  readonly residualAdmissionAllowedThisGate: false;
  readonly runtimeAnchorSourceIds: readonly string[];
  readonly runtimePinsFrozen: readonly BroadAccuracyFloorOpenBoxTimberFrozenRuntimePin[];
  readonly runtimePromotionAllowedInGate: false;
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTION_STATUS;
  readonly toleranceMovementAllowed: false;
};

const EXACT_ONLY_HYBRID_SOURCE_IDS = [
  "tuas_r7b_open_box_timber_measured_2026",
  "tuas_r8b_open_box_timber_measured_2026",
  "tuas_r9b_open_box_timber_measured_2026",
  "tuas_r2c_open_box_timber_measured_2026",
  "tuas_r10a_open_box_timber_measured_2026"
] as const satisfies readonly BroadAccuracyFloorOpenBoxTimberExactOnlyHybridSourceId[];

const POLICY_ROW_METADATA = {
  tuas_r7b_open_box_timber_measured_2026: {
    absentRoles: [],
    blockedRuntimeReason:
      "hybrid lower treatment plus wet/dry upper package needs lower-family and wet/dry package owners before residual admission",
    packageId: "eps_screed_or_hybrid_upper",
    policyDecision: "exact_only_hybrid_residual_evidence_lower_wet_dry_owner_required",
    requiredOwnersBeforeAdmission: [
      "open_box_hybrid_lower_family_owner",
      "wet_dry_upper_package_interaction_owner",
      "same_package_fragmentation_residual_owner"
    ],
    residualAdmissionStatus: "blocked_owner_gap"
  },
  tuas_r8b_open_box_timber_measured_2026: {
    absentRoles: ["floor_covering", "resilient_layer"],
    blockedRuntimeReason:
      "partial or no finish-pair row cannot calibrate complete laminate/EPS package transfer",
    packageId: "eps_screed_or_hybrid_upper",
    policyDecision: "partial_finish_no_finish_residual_boundary",
    requiredOwnersBeforeAdmission: [
      "partial_finish_residual_owner",
      "finish_pair_absence_boundary_owner",
      "hybrid_lower_family_owner"
    ],
    residualAdmissionStatus: "residual_readiness_only"
  },
  tuas_r9b_open_box_timber_measured_2026: {
    absentRoles: ["upper_fill"],
    blockedRuntimeReason:
      "screed-only hybrid package is not a complete upper-fill plus screed transfer anchor",
    packageId: "eps_screed_or_hybrid_upper",
    policyDecision: "screed_only_hybrid_residual_boundary",
    requiredOwnersBeforeAdmission: [
      "screed_only_residual_owner",
      "upper_fill_absence_boundary_owner",
      "hybrid_lower_family_owner"
    ],
    residualAdmissionStatus: "residual_readiness_only"
  },
  tuas_r2c_open_box_timber_measured_2026: {
    absentRoles: ["ceiling_fill", "upper_fill", "floating_screed"],
    blockedRuntimeReason:
      "hybrid lower interaction and missing-mass path cannot be averaged into thin-laminate runtime",
    packageId: "eps_screed_or_hybrid_upper",
    policyDecision: "lower_ceiling_interaction_missing_mass_boundary",
    requiredOwnersBeforeAdmission: [
      "lower_ceiling_interaction_owner",
      "missing_mass_boundary_owner",
      "thin_laminate_runtime_exclusion_owner"
    ],
    residualAdmissionStatus: "blocked_owner_gap"
  },
  tuas_r10a_open_box_timber_measured_2026: {
    absentRoles: [],
    blockedRuntimeReason:
      "mixed staged glasswool/gypsum/screed/gypsum upper package has no predictor-owned same-package row",
    packageId: "mixed_staged_upper",
    policyDecision: "mixed_staged_upper_package_owner_gap",
    requiredOwnersBeforeAdmission: [
      "mixed_staged_upper_package_owner",
      "same_package_predictor_row_owner",
      "staged_upper_residual_budget_owner"
    ],
    residualAdmissionStatus: "blocked_owner_gap"
  }
} as const satisfies Record<
  BroadAccuracyFloorOpenBoxTimberExactOnlyHybridSourceId,
  Omit<
    BroadAccuracyFloorOpenBoxTimberExactOnlyHybridPolicyRow,
    | "exactSourcePrecedence"
    | "fragmentedExactEquivalenceMustStayExact"
    | "measuredMetrics"
    | "runtimeAnchorAdmission"
    | "sourceId"
    | "toleranceMovementAllowed"
  >
>;

function exactSystem(sourceId: BroadAccuracyFloorOpenBoxTimberExactOnlyHybridSourceId): ExactFloorSystem {
  const system = EXACT_FLOOR_SYSTEMS.find((candidate) => candidate.id === sourceId);

  if (!system) {
    throw new Error(`Missing exact floor system for ${sourceId}`);
  }

  return system;
}

function measuredMetrics(system: ExactFloorSystem): BroadAccuracyFloorOpenBoxTimberExactOnlyHybridMeasuredMetrics {
  const rwPlusC = getFloorSystemDerivedRwPlusC(system.airborneRatings);

  if (typeof rwPlusC !== "number") {
    throw new Error(`Expected ${system.id} to expose an Rw + C companion value`);
  }

  return {
    CI: system.impactRatings.CI ?? 0,
    CI50_2500: system.impactRatings.CI50_2500 ?? 0,
    LnW: system.impactRatings.LnW,
    LnWPlusCI: system.impactRatings.LnWPlusCI ?? system.impactRatings.LnW + (system.impactRatings.CI ?? 0),
    Rw: system.airborneRatings.Rw,
    RwPlusC: rwPlusC
  };
}

function frozenRuntimePin(
  scenario: BroadAccuracyFloorOpenBoxTimberRuntimeScenario
): BroadAccuracyFloorOpenBoxTimberFrozenRuntimePin {
  return {
    anchorSourceIds: scenario.anchorSourceIds,
    CI: scenario.expectedImpact.CI,
    CI50_2500: scenario.expectedImpact.CI50_2500,
    id: scenario.id,
    LnW: scenario.expectedImpact.LnW,
    LnWPlusCI: scenario.expectedImpact.LnWPlusCI,
    packageId: scenario.packageId,
    Rw: scenario.expectedAirborne.Rw,
    RwPlusC: scenario.expectedAirborne.RwPlusC
  };
}

export function buildBroadAccuracyFloorOpenBoxTimberExactOnlyHybridFragmentationPolicyRows():
  readonly BroadAccuracyFloorOpenBoxTimberExactOnlyHybridPolicyRow[] {
  return EXACT_ONLY_HYBRID_SOURCE_IDS.map((sourceId) => {
    const metadata = POLICY_ROW_METADATA[sourceId];

    return {
      ...metadata,
      exactSourcePrecedence: true,
      fragmentedExactEquivalenceMustStayExact: true,
      measuredMetrics: measuredMetrics(exactSystem(sourceId)),
      runtimeAnchorAdmission: "blocked",
      sourceId,
      toleranceMovementAllowed: false
    };
  });
}

export function buildBroadAccuracyFloorOpenBoxTimberExactOnlyHybridFragmentationPolicyContract():
  BroadAccuracyFloorOpenBoxTimberExactOnlyHybridFragmentationPolicyContract {
  const runtime = buildBroadAccuracyFloorOpenBoxTimberSimilarityRuntimeCorridorContract();
  const runtimeAnchorSourceIds = runtime.supportedScenarios.flatMap((scenario) => scenario.anchorSourceIds);

  return {
    basisAliasBlocked: {
      astmIicAiic: true,
      buildingPrediction: true,
      fieldImpact: true,
      labAirborneFieldAliases: true
    },
    exactMeasuredRowsRemainPrecedence: true,
    excludedRuntimeAnchorSourceIds: EXACT_ONLY_HYBRID_SOURCE_IDS,
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_LANDED_GATE,
    negativeBoundaries: [
      "exact_only_hybrid_rows_remain_exact_source_rows_not_runtime_anchors",
      "fragmented_source_equivalent_packages_must_preserve_exact_lab_and_field_routes",
      "partial_finish_or_missing_finish_rows_cannot_calibrate_complete_laminate_eps_transfer",
      "lower_ceiling_missing_mass_rows_cannot_average_into_thin_laminate_runtime",
      "mixed_staged_upper_rows_need_a_dedicated_owner_before_any_residual_admission",
      "raw_bare_open_box_reopening_is_deferred_to_the_selected_next_guard",
      "open_web_steel_and_other_support_families_cannot_borrow_tuas_open_box_rows",
      "field_building_and_astm_iic_aliases_remain_unpromoted"
    ],
    noRuntimeValueMovement: true,
    policyRows: buildBroadAccuracyFloorOpenBoxTimberExactOnlyHybridFragmentationPolicyRows(),
    previousCoverageRefresh: {
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_COVERAGE_REFRESH_SELECTION_STATUS
    },
    residualAdmissionAllowedThisGate: false,
    runtimeAnchorSourceIds,
    runtimePinsFrozen: runtime.supportedScenarios.map(frozenRuntimePin),
    runtimePromotionAllowedInGate: false,
    selectedNextAction:
      BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EXACT_ONLY_HYBRID_FRAGMENTATION_POLICY_SELECTION_STATUS,
    toleranceMovementAllowed: false
  };
}
