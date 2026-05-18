import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";

import { getVerifiedAirborneCatalogStats } from "./airborne-verified-catalog";
import {
  BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTION_STATUS,
  buildBroadAccuracyCalculatorReadinessContract
} from "./broad-accuracy-calculator-readiness";
import { buildGateAHSteelFloorFormulaAccuracyBenchmarkContract } from "./steel-floor-formula-accuracy-benchmark";
import {
  WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS,
  WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS
} from "./wall-timber-lightweight-source-corpus";
import { evaluateWallTripleLeafCalibrationFit } from "./wall-triple-leaf-calibration-fit";

export const BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_LANDED_GATE =
  "broad_accuracy_reference_benchmark_expansion_and_similarity_solver_plan";

export const BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTION_STATUS =
  "broad_accuracy_reference_benchmark_expansion_landed_no_runtime_selected_floor_system_similarity_anchor";

export const BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_system_similarity_anchor_runtime_plan";

export const BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-system-similarity-anchor-contract.test.ts";

export type BroadAccuracyMetricId =
  | "Rw"
  | "STC"
  | "C"
  | "Ctr"
  | "R'w"
  | "Dn,w"
  | "DnT,w"
  | "Dn,A"
  | "DnT,A"
  | "DnT,A,k"
  | "Ln,w"
  | "Ln,w+CI"
  | "DeltaLw"
  | "L'n,w"
  | "L'nT,w"
  | "L'nT,50"
  | "IIC"
  | "AIIC";

export type BroadAccuracyRoute = "floor" | "mixed" | "wall";

export type BroadAccuracyBasis =
  | "astm_rating_boundary"
  | "building_prediction"
  | "controlled_envelope"
  | "element_lab"
  | "field_apparent"
  | "mixed";

export type BroadAccuracyEvidenceRole =
  | "calibration_row"
  | "controlled_envelope_guardrail"
  | "exact_source"
  | "formula_regression_anchor"
  | "holdout_residual"
  | "negative_boundary"
  | "similarity_anchor"
  | "source_absent_budget_only";

export type BroadAccuracySourceKind =
  | "contract_only_boundary"
  | "controlled_envelope_matrix"
  | "existing_local_formula_fixture"
  | "official_manufacturer_system_table"
  | "official_open_component_library"
  | "open_measured_dataset"
  | "verified_airborne_catalog"
  | "wall_timber_lightweight_source_corpus";

export type BroadAccuracyReferenceCase = {
  basis: BroadAccuracyBasis;
  blockers: readonly string[];
  evidenceRole: BroadAccuracyEvidenceRole;
  exactSourcePrecedenceEligible: boolean;
  family: string;
  id: string;
  measuredOrExpectedValuePolicy: "already_present_rights_safe" | "not_ingested" | "not_measured_value";
  metrics: readonly BroadAccuracyMetricId[];
  residualEligible: boolean;
  route: BroadAccuracyRoute;
  rowCount: number;
  sourceKind: BroadAccuracySourceKind;
  topologyOwnerFields: readonly string[];
};

export type BroadAccuracyFamilyResidualSummary = {
  basis: BroadAccuracyBasis;
  blockers: readonly string[];
  calibrationCount: number;
  exactCount: number;
  familyId: string;
  holdoutResidualCount: number;
  maxAbsErrorDb: number | null;
  meanAbsErrorDb: number | null;
  metric: BroadAccuracyMetricId;
  route: BroadAccuracyRoute;
  similarityAnchorCount: number;
  sourceAbsentBudgetOnlyCount: number;
};

export type BroadAccuracyWeakLaneConversionPath =
  | "calibrated_family_solver"
  | "exact_source_match"
  | "historical_only_after_existing_cleanup"
  | "similarity_anchor"
  | "source_absent_family_solver"
  | "precise_needs_input"
  | "precise_unsupported";

export type BroadAccuracyWeakLaneDebt = {
  activeRuntimeRisk: "active_runtime_possible" | "historical_contract_guard" | "legacy_id_current_family_partial";
  basis: BroadAccuracyBasis;
  blockers: readonly string[];
  currentWeakLane: "bounded_screening" | "low_confidence" | "multileaf_screening_blend" | "screening_fallback";
  family: string;
  id: string;
  metrics: readonly BroadAccuracyMetricId[];
  priority: number;
  recommendedConversionPath: BroadAccuracyWeakLaneConversionPath;
  requiredPhysicalInputs: readonly string[];
  route: BroadAccuracyRoute;
  supportedReadinessCoverage: false;
  tracePaths: readonly string[];
};

export type BroadAccuracySimilarityAnchorPolicy = {
  distanceDimensions: readonly string[];
  hardRejectionRules: readonly string[];
  examples: readonly {
    anchorUse: "anchor_only" | "exact_override" | "rejected";
    id: string;
    rank: number | null;
    reason: string;
  }[];
};

export type BroadAccuracyNextLaneCandidate = {
  category:
    | "residual_backtest"
    | "similarity_anchor_runtime"
    | "source_owned_holdout_acquisition"
    | "unsupported_boundary"
    | "weak_lane_conversion";
  id: string;
  reason: string;
  runtimeMovementAllowedInThisSlice: false;
  score: number;
  selected: boolean;
  sourceRowsRequiredForSelection: boolean;
  unlocksMetrics: readonly BroadAccuracyMetricId[];
};

export type BroadAccuracyReferenceBenchmarkExpansionContract = {
  benchmarkLedger: readonly BroadAccuracyReferenceCase[];
  canClaimBroadAccuracyReady: false;
  ledgerSummary: {
    controlledEnvelopeRows: number;
    exactSourceRowsByGroup: number;
    formulaRegressionAnchorRows: number;
    holdoutResidualRows: number;
    referenceGroups: number;
    sourceAbsentBudgetOnlyRows: number;
    weakLaneDebtRows: number;
    weakLaneRowsCountedAsSupportedReadiness: 0;
  };
  landedGate: typeof BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_LANDED_GATE;
  nextLaneSelection: {
    candidates: readonly BroadAccuracyNextLaneCandidate[];
    selectedCandidate: BroadAccuracyNextLaneCandidate;
    selectedNextAction: typeof BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTED_NEXT_FILE;
  };
  noRuntimeValueMovement: true;
  previousRefocus: {
    selectedNextAction: typeof BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTED_NEXT_FILE;
    selectionStatus: typeof BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTION_STATUS;
  };
  residualSummaries: readonly BroadAccuracyFamilyResidualSummary[];
  selectedNextAction: typeof BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTED_NEXT_FILE;
  selectionStatus: typeof BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTION_STATUS;
  similarityAnchorPolicy: BroadAccuracySimilarityAnchorPolicy;
  sourceInventoryIsStillNotProductGoal: true;
  weakLaneDebtLedger: readonly BroadAccuracyWeakLaneDebt[];
};

function floorExactGroup(
  sourceKind: Extract<
    BroadAccuracySourceKind,
    "official_manufacturer_system_table" | "official_open_component_library" | "open_measured_dataset"
  >,
  rowCount: number
): BroadAccuracyReferenceCase {
  return {
    basis: "mixed",
    blockers: ["exact_inventory_count_is_not_a_solver_residual_backtest"],
    evidenceRole: "exact_source",
    exactSourcePrecedenceEligible: true,
    family: "floor_system_exact_corpus",
    id: `floor.exact_systems.${sourceKind}`,
    measuredOrExpectedValuePolicy: "already_present_rights_safe",
    metrics: ["Rw", "R'w", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w"],
    residualEligible: false,
    route: "floor",
    rowCount,
    sourceKind,
    topologyOwnerFields: ["supportFamily", "carrierDepth", "finishPackage", "ceilingOrLowerAssembly", "metricBasis"]
  };
}

function buildBenchmarkLedger(): readonly BroadAccuracyReferenceCase[] {
  const readiness = buildBroadAccuracyCalculatorReadinessContract();
  const steel = buildGateAHSteelFloorFormulaAccuracyBenchmarkContract();
  const tripleLeaf = evaluateWallTripleLeafCalibrationFit();
  const wallStats = getVerifiedAirborneCatalogStats();
  const floorSourceCounts = readiness.floorSourceInventory.exactRowsBySourceType;
  const wallTimberHoldoutRows = WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.filter(
    (entry) => entry.kind === "linked_holdout"
  ).length;

  return [
    floorExactGroup("open_measured_dataset", floorSourceCounts.open_measured_dataset ?? 0),
    floorExactGroup(
      "official_manufacturer_system_table",
      floorSourceCounts.official_manufacturer_system_table ?? 0
    ),
    floorExactGroup("official_open_component_library", floorSourceCounts.official_open_component_library ?? 0),
    {
      basis: "mixed",
      blockers: ["bound_rows_can_seed_similarity_but_cannot_promote_exact_precedence"],
      evidenceRole: "similarity_anchor",
      exactSourcePrecedenceEligible: false,
      family: "floor_system_bound_corpus",
      id: "floor.bound_systems.compatible_nearby_anchor_pool",
      measuredOrExpectedValuePolicy: "already_present_rights_safe",
      metrics: ["Rw", "R'w", "Ln,w", "L'n,w", "L'nT,w"],
      residualEligible: false,
      route: "floor",
      rowCount: BOUND_FLOOR_SYSTEMS.length,
      sourceKind: "official_manufacturer_system_table",
      topologyOwnerFields: ["supportFamily", "toleranceBand", "layerRole", "metricBasis"]
    },
    {
      basis: "element_lab",
      blockers: [],
      evidenceRole: "holdout_residual",
      exactSourcePrecedenceEligible: false,
      family: "lightweight_steel_floor_formula",
      id: "floor.lightweight_steel.lab_lnw.same_family_holdouts",
      measuredOrExpectedValuePolicy: "already_present_rights_safe",
      metrics: ["Ln,w"],
      residualEligible: true,
      route: "floor",
      rowCount: steel.lnWResidualCaseCount,
      sourceKind: "existing_local_formula_fixture",
      topologyOwnerFields: ["supportForm", "carrierSpacing", "loadBasis", "dynamicStiffness", "lowerIsolation"]
    },
    {
      basis: "element_lab",
      blockers: ["source_owned_same_stack_iso_delta_lw_holdouts_absent"],
      evidenceRole: "holdout_residual",
      exactSourcePrecedenceEligible: false,
      family: "lightweight_steel_floor_formula",
      id: "floor.lightweight_steel.lab_delta_lw.same_stack_holdout_gap",
      measuredOrExpectedValuePolicy: "not_ingested",
      metrics: ["DeltaLw"],
      residualEligible: false,
      route: "floor",
      rowCount: steel.deltaLwResidualCaseCount,
      sourceKind: "contract_only_boundary",
      topologyOwnerFields: ["sameStackReferenceFloor", "supportForm", "dynamicStiffness", "loadBasis", "lowerIsolation"]
    },
    {
      basis: "element_lab",
      blockers: ["calibration_anchor_only_until_open_web_inputs_are_source_owned"],
      evidenceRole: "formula_regression_anchor",
      exactSourcePrecedenceEligible: true,
      family: "lightweight_steel_floor_formula",
      id: "floor.lightweight_steel.ubiq_open_web.exact_anchor_only",
      measuredOrExpectedValuePolicy: "already_present_rights_safe",
      metrics: ["Ln,w"],
      residualEligible: false,
      route: "floor",
      rowCount: steel.sourceAnchorInventory.ubiqOpenWebExactAnchorRows,
      sourceKind: "official_manufacturer_system_table",
      topologyOwnerFields: ["supportForm", "carrierDepth", "carrierSpacing", "lowerIsolation"]
    },
    {
      basis: "element_lab",
      blockers: [],
      evidenceRole: "source_absent_budget_only",
      exactSourcePrecedenceEligible: false,
      family: "lightweight_steel_floor_formula",
      id: "floor.lightweight_steel.complete_source_absent_design_reference",
      measuredOrExpectedValuePolicy: "not_measured_value",
      metrics: ["Ln,w", "DeltaLw"],
      residualEligible: false,
      route: "floor",
      rowCount: 1,
      sourceKind: "existing_local_formula_fixture",
      topologyOwnerFields: ["supportForm", "carrierSpacing", "loadBasis", "dynamicStiffness", "lowerIsolation"]
    },
    {
      basis: "element_lab",
      blockers: ["verified_rows_not_yet_partitioned_into_solver_holdouts"],
      evidenceRole: "exact_source",
      exactSourcePrecedenceEligible: true,
      family: "verified_airborne_wall_catalog",
      id: "wall.verified_airborne.lab_rw.exact_pool",
      measuredOrExpectedValuePolicy: "already_present_rights_safe",
      metrics: ["Rw"],
      residualEligible: false,
      route: "wall",
      rowCount: wallStats.labEntries,
      sourceKind: "verified_airborne_catalog",
      topologyOwnerFields: ["wallFamily", "leafCount", "cavityTopology", "metricBasis"]
    },
    {
      basis: "field_apparent",
      blockers: ["field_rows_must_not_calibrate_lab_rw_solvers"],
      evidenceRole: "exact_source",
      exactSourcePrecedenceEligible: true,
      family: "verified_airborne_wall_catalog",
      id: "wall.verified_airborne.field_dntak.exact_pool",
      measuredOrExpectedValuePolicy: "already_present_rights_safe",
      metrics: ["DnT,A,k"],
      residualEligible: false,
      route: "wall",
      rowCount: wallStats.fieldEntries,
      sourceKind: "verified_airborne_catalog",
      topologyOwnerFields: ["fieldContext", "metricBasis", "roomOrFacadeBasis"]
    },
    {
      basis: "field_apparent",
      blockers: ["approximate_field_companions_are_anchor_candidates_not_exact_lab_evidence"],
      evidenceRole: "similarity_anchor",
      exactSourcePrecedenceEligible: false,
      family: "verified_airborne_wall_catalog",
      id: "wall.verified_airborne.approximate_field_companions.anchor_pool",
      measuredOrExpectedValuePolicy: "already_present_rights_safe",
      metrics: ["R'w", "DnT,w", "Dn,A", "DnT,A"],
      residualEligible: false,
      route: "wall",
      rowCount: wallStats.approximateFieldCompanionEntries,
      sourceKind: "verified_airborne_catalog",
      topologyOwnerFields: ["fieldContext", "roomVolume", "separatingArea", "metricBasis"]
    },
    {
      basis: "element_lab",
      blockers: [],
      evidenceRole: "exact_source",
      exactSourcePrecedenceEligible: true,
      family: "wall_timber_lightweight",
      id: "wall.timber_lightweight.exact_imports",
      measuredOrExpectedValuePolicy: "already_present_rights_safe",
      metrics: ["Rw"],
      residualEligible: false,
      route: "wall",
      rowCount: WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS.length,
      sourceKind: "wall_timber_lightweight_source_corpus",
      topologyOwnerFields: ["studType", "studSpacing", "resilientBarSideCount", "boardPackage", "cavityFill"]
    },
    {
      basis: "element_lab",
      blockers: ["linked_holdout_residual_runner_not_globalized_yet"],
      evidenceRole: "holdout_residual",
      exactSourcePrecedenceEligible: false,
      family: "wall_timber_lightweight",
      id: "wall.timber_lightweight.linked_holdouts",
      measuredOrExpectedValuePolicy: "already_present_rights_safe",
      metrics: ["Rw"],
      residualEligible: true,
      route: "wall",
      rowCount: wallTimberHoldoutRows,
      sourceKind: "wall_timber_lightweight_source_corpus",
      topologyOwnerFields: ["supportFamily", "boardPackage", "cavityFill", "metricBasis"]
    },
    {
      basis: "element_lab",
      blockers: [],
      evidenceRole: "calibration_row",
      exactSourcePrecedenceEligible: false,
      family: "wall_triple_leaf_two_cavity",
      id: "wall.triple_leaf.nrc2024.calibration_rows",
      measuredOrExpectedValuePolicy: "already_present_rights_safe",
      metrics: ["Rw"],
      residualEligible: false,
      route: "wall",
      rowCount: tripleLeaf.calibrationAccuracy.rowCount,
      sourceKind: "existing_local_formula_fixture",
      topologyOwnerFields: ["leafGrouping", "internalLeaf", "cavityFill", "sourceFamilyMapping"]
    },
    {
      basis: "element_lab",
      blockers: tripleLeaf.holdoutAccuracy.blockers,
      evidenceRole: "holdout_residual",
      exactSourcePrecedenceEligible: false,
      family: "wall_triple_leaf_two_cavity",
      id: "wall.triple_leaf.nrc2024.holdout_rows",
      measuredOrExpectedValuePolicy: "already_present_rights_safe",
      metrics: ["Rw"],
      residualEligible: true,
      route: "wall",
      rowCount: tripleLeaf.holdoutAccuracy.rowCount,
      sourceKind: "existing_local_formula_fixture",
      topologyOwnerFields: ["leafGrouping", "internalLeaf", "cavityFill", "sourceFamilyMapping"]
    },
    {
      basis: "element_lab",
      blockers: [],
      evidenceRole: "negative_boundary",
      exactSourcePrecedenceEligible: false,
      family: "wall_triple_leaf_two_cavity",
      id: "wall.triple_leaf.negative_boundaries",
      measuredOrExpectedValuePolicy: "not_measured_value",
      metrics: ["Rw"],
      residualEligible: false,
      route: "wall",
      rowCount: tripleLeaf.negativeBoundaryProof.protectedNegativeBoundaryCount,
      sourceKind: "contract_only_boundary",
      topologyOwnerFields: ["wrongFamilyReason", "metricBasis", "sourceScope"]
    },
    {
      basis: "controlled_envelope",
      blockers: ["controlled_envelope_is_regression_guard_not_measured_broad_residual_proof"],
      evidenceRole: "controlled_envelope_guardrail",
      exactSourcePrecedenceEligible: false,
      family: "company_internal_matrix_v6",
      id: "mixed.company_internal_matrix_v6.controlled_envelope",
      measuredOrExpectedValuePolicy: "not_measured_value",
      metrics: ["Rw", "R'w", "DnT,w", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w"],
      residualEligible: false,
      route: "mixed",
      rowCount: readiness.controlledEnvelopeRows,
      sourceKind: "controlled_envelope_matrix",
      topologyOwnerFields: ["route", "family", "basis", "posture", "visibleSurfaceOwner"]
    }
  ];
}

function buildResidualSummaries(): readonly BroadAccuracyFamilyResidualSummary[] {
  const readiness = buildBroadAccuracyCalculatorReadinessContract();
  const steel = buildGateAHSteelFloorFormulaAccuracyBenchmarkContract();
  const tripleLeaf = evaluateWallTripleLeafCalibrationFit();

  return [
    {
      basis: "mixed",
      blockers: ["exact_inventory_not_holdout_residual_proof"],
      calibrationCount: 0,
      exactCount: readiness.floorSourceInventory.exactRows,
      familyId: "floor.exact_systems",
      holdoutResidualCount: 0,
      maxAbsErrorDb: null,
      meanAbsErrorDb: null,
      metric: "Ln,w",
      route: "floor",
      similarityAnchorCount: BOUND_FLOOR_SYSTEMS.length,
      sourceAbsentBudgetOnlyCount: 0
    },
    {
      basis: "element_lab",
      blockers: [],
      calibrationCount: steel.sourceAnchorInventory.ubiqOpenWebExactAnchorRows,
      exactCount: 0,
      familyId: "floor.lightweight_steel.lab_lnw",
      holdoutResidualCount: steel.lnWResidualCaseCount,
      maxAbsErrorDb: steel.maxAbsoluteLnWResidualDb,
      meanAbsErrorDb: steel.meanAbsoluteLnWResidualDb,
      metric: "Ln,w",
      route: "floor",
      similarityAnchorCount: 0,
      sourceAbsentBudgetOnlyCount: 1
    },
    {
      basis: "element_lab",
      blockers: ["measured_same_stack_delta_lw_holdouts_absent"],
      calibrationCount: 0,
      exactCount: 0,
      familyId: "floor.lightweight_steel.lab_delta_lw",
      holdoutResidualCount: steel.deltaLwResidualCaseCount,
      maxAbsErrorDb: null,
      meanAbsErrorDb: null,
      metric: "DeltaLw",
      route: "floor",
      similarityAnchorCount: 0,
      sourceAbsentBudgetOnlyCount: 1
    },
    {
      basis: "element_lab",
      blockers: ["verified_airborne_rows_not_yet_split_into_calibration_and_holdout_sets"],
      calibrationCount: 0,
      exactCount: getVerifiedAirborneCatalogStats().labEntries,
      familyId: "wall.verified_airborne.lab_rw",
      holdoutResidualCount: 0,
      maxAbsErrorDb: null,
      meanAbsErrorDb: null,
      metric: "Rw",
      route: "wall",
      similarityAnchorCount: 0,
      sourceAbsentBudgetOnlyCount: 0
    },
    {
      basis: "element_lab",
      blockers: ["linked_holdout_residual_runner_not_globalized_yet"],
      calibrationCount: 0,
      exactCount: WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS.length,
      familyId: "wall.timber_lightweight.lab_rw",
      holdoutResidualCount: WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.filter((entry) => entry.kind === "linked_holdout")
        .length,
      maxAbsErrorDb: null,
      meanAbsErrorDb: null,
      metric: "Rw",
      route: "wall",
      similarityAnchorCount: 0,
      sourceAbsentBudgetOnlyCount: 0
    },
    {
      basis: "element_lab",
      blockers: tripleLeaf.runtimeBlockers,
      calibrationCount: tripleLeaf.calibrationAccuracy.rowCount,
      exactCount: 0,
      familyId: "wall.triple_leaf_two_cavity.lab_rw",
      holdoutResidualCount: tripleLeaf.holdoutAccuracy.rowCount,
      maxAbsErrorDb: tripleLeaf.holdoutAccuracy.maxAbsErrorDb,
      meanAbsErrorDb: tripleLeaf.holdoutAccuracy.meanAbsErrorDb,
      metric: "Rw",
      route: "wall",
      similarityAnchorCount: 0,
      sourceAbsentBudgetOnlyCount: 0
    },
    {
      basis: "controlled_envelope",
      blockers: ["matrix_rows_are_value_guardrails_not_measured_benchmark_rows"],
      calibrationCount: 0,
      exactCount: 0,
      familyId: "mixed.company_internal_matrix_v6",
      holdoutResidualCount: 0,
      maxAbsErrorDb: null,
      meanAbsErrorDb: null,
      metric: "Rw",
      route: "mixed",
      similarityAnchorCount: 0,
      sourceAbsentBudgetOnlyCount: 0
    }
  ];
}

function buildWeakLaneDebtLedger(): readonly BroadAccuracyWeakLaneDebt[] {
  return [
    {
      activeRuntimeRisk: "legacy_id_current_family_partial",
      basis: "field_apparent",
      blockers: ["floor_system_similarity_anchor_not_first_class", "low_frequency_lnt50_owner_missing_for_partial_field_lane"],
      currentWeakLane: "low_confidence",
      family: "floor_open_web_or_open_box",
      id: "floor.open_web_or_open_box.legacy_low_confidence_family_lane",
      metrics: ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
      priority: 0.96,
      recommendedConversionPath: "similarity_anchor",
      requiredPhysicalInputs: ["supportForm", "carrierDepth", "carrierSpacing", "lowerAssembly", "CI50_2500"],
      route: "floor",
      supportedReadinessCoverage: false,
      tracePaths: [
        "packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts",
        "packages/engine/src/impact-validation-regime.ts"
      ]
    },
    {
      activeRuntimeRisk: "active_runtime_possible",
      basis: "element_lab",
      blockers: ["local_material_mapping_must_survive_hostile_reorders", "source_family_fit_must_not_alias_rockwool_exact_rows"],
      currentWeakLane: "multileaf_screening_blend",
      family: "wall_triple_leaf_two_cavity",
      id: "wall.multileaf_screening_blend.rockwool_split_rw41",
      metrics: ["Rw", "R'w", "DnT,w"],
      priority: 0.92,
      recommendedConversionPath: "calibrated_family_solver",
      requiredPhysicalInputs: ["leafGrouping", "cavityDepths", "internalLeaf", "materialMapping", "metricBasis"],
      route: "wall",
      supportedReadinessCoverage: false,
      tracePaths: [
        "packages/engine/src/dynamic-airborne-gate-g-rockwool.ts",
        "packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure.ts"
      ]
    },
    {
      activeRuntimeRisk: "active_runtime_possible",
      basis: "element_lab",
      blockers: ["screening_basis_enum_can_still_mask_unowned_family_solver"],
      currentWeakLane: "screening_fallback",
      family: "generic_airborne_route",
      id: "wall.generic_airborne.screening_fallback_basis",
      metrics: ["Rw", "STC", "C", "Ctr"],
      priority: 0.9,
      recommendedConversionPath: "source_absent_family_solver",
      requiredPhysicalInputs: ["familyClassifier", "leafCount", "surfaceMass", "cavityTopology", "connectionType"],
      route: "wall",
      supportedReadinessCoverage: false,
      tracePaths: [
        "packages/shared/src/domain/airborne-basis.ts",
        "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts"
      ]
    },
    {
      activeRuntimeRisk: "active_runtime_possible",
      basis: "element_lab",
      blockers: ["sharp_davy_delegate_exists_but_screening_candidate_still_available"],
      currentWeakLane: "screening_fallback",
      family: "wall_double_leaf_framed",
      id: "wall.double_leaf_framed.screening_fallback_candidate",
      metrics: ["Rw", "STC", "C", "Ctr"],
      priority: 0.86,
      recommendedConversionPath: "source_absent_family_solver",
      requiredPhysicalInputs: ["studType", "studSpacing", "boardPackage", "cavityDepth", "cavityFill", "connectionType"],
      route: "wall",
      supportedReadinessCoverage: false,
      tracePaths: ["packages/engine/src/dynamic-airborne-gate-s-double-leaf-framed.ts"]
    },
    {
      activeRuntimeRisk: "active_runtime_possible",
      basis: "element_lab",
      blockers: ["validation_regime_still_has_low_confidence_bucket", "benchmark_runner_must_rank_or_retire_each_case"],
      currentWeakLane: "low_confidence",
      family: "impact_validation_regime",
      id: "floor.impact_validation.low_confidence_estimate_bucket",
      metrics: ["Ln,w", "DeltaLw"],
      priority: 0.74,
      recommendedConversionPath: "source_absent_family_solver",
      requiredPhysicalInputs: ["supportFamily", "finishPackage", "dynamicStiffness", "loadBasis", "lowerAssembly"],
      route: "floor",
      supportedReadinessCoverage: false,
      tracePaths: ["packages/engine/src/impact-validation-regime.ts", "packages/engine/src/impact-validation-benchmark.test.ts"]
    },
    {
      activeRuntimeRisk: "historical_contract_guard",
      basis: "element_lab",
      blockers: ["gate_bq_replaced_the_matrix_blocker_but_history_must_stay_excluded_from_readiness_counts"],
      currentWeakLane: "low_confidence",
      family: "reinforced_concrete_combined_floor",
      id: "floor.reinforced_concrete.low_confidence_cleanup_history",
      metrics: ["Ln,w", "DeltaLw"],
      priority: 0.42,
      recommendedConversionPath: "historical_only_after_existing_cleanup",
      requiredPhysicalInputs: ["baseSlabOrFloor", "upperTreatment", "dynamicStiffness", "loadBasis", "lowerAssembly"],
      route: "floor",
      supportedReadinessCoverage: false,
      tracePaths: [
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bq.ts",
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bq-coverage-matrix-refresh-after-reinforced-concrete-cleanup-contract.test.ts"
      ]
    }
  ];
}

function buildSimilarityAnchorPolicy(): BroadAccuracySimilarityAnchorPolicy {
  return {
    distanceDimensions: [
      "route",
      "metric_basis",
      "support_family",
      "structural_carrier",
      "leaf_or_cavity_count",
      "role_topology",
      "thickness_and_surface_mass",
      "dynamic_stiffness_and_load_basis",
      "opening_or_leak_package",
      "field_or_building_room_context"
    ],
    examples: [
      {
        anchorUse: "exact_override",
        id: "same_topology_metric_basis_rank_zero",
        rank: 0,
        reason: "same topology, same metric, and same basis remains an exact measured override"
      },
      {
        anchorUse: "anchor_only",
        id: "nearby_open_web_floor_same_metric_family",
        rank: 1,
        reason: "compatible support family and metric basis can anchor a later correction method"
      },
      {
        anchorUse: "rejected",
        id: "lab_rw_to_field_dntw_alias",
        rank: null,
        reason: "lab element Rw cannot anchor field DnT,w without a field adapter owner"
      },
      {
        anchorUse: "rejected",
        id: "iso_lnw_to_astm_iic_alias",
        rank: null,
        reason: "ISO impact metrics cannot anchor ASTM IIC/AIIC"
      },
      {
        anchorUse: "rejected",
        id: "wrong_support_family_steel_to_timber",
        rank: null,
        reason: "wrong structural support family is a negative boundary, not an anchor"
      }
    ],
    hardRejectionRules: [
      "wrong_metric_basis",
      "lab_to_field_or_field_to_building_alias",
      "iso_to_astm_alias",
      "wrong_support_family",
      "missing_physical_owner_fields",
      "source_row_without_topology_ownership"
    ]
  };
}

function buildNextLaneCandidates(): readonly BroadAccuracyNextLaneCandidate[] {
  return [
    {
      category: "similarity_anchor_runtime",
      id: "floor_system_similarity_anchor_for_open_web_open_box_variants",
      reason: "largest existing floor evidence pool can turn nearby measured rows into compatible anchors without a broad source crawl",
      runtimeMovementAllowedInThisSlice: false,
      score: 1.82,
      selected: true,
      sourceRowsRequiredForSelection: false,
      unlocksMetrics: ["Ln,w", "L'n,w", "L'nT,w"]
    },
    {
      category: "weak_lane_conversion",
      id: "wall_multileaf_screening_blend_to_calibrated_triple_leaf_solver",
      reason: "existing calibration and holdout fit is promising, but material mapping and hostile reorders still need a narrower runtime lane",
      runtimeMovementAllowedInThisSlice: false,
      score: 1.61,
      selected: false,
      sourceRowsRequiredForSelection: false,
      unlocksMetrics: ["Rw", "R'w", "DnT,w"]
    },
    {
      category: "residual_backtest",
      id: "wall_timber_lightweight_holdout_residual_runner",
      reason: "exact imports and linked holdouts exist, but the residual runner is not globalized yet",
      runtimeMovementAllowedInThisSlice: false,
      score: 1.34,
      selected: false,
      sourceRowsRequiredForSelection: false,
      unlocksMetrics: ["Rw"]
    },
    {
      category: "source_owned_holdout_acquisition",
      id: "steel_floor_same_stack_delta_lw_holdout_acquisition",
      reason: "DeltaLw still has zero source-owned same-stack measured residual rows",
      runtimeMovementAllowedInThisSlice: false,
      score: 0.92,
      selected: false,
      sourceRowsRequiredForSelection: true,
      unlocksMetrics: ["DeltaLw"]
    },
    {
      category: "unsupported_boundary",
      id: "astm_iic_aiic_detour",
      reason: "ASTM metrics remain a boundary and do not improve the ISO calculator core",
      runtimeMovementAllowedInThisSlice: false,
      score: 0.14,
      selected: false,
      sourceRowsRequiredForSelection: true,
      unlocksMetrics: ["IIC", "AIIC"]
    }
  ];
}

function sumRows(
  rows: readonly BroadAccuracyReferenceCase[],
  predicate: (row: BroadAccuracyReferenceCase) => boolean
): number {
  return rows.filter(predicate).reduce((sum, row) => sum + row.rowCount, 0);
}

export function buildBroadAccuracyReferenceBenchmarkExpansionContract(): BroadAccuracyReferenceBenchmarkExpansionContract {
  const benchmarkLedger = buildBenchmarkLedger();
  const weakLaneDebtLedger = buildWeakLaneDebtLedger();
  const candidates = buildNextLaneCandidates();
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Broad accuracy benchmark expansion has no selected next lane");
  }

  return {
    benchmarkLedger,
    canClaimBroadAccuracyReady: false,
    ledgerSummary: {
      controlledEnvelopeRows: sumRows(
        benchmarkLedger,
        (row) => row.evidenceRole === "controlled_envelope_guardrail"
      ),
      exactSourceRowsByGroup: sumRows(benchmarkLedger, (row) => row.evidenceRole === "exact_source"),
      formulaRegressionAnchorRows: sumRows(benchmarkLedger, (row) => row.evidenceRole === "formula_regression_anchor"),
      holdoutResidualRows: sumRows(benchmarkLedger, (row) => row.evidenceRole === "holdout_residual"),
      referenceGroups: benchmarkLedger.length,
      sourceAbsentBudgetOnlyRows: sumRows(benchmarkLedger, (row) => row.evidenceRole === "source_absent_budget_only"),
      weakLaneDebtRows: weakLaneDebtLedger.length,
      weakLaneRowsCountedAsSupportedReadiness: 0
    },
    landedGate: BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_LANDED_GATE,
    nextLaneSelection: {
      candidates,
      selectedCandidate,
      selectedNextAction: BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTED_NEXT_FILE
    },
    noRuntimeValueMovement: true,
    previousRefocus: {
      selectedNextAction: BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_CALCULATOR_REFOCUS_SELECTION_STATUS
    },
    residualSummaries: buildResidualSummaries(),
    selectedNextAction: BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTED_NEXT_FILE,
    selectionStatus: BROAD_ACCURACY_REFERENCE_BENCHMARK_EXPANSION_SELECTION_STATUS,
    similarityAnchorPolicy: buildSimilarityAnchorPolicy(),
    sourceInventoryIsStillNotProductGoal: true,
    weakLaneDebtLedger
  };
}
