import {
  AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE,
  AirborneCandidateResolutionSchema
} from "@dynecho/shared";
import type {
  AirborneCandidate,
  AirborneCandidateRejectionReason,
  AirborneCandidateResolution,
  AirborneResultBasis,
  DynamicAirborneFamily,
  DynamicAirborneTrace,
  ResolvedLayer
} from "@dynecho/shared";

import type { AirborneTopologySummary } from "./airborne-topology";
import { materialText } from "./airborne-topology";
import { buildRatingsFromCurve } from "./curve-rating";
import {
  getDelegateLabel,
  type DynamicAirborneOptions,
  type DynamicAirborneResult
} from "./dynamic-airborne-helpers";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING,
  maybeBuildGateIAirborneFieldContextBasisFromBase
} from "./dynamic-airborne-gate-i-airborne-field-context";
import { ksRound1 } from "./math";
import { solveWallTripleLeafFrequencyBands } from "./wall-triple-leaf-frequency-solver";
import { validateWallTripleLeafLayerGroups } from "./wall-triple-leaf-topology-readiness";

export const GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD =
  "gate_ae_flat_multicavity_two_cavity_frequency_solver";

export const GATE_AE_FLAT_MULTICAVITY_SELECTED_CANDIDATE_ID =
  "candidate_gate_ae_flat_multicavity_family_physics_prediction";

export const GATE_AE_FLAT_MULTICAVITY_PREDICTION_STRATEGY =
  "gate_ae_flat_multicavity_two_cavity_solver_broadening_family_physics_prediction";

export const GATE_AE_FLAT_MULTICAVITY_PREDICTION_WARNING =
  "Flat multicavity family physics prediction is active from explicit or safely derived grouped topology. It is not measured exact or source-calibrated; use the 7 dB uncalibrated error budget until same-family holdouts land.";

const GATE_AE_FLAT_MULTICAVITY_BUILDING_PREDICTION_RUNTIME_METHOD =
  "gate_ar_airborne_building_prediction_all_owner_runtime_corridor";

const GATE_AE_FLAT_MULTICAVITY_BUILDING_PREDICTION_WARNING =
  "Airborne building-prediction runtime corridor is active from the Gate AE flat multicavity two-cavity solver, explicit flanking/junction context, room standardization, and a +/-9 dB source-absent uncertainty budget. It is not measured building evidence.";

const REQUIRED_INPUTS = [
  "wallTopology.topologyMode",
  "wallTopology.sideALeafLayerIndices",
  "wallTopology.cavity1LayerIndices",
  "wallTopology.cavity1DepthMm",
  "wallTopology.cavity1FillCoverage",
  "wallTopology.cavity1AbsorptionClass",
  "wallTopology.internalLeafLayerIndices",
  "wallTopology.internalLeafCoupling",
  "wallTopology.cavity2LayerIndices",
  "wallTopology.cavity2DepthMm",
  "wallTopology.cavity2FillCoverage",
  "wallTopology.cavity2AbsorptionClass",
  "wallTopology.sideBLeafLayerIndices",
  "wallTopology.supportTopology"
] as const;

const GATE_AE_BUILDING_REQUIRED_INPUTS = [
  "panelWidthMm",
  "panelHeightMm",
  "sourceRoomVolumeM3",
  "receivingRoomVolumeM3",
  "receivingRoomRt60S",
  "flankingJunctionClass",
  "conservativeFlankingAssumption",
  "junctionCouplingLengthM",
  "buildingPredictionOutputBasis"
] as const;

type CompleteGateAEBuildingPredictionContext = {
  buildingPredictionOutputBasis: "apparent" | "apparent_and_standardized" | "standardized";
  conservativeFlankingAssumption: "multi_path_conservative" | "single_conservative_path" | "worst_case_screening";
  contextMode: "building_prediction";
  flankingJunctionClass:
    | "isolated_junction"
    | "lightweight_junction"
    | "mixed_junction"
    | "rigid_cross_junction"
    | "rigid_t_junction";
  junctionCouplingLengthM: number;
  panelHeightMm: number;
  panelWidthMm: number;
  receivingRoomRt60S: number;
  receivingRoomVolumeM3: number;
  sourceRoomVolumeM3: number;
};

function isPositiveFinite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function hasCompleteGateAEBuildingPredictionContext(
  context: DynamicAirborneOptions["airborneContext"]
): context is CompleteGateAEBuildingPredictionContext {
  return (
    context?.contextMode === "building_prediction" &&
    context.flankingJunctionClass !== undefined &&
    context.flankingJunctionClass !== "unknown" &&
    context.conservativeFlankingAssumption !== undefined &&
    context.conservativeFlankingAssumption !== "unknown" &&
    context.buildingPredictionOutputBasis !== undefined &&
    context.buildingPredictionOutputBasis !== "unknown" &&
    isPositiveFinite(context.panelWidthMm) &&
    isPositiveFinite(context.panelHeightMm) &&
    isPositiveFinite(context.sourceRoomVolumeM3) &&
    isPositiveFinite(context.receivingRoomVolumeM3) &&
    isPositiveFinite(context.receivingRoomRt60S) &&
    isPositiveFinite(context.junctionCouplingLengthM) &&
    !isPositiveFinite(context.hostWallAreaM2) &&
    !(Array.isArray(context.openingLeakElements) && context.openingLeakElements.length > 0)
  );
}

function groupContainsLayerText(
  layers: readonly ResolvedLayer[],
  indices: readonly number[] | undefined,
  pattern: RegExp
): boolean {
  if (!Array.isArray(indices) || indices.length === 0) {
    return false;
  }

  return indices.some((index) => {
    const layer = layers[index];
    return Boolean(layer && pattern.test(materialText(layer)));
  });
}

function hasLayerGroup(value: readonly number[] | undefined): boolean {
  return Array.isArray(value) && value.length > 0;
}

function hasKnownTopologyToken(value: string | undefined): boolean {
  return typeof value === "string" && value !== "unknown" && value !== "auto";
}

function isOwnedCavityDepth(value: number | undefined): boolean {
  return typeof value === "number" && Number.isFinite(value) && value >= 25 && value <= 220;
}

function isOwnedFillCoverage(value: string | undefined): boolean {
  return value === "partial" || value === "full";
}

function isGateAEFlatMulticavityTarget(layers: readonly ResolvedLayer[], options: DynamicAirborneOptions): boolean {
  const contextMode = options.airborneContext?.contextMode ?? "element_lab";
  const topology = options.airborneContext?.wallTopology;

  if (
    (
      contextMode !== "element_lab" &&
      contextMode !== "field_between_rooms" &&
      contextMode !== "building_prediction"
    ) ||
    topology?.topologyMode !== "grouped_triple_leaf"
  ) {
    return false;
  }

  if (!validateWallTripleLeafLayerGroups({ layerCount: layers.length, topology }).valid) {
    return false;
  }

  const absorberPattern = /rock\s*wool|rockwool|stone\s*wool|mineral\s*wool|glass\s*wool|fiberglass|fibre|fiber|insulation/;

  return (
    hasLayerGroup(topology.sideALeafLayerIndices) &&
    hasLayerGroup(topology.cavity1LayerIndices) &&
    hasLayerGroup(topology.internalLeafLayerIndices) &&
    hasLayerGroup(topology.cavity2LayerIndices) &&
    hasLayerGroup(topology.sideBLeafLayerIndices) &&
    isOwnedCavityDepth(topology.cavity1DepthMm) &&
    isOwnedCavityDepth(topology.cavity2DepthMm) &&
    isOwnedFillCoverage(topology.cavity1FillCoverage) &&
    isOwnedFillCoverage(topology.cavity2FillCoverage) &&
    topology.cavity1AbsorptionClass === "porous_absorptive" &&
    topology.cavity2AbsorptionClass === "porous_absorptive" &&
    hasKnownTopologyToken(topology.internalLeafCoupling) &&
    hasKnownTopologyToken(topology.supportTopology) &&
    groupContainsLayerText(layers, topology.cavity1LayerIndices, absorberPattern) &&
    groupContainsLayerText(layers, topology.cavity2LayerIndices, absorberPattern)
  );
}

function buildGateAEFlatMulticavityPhysicsBasis(input: {
  cavityDepthsMm: readonly [number, number];
  fillCoverage: readonly [string, string];
  frequenciesHz: readonly number[];
}): AirborneResultBasis {
  return {
    assumptions: [
      "grouped flat/many-layer triple-leaf topology is explicit or safely derived from layer order",
      `two porous absorptive cavities are physically owned (${input.cavityDepthsMm[0].toFixed(0)} mm ${input.fillCoverage[0]} / ${input.cavityDepthsMm[1].toFixed(0)} mm ${input.fillCoverage[1]})`,
      "layer order is preserved; safe auto-grouping is limited to leaf / porous-cavity / leaf / porous-cavity / leaf patterns with explicit air gaps or explicit support context",
      "missing source rows block exact/calibrated promotion only, not this formula-backed prediction"
    ],
    calculationStandard: "engine_triple_leaf_two_cavity_frequency_solver",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 7,
    family: "multileaf_multicavity",
    frequencyBands: {
      bandSet: "third_octave_solver_grid",
      frequenciesHz: [...input.frequenciesHz]
    },
    kind: "airborne_physics_prediction",
    method: GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "family_physics_prediction",
    propertyDefaults: [
      {
        field: "porousAbsorber.flowResistivity",
        reason: "The flat multicavity route has explicit topology but no material-specific calibrated absorber property yet.",
        source: "engine_family_default_until_flat_multicavity_holdouts_land",
        unit: "Pa.s/m2",
        value: "family_default"
      },
      {
        field: "flatMulticavity.partialFillTransfer",
        reason: "Partial fill is solved as porous absorptive damping with an uncalibrated transfer factor until same-family holdouts exist.",
        source: "gate_ae_uncalibrated_family_default",
        value: "partial_or_full_fill_default"
      }
    ],
    ratingStandard: "ISO 717-1",
    requiredInputs: [...REQUIRED_INPUTS],
    toleranceClass: "uncalibrated_prediction"
  };
}

function maybeBuildGateAEFlatMulticavityBuildingPredictionBasis(input: {
  baseBasis: AirborneResultBasis;
  context: DynamicAirborneOptions["airborneContext"];
  frequencyBands: NonNullable<AirborneResultBasis["frequencyBands"]>;
}): AirborneResultBasis | null {
  if (!hasCompleteGateAEBuildingPredictionContext(input.context)) {
    return null;
  }

  const partitionAreaM2 = (input.context.panelWidthMm * input.context.panelHeightMm) / 1_000_000;

  return {
    ...input.baseBasis,
    assumptions: [
      ...input.baseBasis.assumptions,
      "building-prediction output is computed only from explicit building_prediction context",
      "direct separating-element curve comes from the Gate AE flat multicavity two-cavity frequency solver",
      "flanking/junction contribution is represented by the explicit conservative flanking assumption, named junction class, coupling length, and the existing path-energy overlay",
      "room standardization owns partition area, source-room volume, receiving-room volume, and receiving-room RT60 instead of borrowing Gate I field context",
      "+/-9 dB uncertainty budget remains source-absent and not measured evidence",
      `building context uses ${partitionAreaM2.toFixed(2)} m2 partition area, ${input.context.sourceRoomVolumeM3.toFixed(1)} m3 source-room volume, ${input.context.receivingRoomVolumeM3.toFixed(1)} m3 receiving-room volume, ${input.context.receivingRoomRt60S.toFixed(2)} s RT60, ${input.context.flankingJunctionClass}, ${input.context.conservativeFlankingAssumption}, and ${input.context.junctionCouplingLengthM.toFixed(2)} m coupling length`,
      `base lab-family method remains ${input.baseBasis.method}`
    ],
    calculationStandard: "ISO 12354-1",
    errorBudgetDb: 9,
    frequencyBands: input.frequencyBands,
    kind: "airborne_physics_prediction",
    method: GATE_AE_FLAT_MULTICAVITY_BUILDING_PREDICTION_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [
      "same_building_source_owned_RwPrime_DnTw_holdouts_absent"
    ],
    origin: "family_physics_prediction",
    ratingStandard: "ISO 717-1",
    requiredInputs: [
      ...input.baseBasis.requiredInputs,
      ...GATE_AE_BUILDING_REQUIRED_INPUTS,
      "ISO_12354_1_direct_separating_element_frequency_curve_owner",
      "ISO_12354_1_flanking_path_transmission_terms_owner",
      "ISO_12354_1_junction_vibration_reduction_index_owner",
      "ISO_12354_1_room_absorption_normalization_owner",
      "buildingPredictionUncertaintyBudgetOwner"
    ],
    toleranceClass: "uncalibrated_prediction"
  };
}

type GateAEAirborneCandidateSeed = Omit<AirborneCandidate, "rejectionReasons" | "selected"> & {
  blockedReasons?: readonly AirborneCandidateRejectionReason[];
};

function buildGateAEFlatMulticavityCandidateResolution(input: {
  basis: AirborneResultBasis;
}): AirborneCandidateResolution {
  const exactBasis: AirborneResultBasis = {
    assumptions: [],
    curveBasis: "no_curve",
    family: "multileaf_multicavity",
    kind: "airborne_measured_exact",
    measurementStandard: "source_report",
    method: "verified_airborne_catalog_exact_match",
    missingPhysicalInputs: [],
    missingSourceEvidence: ["flat_multicavity_source_owned_curve_payload_absent"],
    origin: "measured_exact_full_stack",
    propertyDefaults: [],
    ratingStandard: "source_report",
    requiredInputs: ["sourceOwnedCurvePayload", "metricContextOwner", "topologyOwner"],
    toleranceClass: "exact_source"
  };
  const calibratedBasis: AirborneResultBasis = {
    assumptions: ["flat multicavity calibration rows must be topology-compatible and rights-safe"],
    calculationStandard: "engine_triple_leaf_two_cavity_frequency_solver",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 4,
    family: "multileaf_multicavity",
    kind: "airborne_calibrated_prediction",
    measurementStandard: "source_report",
    method: "calibrated_flat_multicavity_family_solver",
    missingPhysicalInputs: [],
    missingSourceEvidence: ["flat_multicavity_calibration_holdout_curve_absent"],
    origin: "calibrated_family_physics",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs: ["calibrationSetId", "holdoutSetId", "groupedTopology"],
    toleranceClass: "calibrated_prediction"
  };
  const screeningBasis: AirborneResultBasis = {
    assumptions: ["ambiguous or incomplete multi-leaf topology is screened conservatively"],
    calculationStandard: "engine_screening",
    curveBasis: "screening_mass_law_curve",
    errorBudgetDb: 10,
    family: "multileaf_multicavity",
    kind: "airborne_screening",
    method: "screening_mass_law_curve_seed_v3",
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "screening_fallback",
    propertyDefaults: [],
    ratingStandard: "engine_native_bounded_estimate",
    requiredInputs: ["layers"],
    toleranceClass: "screening_fallback"
  };
  const seeds: GateAEAirborneCandidateSeed[] = [
    {
      basis: exactBasis,
      blockedReasons: [
        {
          code: "missing_source_evidence",
          detail: "Exact promotion is blocked until a source-owned flat multicavity curve exists."
        }
      ],
      id: "candidate_blocked_flat_multicavity_exact_source",
      metricIds: ["Rw", "STC", "C", "Ctr"],
      origin: "measured_exact_full_stack",
      outputIds: ["Rw", "STC", "C", "Ctr"]
    },
    {
      basis: calibratedBasis,
      blockedReasons: [
        {
          code: "missing_source_evidence",
          detail: "Calibration promotion waits for same-family flat multicavity holdout curves."
        }
      ],
      id: "candidate_calibrated_flat_multicavity_family",
      metricIds: ["Rw", "STC", "C", "Ctr"],
      origin: "calibrated_family_physics",
      outputIds: ["Rw", "STC", "C", "Ctr"]
    },
    {
      basis: input.basis,
      id: GATE_AE_FLAT_MULTICAVITY_SELECTED_CANDIDATE_ID,
      metricIds: ["Rw", "STC", "C", "Ctr"],
      origin: "family_physics_prediction",
      outputIds: ["Rw", "STC", "C", "Ctr"]
    },
    {
      basis: screeningBasis,
      id: "candidate_multileaf_screening_fallback",
      metricIds: ["Rw"],
      origin: "screening_fallback",
      outputIds: ["Rw"]
    }
  ];
  const selectedSeed = seeds.find((seed) => seed.id === GATE_AE_FLAT_MULTICAVITY_SELECTED_CANDIDATE_ID);
  if (!selectedSeed) {
    throw new Error("Gate AE flat multicavity resolver requires a physics prediction candidate.");
  }

  const candidates: AirborneCandidate[] = seeds.map((seed) => {
    const selected = seed.id === selectedSeed.id;
    const blockedReasons = [...(seed.blockedReasons ?? [])];
    const rejectionReasons = selected
      ? []
      : blockedReasons.length > 0
        ? blockedReasons
        : [
            {
              code: "lower_precedence_than_selected",
              detail: `Candidate loses to ${selectedSeed.id} under model-first airborne precedence.`
            }
          ];

    return {
      basis: seed.basis,
      id: seed.id,
      metricIds: seed.metricIds,
      origin: seed.origin,
      outputIds: seed.outputIds,
      rejectionReasons,
      selected
    };
  });

  return AirborneCandidateResolutionSchema.parse({
    candidatePrecedence: [...AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE],
    candidates,
    deterministicTieBreakers: [
      "origin_precedence",
      "input_completeness_status",
      "family_confidence_class",
      "error_budget_db",
      "source_evidence_completeness",
      "stable_candidate_id"
    ],
    id: "resolver_gate_ae_flat_multicavity_runtime",
    inputCompletenessIds: ["explicit_grouped_flat_multicavity_airborne_minimum_inputs"],
    policyId: "model_first_airborne_candidate_precedence_v1",
    ratingAdapterBasisIds: [
      "iso_717_1_rw_from_airborne_transmission_loss_curve",
      "astm_e413_stc_from_airborne_transmission_loss_curve"
    ],
    rejectedCandidateIds: candidates.filter((candidate) => !candidate.selected).map((candidate) => candidate.id),
    runtimeValueMovement: true,
    selectedBasis: selectedSeed.basis,
    selectedCandidateId: selectedSeed.id,
    selectedOrigin: selectedSeed.origin
  });
}

export function maybeCalculateGateAEFlatMulticavityPrediction(input: {
  family: { family: DynamicAirborneFamily; notes: string[] };
  layers: readonly ResolvedLayer[];
  options: DynamicAirborneOptions;
  topology: AirborneTopologySummary;
}): DynamicAirborneResult | null {
  if (input.family.family !== "multileaf_multicavity") {
    return null;
  }

  if (!isGateAEFlatMulticavityTarget(input.layers, input.options)) {
    return null;
  }

  const solver = solveWallTripleLeafFrequencyBands({
    airborneContext: input.options.airborneContext ?? { contextMode: "element_lab" },
    frequenciesHz: input.options.frequenciesHz,
    layers: input.layers
  });
  if (solver.calculationBlocked || !solver.curve || !solver.ratings) {
    return null;
  }

  const ratings = buildRatingsFromCurve(solver.curve.frequenciesHz, solver.curve.transmissionLossDb);
  const topology = input.options.airborneContext?.wallTopology;
  const basis = buildGateAEFlatMulticavityPhysicsBasis({
    cavityDepthsMm: [
      topology?.cavity1DepthMm ?? solver.cavities[0]?.depthMm ?? 0,
      topology?.cavity2DepthMm ?? solver.cavities[1]?.depthMm ?? 0
    ],
    fillCoverage: [
      topology?.cavity1FillCoverage ?? solver.cavities[0]?.fillCoverage ?? "unknown",
      topology?.cavity2FillCoverage ?? solver.cavities[1]?.fillCoverage ?? "unknown"
    ],
    frequenciesHz: solver.curve.frequenciesHz
  });
  const fieldContextBasis = maybeBuildGateIAirborneFieldContextBasisFromBase({
    baseBasis: basis,
    context: input.options.airborneContext,
    family: "multileaf_multicavity",
    frequencyBands: {
      bandSet: "third_octave_solver_grid",
      frequenciesHz: [...solver.curve.frequenciesHz]
    }
  });
  const contextMode = input.options.airborneContext?.contextMode ?? "element_lab";
  if (contextMode === "field_between_rooms" && !fieldContextBasis) {
    return null;
  }
  const buildingPredictionBasis = maybeBuildGateAEFlatMulticavityBuildingPredictionBasis({
    baseBasis: basis,
    context: input.options.airborneContext,
    frequencyBands: {
      bandSet: "third_octave_solver_grid",
      frequenciesHz: [...solver.curve.frequenciesHz]
    }
  });
  if (contextMode === "building_prediction" && !buildingPredictionBasis) {
    return null;
  }

  const selectedBasis = buildingPredictionBasis ?? fieldContextBasis ?? basis;
  const candidateResolution = buildGateAEFlatMulticavityCandidateResolution({ basis: selectedBasis });
  const solverRw = ratings.iso717.Rw;
  const screeningRw = input.options.screeningEstimatedRwDb;
  const leafMassNote = solver.leafMasses
    .map((leaf) => `${leaf.id} ${leaf.surfaceMassKgM2.toFixed(1)} kg/m2`)
    .join(", ");
  const resonanceNote = solver.resonances
    .map((resonance) => `${resonance.cavityId} ${resonance.resonanceHz.toFixed(1)} Hz`)
    .join(", ");
  const trace: DynamicAirborneTrace = {
    adjustmentDb: 0,
    candidateMethods: [
      {
        label: getDelegateLabel("screening_mass_law_curve_seed_v3"),
        method: "screening_mass_law_curve_seed_v3",
        rwDb: screeningRw,
        selected: false
      },
      {
        label: getDelegateLabel("triple_leaf_two_cavity_frequency_solver"),
        method: "triple_leaf_two_cavity_frequency_solver",
        rwDb: solverRw,
        selected: true
      }
    ],
    cavityCount: solver.cavities.length || input.topology.cavityCount,
    confidenceClass: "medium",
    confidenceScore: 0.56,
    detectedFamily: input.family.family,
    detectedFamilyLabel: "Multi-Leaf / Multi-Cavity",
    familyDecisionClass: "clear",
    hasPorousFill: input.topology.hasPorousFill,
    hasStudLikeSupport: input.topology.hasStudLikeSupport,
    notes: [
      ...input.family.notes,
      "Gate AE selected the explicit or safely derived grouped flat/many-layer multicavity solver lane.",
      `Two-cavity solver leaf masses: ${leafMassNote}.`,
      `Solver mass-air-mass resonances: ${resonanceNote}.`,
      "Source absence is retained as an exact/calibration blocker, not a blocker for formula-backed prediction.",
      "Field, building, and ASTM/IIC outputs remain outside this lab solver route unless their own output-basis adapter is selected."
    ],
    originalSolidLayerCount: input.topology.originalSolidLayerCount,
    porousLayerCount: input.topology.porousLayerCount,
    selectedLabel: getDelegateLabel("triple_leaf_two_cavity_frequency_solver"),
    selectedFamilyScore: 0.56,
    selectedMethod: "triple_leaf_two_cavity_frequency_solver",
    solverSpreadRwDb: ksRound1(Math.abs(solverRw - screeningRw)),
    strategy: GATE_AE_FLAT_MULTICAVITY_PREDICTION_STRATEGY,
    supportLayerCount: input.topology.supportLayerCount,
    surfaceMassKgM2: input.topology.surfaceMassKgM2,
    totalGapThicknessMm: input.topology.totalGapThicknessMm,
    visibleLeafCount: input.topology.visibleLeafCount,
    visibleLeafMassRatio: input.topology.visibleLeafMassRatio
  };

  return {
    airborneBasis: selectedBasis,
    airborneCandidateResolution: candidateResolution,
    airborneCandidateSet: candidateResolution.candidates,
    curve: solver.curve,
    id: "dynamic",
    label: "Dynamic Topology",
    ratings,
    rw: solverRw,
    trace,
    warnings: [
      ...(buildingPredictionBasis ? [GATE_AE_FLAT_MULTICAVITY_BUILDING_PREDICTION_WARNING] : []),
      ...(fieldContextBasis ? [GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING] : []),
      GATE_AE_FLAT_MULTICAVITY_PREDICTION_WARNING,
      "Dynamic airborne confidence is medium because the topology is explicit, but this broader flat-multicavity corridor has not been calibrated against same-family holdouts."
    ]
  };
}
