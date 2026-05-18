import type { AirborneContext, LayerInput, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";

import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTION_STATUS,
  evaluateBroadAccuracyWallTripleLeafLocalSubstitutionMapping,
  type BroadAccuracyWallTripleLeafLocalSubstitutionDecisionId,
  type BroadAccuracyWallTripleLeafLocalSubstitutionEvaluation
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-mapping";
import { computeLayerSurfaceMassKgM2 } from "./layer-surface-mass";
import { clamp, ksRound1, log10Safe } from "./math";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_LANDED_GATE =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_formula_corridor_plan";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTION_STATUS =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_formula_corridor_landed_no_runtime_selected_runtime_corridor";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor_plan";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor-contract.test.ts";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL =
  "wall triple-leaf local substitution runtime corridor";

export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SOURCE_ANCHOR_RW_DB = 49;
export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SOURCE_BOARD_MASS_KG_M2 = 9.8;
export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SOURCE_CAVITY_DEPTH_MM = 92.1;
export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SOURCE_FLOW_RESISTIVITY_PA_S_M2 = 10_000;
export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_GENERIC_BUDGET_DB = 6;
export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LOCAL_STACK_BUDGET_DB = 8;

export type BroadAccuracyWallTripleLeafLocalSubstitutionFormulaCandidateId =
  | "generic_gypsum_glasswool_source_like_rw_formula"
  | "local_rockwool_mlv_plaster_custom_stack_rw_formula";

export type BroadAccuracyWallTripleLeafLocalSubstitutionFormulaStatus =
  | "blocked_basis_alias"
  | "blocked_input_contract"
  | "blocked_metric_adapter_missing"
  | "formula_corridor_defined_runtime_gate_required"
  | "owned_control_no_substitution_formula_needed";

export type BroadAccuracyWallTripleLeafLocalSubstitutionFormulaTermId =
  | "board_leaf_surface_mass_and_stiffness_substitution"
  | "porous_absorber_flow_resistivity_substitution"
  | "cavity_depth_and_support_substitution"
  | "mlv_limp_mass_position_substitution"
  | "plaster_finish_mass_damping_substitution";

export type BroadAccuracyWallTripleLeafLocalSubstitutionFormulaTerm = {
  correctionDb: number;
  description: string;
  owner: string;
  requiredInputs: readonly string[];
  runtimeOwnedInGate: false;
  termId: BroadAccuracyWallTripleLeafLocalSubstitutionFormulaTermId;
};

export type BroadAccuracyWallTripleLeafLocalSubstitutionToleranceBudget = {
  metricId: "Rw";
  notMeasuredEvidence: true;
  terms: readonly string[];
  toleranceDb: number;
  totalBudgetDb: number;
};

export type BroadAccuracyWallTripleLeafLocalSubstitutionFormulaEvaluation = {
  affectedFormulaOutputs: readonly RequestedOutputId[];
  blockedFormulaOutputs: readonly RequestedOutputId[];
  candidateId: BroadAccuracyWallTripleLeafLocalSubstitutionFormulaCandidateId | null;
  designCorridorRwDb: number | null;
  exactMeasuredRowsRemainPrecedence: true;
  formulaTerms: readonly BroadAccuracyWallTripleLeafLocalSubstitutionFormulaTerm[];
  mappingDecisionId: BroadAccuracyWallTripleLeafLocalSubstitutionDecisionId;
  mappingSnapshot: BroadAccuracyWallTripleLeafLocalSubstitutionEvaluation;
  noRuntimeValueMovement: true;
  proposedRuntimeRwDb: null;
  runtimePromotionAllowedInGate: false;
  selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_FILE;
  sourceAnchorRwDb: typeof BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SOURCE_ANCHOR_RW_DB;
  status: BroadAccuracyWallTripleLeafLocalSubstitutionFormulaStatus;
  toleranceBudget: BroadAccuracyWallTripleLeafLocalSubstitutionToleranceBudget | null;
};

export type BroadAccuracyWallTripleLeafLocalSubstitutionFormulaCorridorContract = {
  candidateFormulaRows: readonly BroadAccuracyWallTripleLeafLocalSubstitutionFormulaEvaluation[];
  exactMeasuredRowsRemainPrecedence: true;
  landedGate: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_LANDED_GATE;
  metricBoundaries: {
    buildingPredictionMetricsBlocked: true;
    fieldMetricsBlocked: true;
    stcCAndCtrAdaptersMissing: true;
  };
  noRuntimeValueMovement: true;
  previousMapping: {
    landedGate: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_LANDED_GATE;
    selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_FILE;
    selectionStatus: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTION_STATUS;
  };
  runtimePromotionAllowedInGate: false;
  selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL;
  selectionStatus: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTION_STATUS;
};

type ResolvedFormulaLayer = LayerInput & {
  material: MaterialDefinition;
  surfaceMassKgM2: number;
};

const FORMULA_RW_OUTPUTS = new Set<RequestedOutputId>(["Rw"]);

function resolveFormulaLayers(
  layers: readonly LayerInput[],
  catalog: readonly MaterialDefinition[]
): readonly ResolvedFormulaLayer[] {
  return layers.map((layer) => {
    const material = resolveMaterial(layer.materialId, catalog);

    return {
      ...layer,
      material,
      surfaceMassKgM2: computeLayerSurfaceMassKgM2(layer, material)
    };
  });
}

function getTopology(airborneContext: AirborneContext): NonNullable<AirborneContext["wallTopology"]> {
  const topology = airborneContext.wallTopology;

  if (!topology) {
    throw new Error("Formula corridor requires wall topology after mapping admission.");
  }

  return topology;
}

function sumSurfaceMass(
  layers: readonly ResolvedFormulaLayer[],
  indices: readonly number[] | undefined
): number {
  if (!indices) {
    return 0;
  }

  return indices.reduce((sum, index) => sum + (layers[index]?.surfaceMassKgM2 ?? 0), 0);
}

function averageLeafSurfaceMass(
  layers: readonly ResolvedFormulaLayer[],
  topology: NonNullable<AirborneContext["wallTopology"]>
): number {
  const leafMasses = [
    sumSurfaceMass(layers, topology.sideALeafLayerIndices),
    sumSurfaceMass(layers, topology.internalLeafLayerIndices),
    sumSurfaceMass(layers, topology.sideBLeafLayerIndices)
  ].filter((value) => Number.isFinite(value) && value > 0);

  if (leafMasses.length === 0) {
    return BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SOURCE_BOARD_MASS_KG_M2;
  }

  return leafMasses.reduce((sum, value) => sum + value, 0) / leafMasses.length;
}

function averageCavityDepth(topology: NonNullable<AirborneContext["wallTopology"]>): number {
  const depths = [topology.cavity1DepthMm, topology.cavity2DepthMm].filter(
    (value): value is number => typeof value === "number" && Number.isFinite(value) && value > 0
  );

  if (depths.length === 0) {
    return BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SOURCE_CAVITY_DEPTH_MM;
  }

  return depths.reduce((sum, value) => sum + value, 0) / depths.length;
}

function averageCavityFlowResistivity(
  layers: readonly ResolvedFormulaLayer[],
  topology: NonNullable<AirborneContext["wallTopology"]>
): number {
  const indices = [...(topology.cavity1LayerIndices ?? []), ...(topology.cavity2LayerIndices ?? [])];
  const values = indices
    .map((index) => layers[index]?.material.acoustic?.flowResistivityPaSM2)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value) && value > 0);

  if (values.length === 0) {
    return BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SOURCE_FLOW_RESISTIVITY_PA_S_M2;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function containsMaterial(layers: readonly ResolvedFormulaLayer[], materialId: string): boolean {
  return layers.some((layer) => layer.material.id === materialId);
}

function splitOutputs(targetOutputs: readonly RequestedOutputId[]): {
  affectedFormulaOutputs: readonly RequestedOutputId[];
  blockedFormulaOutputs: readonly RequestedOutputId[];
} {
  const requestedOutputs = targetOutputs.length > 0 ? targetOutputs : (["Rw"] as const);

  return {
    affectedFormulaOutputs: requestedOutputs.filter((output) => FORMULA_RW_OUTPUTS.has(output)),
    blockedFormulaOutputs: requestedOutputs.filter((output) => !FORMULA_RW_OUTPUTS.has(output))
  };
}

function buildBudget(input: {
  candidateId: BroadAccuracyWallTripleLeafLocalSubstitutionFormulaCandidateId;
  toleranceDb: number;
}): BroadAccuracyWallTripleLeafLocalSubstitutionToleranceBudget {
  return {
    metricId: "Rw",
    notMeasuredEvidence: true,
    terms: [
      `${input.candidateId}:source_family_anchor_uncertainty`,
      `${input.candidateId}:material_substitution_uncertainty`,
      `${input.candidateId}:topology_and_cavity_simplification_uncertainty`,
      `${input.candidateId}:missing_runtime_holdout_uncertainty`
    ],
    toleranceDb: input.toleranceDb,
    totalBudgetDb: input.toleranceDb
  };
}

function buildFormulaTerm(input: BroadAccuracyWallTripleLeafLocalSubstitutionFormulaTerm):
  BroadAccuracyWallTripleLeafLocalSubstitutionFormulaTerm {
  return input;
}

function buildGenericFormula(input: {
  layers: readonly ResolvedFormulaLayer[];
  topology: NonNullable<AirborneContext["wallTopology"]>;
}): {
  candidateId: "generic_gypsum_glasswool_source_like_rw_formula";
  designCorridorRwDb: number;
  formulaTerms: readonly BroadAccuracyWallTripleLeafLocalSubstitutionFormulaTerm[];
  toleranceBudget: BroadAccuracyWallTripleLeafLocalSubstitutionToleranceBudget;
} {
  const averageMass = averageLeafSurfaceMass(input.layers, input.topology);
  const averageFlow = averageCavityFlowResistivity(input.layers, input.topology);
  const cavityDepth = averageCavityDepth(input.topology);
  const boardCorrection = clamp(
    8 * log10Safe(averageMass / BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SOURCE_BOARD_MASS_KG_M2),
    -1.5,
    1.5
  );
  const flowCorrection = clamp(
    1.2 * log10Safe(averageFlow / BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SOURCE_FLOW_RESISTIVITY_PA_S_M2),
    -1,
    1
  );
  const cavityCorrection = clamp(
    4 * log10Safe(cavityDepth / BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SOURCE_CAVITY_DEPTH_MM),
    -1,
    1
  );
  const designCorridorRwDb = ksRound1(
    BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SOURCE_ANCHOR_RW_DB +
      boardCorrection +
      flowCorrection +
      cavityCorrection
  );

  return {
    candidateId: "generic_gypsum_glasswool_source_like_rw_formula",
    designCorridorRwDb,
    formulaTerms: [
      buildFormulaTerm({
        correctionDb: ksRound1(boardCorrection),
        description:
          "Substitutes generic gypsum-board leaf surface mass and panel stiffness against the NRC Type C board anchor.",
        owner: "genericGypsumBoardToTypeCSurfaceMassAndStiffnessOwner",
        requiredInputs: [
          "gypsum_board.densityKgM3",
          "gypsum_board.thicknessMm",
          "nrc_type_c_gypsum_board.sourceSurfaceMassKgM2"
        ],
        runtimeOwnedInGate: false,
        termId: "board_leaf_surface_mass_and_stiffness_substitution"
      }),
      buildFormulaTerm({
        correctionDb: ksRound1(flowCorrection),
        description:
          "Compares generic glasswool flow resistivity with the source-owned NRC glass-fiber batt flow resistivity.",
        owner: "glasswoolBoardToNrcBattFlowResistivityOwner",
        requiredInputs: ["glasswool_board.flowResistivityPaSM2", "nrc_glass_fiber_batt.flowResistivityPaSM2"],
        runtimeOwnedInGate: false,
        termId: "porous_absorber_flow_resistivity_substitution"
      }),
      buildFormulaTerm({
        correctionDb: ksRound1(cavityCorrection),
        description:
          "Keeps the two-cavity source family but adjusts the corridor for explicit cavity depth and support topology.",
        owner: "cavityDepthAndSupportCorrectionOwner",
        requiredInputs: ["wallTopology.cavity1DepthMm", "wallTopology.cavity2DepthMm", "wallTopology.supportTopology"],
        runtimeOwnedInGate: false,
        termId: "cavity_depth_and_support_substitution"
      })
    ],
    toleranceBudget: buildBudget({
      candidateId: "generic_gypsum_glasswool_source_like_rw_formula",
      toleranceDb: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_GENERIC_BUDGET_DB
    })
  };
}

function buildLocalFormula(input: {
  layers: readonly ResolvedFormulaLayer[];
  topology: NonNullable<AirborneContext["wallTopology"]>;
}): {
  candidateId: "local_rockwool_mlv_plaster_custom_stack_rw_formula";
  designCorridorRwDb: number;
  formulaTerms: readonly BroadAccuracyWallTripleLeafLocalSubstitutionFormulaTerm[];
  toleranceBudget: BroadAccuracyWallTripleLeafLocalSubstitutionToleranceBudget;
} {
  const averageMass = averageLeafSurfaceMass(input.layers, input.topology);
  const averageFlow = averageCavityFlowResistivity(input.layers, input.topology);
  const cavityDepth = averageCavityDepth(input.topology);
  const boardCorrection = clamp(
    8 * log10Safe(averageMass / BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SOURCE_BOARD_MASS_KG_M2),
    -2,
    5
  );
  const flowCorrection = clamp(
    1.2 * log10Safe(averageFlow / BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SOURCE_FLOW_RESISTIVITY_PA_S_M2),
    -1.2,
    1.2
  );
  const cavityCorrection = clamp(
    4 * log10Safe(cavityDepth / BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SOURCE_CAVITY_DEPTH_MM),
    -2,
    1
  );
  const mlvCorrection = containsMaterial(input.layers, "mlv") ? 1.2 : 0;
  const plasterCorrection = containsMaterial(input.layers, "gypsum_plaster") ? 0.4 : 0;
  const designCorridorRwDb = ksRound1(
    BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SOURCE_ANCHOR_RW_DB +
      boardCorrection +
      flowCorrection +
      cavityCorrection +
      mlvCorrection +
      plasterCorrection
  );

  return {
    candidateId: "local_rockwool_mlv_plaster_custom_stack_rw_formula",
    designCorridorRwDb,
    formulaTerms: [
      buildFormulaTerm({
        correctionDb: ksRound1(boardCorrection),
        description:
          "Uses grouped-leaf surface mass to bound gypsum plus local finish substitutions without treating them as source-family boards.",
        owner: "localLeafSurfaceMassDistributionOwner",
        requiredInputs: [
          "wallTopology.sideALeafLayerIndices",
          "wallTopology.internalLeafLayerIndices",
          "wallTopology.sideBLeafLayerIndices",
          "layer.densityKgM3",
          "layer.thicknessMm"
        ],
        runtimeOwnedInGate: false,
        termId: "board_leaf_surface_mass_and_stiffness_substitution"
      }),
      buildFormulaTerm({
        correctionDb: ksRound1(flowCorrection),
        description:
          "Substitutes Rockwool porous absorption against the NRC glass-fiber batt anchor through explicit flow resistivity.",
        owner: "rockwoolToGlassFiberFlowResistivityDensityOwner",
        requiredInputs: ["rockwool.flowResistivityPaSM2", "rockwool.densityKgM3", "nrc_glass_fiber_batt.flowResistivityPaSM2"],
        runtimeOwnedInGate: false,
        termId: "porous_absorber_flow_resistivity_substitution"
      }),
      buildFormulaTerm({
        correctionDb: ksRound1(cavityCorrection),
        description:
          "Applies a short-cavity correction so 50 mm local cavities do not inherit the 92.1 mm source anchor unmodified.",
        owner: "shortCavityDepthCorrectionOwner",
        requiredInputs: ["wallTopology.cavity1DepthMm", "wallTopology.cavity2DepthMm", "wallTopology.supportTopology"],
        runtimeOwnedInGate: false,
        termId: "cavity_depth_and_support_substitution"
      }),
      buildFormulaTerm({
        correctionDb: ksRound1(mlvCorrection),
        description:
          "Adds only a bounded limp-mass membrane term for MLV placement; it is not a measured product delta.",
        owner: "mlvLimpMassPositionCorrectionOwner",
        requiredInputs: ["mlv.thicknessMm", "mlv.densityKgM3", "mlv.leafPosition"],
        runtimeOwnedInGate: false,
        termId: "mlv_limp_mass_position_substitution"
      }),
      buildFormulaTerm({
        correctionDb: ksRound1(plasterCorrection),
        description:
          "Adds a bounded gypsum-plaster finish mass/damping term while keeping plaster outside the NRC source family.",
        owner: "gypsumPlasterFinishMassDampingCorrectionOwner",
        requiredInputs: ["gypsum_plaster.thicknessMm", "gypsum_plaster.densityKgM3"],
        runtimeOwnedInGate: false,
        termId: "plaster_finish_mass_damping_substitution"
      })
    ],
    toleranceBudget: buildBudget({
      candidateId: "local_rockwool_mlv_plaster_custom_stack_rw_formula",
      toleranceDb: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LOCAL_STACK_BUDGET_DB
    })
  };
}

function blockedEvaluation(input: {
  affectedFormulaOutputs: readonly RequestedOutputId[];
  blockedFormulaOutputs: readonly RequestedOutputId[];
  mappingSnapshot: BroadAccuracyWallTripleLeafLocalSubstitutionEvaluation;
  status: BroadAccuracyWallTripleLeafLocalSubstitutionFormulaStatus;
}): BroadAccuracyWallTripleLeafLocalSubstitutionFormulaEvaluation {
  return {
    affectedFormulaOutputs: input.affectedFormulaOutputs,
    blockedFormulaOutputs: input.blockedFormulaOutputs,
    candidateId: null,
    designCorridorRwDb: null,
    exactMeasuredRowsRemainPrecedence: true,
    formulaTerms: [],
    mappingDecisionId: input.mappingSnapshot.decisionId,
    mappingSnapshot: input.mappingSnapshot,
    noRuntimeValueMovement: true,
    proposedRuntimeRwDb: null,
    runtimePromotionAllowedInGate: false,
    selectedNextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
    sourceAnchorRwDb: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SOURCE_ANCHOR_RW_DB,
    status: input.status,
    toleranceBudget: null
  };
}

export function evaluateBroadAccuracyWallTripleLeafLocalSubstitutionFormulaCorridor(input: {
  airborneContext: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
  targetOutputs?: readonly RequestedOutputId[];
}): BroadAccuracyWallTripleLeafLocalSubstitutionFormulaEvaluation {
  const catalog = input.catalog ?? getDefaultMaterialCatalog();
  const mappingSnapshot = evaluateBroadAccuracyWallTripleLeafLocalSubstitutionMapping({
    airborneContext: input.airborneContext,
    catalog,
    layers: input.layers
  });
  const { affectedFormulaOutputs, blockedFormulaOutputs } = splitOutputs(input.targetOutputs ?? ["Rw"]);

  if (mappingSnapshot.decisionId === "field_or_building_basis_boundary") {
    return blockedEvaluation({
      affectedFormulaOutputs,
      blockedFormulaOutputs,
      mappingSnapshot,
      status: "blocked_basis_alias"
    });
  }

  if (!mappingSnapshot.formulaCorridorCandidate) {
    return blockedEvaluation({
      affectedFormulaOutputs,
      blockedFormulaOutputs,
      mappingSnapshot,
      status:
        mappingSnapshot.status === "owned_control" ? "owned_control_no_substitution_formula_needed" : "blocked_input_contract"
    });
  }

  if (affectedFormulaOutputs.length === 0) {
    return blockedEvaluation({
      affectedFormulaOutputs,
      blockedFormulaOutputs,
      mappingSnapshot,
      status: "blocked_metric_adapter_missing"
    });
  }

  const resolvedLayers = resolveFormulaLayers(input.layers, catalog);
  const topology = getTopology(input.airborneContext);
  const formula =
    mappingSnapshot.decisionId === "generic_gypsum_glasswool_source_like"
      ? buildGenericFormula({ layers: resolvedLayers, topology })
      : buildLocalFormula({ layers: resolvedLayers, topology });

  return {
    affectedFormulaOutputs,
    blockedFormulaOutputs,
    candidateId: formula.candidateId,
    designCorridorRwDb: formula.designCorridorRwDb,
    exactMeasuredRowsRemainPrecedence: true,
    formulaTerms: formula.formulaTerms,
    mappingDecisionId: mappingSnapshot.decisionId,
    mappingSnapshot,
    noRuntimeValueMovement: true,
    proposedRuntimeRwDb: null,
    runtimePromotionAllowedInGate: false,
    selectedNextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
    sourceAnchorRwDb: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SOURCE_ANCHOR_RW_DB,
    status: "formula_corridor_defined_runtime_gate_required",
    toleranceBudget: formula.toleranceBudget
  };
}

export function buildBroadAccuracyWallTripleLeafLocalSubstitutionFormulaCorridorContract():
  BroadAccuracyWallTripleLeafLocalSubstitutionFormulaCorridorContract {
  const sourceLikeContext: AirborneContext = {
    contextMode: "element_lab",
    wallTopology: {
      cavity1AbsorptionClass: "porous_absorptive",
      cavity1DepthMm: 92.1,
      cavity1FillCoverage: "full",
      cavity1LayerIndices: [1],
      cavity2AbsorptionClass: "porous_absorptive",
      cavity2DepthMm: 92.1,
      cavity2FillCoverage: "full",
      cavity2LayerIndices: [3],
      internalLeafCoupling: "independent",
      internalLeafLayerIndices: [2],
      sideALeafLayerIndices: [0],
      sideBLeafLayerIndices: [4],
      supportTopology: "independent_frames",
      topologyMode: "grouped_triple_leaf"
    }
  };
  const localContext: AirborneContext = {
    contextMode: "element_lab",
    wallTopology: {
      cavity1AbsorptionClass: "porous_absorptive",
      cavity1DepthMm: 50,
      cavity1FillCoverage: "full",
      cavity1LayerIndices: [3],
      cavity2AbsorptionClass: "porous_absorptive",
      cavity2DepthMm: 50,
      cavity2FillCoverage: "full",
      cavity2LayerIndices: [5],
      internalLeafCoupling: "independent",
      internalLeafLayerIndices: [4],
      sideALeafLayerIndices: [0, 1, 2],
      sideBLeafLayerIndices: [6, 7, 8],
      supportTopology: "independent_frames",
      topologyMode: "grouped_triple_leaf"
    }
  };

  return {
    candidateFormulaRows: [
      evaluateBroadAccuracyWallTripleLeafLocalSubstitutionFormulaCorridor({
        airborneContext: sourceLikeContext,
        layers: [
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "glasswool_board", thicknessMm: 92.1 },
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "glasswool_board", thicknessMm: 92.1 },
          { materialId: "gypsum_board", thicknessMm: 12.5 }
        ],
        targetOutputs: ["Rw"]
      }),
      evaluateBroadAccuracyWallTripleLeafLocalSubstitutionFormulaCorridor({
        airborneContext: localContext,
        layers: [
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "mlv", thicknessMm: 4 },
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 50 },
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "rockwool", thicknessMm: 50 },
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "gypsum_plaster", thicknessMm: 10 },
          { materialId: "gypsum_board", thicknessMm: 12.5 }
        ],
        targetOutputs: ["Rw"]
      })
    ],
    exactMeasuredRowsRemainPrecedence: true,
    landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_LANDED_GATE,
    metricBoundaries: {
      buildingPredictionMetricsBlocked: true,
      fieldMetricsBlocked: true,
      stcCAndCtrAdaptersMissing: true
    },
    noRuntimeValueMovement: true,
    previousMapping: {
      landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_MAPPING_SELECTION_STATUS
    },
    runtimePromotionAllowedInGate: false,
    selectedNextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTION_STATUS
  };
}
