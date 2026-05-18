import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { ExactFloorSystem } from "@dynecho/shared";

import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTION_STATUS
} from "./broad-accuracy-floor-open-web-direct-fixed-lining-coverage-refresh";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_LANDED_GATE =
  "broad_accuracy_floor_open_box_timber_similarity_transfer_owner_contract_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTION_STATUS =
  "broad_accuracy_floor_open_box_timber_similarity_transfer_owner_landed_no_runtime_selected_formula_corridor";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_box_timber_similarity_formula_corridor_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_LABEL =
  "floor open-box timber similarity formula corridor";

export type BroadAccuracyFloorOpenBoxTimberPackageId =
  | "dry_gypsum_fiber_upper"
  | "eps_screed_or_hybrid_upper"
  | "mixed_staged_upper"
  | "reinforced_ceiling_laminate"
  | "thin_laminate_eps_no_upper";

export type BroadAccuracyFloorOpenBoxTimberOwnerTermId =
  | "airborne_rw_plus_c_owner"
  | "exact_precedence_owner"
  | "fragmented_package_exact_equivalence_owner"
  | "impact_lnw_ci_transfer_owner"
  | "lower_ceiling_family_owner"
  | "metric_basis_owner"
  | "negative_boundary_owner"
  | "open_box_support_family_owner"
  | "source_absent_budget_owner"
  | "thin_laminate_eps_finish_owner"
  | "upper_package_interaction_owner";

export type BroadAccuracyFloorOpenBoxTimberOwnerTerm = {
  id: BroadAccuracyFloorOpenBoxTimberOwnerTermId;
  requiredFields: readonly string[];
  runtimePromotionRole: string;
  status: "blocked_until_formula_corridor" | "owned_for_formula_corridor" | "owned_for_negative_boundary";
};

export type BroadAccuracyFloorOpenBoxTimberPackagePacket = {
  exactOnlyRows: readonly string[];
  exactRows: readonly string[];
  lowerSupportClasses: readonly string[];
  packageId: BroadAccuracyFloorOpenBoxTimberPackageId;
  predictorOwnedRows: readonly string[];
  ranges: {
    CI: readonly [number, number];
    CI50_2500: readonly [number, number];
    LnW: readonly [number, number];
    LnWPlusCI: readonly [number, number];
    Rw: readonly [number, number];
  };
};

export type BroadAccuracyFloorOpenBoxTimberTransferOwnerContract = {
  blockedRuntimeBoundaries: readonly {
    id:
      | "astm_iic_aiic_alias_boundary"
      | "disjoint_duplicate_role_boundary"
      | "exact_only_hybrid_no_predictor_transfer_boundary"
      | "field_building_alias_boundary"
      | "open_web_steel_wrong_support_family"
      | "partial_laminate_eps_finish_boundary"
      | "raw_bare_open_box_reopening_guard";
    reason: string;
  }[];
  landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_LANDED_GATE;
  noRuntimeValueMovement: true;
  openBoxInventory: {
    carrierThicknessesMm: readonly [370];
    exactOnlyHybridRows: readonly string[];
    exactRows: number;
    familyEstimateEligibleRows: number;
    measuredMetricRanges: {
      CI: readonly [number, number];
      CI50_2500: readonly [number, number];
      LnW: readonly [number, number];
      LnWPlusCI: readonly [number, number];
      Rw: readonly [number, number];
      RwPlusC: readonly [number, number];
    };
    predictorOwnedRows: number;
    sourceType: "open_measured_dataset";
    supportMaterial: "open_box_timber_slab";
    trustTier: "peer_reviewed_open_access";
  };
  ownerTerms: readonly BroadAccuracyFloorOpenBoxTimberOwnerTerm[];
  packagePackets: readonly BroadAccuracyFloorOpenBoxTimberPackagePacket[];
  previousCoverageRefresh: {
    landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_LANDED_GATE;
    selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
    selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTION_STATUS;
  };
  runtimePromotionRequirements: readonly string[];
  selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_LABEL;
  selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTION_STATUS;
};

function isTuasOpenBoxTimber(system: ExactFloorSystem): boolean {
  return (
    system.id.startsWith("tuas_r") &&
    system.match.baseStructure?.materialIds?.includes("open_box_timber_slab") === true
  );
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function numericRange(values: readonly number[]): readonly [number, number] {
  return [round1(Math.min(...values)), round1(Math.max(...values))] as const;
}

function uniqueSortedStrings(values: readonly string[]): readonly string[] {
  return [...new Set(values)].sort();
}

function buildOpenBoxRows(): readonly ExactFloorSystem[] {
  return EXACT_FLOOR_SYSTEMS.filter(isTuasOpenBoxTimber);
}

function getPackageId(system: ExactFloorSystem): BroadAccuracyFloorOpenBoxTimberPackageId {
  if (/^tuas_r2[ab]_/u.test(system.id)) {
    return "thin_laminate_eps_no_upper";
  }

  if (/^tuas_r[35][ab]_/u.test(system.id)) {
    return "dry_gypsum_fiber_upper";
  }

  if (/^tuas_r6[ab]_/u.test(system.id)) {
    return "reinforced_ceiling_laminate";
  }

  if (/^tuas_r10a_/u.test(system.id)) {
    return "mixed_staged_upper";
  }

  return "eps_screed_or_hybrid_upper";
}

function getLowerSupportClass(system: ExactFloorSystem): string {
  const estimateSupport = system.estimateMatch?.lowerTreatment?.supportClass;
  if (estimateSupport) {
    return estimateSupport;
  }

  const schedule = system.match.ceilingCavity?.materialScheduleIds;
  if (schedule && schedule.length > 0) {
    return schedule.join("+");
  }

  return system.match.ceilingCavity?.materialIds?.join("+") ?? "none";
}

function buildPackagePackets(
  rows: readonly ExactFloorSystem[] = buildOpenBoxRows()
): readonly BroadAccuracyFloorOpenBoxTimberPackagePacket[] {
  const packageOrder: readonly BroadAccuracyFloorOpenBoxTimberPackageId[] = [
    "thin_laminate_eps_no_upper",
    "dry_gypsum_fiber_upper",
    "reinforced_ceiling_laminate",
    "eps_screed_or_hybrid_upper",
    "mixed_staged_upper"
  ];

  return packageOrder.map((packageId) => {
    const packageRows = rows.filter((row) => getPackageId(row) === packageId);

    return {
      exactOnlyRows: packageRows.filter((row) => !row.estimateMatch).map((row) => row.id),
      exactRows: packageRows.map((row) => row.id),
      lowerSupportClasses: uniqueSortedStrings(packageRows.map(getLowerSupportClass)),
      packageId,
      predictorOwnedRows: packageRows.filter((row) => row.estimateMatch).map((row) => row.id),
      ranges: {
        CI: numericRange(packageRows.map((row) => row.impactRatings.CI ?? 0)),
        CI50_2500: numericRange(packageRows.map((row) => row.impactRatings.CI50_2500 ?? 0)),
        LnW: numericRange(packageRows.map((row) => row.impactRatings.LnW)),
        LnWPlusCI: numericRange(packageRows.map((row) => row.impactRatings.LnWPlusCI ?? 0)),
        Rw: numericRange(packageRows.map((row) => row.airborneRatings.Rw))
      }
    };
  });
}

export function buildBroadAccuracyFloorOpenBoxTimberTransferOwnerContract():
  BroadAccuracyFloorOpenBoxTimberTransferOwnerContract {
  const openBoxRows = buildOpenBoxRows();
  const exactOnlyHybridRows = openBoxRows.filter((row) => !row.estimateMatch).map((row) => row.id);

  return {
    blockedRuntimeBoundaries: [
      {
        id: "open_web_steel_wrong_support_family",
        reason: "open-web steel direct-fixed and supported-band evidence cannot calibrate open-box timber transfer"
      },
      {
        id: "raw_bare_open_box_reopening_guard",
        reason: "a bare or roleless open-box timber carrier cannot reopen Rw/Ln,w impact support from nearby measured rows"
      },
      {
        id: "disjoint_duplicate_role_boundary",
        reason: "split single-entry upper or lower roles are topology conflicts unless they are source-equivalent packed schedules"
      },
      {
        id: "exact_only_hybrid_no_predictor_transfer_boundary",
        reason: "hybrid exact-only TUAS rows need formula ownership before they can seed source-absent transfer"
      },
      {
        id: "partial_laminate_eps_finish_boundary",
        reason: "laminate and EPS walking finishes must be present together inside the source-backed thickness band"
      },
      {
        id: "field_building_alias_boundary",
        reason: "lab Rw/Ln,w open-box rows cannot become field or building outputs without separate metric owners"
      },
      {
        id: "astm_iic_aiic_alias_boundary",
        reason: "ISO lab Ln,w/CI rows cannot be relabelled as ASTM IIC or AIIC"
      }
    ],
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_LANDED_GATE,
    noRuntimeValueMovement: true,
    openBoxInventory: {
      carrierThicknessesMm: [370],
      exactOnlyHybridRows,
      exactRows: openBoxRows.length,
      familyEstimateEligibleRows: openBoxRows.filter((row) => row.familyEstimateEligible !== false).length,
      measuredMetricRanges: {
        CI: numericRange(openBoxRows.map((row) => row.impactRatings.CI ?? 0)),
        CI50_2500: numericRange(openBoxRows.map((row) => row.impactRatings.CI50_2500 ?? 0)),
        LnW: numericRange(openBoxRows.map((row) => row.impactRatings.LnW)),
        LnWPlusCI: numericRange(openBoxRows.map((row) => row.impactRatings.LnWPlusCI ?? 0)),
        Rw: numericRange(openBoxRows.map((row) => row.airborneRatings.Rw)),
        RwPlusC: numericRange(openBoxRows.map((row) => row.airborneRatings.RwCtr ?? 0))
      },
      predictorOwnedRows: openBoxRows.filter((row) => row.estimateMatch).length,
      sourceType: "open_measured_dataset",
      supportMaterial: "open_box_timber_slab",
      trustTier: "peer_reviewed_open_access"
    },
    ownerTerms: [
      {
        id: "open_box_support_family_owner",
        requiredFields: ["structuralSupportType", "supportForm", "baseSlab.thicknessMm"],
        runtimePromotionRole: "keep open-box timber separate from open-web steel and CLT support families",
        status: "owned_for_formula_corridor"
      },
      {
        id: "thin_laminate_eps_finish_owner",
        requiredFields: ["floorCovering.materialClass", "floorCovering.thicknessMm", "resilientLayer.productId", "resilientLayer.thicknessMm"],
        runtimePromotionRole: "own the 8 mm laminate plus 3 mm EPS walking-finish pair before similarity transfer",
        status: "owned_for_formula_corridor"
      },
      {
        id: "upper_package_interaction_owner",
        requiredFields: ["upperFill.materialClass", "upperFill.thicknessMm", "floatingScreed.materialClass", "floatingScreed.thicknessMm"],
        runtimePromotionRole: "separate dry gypsum-fiber, EPS/screed, glasswool board, and no-upper-package interactions",
        status: "blocked_until_formula_corridor"
      },
      {
        id: "lower_ceiling_family_owner",
        requiredFields: ["lowerTreatment.supportClass", "lowerTreatment.boardSchedule", "lowerTreatment.cavityDepthMm", "lowerTreatment.cavityFillThicknessMm"],
        runtimePromotionRole: "separate TUAS family A, family B, reinforced board, and hybrid lower paths",
        status: "blocked_until_formula_corridor"
      },
      {
        id: "fragmented_package_exact_equivalence_owner",
        requiredFields: ["sourceEquivalentPackedSchedule", "visibleRoleOrder", "singleEntryRoleConflictState"],
        runtimePromotionRole: "allow exact same-package fragmentation while refusing disjoint duplicate-role fallbacks",
        status: "owned_for_negative_boundary"
      },
      {
        id: "impact_lnw_ci_transfer_owner",
        requiredFields: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "packageFamily"],
        runtimePromotionRole: "own ISO lab impact transfer before source-absent open-box runtime",
        status: "blocked_until_formula_corridor"
      },
      {
        id: "airborne_rw_plus_c_owner",
        requiredFields: ["Rw", "Rw+C", "airborneCompanionSemantic"],
        runtimePromotionRole: "keep TUAS Rw+C companion semantics explicit and separate from Rw+Ctr",
        status: "blocked_until_formula_corridor"
      },
      {
        id: "metric_basis_owner",
        requiredFields: ["elementLabBasis", "fieldContextBasis", "astmRatingProcedure"],
        runtimePromotionRole: "keep lab, field/building, and ASTM metrics separate",
        status: "owned_for_negative_boundary"
      },
      {
        id: "source_absent_budget_owner",
        requiredFields: ["holdoutPacket", "residualThresholdDb", "errorBudgetDb"],
        runtimePromotionRole: "attach source-absent design budgets only after formula residual policy exists",
        status: "blocked_until_formula_corridor"
      },
      {
        id: "exact_precedence_owner",
        requiredFields: ["sameStackExactSourceId", "metricBasis", "supportFamily"],
        runtimePromotionRole: "keep all 15 TUAS exact rows ahead of any source-absent formula",
        status: "owned_for_negative_boundary"
      },
      {
        id: "negative_boundary_owner",
        requiredFields: ["wrongSupportFamily", "rawRolelessCarrier", "disjointDuplicateRole", "wrongMetricBasis"],
        runtimePromotionRole: "block open-web steel, raw bare carrier, disjoint duplicate roles, field/building, and ASTM aliases",
        status: "owned_for_negative_boundary"
      }
    ],
    packagePackets: buildPackagePackets(openBoxRows),
    previousCoverageRefresh: {
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_COVERAGE_REFRESH_SELECTION_STATUS
    },
    runtimePromotionRequirements: [
      "exact_source_precedence_stays_first_for_all_15_tuas_open_box_rows",
      "supportFamily_open_box_timber_required_and_open_web_steel_rejected",
      "baseSlab_370mm_owner_required_until_carrier_depth_generalization_lands",
      "thin_laminate_eps_finish_pair_required_when_any_walking_finish_is_present",
      "upper_package_family_must_be_explicit_before_transfer",
      "lower_ceiling_family_or_hybrid_schedule_must_be_explicit_before_transfer",
      "fragmented_source_equivalent_packages_can_exact_match_but_disjoint_duplicate_roles_block_formula_transfer",
      "raw_bare_open_box_carriers_stay_screening_or_needs_input_for_impact",
      "lab_field_building_and_astm_outputs_stay_separate_until_metric_specific_owners_land",
      "source_absent_budget_and_holdout_residual_policy_required_before_runtime_formula_promotion"
    ],
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_SIMILARITY_TRANSFER_OWNER_SELECTION_STATUS
  };
}
