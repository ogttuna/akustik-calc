import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import { getFloorSystemDerivedRwPlusC, type ExactFloorSystem } from "@dynecho/shared";

import {
  buildBroadAccuracyFloorOpenBoxTimberExactOnlyHybridFragmentationPolicyContract,
  type BroadAccuracyFloorOpenBoxTimberExactOnlyHybridSourceId
} from "./broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy";
import { evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor } from "./broad-accuracy-floor-open-box-timber-similarity-formula-corridor";
import {
  buildBroadAccuracyFloorOpenBoxTimberSimilarityRuntimeCorridorContract,
  type BroadAccuracyFloorOpenBoxTimberRuntimeScenario
} from "./broad-accuracy-floor-open-box-timber-similarity-runtime-corridor";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_LANDED_GATE =
  "broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_owner_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTION_STATUS =
  "broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_owner_landed_no_runtime_selected_formula_corridor";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-formula-corridor-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_LABEL =
  "floor open-box timber EPS/screed hybrid package formula corridor";

const PREVIOUS_RESIDUAL_EXPANSION_LANDED_GATE =
  "broad_accuracy_floor_open_box_timber_package_transfer_residual_expansion_plan";

const PREVIOUS_RESIDUAL_EXPANSION_SELECTION_STATUS =
  "broad_accuracy_floor_open_box_timber_package_transfer_residual_expansion_landed_no_runtime_selected_eps_screed_hybrid_package_owner";

const PREVIOUS_RESIDUAL_EXPANSION_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_owner_plan";

const PREVIOUS_RESIDUAL_EXPANSION_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-owner-contract.test.ts";

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridOwnerTermId =
  | "basis_boundary_owner"
  | "exact_precedence_owner"
  | "hostile_topology_owner"
  | "hybrid_lower_treatment_family_owner"
  | "laminate_eps_finish_pair_owner"
  | "metric_budget_owner"
  | "open_box_support_geometry_owner"
  | "residual_cohort_negative_boundary_owner"
  | "source_equivalent_schedule_owner"
  | "wet_eps_screed_upper_package_owner";

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridOwnerTerm = {
  readonly acceptedBasis: readonly string[];
  readonly id: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridOwnerTermId;
  readonly requiredPhysicalFields: readonly string[];
  readonly runtimeRole: string;
  readonly status: "owned_for_formula_corridor" | "owned_for_negative_boundary" | "runtime_blocked_until_formula_corridor";
};

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridExactPacket = {
  readonly airborneMetrics: {
    readonly Rw: number;
    readonly RwPlusC: number;
  };
  readonly impactMetrics: {
    readonly CI: number;
    readonly CI50_2500: number;
    readonly LnW: number;
    readonly LnWPlusCI: number;
  };
  readonly lowerTreatment: {
    readonly boardSchedule: readonly string[];
    readonly cavityScheduleMm: readonly number[];
    readonly cavityScheduleMaterials: readonly string[];
    readonly fillMaterial: string;
    readonly fillThicknessMm: number;
  };
  readonly sourceId: "tuas_r7b_open_box_timber_measured_2026";
  readonly support: {
    readonly materialId: "open_box_timber_slab";
    readonly thicknessMm: 370;
  };
  readonly upperPackage: {
    readonly floatingScreedMaterials: readonly string[];
    readonly floatingScreedThicknessMm: readonly number[];
    readonly floorCoveringMaterial: string;
    readonly floorCoveringThicknessMm: number;
    readonly resilientLayerMaterial: string;
    readonly resilientLayerThicknessMm: number;
    readonly upperFillMaterial: string;
    readonly upperFillThicknessMm: number;
  };
};

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridBoundaryRow = {
  readonly boundaryRole:
    | "accepted_candidate_owner_gap"
    | "blocked_lower_missing_mass_boundary"
    | "blocked_mixed_staged_upper_boundary"
    | "blocked_partial_finish_boundary"
    | "blocked_screed_only_boundary";
  readonly exactSourcePrecedence: true;
  readonly formulaAdmission: "blocked" | "candidate_after_owner_gate";
  readonly sourceId: BroadAccuracyFloorOpenBoxTimberExactOnlyHybridSourceId;
};

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridFrozenRuntimePin = {
  readonly anchorSourceIds: readonly string[];
  readonly CI50_2500: number;
  readonly LnW: number;
  readonly packageId: string;
  readonly Rw: number;
};

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageOwnerContract = {
  readonly basisAliasBlocked: {
    readonly astmIicAiic: true;
    readonly buildingPrediction: true;
    readonly fieldImpact: true;
    readonly labAirborneFieldAliases: true;
  };
  readonly candidateExactPacket: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridExactPacket;
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly formulaCorridorStillBlockedBeforeNextGate: true;
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_LANDED_GATE;
  readonly negativeBoundaries: readonly string[];
  readonly noRuntimeValueMovement: true;
  readonly ownerTerms: readonly BroadAccuracyFloorOpenBoxTimberEpsScreedHybridOwnerTerm[];
  readonly previousResidualExpansion: {
    readonly landedGate: typeof PREVIOUS_RESIDUAL_EXPANSION_LANDED_GATE;
    readonly selectedNextAction: typeof PREVIOUS_RESIDUAL_EXPANSION_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof PREVIOUS_RESIDUAL_EXPANSION_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof PREVIOUS_RESIDUAL_EXPANSION_SELECTION_STATUS;
  };
  readonly residualBoundaryRows: readonly BroadAccuracyFloorOpenBoxTimberEpsScreedHybridBoundaryRow[];
  readonly runtimePinsStillFrozen: readonly BroadAccuracyFloorOpenBoxTimberEpsScreedHybridFrozenRuntimePin[];
  readonly runtimePromotionAllowedInGate: false;
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTION_STATUS;
  readonly toleranceMovementAllowed: false;
};

const EPS_SCREED_HYBRID_OWNER_TERMS = [
  {
    acceptedBasis: ["open_box_timber_slab_370mm"],
    id: "open_box_support_geometry_owner",
    requiredPhysicalFields: [
      "supportFamily=open_box_timber",
      "supportForm=open_box_timber_slab",
      "baseStructure.materialId=open_box_timber_slab",
      "baseStructure.thicknessMm=370",
      "surfaceMassKgM2",
      "openBoxPanelSchedule",
      "ribOrWebSpacingMm",
      "lossFactor"
    ],
    runtimeRole: "keep the hybrid package on the 370 mm TUAS open-box timber support family",
    status: "owned_for_formula_corridor"
  },
  {
    acceptedBasis: ["eps_board_geotextile_screed_upper_package"],
    id: "wet_eps_screed_upper_package_owner",
    requiredPhysicalFields: [
      "upperFill.materialId=eps_floor_insulation_board",
      "upperFill.thicknessMm=35",
      "separator.materialId=geotextile",
      "separator.thicknessMm=1",
      "floatingScreed.materialId=screed",
      "floatingScreed.thicknessMm=40",
      "wetScreedMassOrDensity",
      "wetDryCouplingClass"
    ],
    runtimeRole: "own the EPS board + separator + screed transfer instead of averaging it into the dry package lane",
    status: "owned_for_formula_corridor"
  },
  {
    acceptedBasis: ["complete_laminate_eps_finish_pair"],
    id: "laminate_eps_finish_pair_owner",
    requiredPhysicalFields: [
      "resilientLayer.materialId=eps_underlay",
      "resilientLayer.thicknessMm=3",
      "floorCovering.materialId=laminate_flooring",
      "floorCovering.thicknessMm=8",
      "finishPairCompleteness=true"
    ],
    runtimeRole: "separate complete walking-finish packets from R8b partial/no-finish negatives",
    status: "owned_for_formula_corridor"
  },
  {
    acceptedBasis: ["tuas_hybrid_lower_family_a_plus_resilient_stud"],
    id: "hybrid_lower_treatment_family_owner",
    requiredPhysicalFields: [
      "ceilingCavity.materialSchedule=tuas_open_box_ceiling_family_a+resilient_stud_ceiling",
      "ceilingCavity.thicknessScheduleMm=45+25",
      "ceilingFill.materialId=rockwool",
      "ceilingFill.thicknessMm=100",
      "ceilingBoard.materialId=gypsum_board",
      "ceilingBoard.layerCount=2",
      "ceilingBoard.thicknessMm=13"
    ],
    runtimeRole: "separate the hybrid lower path from family A/B and missing-mass lower routes",
    status: "owned_for_formula_corridor"
  },
  {
    acceptedBasis: ["source_equivalent_packed_schedule"],
    id: "source_equivalent_schedule_owner",
    requiredPhysicalFields: [
      "materialScheduleIds",
      "thicknessScheduleMm",
      "visibleRoleOrder",
      "safeFragmentationPolicy",
      "singleEntryRoleConflictState"
    ],
    runtimeRole: "allow safe packed or split schedules while refusing disjoint duplicate ownership",
    status: "owned_for_negative_boundary"
  },
  {
    acceptedBasis: ["r7b_candidate_with_sibling_negatives"],
    id: "residual_cohort_negative_boundary_owner",
    requiredPhysicalFields: [
      "candidateSourceId=tuas_r7b_open_box_timber_measured_2026",
      "partialFinishNegative=tuas_r8b_open_box_timber_measured_2026",
      "screedOnlyNegative=tuas_r9b_open_box_timber_measured_2026",
      "missingMassNegative=tuas_r2c_open_box_timber_measured_2026",
      "mixedStagedNegative=tuas_r10a_open_box_timber_measured_2026"
    ],
    runtimeRole: "keep R7b as the only next formula candidate and keep sibling rows out of runtime anchors",
    status: "owned_for_negative_boundary"
  },
  {
    acceptedBasis: ["element_lab_iso_717_metric_boundaries"],
    id: "basis_boundary_owner",
    requiredPhysicalFields: [
      "elementLabLnW",
      "elementLabRw",
      "CI",
      "CI50_2500",
      "notFieldBasis",
      "notBuildingPredictionBasis",
      "notAstmIicAiicBasis"
    ],
    runtimeRole: "block field/building and ASTM/IIC aliases until metric-specific adapters own them",
    status: "owned_for_negative_boundary"
  },
  {
    acceptedBasis: ["source_absent_formula_error_budget"],
    id: "metric_budget_owner",
    requiredPhysicalFields: [
      "LnWResidualBudgetOwner",
      "RwResidualBudgetOwner",
      "CIResidualBudgetOwner",
      "upperWetDryInteractionBudgetOwner",
      "hybridLowerTransferBudgetOwner",
      "inputPrecisionBudgetOwner"
    ],
    runtimeRole: "require metric-specific not-measured budgets in the next formula corridor before runtime can move",
    status: "runtime_blocked_until_formula_corridor"
  },
  {
    acceptedBasis: ["open_measured_floor_system_exact_match"],
    id: "exact_precedence_owner",
    requiredPhysicalFields: ["exactSystemId", "sourceEquivalentLayerSchedule", "requestedMetricBasis"],
    runtimeRole: "ensure exact TUAS rows still beat source-absent EPS/screed formula candidates",
    status: "owned_for_negative_boundary"
  },
  {
    acceptedBasis: ["hostile_input_guard"],
    id: "hostile_topology_owner",
    requiredPhysicalFields: [
      "duplicateUpperPackagePolicy",
      "duplicateLowerTreatmentPolicy",
      "unsafeOverlapPolicy",
      "safeSplitEquivalencePolicy",
      "rolelessInferencePolicy"
    ],
    runtimeRole: "keep user-edited layer duplicates and unsafe reorderings from producing borrowed high values",
    status: "owned_for_negative_boundary"
  }
] as const satisfies readonly BroadAccuracyFloorOpenBoxTimberEpsScreedHybridOwnerTerm[];

function exactSystem(sourceId: "tuas_r7b_open_box_timber_measured_2026"): ExactFloorSystem {
  const system = EXACT_FLOOR_SYSTEMS.find((candidate) => candidate.id === sourceId);

  if (!system) {
    throw new Error(`Missing exact floor system ${sourceId}`);
  }

  return system;
}

function exactPacket(): BroadAccuracyFloorOpenBoxTimberEpsScreedHybridExactPacket {
  const system = exactSystem("tuas_r7b_open_box_timber_measured_2026");
  const rwPlusC = getFloorSystemDerivedRwPlusC(system.airborneRatings);

  if (typeof rwPlusC !== "number") {
    throw new Error("Expected R7b to expose Rw+C semantics");
  }

  return {
    airborneMetrics: {
      Rw: system.airborneRatings.Rw,
      RwPlusC: rwPlusC
    },
    impactMetrics: {
      CI: system.impactRatings.CI ?? 0,
      CI50_2500: system.impactRatings.CI50_2500 ?? 0,
      LnW: system.impactRatings.LnW,
      LnWPlusCI: system.impactRatings.LnWPlusCI ?? system.impactRatings.LnW + (system.impactRatings.CI ?? 0)
    },
    lowerTreatment: {
      boardSchedule: ["gypsum_board", "gypsum_board"],
      cavityScheduleMaterials: system.match.ceilingCavity?.materialScheduleIds ?? [],
      cavityScheduleMm: system.match.ceilingCavity?.thicknessScheduleMm ?? [],
      fillMaterial: system.match.ceilingFill?.materialIds?.[0] ?? "unknown",
      fillThicknessMm: system.match.ceilingFill?.thicknessMm ?? 0
    },
    sourceId: "tuas_r7b_open_box_timber_measured_2026",
    support: {
      materialId: "open_box_timber_slab",
      thicknessMm: 370
    },
    upperPackage: {
      floatingScreedMaterials: system.match.floatingScreed?.materialScheduleIds ?? [],
      floatingScreedThicknessMm: system.match.floatingScreed?.thicknessScheduleMm ?? [],
      floorCoveringMaterial: system.match.floorCovering?.materialIds?.[0] ?? "unknown",
      floorCoveringThicknessMm: system.match.floorCovering?.thicknessMm ?? 0,
      resilientLayerMaterial: system.match.resilientLayer?.materialIds?.[0] ?? "unknown",
      resilientLayerThicknessMm: system.match.resilientLayer?.thicknessMm ?? 0,
      upperFillMaterial: system.match.upperFill?.materialIds?.[0] ?? "unknown",
      upperFillThicknessMm: system.match.upperFill?.thicknessMm ?? 0
    }
  };
}

function runtimePin(
  scenario: BroadAccuracyFloorOpenBoxTimberRuntimeScenario
): BroadAccuracyFloorOpenBoxTimberEpsScreedHybridFrozenRuntimePin {
  return {
    anchorSourceIds: scenario.anchorSourceIds,
    CI50_2500: scenario.expectedImpact.CI50_2500,
    LnW: scenario.expectedImpact.LnW,
    packageId: scenario.packageId,
    Rw: scenario.expectedAirborne.Rw
  };
}

export function buildBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageOwnerContract():
  BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageOwnerContract {
  const policy = buildBroadAccuracyFloorOpenBoxTimberExactOnlyHybridFragmentationPolicyContract();
  const runtime = buildBroadAccuracyFloorOpenBoxTimberSimilarityRuntimeCorridorContract();
  const formulaProbe = evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor({
    finishPairState: "complete_laminate_eps",
    packageId: "eps_screed_or_hybrid_upper",
    roleTopologyState: "source_equivalent",
    supportFamily: "open_box_timber",
    targetOutputs: ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]
  });

  if (formulaProbe.corridorStatus !== "blocked_exact_only_hybrid_transfer") {
    throw new Error("Expected EPS/screed hybrid formula corridor to stay blocked before the formula gate");
  }

  return {
    basisAliasBlocked: policy.basisAliasBlocked,
    candidateExactPacket: exactPacket(),
    exactMeasuredRowsRemainPrecedence: true,
    formulaCorridorStillBlockedBeforeNextGate: true,
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_LANDED_GATE,
    negativeBoundaries: [
      "eps_screed_hybrid_owner_contract_does_not_promote_runtime_values",
      "r7b_becomes_formula_candidate_only_not_runtime_anchor",
      "r8b_partial_finish_stays_negative_boundary",
      "r9b_screed_only_missing_upper_fill_stays_negative_boundary",
      "r2c_missing_mass_lower_path_stays_negative_boundary",
      "r10a_mixed_staged_upper_stays_out_of_eps_screed_formula",
      "dry_package_values_Lnw_50_8_Rw_66_stay_frozen",
      "field_building_and_astm_iic_aliases_remain_unpromoted",
      "unsafe_duplicate_upper_or_lower_roles_stay_blocked"
    ],
    noRuntimeValueMovement: true,
    ownerTerms: EPS_SCREED_HYBRID_OWNER_TERMS,
    previousResidualExpansion: {
      landedGate: PREVIOUS_RESIDUAL_EXPANSION_LANDED_GATE,
      selectedNextAction: PREVIOUS_RESIDUAL_EXPANSION_SELECTED_NEXT_ACTION,
      selectedNextFile: PREVIOUS_RESIDUAL_EXPANSION_SELECTED_NEXT_FILE,
      selectionStatus: PREVIOUS_RESIDUAL_EXPANSION_SELECTION_STATUS
    },
    residualBoundaryRows: [
      {
        boundaryRole: "accepted_candidate_owner_gap",
        exactSourcePrecedence: true,
        formulaAdmission: "candidate_after_owner_gate",
        sourceId: "tuas_r7b_open_box_timber_measured_2026"
      },
      {
        boundaryRole: "blocked_partial_finish_boundary",
        exactSourcePrecedence: true,
        formulaAdmission: "blocked",
        sourceId: "tuas_r8b_open_box_timber_measured_2026"
      },
      {
        boundaryRole: "blocked_screed_only_boundary",
        exactSourcePrecedence: true,
        formulaAdmission: "blocked",
        sourceId: "tuas_r9b_open_box_timber_measured_2026"
      },
      {
        boundaryRole: "blocked_lower_missing_mass_boundary",
        exactSourcePrecedence: true,
        formulaAdmission: "blocked",
        sourceId: "tuas_r2c_open_box_timber_measured_2026"
      },
      {
        boundaryRole: "blocked_mixed_staged_upper_boundary",
        exactSourcePrecedence: true,
        formulaAdmission: "blocked",
        sourceId: "tuas_r10a_open_box_timber_measured_2026"
      }
    ],
    runtimePinsStillFrozen: runtime.supportedScenarios.map(runtimePin),
    runtimePromotionAllowedInGate: false,
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_OWNER_SELECTION_STATUS,
    toleranceMovementAllowed: false
  };
}
