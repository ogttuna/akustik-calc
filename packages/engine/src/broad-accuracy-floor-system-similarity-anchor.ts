import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { BoundFloorSystem, ExactFloorSystem } from "@dynecho/shared";

import {
  BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTION_STATUS,
  type BroadAccuracyMetricId
} from "./broad-accuracy-reference-benchmark-expansion";

export const BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_LANDED_GATE =
  "broad_accuracy_floor_system_similarity_anchor_runtime_plan";

export const BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTION_STATUS =
  "broad_accuracy_floor_system_similarity_anchor_landed_no_runtime_selected_open_web_supported_band_runtime_corridor";

export const BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_ACTION =
  "broad_accuracy_open_web_supported_band_similarity_runtime_corridor_plan";

export const BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-open-web-supported-band-similarity-runtime-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_LABEL =
  "open-web steel supported-band similarity runtime corridor";

export type BroadAccuracyFloorSystemAnchorLaneId =
  | "open_web_steel_supported_resilient_ceiling_similarity"
  | "open_web_steel_direct_fixed_lining_similarity"
  | "open_box_timber_measured_similarity"
  | "astm_iic_aiic_floor_adapter_detour"
  | "floor_impact_field_building_adapter_followup";

export type BroadAccuracyFloorSystemAnchorRuntimeCandidate = {
  blockers: readonly string[];
  candidateId: BroadAccuracyFloorSystemAnchorLaneId;
  exactAnchorRows: number;
  basis: "element_lab" | "field_or_building" | "astm_rating_boundary";
  boundAnchorRows: number;
  currentRuntimeSeedBasis: string | null;
  hardRejected: boolean;
  metrics: readonly BroadAccuracyMetricId[];
  nextAction: string | null;
  selected: boolean;
  score: number;
  sourceRowsRequiredBeforeSelection: boolean;
};

export type BroadAccuracyFloorSystemAnchorBoundaryExample = {
  anchorUse: "anchor_only" | "current_runtime_seed" | "exact_override" | "rejected";
  id: string;
  reason: string;
  requiredOwnerFields: readonly string[];
  sourceId: string | null;
};

export type BroadAccuracyFloorSystemSimilarityAnchorContract = {
  admittedRuntimeMovementThisGate: false;
  anchorInventory: {
    boundOpenWebCarpetLnWPlusCiRows: number;
    boundOpenWebFl33LnWUpperBoundRows: number;
    boundOpenWebSteelRows: number;
    exactOpenBoxTimberRows: number;
    exactOpenWebDirectFixedRows: number;
    exactOpenWebElasticSuspendedRows: number;
    exactOpenWebFamilyEstimateEligibleRows: number;
    exactOpenWebSteelRows: number;
  };
  anchorOwnerFields: readonly string[];
  boundaryExamples: readonly BroadAccuracyFloorSystemAnchorBoundaryExample[];
  currentRuntimeSeed: {
    basis: "predictor_lightweight_steel_fl28_interpolation_estimate";
    exactRowsUsed: readonly string[];
    status: "existing_narrow_seed_only";
    stillUsesScreeningWarningCopy: true;
    unlockedMetrics: readonly BroadAccuracyMetricId[];
  };
  landedGate: typeof BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_LANDED_GATE;
  noRuntimeValueMovement: true;
  previousBenchmarkExpansion: {
    selectedNextAction: typeof BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTED_NEXT_FILE;
    selectionStatus: typeof BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTION_STATUS;
  };
  selectedCandidate: BroadAccuracyFloorSystemAnchorRuntimeCandidate;
  selectedNextAction: typeof BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_LABEL;
  selectionStatus: typeof BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTION_STATUS;
  similarityAdmissionRules: readonly string[];
  weakLaneConvertedToSupportedReadiness: false;
  runtimeCandidates: readonly BroadAccuracyFloorSystemAnchorRuntimeCandidate[];
};

function isOpenWebSteelExact(system: ExactFloorSystem): boolean {
  return system.match.baseStructure?.materialIds?.includes("open_web_steel_floor") === true;
}

function isOpenWebSteelBound(system: BoundFloorSystem): boolean {
  return system.match.baseStructure?.materialIds?.includes("open_web_steel_floor") === true;
}

function isOpenBoxTimberExact(system: ExactFloorSystem): boolean {
  return system.match.baseStructure?.materialIds?.includes("open_box_timber_slab") === true;
}

function hasElasticSuspendedLower(system: ExactFloorSystem): boolean {
  return system.estimateMatch?.lowerTreatment?.type === "suspended_ceiling_elastic_hanger";
}

function hasDirectFixedLower(system: ExactFloorSystem): boolean {
  return system.estimateMatch?.lowerTreatment?.type === "direct_fixed_ceiling";
}

function countOpenWebCarpetBoundRows(systems: readonly BoundFloorSystem[]): number {
  return systems.filter((system) => system.id.includes("_carpet_lnw_plus_ci_bound_")).length;
}

function countOpenWebFl33Rows(systems: readonly BoundFloorSystem[]): number {
  return systems.filter((system) => /^ubiq_fl33_open_web_steel_/u.test(system.id)).length;
}

function buildAnchorInventory(): BroadAccuracyFloorSystemSimilarityAnchorContract["anchorInventory"] {
  const exactOpenWebRows = EXACT_FLOOR_SYSTEMS.filter(isOpenWebSteelExact);
  const boundOpenWebRows = BOUND_FLOOR_SYSTEMS.filter(isOpenWebSteelBound);

  return {
    boundOpenWebCarpetLnWPlusCiRows: countOpenWebCarpetBoundRows(boundOpenWebRows),
    boundOpenWebFl33LnWUpperBoundRows: countOpenWebFl33Rows(boundOpenWebRows),
    boundOpenWebSteelRows: boundOpenWebRows.length,
    exactOpenBoxTimberRows: EXACT_FLOOR_SYSTEMS.filter(isOpenBoxTimberExact).length,
    exactOpenWebDirectFixedRows: exactOpenWebRows.filter(hasDirectFixedLower).length,
    exactOpenWebElasticSuspendedRows: exactOpenWebRows.filter(hasElasticSuspendedLower).length,
    exactOpenWebFamilyEstimateEligibleRows: exactOpenWebRows.filter((system) => system.familyEstimateEligible !== false).length,
    exactOpenWebSteelRows: exactOpenWebRows.length
  };
}

function buildRuntimeCandidates(
  inventory: BroadAccuracyFloorSystemSimilarityAnchorContract["anchorInventory"]
): readonly BroadAccuracyFloorSystemAnchorRuntimeCandidate[] {
  return [
    {
      basis: "element_lab",
      blockers: [],
      boundAnchorRows: inventory.boundOpenWebCarpetLnWPlusCiRows,
      candidateId: "open_web_steel_supported_resilient_ceiling_similarity",
      currentRuntimeSeedBasis: "predictor_lightweight_steel_fl28_interpolation_estimate",
      exactAnchorRows: inventory.exactOpenWebElasticSuspendedRows,
      hardRejected: false,
      metrics: ["Rw", "Ln,w", "Ln,w+CI"],
      nextAction: BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_ACTION,
      score: 2.74,
      selected: true,
      sourceRowsRequiredBeforeSelection: false
    },
    {
      basis: "element_lab",
      blockers: [
        "direct_fixed_lining_transfer_owner_missing",
        "all_direct_fixed_rows_are_exact_only_until_a_lower_support_model_owner_exists"
      ],
      boundAnchorRows: 0,
      candidateId: "open_web_steel_direct_fixed_lining_similarity",
      currentRuntimeSeedBasis: null,
      exactAnchorRows: inventory.exactOpenWebDirectFixedRows,
      hardRejected: false,
      metrics: ["Rw", "Ln,w", "Ln,w+CI"],
      nextAction: null,
      score: 1.87,
      selected: false,
      sourceRowsRequiredBeforeSelection: false
    },
    {
      basis: "element_lab",
      blockers: [
        "open_box_timber_wet_dry_hybrid_interaction_owner_missing",
        "wrong_support_family_guard_must_keep_open_box_out_of_open_web_steel_similarity"
      ],
      boundAnchorRows: 0,
      candidateId: "open_box_timber_measured_similarity",
      currentRuntimeSeedBasis: null,
      exactAnchorRows: inventory.exactOpenBoxTimberRows,
      hardRejected: false,
      metrics: ["Rw", "Ln,w"],
      nextAction: null,
      score: 1.43,
      selected: false,
      sourceRowsRequiredBeforeSelection: false
    },
    {
      basis: "field_or_building",
      blockers: [
        "field_impact_adapter_owner_must_be_metric_specific",
        "building_prediction_cannot_borrow_lab_open_web_values"
      ],
      boundAnchorRows: 0,
      candidateId: "floor_impact_field_building_adapter_followup",
      currentRuntimeSeedBasis: null,
      exactAnchorRows: 0,
      hardRejected: false,
      metrics: ["L'n,w", "L'nT,w", "L'nT,50"],
      nextAction: null,
      score: 0.82,
      selected: false,
      sourceRowsRequiredBeforeSelection: true
    },
    {
      basis: "astm_rating_boundary",
      blockers: ["iso_lnw_rows_are_not_astm_iic_or_aiic_rating_curves"],
      boundAnchorRows: 0,
      candidateId: "astm_iic_aiic_floor_adapter_detour",
      currentRuntimeSeedBasis: null,
      exactAnchorRows: 0,
      hardRejected: true,
      metrics: ["IIC", "AIIC"],
      nextAction: null,
      score: 0.11,
      selected: false,
      sourceRowsRequiredBeforeSelection: true
    }
  ];
}

export function buildBroadAccuracyFloorSystemSimilarityAnchorContract(): BroadAccuracyFloorSystemSimilarityAnchorContract {
  const inventory = buildAnchorInventory();
  const runtimeCandidates = buildRuntimeCandidates(inventory);
  const selectedCandidate = runtimeCandidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Broad accuracy floor-system similarity anchor contract has no selected candidate.");
  }

  return {
    admittedRuntimeMovementThisGate: false,
    anchorInventory: inventory,
    anchorOwnerFields: [
      "route",
      "metricBasis",
      "supportFamily",
      "supportForm",
      "carrierDepthMm",
      "carrierSpacingMm",
      "deckOrFloatingPanelThicknessMm",
      "finishPackage",
      "lowerSupportClass",
      "ceilingBoardSchedule",
      "ceilingCavityDepthMm",
      "ceilingFillThicknessMm"
    ],
    boundaryExamples: [
      {
        anchorUse: "exact_override",
        id: "same_open_web_exact_row_rank_zero",
        reason: "same UBIQ open-web steel topology, metric, and lab basis remains an exact source override",
        requiredOwnerFields: ["route", "metricBasis", "supportForm", "carrierDepthMm", "finishPackage"],
        sourceId: "ubiq_fl28_open_web_steel_300_exact_lab_2026"
      },
      {
        anchorUse: "current_runtime_seed",
        id: "fl28_250mm_interpolation_seed",
        reason: "existing FL-28 runtime interpolates between measured 200/300/400 mm same-family lab rows",
        requiredOwnerFields: ["carrierDepthMm", "deckOrFloatingPanelThicknessMm", "ceilingBoardSchedule"],
        sourceId: "ubiq_fl28_open_web_steel_300_exact_lab_2026"
      },
      {
        anchorUse: "anchor_only",
        id: "supported_band_carpet_bound_lnw_plus_ci",
        reason: "carpet rows can anchor Ln,w+CI bound handling but cannot fabricate exact Ln,w or CI",
        requiredOwnerFields: ["metricBasis", "finishPackage", "boundMetricSemantics"],
        sourceId: "ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026"
      },
      {
        anchorUse: "rejected",
        id: "open_box_timber_as_open_web_steel",
        reason: "open-box timber is a different support family and can only enter its own later similarity lane",
        requiredOwnerFields: ["supportFamily", "supportForm"],
        sourceId: "tuas_r2b_open_box_timber_measured_2026"
      },
      {
        anchorUse: "rejected",
        id: "lab_lnw_to_iic_alias",
        reason: "ISO lab Ln,w rows do not own ASTM IIC/AIIC rating curves",
        requiredOwnerFields: ["metricBasis", "ratingProcedure"],
        sourceId: null
      }
    ],
    currentRuntimeSeed: {
      basis: "predictor_lightweight_steel_fl28_interpolation_estimate",
      exactRowsUsed: [
        "ubiq_fl28_open_web_steel_200_exact_lab_2026",
        "ubiq_fl28_open_web_steel_300_exact_lab_2026",
        "ubiq_fl28_open_web_steel_400_exact_lab_2026"
      ],
      status: "existing_narrow_seed_only",
      stillUsesScreeningWarningCopy: true,
      unlockedMetrics: ["Rw", "Ln,w", "Ln,w+CI"]
    },
    landedGate: BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousBenchmarkExpansion: {
      selectedNextAction: BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTION_STATUS
    },
    runtimeCandidates,
    selectedCandidate,
    selectedNextAction: BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTION_STATUS,
    similarityAdmissionRules: [
      "exact_source_precedence_stays_first",
      "same_route_metric_and_basis_required",
      "lab_impact_rows_cannot_anchor_field_or_building_outputs_without_metric_adapter_owner",
      "iso_lnw_delta_lw_rows_cannot_anchor_astm_iic_aiic",
      "wrong_support_family_or_support_form_is_a_negative_boundary",
      "missing_carrier_depth_spacing_finish_or_lower_assembly_owner_blocks_similarity_runtime",
      "bound_rows_keep_bound_semantics_and_cannot_promote_exact_lnw",
      "familyEstimateEligible_false_rows_can_exact_match_but_do_not_seed_broad_family_runtime"
    ],
    weakLaneConvertedToSupportedReadiness: false
  };
}
