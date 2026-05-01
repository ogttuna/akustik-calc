import type {
  AirborneContext,
  AssemblyRatings,
  LayerInput,
  MaterialDefinition,
  TransmissionLossCurve,
  WallCavityAbsorptionClass,
  WallCavityFillCoverage,
  WallInternalLeafCoupling,
  WallSupportTopology
} from "@dynecho/shared";

import { buildRatingsFromCurve, massLawTransmissionLoss, sortUniqueFrequencies } from "./curve-rating";
import { computeLayerSurfaceMassKgM2 } from "./layer-surface-mass";
import { clamp, ksRound1, log10Safe } from "./math";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";
import { WALL_TRIPLE_LEAF_BAND_GRID_50_TO_6300_HZ } from "./wall-triple-leaf-source-pack";

export type WallTripleLeafSolverLeafId = "side_a_leaf" | "internal_leaf" | "side_b_leaf";
export type WallTripleLeafSolverCavityId = "cavity_1" | "cavity_2";

export type WallTripleLeafSolverLeafMass = {
  id: WallTripleLeafSolverLeafId;
  layerIndices: readonly number[];
  materialIds: readonly string[];
  surfaceMassKgM2: number;
};

export type WallTripleLeafSolverCavity = {
  absorptionClass: WallCavityAbsorptionClass;
  dampingMultiplier: number;
  depthMm: number;
  fillCoverage: WallCavityFillCoverage;
  id: WallTripleLeafSolverCavityId;
  layerIndices: readonly number[];
  porousLiftDb: number;
};

export type WallTripleLeafSolverResonance = {
  cavityId: WallTripleLeafSolverCavityId;
  coupledLeafIds: readonly [WallTripleLeafSolverLeafId, WallTripleLeafSolverLeafId];
  dipDepthDb: number;
  nearestBandHz: number;
  resonanceHz: number;
};

export type WallTripleLeafSolverCoupling = {
  broadbandPenaltyDb: number;
  dipMultiplier: number;
  internalLeafCoupling: WallInternalLeafCoupling;
  supportTopology: WallSupportTopology;
};

export type WallTripleLeafFrequencySolverResult = {
  blockers: readonly string[];
  calculationBlocked: boolean;
  calibrationStatus: "gate_f_uncalibrated_research_skeleton";
  cavities: readonly WallTripleLeafSolverCavity[];
  coupling: WallTripleLeafSolverCoupling | null;
  curve: TransmissionLossCurve | null;
  interactingResonancePair:
    | {
        centerHz: number;
        penaltyDb: number;
      }
    | null;
  leafMasses: readonly WallTripleLeafSolverLeafMass[];
  ratings: AssemblyRatings | null;
  researchOnly: true;
  resonances: readonly WallTripleLeafSolverResonance[];
  runtimeEligible: false;
  sourceOwned: false;
  warnings: readonly string[];
};

export type WallTripleLeafFrequencySolverInput = {
  airborneContext: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  frequenciesHz?: readonly number[];
  layers: readonly LayerInput[];
};

type ResolvedSolverLayer = LayerInput & {
  material: MaterialDefinition;
  surfaceMassKgM2: number;
};

type CompleteWallTripleLeafTopology = {
  cavity1AbsorptionClass: WallCavityAbsorptionClass;
  cavity1DepthMm: number;
  cavity1FillCoverage: WallCavityFillCoverage;
  cavity1LayerIndices: readonly number[];
  cavity2AbsorptionClass: WallCavityAbsorptionClass;
  cavity2DepthMm: number;
  cavity2FillCoverage: WallCavityFillCoverage;
  cavity2LayerIndices: readonly number[];
  internalLeafCoupling: WallInternalLeafCoupling;
  internalLeafLayerIndices: readonly number[];
  sideALeafLayerIndices: readonly number[];
  sideBLeafLayerIndices: readonly number[];
  supportTopology: WallSupportTopology;
};

export const WALL_TRIPLE_LEAF_FREQUENCY_SOLVER_BANDS_HZ = WALL_TRIPLE_LEAF_BAND_GRID_50_TO_6300_HZ;

export const WALL_TRIPLE_LEAF_FREQUENCY_SOLVER_GATE_F = {
  apiShapeChange: false,
  calibrationStatus: "gate_f_uncalibrated_research_skeleton",
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_f_frequency_band_solver_skeleton_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_g_calibration_and_holdout_tolerance",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-calibration-regime.test.ts",
  selectionStatus:
    "gate_f_landed_frequency_band_solver_skeleton_no_runtime_and_selected_calibration_holdout_gate_g",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  sourceOwned: false,
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const SOLVER_WARNINGS = [
  "Gate F solver is a research-only three-leaf/two-cavity curve skeleton; it is not source-calibrated runtime evidence.",
  "Runtime promotion remains blocked until Gate G owns damping, coupling, source-family tolerance, and holdout rows."
] as const;

const RUNTIME_BLOCKERS = [
  "no_gate_g_source_family_calibration_pass",
  "no_gate_g_holdout_tolerance_owner",
  "no_paired_engine_and_web_visible_runtime_tests"
] as const;

function buildBlockedResult(blockers: readonly string[]): WallTripleLeafFrequencySolverResult {
  return {
    blockers: [...blockers, ...RUNTIME_BLOCKERS],
    calculationBlocked: true,
    calibrationStatus: "gate_f_uncalibrated_research_skeleton",
    cavities: [],
    coupling: null,
    curve: null,
    interactingResonancePair: null,
    leafMasses: [],
    ratings: null,
    researchOnly: true,
    resonances: [],
    runtimeEligible: false,
    sourceOwned: false,
    warnings: SOLVER_WARNINGS
  };
}

function hasKnownValue(value: string | undefined): boolean {
  return typeof value === "string" && value !== "unknown" && value !== "auto";
}

function hasLayerGroup(value: readonly number[] | undefined): value is readonly number[] {
  return Array.isArray(value) && value.length > 0;
}

function getCompleteTopology(context: AirborneContext): CompleteWallTripleLeafTopology | null {
  const topology = context.wallTopology;

  if (topology?.topologyMode !== "grouped_triple_leaf") {
    return null;
  }

  if (
    !hasLayerGroup(topology.sideALeafLayerIndices) ||
    !hasLayerGroup(topology.cavity1LayerIndices) ||
    !hasLayerGroup(topology.internalLeafLayerIndices) ||
    !hasLayerGroup(topology.cavity2LayerIndices) ||
    !hasLayerGroup(topology.sideBLeafLayerIndices) ||
    !(typeof topology.cavity1DepthMm === "number" && topology.cavity1DepthMm > 0) ||
    !(typeof topology.cavity2DepthMm === "number" && topology.cavity2DepthMm > 0) ||
    !hasKnownValue(topology.cavity1FillCoverage) ||
    !hasKnownValue(topology.cavity1AbsorptionClass) ||
    !hasKnownValue(topology.cavity2FillCoverage) ||
    !hasKnownValue(topology.cavity2AbsorptionClass) ||
    !hasKnownValue(topology.internalLeafCoupling) ||
    !hasKnownValue(topology.supportTopology)
  ) {
    return null;
  }

  return {
    cavity1AbsorptionClass: topology.cavity1AbsorptionClass,
    cavity1DepthMm: topology.cavity1DepthMm,
    cavity1FillCoverage: topology.cavity1FillCoverage,
    cavity1LayerIndices: topology.cavity1LayerIndices,
    cavity2AbsorptionClass: topology.cavity2AbsorptionClass,
    cavity2DepthMm: topology.cavity2DepthMm,
    cavity2FillCoverage: topology.cavity2FillCoverage,
    cavity2LayerIndices: topology.cavity2LayerIndices,
    internalLeafCoupling: topology.internalLeafCoupling,
    internalLeafLayerIndices: topology.internalLeafLayerIndices,
    sideALeafLayerIndices: topology.sideALeafLayerIndices,
    sideBLeafLayerIndices: topology.sideBLeafLayerIndices,
    supportTopology: topology.supportTopology
  };
}

function resolveSolverLayers(
  layers: readonly LayerInput[],
  catalog: readonly MaterialDefinition[]
): readonly ResolvedSolverLayer[] {
  return layers.map((layer) => {
    const material = resolveMaterial(layer.materialId, catalog);

    return {
      ...layer,
      material,
      surfaceMassKgM2: computeLayerSurfaceMassKgM2(layer, material)
    };
  });
}

function findGroupBlockers(
  layers: readonly ResolvedSolverLayer[],
  groups: readonly {
    id: string;
    indices: readonly number[];
  }[]
): string[] {
  const blockers: string[] = [];
  const seen = new Map<number, string>();

  for (const group of groups) {
    for (const index of group.indices) {
      if (!Number.isInteger(index) || index < 0 || index >= layers.length) {
        blockers.push(`${group.id}_contains_out_of_range_layer_index_${String(index)}`);
        continue;
      }

      const previousGroup = seen.get(index);
      if (previousGroup) {
        blockers.push(`layer_index_${String(index)}_appears_in_both_${previousGroup}_and_${group.id}`);
        continue;
      }

      seen.set(index, group.id);
    }
  }

  return blockers;
}

function summarizeLeaf(
  id: WallTripleLeafSolverLeafId,
  layerIndices: readonly number[],
  layers: readonly ResolvedSolverLayer[]
): WallTripleLeafSolverLeafMass {
  const selectedLayers = layerIndices.map((index) => layers[index]);
  const surfaceMassKgM2 = selectedLayers.reduce((sum, layer) => sum + (layer?.surfaceMassKgM2 ?? 0), 0);

  return {
    id,
    layerIndices,
    materialIds: selectedLayers.map((layer) => layer.material.id),
    surfaceMassKgM2: ksRound1(surfaceMassKgM2)
  };
}

function getFillDampingMultiplier(fillCoverage: WallCavityFillCoverage, absorptionClass: WallCavityAbsorptionClass): number {
  const coverageMultiplier: Record<WallCavityFillCoverage, number> = {
    empty: 1.15,
    full: 0.58,
    partial: 0.82,
    unknown: 1
  };
  const absorptionMultiplier = absorptionClass === "porous_absorptive" ? 0.82 : 1.05;

  return clamp(coverageMultiplier[fillCoverage] * absorptionMultiplier, 0.42, 1.3);
}

function getPorousLiftDb(fillCoverage: WallCavityFillCoverage, absorptionClass: WallCavityAbsorptionClass): number {
  if (absorptionClass !== "porous_absorptive") {
    return 0;
  }

  if (fillCoverage === "full") {
    return 2.8;
  }

  if (fillCoverage === "partial") {
    return 1.4;
  }

  return 0.4;
}

function buildCavity(
  id: WallTripleLeafSolverCavityId,
  depthMm: number,
  fillCoverage: WallCavityFillCoverage,
  absorptionClass: WallCavityAbsorptionClass,
  layerIndices: readonly number[]
): WallTripleLeafSolverCavity {
  return {
    absorptionClass,
    dampingMultiplier: ksRound1(getFillDampingMultiplier(fillCoverage, absorptionClass)),
    depthMm: ksRound1(depthMm),
    fillCoverage,
    id,
    layerIndices,
    porousLiftDb: ksRound1(getPorousLiftDb(fillCoverage, absorptionClass))
  };
}

function getCoupling(input: {
  internalLeafCoupling: WallInternalLeafCoupling;
  supportTopology: WallSupportTopology;
}): WallTripleLeafSolverCoupling {
  const couplingPenalty: Record<WallInternalLeafCoupling, number> = {
    attached_to_side_a: 2.2,
    attached_to_side_b: 2.2,
    direct_bridge: 5.5,
    independent: 0,
    shared_stud_bridge: 4,
    unknown: 3
  };
  const supportPenalty: Record<WallSupportTopology, number> = {
    direct_fixed: 4,
    independent_frames: 0,
    resilient_channel: 1,
    single_shared_stud: 3.2,
    twin_frame: 1.4,
    unknown: 2.5
  };
  const couplingDip: Record<WallInternalLeafCoupling, number> = {
    attached_to_side_a: 1.05,
    attached_to_side_b: 1.05,
    direct_bridge: 1.35,
    independent: 0.86,
    shared_stud_bridge: 1.22,
    unknown: 1.15
  };
  const supportDip: Record<WallSupportTopology, number> = {
    direct_fixed: 1.18,
    independent_frames: 0.9,
    resilient_channel: 0.96,
    single_shared_stud: 1.12,
    twin_frame: 1,
    unknown: 1.08
  };

  return {
    broadbandPenaltyDb: ksRound1(couplingPenalty[input.internalLeafCoupling] + supportPenalty[input.supportTopology]),
    dipMultiplier: ksRound1(couplingDip[input.internalLeafCoupling] * supportDip[input.supportTopology]),
    internalLeafCoupling: input.internalLeafCoupling,
    supportTopology: input.supportTopology
  };
}

function nearestBandHz(frequencyHz: number, bandsHz: readonly number[]): number {
  return bandsHz.reduce((best, band) =>
    Math.abs(band - frequencyHz) < Math.abs(best - frequencyHz) ? band : best
  );
}

function computeMassAirMassResonanceHz(leftMassKgM2: number, rightMassKgM2: number, cavityDepthMm: number): number {
  const cavityDepthM = Math.max(cavityDepthMm / 1000, 0.005);
  const massTerm = (1 / Math.max(leftMassKgM2, 1e-6)) + (1 / Math.max(rightMassKgM2, 1e-6));

  return 60 * Math.sqrt(massTerm / cavityDepthM);
}

function computeResonanceDipDb(input: {
  cavity: WallTripleLeafSolverCavity;
  coupling: WallTripleLeafSolverCoupling;
  lightLeafMassKgM2: number;
}): number {
  const lightLeafBoost = clamp(13 / Math.max(input.lightLeafMassKgM2, 1e-6), 0.75, 1.45);
  const cavityDepthBoost = clamp(65 / Math.max(input.cavity.depthMm, 1), 0.72, 1.45);
  const baseDipDb = 11.5;

  return ksRound1(baseDipDb * input.cavity.dampingMultiplier * input.coupling.dipMultiplier * lightLeafBoost * cavityDepthBoost);
}

function resonancePenaltyAtBand(frequencyHz: number, resonanceHz: number, dipDepthDb: number): number {
  const distanceOctaves = Math.log2(Math.max(frequencyHz, 1e-6) / Math.max(resonanceHz, 1e-6));
  const widthOctaves = 0.42;

  return dipDepthDb * Math.exp(-((distanceOctaves * distanceOctaves) / (2 * widthOctaves * widthOctaves)));
}

function computeInteractionPenalty(input: {
  coupling: WallTripleLeafSolverCoupling;
  resonanceAHz: number;
  resonanceBHz: number;
}): { centerHz: number; penaltyDb: number } | null {
  const distanceOctaves = Math.abs(Math.log2(input.resonanceAHz / input.resonanceBHz));
  const closeness = clamp(1 - (distanceOctaves / 0.85), 0, 1);
  const penaltyDb = ksRound1(3.8 * closeness * input.coupling.dipMultiplier);

  if (!(penaltyDb > 0)) {
    return null;
  }

  return {
    centerHz: ksRound1(Math.sqrt(input.resonanceAHz * input.resonanceBHz)),
    penaltyDb
  };
}

function supportIsolationBonusDb(supportTopology: WallSupportTopology): number {
  const supportBonus: Record<WallSupportTopology, number> = {
    direct_fixed: 0,
    independent_frames: 9.5,
    resilient_channel: 6.5,
    single_shared_stud: 2.5,
    twin_frame: 5.5,
    unknown: 3.5
  };

  return supportBonus[supportTopology];
}

function buildCurve(input: {
  cavities: readonly [WallTripleLeafSolverCavity, WallTripleLeafSolverCavity];
  coupling: WallTripleLeafSolverCoupling;
  frequenciesHz: readonly number[];
  interaction: { centerHz: number; penaltyDb: number } | null;
  leafMasses: readonly [WallTripleLeafSolverLeafMass, WallTripleLeafSolverLeafMass, WallTripleLeafSolverLeafMass];
  resonances: readonly WallTripleLeafSolverResonance[];
}): TransmissionLossCurve {
  const totalMassKgM2 = input.leafMasses.reduce((sum, leaf) => sum + leaf.surfaceMassKgM2, 0);
  const averagePorousLiftDb =
    input.cavities.reduce((sum, cavity) => sum + cavity.porousLiftDb, 0) / input.cavities.length;
  const cavityDepthLiftDb = clamp(
    2.5 * log10Safe((input.cavities[0].depthMm + input.cavities[1].depthMm) / 100),
    -1.2,
    3
  );
  const isolationBonusDb = supportIsolationBonusDb(input.coupling.supportTopology);

  const transmissionLossDb = input.frequenciesHz.map((frequencyHz) => {
    const baseDb =
      massLawTransmissionLoss(frequencyHz, totalMassKgM2) +
      isolationBonusDb +
      averagePorousLiftDb +
      cavityDepthLiftDb -
      input.coupling.broadbandPenaltyDb;
    const resonanceDipDb = input.resonances.reduce(
      (sum, resonance) => sum + resonancePenaltyAtBand(frequencyHz, resonance.resonanceHz, resonance.dipDepthDb),
      0
    );
    const interactionDipDb = input.interaction
      ? resonancePenaltyAtBand(frequencyHz, input.interaction.centerHz, input.interaction.penaltyDb)
      : 0;

    return ksRound1(clamp(baseDb - resonanceDipDb - interactionDipDb, 0, 95));
  });

  return {
    frequenciesHz: [...input.frequenciesHz],
    transmissionLossDb
  };
}

export function solveWallTripleLeafFrequencyBands(
  input: WallTripleLeafFrequencySolverInput
): WallTripleLeafFrequencySolverResult {
  const topology = getCompleteTopology(input.airborneContext);
  if (!topology) {
    return buildBlockedResult(["complete_grouped_triple_leaf_topology_required"]);
  }

  const catalog = input.catalog ?? getDefaultMaterialCatalog();
  const resolvedLayers = resolveSolverLayers(input.layers, catalog);
  const topologyGroups = [
    { id: "side_a_leaf", indices: topology.sideALeafLayerIndices },
    { id: "cavity_1", indices: topology.cavity1LayerIndices },
    { id: "internal_leaf", indices: topology.internalLeafLayerIndices },
    { id: "cavity_2", indices: topology.cavity2LayerIndices },
    { id: "side_b_leaf", indices: topology.sideBLeafLayerIndices }
  ] as const;
  const blockers = findGroupBlockers(resolvedLayers, topologyGroups);

  if (blockers.length > 0) {
    return buildBlockedResult(blockers);
  }

  const leafMasses = [
    summarizeLeaf("side_a_leaf", topology.sideALeafLayerIndices, resolvedLayers),
    summarizeLeaf("internal_leaf", topology.internalLeafLayerIndices, resolvedLayers),
    summarizeLeaf("side_b_leaf", topology.sideBLeafLayerIndices, resolvedLayers)
  ] as const;

  if (leafMasses.some((leaf) => !(leaf.surfaceMassKgM2 > 0))) {
    return buildBlockedResult(["all_three_leaf_groups_must_have_positive_surface_mass"]);
  }

  const cavities = [
    buildCavity(
      "cavity_1",
      topology.cavity1DepthMm,
      topology.cavity1FillCoverage,
      topology.cavity1AbsorptionClass,
      topology.cavity1LayerIndices
    ),
    buildCavity(
      "cavity_2",
      topology.cavity2DepthMm,
      topology.cavity2FillCoverage,
      topology.cavity2AbsorptionClass,
      topology.cavity2LayerIndices
    )
  ] as const;
  const coupling = getCoupling({
    internalLeafCoupling: topology.internalLeafCoupling,
    supportTopology: topology.supportTopology
  });
  const frequenciesHz = sortUniqueFrequencies(input.frequenciesHz ?? WALL_TRIPLE_LEAF_FREQUENCY_SOLVER_BANDS_HZ);
  if (frequenciesHz.length === 0) {
    return buildBlockedResult(["frequency_band_grid_required"]);
  }

  const resonance1Hz = computeMassAirMassResonanceHz(
    leafMasses[0].surfaceMassKgM2,
    leafMasses[1].surfaceMassKgM2,
    cavities[0].depthMm
  );
  const resonance2Hz = computeMassAirMassResonanceHz(
    leafMasses[1].surfaceMassKgM2,
    leafMasses[2].surfaceMassKgM2,
    cavities[1].depthMm
  );
  const resonances = [
    {
      cavityId: "cavity_1",
      coupledLeafIds: ["side_a_leaf", "internal_leaf"],
      dipDepthDb: computeResonanceDipDb({
        cavity: cavities[0],
        coupling,
        lightLeafMassKgM2: Math.min(leafMasses[0].surfaceMassKgM2, leafMasses[1].surfaceMassKgM2)
      }),
      nearestBandHz: nearestBandHz(resonance1Hz, frequenciesHz),
      resonanceHz: ksRound1(resonance1Hz)
    },
    {
      cavityId: "cavity_2",
      coupledLeafIds: ["internal_leaf", "side_b_leaf"],
      dipDepthDb: computeResonanceDipDb({
        cavity: cavities[1],
        coupling,
        lightLeafMassKgM2: Math.min(leafMasses[1].surfaceMassKgM2, leafMasses[2].surfaceMassKgM2)
      }),
      nearestBandHz: nearestBandHz(resonance2Hz, frequenciesHz),
      resonanceHz: ksRound1(resonance2Hz)
    }
  ] as const;
  const interaction = computeInteractionPenalty({
    coupling,
    resonanceAHz: resonance1Hz,
    resonanceBHz: resonance2Hz
  });
  const curve = buildCurve({
    cavities,
    coupling,
    frequenciesHz,
    interaction,
    leafMasses,
    resonances
  });

  return {
    blockers: RUNTIME_BLOCKERS,
    calculationBlocked: false,
    calibrationStatus: "gate_f_uncalibrated_research_skeleton",
    cavities,
    coupling,
    curve,
    interactingResonancePair: interaction,
    leafMasses,
    ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, input.airborneContext),
    researchOnly: true,
    resonances,
    runtimeEligible: false,
    sourceOwned: false,
    warnings: SOLVER_WARNINGS
  };
}
