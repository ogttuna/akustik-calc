import type { AirborneContext, LayerInput, MaterialDefinition } from "@dynecho/shared";

import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTION_STATUS
} from "./broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-coverage-refresh";
import { computeLayerSurfaceMassKgM2 } from "./layer-surface-mass";
import { ksRound1 } from "./math";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";
import {
  evaluateWallTripleLeafLocalMaterialMapping,
  type WallTripleLeafLocalMaterialMappingEvaluation
} from "./wall-triple-leaf-local-material-mapping";
import { validateWallTripleLeafLayerGroups } from "./wall-triple-leaf-topology-readiness";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_LANDED_GATE =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_mapping_plan";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTION_STATUS =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_mapping_landed_no_runtime_selected_formula_corridor";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_ACTION =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_formula_corridor_plan";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-formula-corridor-contract.test.ts";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_LABEL =
  "wall triple-leaf local substitution formula corridor";

export type BroadAccuracyWallTripleLeafLocalSubstitutionDecisionId =
  | "duplicate_or_out_of_range_grouping_boundary"
  | "field_or_building_basis_boundary"
  | "generic_gypsum_glasswool_source_like"
  | "local_rockwool_mlv_plaster_custom_stack"
  | "nrc_type_c_glass_fiber_control"
  | "partial_grouped_topology_boundary";

export type BroadAccuracyWallTripleLeafLocalSubstitutionStatus =
  | "basis_boundary"
  | "formula_corridor_candidate"
  | "input_boundary"
  | "owned_control";

export type BroadAccuracyWallTripleLeafLocalSubstitutionRow = {
  decisionId: BroadAccuracyWallTripleLeafLocalSubstitutionDecisionId;
  requiredFormulaOwners: readonly string[];
  requiredRuntimeOwners: readonly string[];
  status: BroadAccuracyWallTripleLeafLocalSubstitutionStatus;
  supportedRuntimeNow: boolean;
};

export type BroadAccuracyWallTripleLeafLocalSubstitutionEvaluation = {
  decisionId: BroadAccuracyWallTripleLeafLocalSubstitutionDecisionId;
  formulaCorridorCandidate: boolean;
  materialIds: readonly string[];
  noRuntimeValueMovement: true;
  requiredFormulaOwners: readonly string[];
  requiredRuntimeOwners: readonly string[];
  selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_FILE;
  status: BroadAccuracyWallTripleLeafLocalSubstitutionStatus;
  surfaceMassKgM2: number;
  topologyBlockers: readonly string[];
  wallTripleLeafGateG4Snapshot?: WallTripleLeafLocalMaterialMappingEvaluation;
};

export type BroadAccuracyWallTripleLeafLocalSubstitutionMappingSummary = {
  basisBoundaryRowIds: readonly BroadAccuracyWallTripleLeafLocalSubstitutionDecisionId[];
  formulaCandidateRowIds: readonly BroadAccuracyWallTripleLeafLocalSubstitutionDecisionId[];
  inputBoundaryRowIds: readonly BroadAccuracyWallTripleLeafLocalSubstitutionDecisionId[];
  noRuntimeValueMovement: true;
  ownedControlRowIds: readonly BroadAccuracyWallTripleLeafLocalSubstitutionDecisionId[];
  rowCount: number;
  selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_LABEL;
};

export type BroadAccuracyWallTripleLeafLocalSubstitutionMappingContract = {
  landedGate: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_LANDED_GATE;
  mappingRows: readonly BroadAccuracyWallTripleLeafLocalSubstitutionRow[];
  noRuntimeValueMovement: true;
  previousCoverageRefresh: {
    landedGate: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_LANDED_GATE;
    selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
    selectionStatus: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTION_STATUS;
  };
  selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_LABEL;
  selectionStatus: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTION_STATUS;
  summary: BroadAccuracyWallTripleLeafLocalSubstitutionMappingSummary;
};

const GENERIC_GYPSUM_GLASSWOOL_FORMULA_OWNERS = [
  "genericGypsumBoardToTypeCSurfaceMassAndStiffnessOwner",
  "glasswoolBoardToNrcBattFlowResistivityOwner",
  "cavityDepthAndFillCorrectionOwner",
  "supportTopologyEquivalenceOwner",
  "sourceAbsentSubstitutionUncertaintyBudgetOwner"
] as const;

const LOCAL_ROCKWOOL_MLV_PLASTER_FORMULA_OWNERS = [
  "rockwoolToGlassFiberFlowResistivityDensityOwner",
  "mlvLimpMassPositionCorrectionOwner",
  "gypsumPlasterFinishMassDampingCorrectionOwner",
  "shortCavityDepthCorrectionOwner",
  "nonSourceFamilySubstitutionUncertaintyBudgetOwner",
  "pairedNegativeBoundaryOwner"
] as const;

const VISIBLE_RUNTIME_OWNERS = [
  "pairedEngineValuePinTestsOwner",
  "pairedWorkbenchCardReportApiParityOwner",
  "fieldBuildingNonAliasBoundaryOwner"
] as const;

type ResolvedSubstitutionLayer = LayerInput & {
  material: MaterialDefinition;
  surfaceMassKgM2: number;
};

function resolveLayers(
  layers: readonly LayerInput[],
  catalog: readonly MaterialDefinition[]
): readonly ResolvedSubstitutionLayer[] {
  return layers.map((layer) => {
    const material = resolveMaterial(layer.materialId, catalog);

    return {
      ...layer,
      material,
      surfaceMassKgM2: computeLayerSurfaceMassKgM2(layer, material)
    };
  });
}

function hasKnownToken(value: string | undefined): boolean {
  return typeof value === "string" && value !== "unknown" && value !== "auto";
}

function getMaterialIds(layers: readonly ResolvedSubstitutionLayer[]): readonly string[] {
  return [...new Set(layers.map((layer) => layer.material.id))].sort();
}

function getTopologyBlockers(input: {
  airborneContext: AirborneContext;
  layerCount: number;
}): readonly string[] {
  const topology = input.airborneContext.wallTopology;
  const blockers: string[] = [];
  const validation = validateWallTripleLeafLayerGroups({
    layerCount: input.layerCount,
    topology
  });

  if (!validation.valid) {
    blockers.push(...validation.issueIds);
  }

  if (topology?.topologyMode !== "grouped_triple_leaf") {
    blockers.push("wallTopology.topologyMode");
  }

  if (!Array.isArray(topology?.sideALeafLayerIndices) || topology.sideALeafLayerIndices.length === 0) {
    blockers.push("wallTopology.sideALeafLayerIndices");
  }

  if (!Array.isArray(topology?.cavity1LayerIndices) || topology.cavity1LayerIndices.length === 0) {
    blockers.push("wallTopology.cavity1LayerIndices");
  }

  if (!Array.isArray(topology?.internalLeafLayerIndices) || topology.internalLeafLayerIndices.length === 0) {
    blockers.push("wallTopology.internalLeafLayerIndices");
  }

  if (!Array.isArray(topology?.cavity2LayerIndices) || topology.cavity2LayerIndices.length === 0) {
    blockers.push("wallTopology.cavity2LayerIndices");
  }

  if (!Array.isArray(topology?.sideBLeafLayerIndices) || topology.sideBLeafLayerIndices.length === 0) {
    blockers.push("wallTopology.sideBLeafLayerIndices");
  }

  if (typeof topology?.cavity1DepthMm !== "number" || !Number.isFinite(topology.cavity1DepthMm)) {
    blockers.push("wallTopology.cavity1DepthMm");
  }

  if (typeof topology?.cavity2DepthMm !== "number" || !Number.isFinite(topology.cavity2DepthMm)) {
    blockers.push("wallTopology.cavity2DepthMm");
  }

  if (!hasKnownToken(topology?.cavity1FillCoverage)) {
    blockers.push("wallTopology.cavity1FillCoverage");
  }

  if (!hasKnownToken(topology?.cavity2FillCoverage)) {
    blockers.push("wallTopology.cavity2FillCoverage");
  }

  if (!hasKnownToken(topology?.cavity1AbsorptionClass)) {
    blockers.push("wallTopology.cavity1AbsorptionClass");
  }

  if (!hasKnownToken(topology?.cavity2AbsorptionClass)) {
    blockers.push("wallTopology.cavity2AbsorptionClass");
  }

  if (!hasKnownToken(topology?.internalLeafCoupling)) {
    blockers.push("wallTopology.internalLeafCoupling");
  }

  if (!hasKnownToken(topology?.supportTopology)) {
    blockers.push("wallTopology.supportTopology");
  }

  return blockers;
}

function hasOnlyMaterials(materialIds: readonly string[], allowed: readonly string[]): boolean {
  return materialIds.every((id) => allowed.includes(id));
}

function matchesNrcSourceControl(materialIds: readonly string[]): boolean {
  return (
    hasOnlyMaterials(materialIds, ["nrc_glass_fiber_batt", "nrc_type_c_gypsum_board"]) &&
    materialIds.includes("nrc_glass_fiber_batt") &&
    materialIds.includes("nrc_type_c_gypsum_board")
  );
}

function matchesGenericGypsumGlasswool(materialIds: readonly string[]): boolean {
  return (
    hasOnlyMaterials(materialIds, ["glasswool_board", "gypsum_board"]) &&
    materialIds.includes("glasswool_board") &&
    materialIds.includes("gypsum_board")
  );
}

function matchesLocalRockwoolMlvPlaster(materialIds: readonly string[]): boolean {
  return (
    hasOnlyMaterials(materialIds, ["gypsum_board", "gypsum_plaster", "mlv", "rockwool"]) &&
    materialIds.includes("gypsum_board") &&
    materialIds.includes("gypsum_plaster") &&
    materialIds.includes("mlv") &&
    materialIds.includes("rockwool")
  );
}

function buildEvaluation(input: {
  decisionId: BroadAccuracyWallTripleLeafLocalSubstitutionDecisionId;
  formulaCorridorCandidate: boolean;
  materialIds: readonly string[];
  requiredFormulaOwners: readonly string[];
  requiredRuntimeOwners: readonly string[];
  status: BroadAccuracyWallTripleLeafLocalSubstitutionStatus;
  surfaceMassKgM2: number;
  topologyBlockers: readonly string[];
  wallTripleLeafGateG4Snapshot?: WallTripleLeafLocalMaterialMappingEvaluation;
}): BroadAccuracyWallTripleLeafLocalSubstitutionEvaluation {
  return {
    decisionId: input.decisionId,
    formulaCorridorCandidate: input.formulaCorridorCandidate,
    materialIds: input.materialIds,
    noRuntimeValueMovement: true,
    requiredFormulaOwners: input.requiredFormulaOwners,
    requiredRuntimeOwners: input.requiredRuntimeOwners,
    selectedNextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_FILE,
    status: input.status,
    surfaceMassKgM2: input.surfaceMassKgM2,
    topologyBlockers: input.topologyBlockers,
    wallTripleLeafGateG4Snapshot: input.wallTripleLeafGateG4Snapshot
  };
}

export function evaluateBroadAccuracyWallTripleLeafLocalSubstitutionMapping(input: {
  airborneContext: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
}): BroadAccuracyWallTripleLeafLocalSubstitutionEvaluation {
  const catalog = input.catalog ?? getDefaultMaterialCatalog();
  const resolvedLayers = resolveLayers(input.layers, catalog);
  const materialIds = getMaterialIds(resolvedLayers);
  const surfaceMassKgM2 = ksRound1(resolvedLayers.reduce((sum, layer) => sum + layer.surfaceMassKgM2, 0));

  if (input.airborneContext.contextMode !== "element_lab") {
    return buildEvaluation({
      decisionId: "field_or_building_basis_boundary",
      formulaCorridorCandidate: false,
      materialIds,
      requiredFormulaOwners: ["explicitFieldOrBuildingAdapterOwner"],
      requiredRuntimeOwners: [],
      status: "basis_boundary",
      surfaceMassKgM2,
      topologyBlockers: []
    });
  }

  const topologyBlockers = getTopologyBlockers({
    airborneContext: input.airborneContext,
    layerCount: input.layers.length
  });
  const hasInvalidLayerGroups =
    topologyBlockers.includes("duplicate_layer_group_indices") || topologyBlockers.includes("out_of_range_layer_group_indices");

  if (hasInvalidLayerGroups) {
    return buildEvaluation({
      decisionId: "duplicate_or_out_of_range_grouping_boundary",
      formulaCorridorCandidate: false,
      materialIds,
      requiredFormulaOwners: ["nonOverlappingLeafGroupingOwner"],
      requiredRuntimeOwners: [],
      status: "input_boundary",
      surfaceMassKgM2,
      topologyBlockers
    });
  }

  if (topologyBlockers.length > 0) {
    return buildEvaluation({
      decisionId: "partial_grouped_topology_boundary",
      formulaCorridorCandidate: false,
      materialIds,
      requiredFormulaOwners: ["completeGroupedTripleLeafTopologyOwner"],
      requiredRuntimeOwners: [],
      status: "input_boundary",
      surfaceMassKgM2,
      topologyBlockers
    });
  }

  if (matchesNrcSourceControl(materialIds)) {
    return buildEvaluation({
      decisionId: "nrc_type_c_glass_fiber_control",
      formulaCorridorCandidate: false,
      materialIds,
      requiredFormulaOwners: [],
      requiredRuntimeOwners: [],
      status: "owned_control",
      surfaceMassKgM2,
      topologyBlockers: []
    });
  }

  if (matchesGenericGypsumGlasswool(materialIds)) {
    return buildEvaluation({
      decisionId: "generic_gypsum_glasswool_source_like",
      formulaCorridorCandidate: true,
      materialIds,
      requiredFormulaOwners: GENERIC_GYPSUM_GLASSWOOL_FORMULA_OWNERS,
      requiredRuntimeOwners: VISIBLE_RUNTIME_OWNERS,
      status: "formula_corridor_candidate",
      surfaceMassKgM2,
      topologyBlockers: []
    });
  }

  if (matchesLocalRockwoolMlvPlaster(materialIds)) {
    const wallTripleLeafGateG4Snapshot = evaluateWallTripleLeafLocalMaterialMapping({
      airborneContext: input.airborneContext,
      catalog,
      layers: input.layers
    });

    return buildEvaluation({
      decisionId: "local_rockwool_mlv_plaster_custom_stack",
      formulaCorridorCandidate: true,
      materialIds,
      requiredFormulaOwners: LOCAL_ROCKWOOL_MLV_PLASTER_FORMULA_OWNERS,
      requiredRuntimeOwners: VISIBLE_RUNTIME_OWNERS,
      status: "formula_corridor_candidate",
      surfaceMassKgM2,
      topologyBlockers: [],
      wallTripleLeafGateG4Snapshot
    });
  }

  return buildEvaluation({
    decisionId: "partial_grouped_topology_boundary",
    formulaCorridorCandidate: false,
    materialIds,
    requiredFormulaOwners: ["materialFamilyMappingOwner"],
    requiredRuntimeOwners: [],
    status: "input_boundary",
    surfaceMassKgM2,
    topologyBlockers: ["materialFamilyMappingOwner"]
  });
}

export function buildBroadAccuracyWallTripleLeafLocalSubstitutionMappingRows():
  readonly BroadAccuracyWallTripleLeafLocalSubstitutionRow[] {
  return [
    {
      decisionId: "nrc_type_c_glass_fiber_control",
      requiredFormulaOwners: [],
      requiredRuntimeOwners: [],
      status: "owned_control",
      supportedRuntimeNow: true
    },
    {
      decisionId: "generic_gypsum_glasswool_source_like",
      requiredFormulaOwners: GENERIC_GYPSUM_GLASSWOOL_FORMULA_OWNERS,
      requiredRuntimeOwners: VISIBLE_RUNTIME_OWNERS,
      status: "formula_corridor_candidate",
      supportedRuntimeNow: false
    },
    {
      decisionId: "local_rockwool_mlv_plaster_custom_stack",
      requiredFormulaOwners: LOCAL_ROCKWOOL_MLV_PLASTER_FORMULA_OWNERS,
      requiredRuntimeOwners: VISIBLE_RUNTIME_OWNERS,
      status: "formula_corridor_candidate",
      supportedRuntimeNow: false
    },
    {
      decisionId: "field_or_building_basis_boundary",
      requiredFormulaOwners: ["explicitFieldOrBuildingAdapterOwner"],
      requiredRuntimeOwners: [],
      status: "basis_boundary",
      supportedRuntimeNow: false
    },
    {
      decisionId: "duplicate_or_out_of_range_grouping_boundary",
      requiredFormulaOwners: ["nonOverlappingLeafGroupingOwner"],
      requiredRuntimeOwners: [],
      status: "input_boundary",
      supportedRuntimeNow: false
    },
    {
      decisionId: "partial_grouped_topology_boundary",
      requiredFormulaOwners: ["completeGroupedTripleLeafTopologyOwner", "materialFamilyMappingOwner"],
      requiredRuntimeOwners: [],
      status: "input_boundary",
      supportedRuntimeNow: false
    }
  ];
}

export function summarizeBroadAccuracyWallTripleLeafLocalSubstitutionMapping(
  rows: readonly BroadAccuracyWallTripleLeafLocalSubstitutionRow[]
): BroadAccuracyWallTripleLeafLocalSubstitutionMappingSummary {
  return {
    basisBoundaryRowIds: rows.filter((row) => row.status === "basis_boundary").map((row) => row.decisionId),
    formulaCandidateRowIds: rows.filter((row) => row.status === "formula_corridor_candidate").map((row) => row.decisionId),
    inputBoundaryRowIds: rows.filter((row) => row.status === "input_boundary").map((row) => row.decisionId),
    noRuntimeValueMovement: true,
    ownedControlRowIds: rows.filter((row) => row.status === "owned_control").map((row) => row.decisionId),
    rowCount: rows.length,
    selectedNextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_LABEL
  };
}

export function buildBroadAccuracyWallTripleLeafLocalSubstitutionMappingContract():
  BroadAccuracyWallTripleLeafLocalSubstitutionMappingContract {
  const mappingRows = buildBroadAccuracyWallTripleLeafLocalSubstitutionMappingRows();

  return {
    landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_LANDED_GATE,
    mappingRows,
    noRuntimeValueMovement: true,
    previousCoverageRefresh: {
      landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTION_STATUS
    },
    selectedNextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTION_STATUS,
    summary: summarizeBroadAccuracyWallTripleLeafLocalSubstitutionMapping(mappingRows)
  };
}
