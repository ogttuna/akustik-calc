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
import { ksRound1 } from "./math";
import { solveWallTripleLeafFrequencyBands } from "./wall-triple-leaf-frequency-solver";

const GROUPED_ROCKWOOL_TRIPLE_LEAF_PREDICTION_STRATEGY =
  "triple_leaf_two_cavity_frequency_solver_family_physics_prediction";
const GROUPED_ROCKWOOL_TRIPLE_LEAF_PREDICTION_WARNING =
  "Grouped Rockwool triple-leaf family physics prediction is active from the frequency solver. It is not measured exact or source-validated; use the 5 dB uncalibrated error budget until calibration lands.";

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

function isWithinGateAATripleLeafCavityDomain(value: number | undefined): boolean {
  return typeof value === "number" && Number.isFinite(value) && value >= 25 && value <= 220;
}

function isGateGGroupedRockwoolTripleLeafTarget(layers: readonly ResolvedLayer[], options: DynamicAirborneOptions): boolean {
  const topology = options.airborneContext?.wallTopology;

  if (topology?.topologyMode !== "grouped_triple_leaf") {
    return false;
  }

  const rockwoolPattern = /rock\s*wool|rockwool|stone\s*wool|mineral\s*wool/;
  const gypsumPattern = /gypsum|plasterboard|drywall/;

  return (
    hasLayerGroup(topology.sideALeafLayerIndices) &&
    hasLayerGroup(topology.cavity1LayerIndices) &&
    hasLayerGroup(topology.internalLeafLayerIndices) &&
    hasLayerGroup(topology.cavity2LayerIndices) &&
    hasLayerGroup(topology.sideBLeafLayerIndices) &&
    isWithinGateAATripleLeafCavityDomain(topology.cavity1DepthMm) &&
    isWithinGateAATripleLeafCavityDomain(topology.cavity2DepthMm) &&
    topology.cavity1FillCoverage === "full" &&
    topology.cavity2FillCoverage === "full" &&
    topology.cavity1AbsorptionClass === "porous_absorptive" &&
    topology.cavity2AbsorptionClass === "porous_absorptive" &&
    hasKnownTopologyToken(topology.internalLeafCoupling) &&
    hasKnownTopologyToken(topology.supportTopology) &&
    groupContainsLayerText(layers, topology.cavity1LayerIndices, rockwoolPattern) &&
    groupContainsLayerText(layers, topology.cavity2LayerIndices, rockwoolPattern) &&
    groupContainsLayerText(layers, topology.internalLeafLayerIndices, gypsumPattern)
  );
}

type GateGAirborneCandidateSeed = Omit<AirborneCandidate, "rejectionReasons" | "selected"> & {
  blockedReasons?: readonly AirborneCandidateRejectionReason[];
};

function buildGateGGroupedRockwoolPhysicsBasis(input: {
  cavityDepthsMm: readonly [number, number];
  frequenciesHz: readonly number[];
}): AirborneResultBasis {
  return {
    assumptions: [
      "grouped triple-leaf topology is explicit",
      `two explicit mineral-wool cavities are full porous absorptive layers (${input.cavityDepthsMm[0].toFixed(0)} mm / ${input.cavityDepthsMm[1].toFixed(0)} mm)`,
      "internal gypsum leaf and independent support are treated by the uncalibrated two-cavity solver",
      "missing source rows block exact/calibrated promotion only, not this formula-backed prediction"
    ],
    calculationStandard: "engine_triple_leaf_two_cavity_frequency_solver",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 5,
    family: "multileaf_multicavity",
    frequencyBands: {
      bandSet: "third_octave_solver_grid",
      frequenciesHz: [...input.frequenciesHz]
    },
    kind: "airborne_physics_prediction",
    method: "triple_leaf_two_cavity_frequency_solver",
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "family_physics_prediction",
    propertyDefaults: [
      {
        field: "mineralWool.flowResistivity",
        reason: "No calibrated project material property exists yet; prediction carries the Gate G uncalibrated error budget.",
        source: "engine_family_default_until_material_property_widening",
        unit: "Pa.s/m2",
        value: "family_default"
      },
      {
        field: "tripleLeaf.cavityDamping",
        reason: "Damping is derived from cavity fill coverage and absorption class until source calibration lands.",
        source: "engine_triple_leaf_gate_g_solver_default",
        value: "porous_absorptive_full_fill_default"
      }
    ],
    ratingStandard: "ISO 717-1",
    requiredInputs: [
      "wallTopology.topologyMode",
      "wallTopology.sideALeafLayerIndices",
      "wallTopology.cavity1LayerIndices",
      "wallTopology.cavity1DepthMm",
      "wallTopology.internalLeafLayerIndices",
      "wallTopology.cavity2LayerIndices",
      "wallTopology.cavity2DepthMm",
      "wallTopology.sideBLeafLayerIndices",
      "wallTopology.internalLeafCoupling",
      "wallTopology.supportTopology"
    ],
    toleranceClass: "uncalibrated_prediction"
  };
}

function buildGateGGroupedRockwoolCandidateResolution(input: {
  basis: AirborneResultBasis;
  id?: string;
}): AirborneCandidateResolution {
  const exactBasis: AirborneResultBasis = {
    assumptions: [],
    curveBasis: "no_curve",
    family: "multileaf_multicavity",
    kind: "airborne_measured_exact",
    measurementStandard: "source_report",
    method: "verified_airborne_catalog_exact_match",
    missingPhysicalInputs: [],
    missingSourceEvidence: ["rights_safe_source_owned_curve_payload_absent"],
    origin: "measured_exact_full_stack",
    propertyDefaults: [],
    ratingStandard: "source_report",
    requiredInputs: ["sourceOwnedCurvePayload", "metricContextOwner", "toleranceOwner"],
    toleranceClass: "exact_source"
  };
  const calibratedBasis: AirborneResultBasis = {
    assumptions: ["family calibration rows must be topology-compatible and rights-safe"],
    calculationStandard: "ISO 12354-1",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 3,
    family: "multileaf_multicavity",
    kind: "airborne_calibrated_prediction",
    measurementStandard: "source_report",
    method: "calibrated_triple_leaf_family_solver",
    missingPhysicalInputs: [],
    missingSourceEvidence: ["rights_safe_calibration_holdout_curve_absent"],
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
    method: "multileaf_screening_blend",
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "screening_fallback",
    propertyDefaults: [],
    ratingStandard: "engine_native_bounded_estimate",
    requiredInputs: ["layers"],
    toleranceClass: "screening_fallback"
  };
  const seeds: GateGAirborneCandidateSeed[] = [
    {
      basis: exactBasis,
      blockedReasons: [
        {
          code: "missing_source_evidence",
          detail: "Exact promotion is blocked until a rights-safe source-owned curve exists."
        }
      ],
      id: "candidate_blocked_rockwool_exact_source",
      metricIds: ["Rw", "STC", "C", "Ctr"],
      origin: "measured_exact_full_stack",
      outputIds: ["Rw", "STC", "C", "Ctr"]
    },
    {
      basis: calibratedBasis,
      blockedReasons: [
        {
          code: "missing_source_evidence",
          detail: "Calibration promotion waits for a rights-safe holdout curve."
        }
      ],
      id: "candidate_calibrated_triple_leaf_family",
      metricIds: ["Rw", "STC", "C", "Ctr"],
      origin: "calibrated_family_physics",
      outputIds: ["Rw", "STC", "C", "Ctr"]
    },
    {
      basis: input.basis,
      id: "candidate_grouped_rockwool_family_physics_prediction",
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
  const selectedSeed = seeds.find((seed) => seed.id === "candidate_grouped_rockwool_family_physics_prediction");
  if (!selectedSeed) {
    throw new Error("Gate G grouped Rockwool resolver requires a physics prediction candidate");
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
    id: input.id ?? "resolver_grouped_rockwool_gate_g_runtime",
    inputCompletenessIds: ["triple_leaf_multicavity_airborne_minimum_inputs"],
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

export function maybeCalculateGateGGroupedRockwoolPrediction(input: {
  family: { family: DynamicAirborneFamily; notes: string[] };
  layers: readonly ResolvedLayer[];
  options: DynamicAirborneOptions;
  topology: AirborneTopologySummary;
}): DynamicAirborneResult | null {
  if (input.family.family !== "multileaf_multicavity") {
    return null;
  }

  if (!isGateGGroupedRockwoolTripleLeafTarget(input.layers, input.options)) {
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
  const basis = buildGateGGroupedRockwoolPhysicsBasis({
    cavityDepthsMm: [
      topology?.cavity1DepthMm ?? solver.cavities[0]?.depthMm ?? 0,
      topology?.cavity2DepthMm ?? solver.cavities[1]?.depthMm ?? 0
    ],
    frequenciesHz: solver.curve.frequenciesHz
  });
  const candidateResolution = buildGateGGroupedRockwoolCandidateResolution({ basis });
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
    cavityCount: input.topology.cavityCount,
    confidenceClass: "medium",
    confidenceScore: 0.62,
    detectedFamily: input.family.family,
    detectedFamilyLabel: "Multi-Leaf / Multi-Cavity",
    familyDecisionClass: "clear",
    hasPorousFill: input.topology.hasPorousFill,
    hasStudLikeSupport: input.topology.hasStudLikeSupport,
    notes: [
      ...input.family.notes,
      "Grouped mineral-wool triple-leaf topology selected the model-first family physics prediction lane.",
      `Two-cavity solver leaf masses: ${leafMassNote}.`,
      `Solver mass-air-mass resonances: ${resonanceNote}.`,
      "Source absence is retained as an exact/calibration blocker, not a blocker for formula-backed prediction."
    ],
    originalSolidLayerCount: input.topology.originalSolidLayerCount,
    porousLayerCount: input.topology.porousLayerCount,
    selectedLabel: getDelegateLabel("triple_leaf_two_cavity_frequency_solver"),
    selectedFamilyScore: 0.62,
    selectedMethod: "triple_leaf_two_cavity_frequency_solver",
    solverSpreadRwDb: ksRound1(Math.abs(solverRw - screeningRw)),
    strategy: GROUPED_ROCKWOOL_TRIPLE_LEAF_PREDICTION_STRATEGY,
    supportLayerCount: input.topology.supportLayerCount,
    surfaceMassKgM2: input.topology.surfaceMassKgM2,
    totalGapThicknessMm: input.topology.totalGapThicknessMm,
    visibleLeafCount: input.topology.visibleLeafCount,
    visibleLeafMassRatio: input.topology.visibleLeafMassRatio
  };

  return {
    airborneBasis: basis,
    airborneCandidateResolution: candidateResolution,
    airborneCandidateSet: candidateResolution.candidates,
    curve: solver.curve,
    id: "dynamic",
    label: "Dynamic Topology",
    ratings,
    rw: solverRw,
    trace,
    warnings: [
      GROUPED_ROCKWOOL_TRIPLE_LEAF_PREDICTION_WARNING,
      "Dynamic airborne confidence is medium because the topology is explicit, but calibration and holdout rows have not landed."
    ]
  };
}
