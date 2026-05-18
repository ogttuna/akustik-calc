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
import {
  getDelegateLabel,
  type DynamicAirborneOptions,
  type DynamicAirborneResult
} from "./dynamic-airborne-helpers";
import { ksRound1 } from "./math";
import {
  WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_ROWS,
  type WallTripleLeafSourceCurveDigitizationQcRow
} from "./wall-triple-leaf-source-curve-digitization-qc";
import { validateWallTripleLeafLayerGroups } from "./wall-triple-leaf-topology-readiness";

export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD =
  "broad_accuracy_wall_triple_leaf_nrc2024_calibrated_two_cavity_solver";

export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_PREDICTION_STRATEGY =
  "broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver";

export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID =
  "candidate_broad_accuracy_nrc2024_triple_leaf_calibrated";

export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_WARNING =
  "NRC 2024 Type C/glass-fiber triple-leaf calibrated solver is active only for explicit source-family grouped topology. Rockwool, MLV, plaster, field, and building aliases stay outside this calibrated lane.";

export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_ERROR_BUDGET_DB = 4;

type Nrc2024RuntimeAssemblyId = Extract<
  WallTripleLeafSourceCurveDigitizationQcRow["assemblyId"],
  "nrc_2024_assembly_a_internal_board" | "nrc_2024_assembly_b_internal_board" | "nrc_2024_assembly_d_internal_board"
>;

type GateAirborneCandidateSeed = Omit<AirborneCandidate, "rejectionReasons" | "selected"> & {
  blockedReasons?: readonly AirborneCandidateRejectionReason[];
};

function isSourceFamilyBoard(layer: ResolvedLayer | undefined): boolean {
  return layer?.material.id === "nrc_type_c_gypsum_board" && layer.thicknessMm >= 12 && layer.thicknessMm <= 13.5;
}

function isSourceFamilyBatt(layer: ResolvedLayer | undefined): boolean {
  return layer?.material.id === "nrc_glass_fiber_batt" && layer.thicknessMm >= 88 && layer.thicknessMm <= 96;
}

function countSourceFamilyBoards(layers: readonly ResolvedLayer[], indices: readonly number[] | undefined): number | null {
  if (!Array.isArray(indices) || indices.length === 0) {
    return null;
  }

  let count = 0;
  for (const index of indices) {
    const layer = layers[index];
    if (!isSourceFamilyBoard(layer)) {
      return null;
    }
    count += 1;
  }

  return count;
}

function groupIsSourceFamilyBatt(layers: readonly ResolvedLayer[], indices: readonly number[] | undefined): boolean {
  if (!Array.isArray(indices) || indices.length === 0) {
    return false;
  }

  return indices.every((index) => isSourceFamilyBatt(layers[index]));
}

function isNrcCavityDepth(value: number | undefined): boolean {
  return typeof value === "number" && Number.isFinite(value) && Math.abs(value - 92.1) <= 3;
}

function getNrc2024RuntimeAssemblyId(
  layers: readonly ResolvedLayer[],
  options: DynamicAirborneOptions
): Nrc2024RuntimeAssemblyId | null {
  const topology = options.airborneContext?.wallTopology;

  if ((options.airborneContext?.contextMode ?? "element_lab") !== "element_lab") {
    return null;
  }

  if (topology?.topologyMode !== "grouped_triple_leaf") {
    return null;
  }

  if (!validateWallTripleLeafLayerGroups({ layerCount: layers.length, topology }).valid) {
    return null;
  }

  if (
    !isNrcCavityDepth(topology.cavity1DepthMm) ||
    !isNrcCavityDepth(topology.cavity2DepthMm) ||
    topology.cavity1FillCoverage !== "full" ||
    topology.cavity2FillCoverage !== "full" ||
    topology.cavity1AbsorptionClass !== "porous_absorptive" ||
    topology.cavity2AbsorptionClass !== "porous_absorptive" ||
    topology.internalLeafCoupling !== "independent" ||
    topology.supportTopology !== "independent_frames" ||
    !groupIsSourceFamilyBatt(layers, topology.cavity1LayerIndices) ||
    !groupIsSourceFamilyBatt(layers, topology.cavity2LayerIndices)
  ) {
    return null;
  }

  const sideABoards = countSourceFamilyBoards(layers, topology.sideALeafLayerIndices);
  const internalBoards = countSourceFamilyBoards(layers, topology.internalLeafLayerIndices);
  const sideBBoards = countSourceFamilyBoards(layers, topology.sideBLeafLayerIndices);

  if (sideABoards !== 1 || internalBoards === null || sideBBoards === null) {
    return null;
  }

  if (internalBoards === 1 && sideBBoards === 2) {
    return "nrc_2024_assembly_a_internal_board";
  }

  if (internalBoards === 1 && sideBBoards === 1) {
    return "nrc_2024_assembly_b_internal_board";
  }

  if (internalBoards === 2 && sideBBoards === 1) {
    return "nrc_2024_assembly_d_internal_board";
  }

  return null;
}

function getNrc2024RuntimeRow(assemblyId: Nrc2024RuntimeAssemblyId): WallTripleLeafSourceCurveDigitizationQcRow {
  const row = WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_ROWS.find((candidate) => candidate.assemblyId === assemblyId);

  if (!row) {
    throw new Error(`Missing NRC 2024 calibrated triple-leaf row ${assemblyId}`);
  }

  return row;
}

function buildCalibratedBasis(row: WallTripleLeafSourceCurveDigitizationQcRow): AirborneResultBasis {
  return {
    anchorSourceId: row.sourceId,
    assumptions: [
      "explicit grouped triple-leaf topology matches the NRC 2024 Type C/glass-fiber source family",
      "12.7 mm Type C board identity, 92.1 mm glass-fiber batt identity, two full absorptive cavities, and independent double-frame support are all explicit",
      "local Rockwool, MLV, gypsum plaster, generic gypsum board, field, and building requests are hard boundaries and do not inherit this calibrated result"
    ],
    calculationStandard: "engine_triple_leaf_two_cavity_frequency_solver",
    curveBasis: "measured_frequency_curve",
    errorBudgetDb: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_ERROR_BUDGET_DB,
    family: "multileaf_multicavity",
    frequencyBands: {
      bandSet: "nrc_2024_digitized_third_octave_50_to_5000_hz",
      frequenciesHz: [...row.bandGridHz]
    },
    kind: "airborne_calibrated_prediction",
    measurementStandard: "source_report",
    method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "calibrated_family_physics",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs: [
      "nrc_type_c_gypsum_board",
      "nrc_glass_fiber_batt",
      "wallTopology.topologyMode",
      "wallTopology.sideALeafLayerIndices",
      "wallTopology.cavity1LayerIndices",
      "wallTopology.internalLeafLayerIndices",
      "wallTopology.cavity2LayerIndices",
      "wallTopology.sideBLeafLayerIndices",
      "wallTopology.cavity1DepthMm",
      "wallTopology.cavity2DepthMm",
      "wallTopology.internalLeafCoupling",
      "wallTopology.supportTopology"
    ],
    toleranceClass: "calibrated_prediction"
  };
}

function buildCandidateResolution(input: {
  basis: AirborneResultBasis;
}): AirborneCandidateResolution {
  const exactBasis: AirborneResultBasis = {
    assumptions: ["exact source promotion requires product/report identity beyond the source-family material corridor"],
    curveBasis: "measured_frequency_curve",
    exactSourceId: "nrc_2024_internal_gypsum_double_stud",
    family: "multileaf_multicavity",
    kind: "airborne_measured_exact",
    measurementStandard: "source_report",
    method: "verified_airborne_catalog_exact_match",
    missingPhysicalInputs: [],
    missingSourceEvidence: ["product_specific_full_stack_identity_owner"],
    origin: "measured_exact_full_stack",
    propertyDefaults: [],
    ratingStandard: "source_report",
    requiredInputs: ["productSpecificReportRowId", "rightsSafeExactCurvePayload"],
    toleranceClass: "exact_source"
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
  const seeds: GateAirborneCandidateSeed[] = [
    {
      basis: exactBasis,
      blockedReasons: [
        {
          code: "missing_source_evidence",
          detail: "The broad calibrated corridor has source-family identity, but not a product-specific exact-row owner."
        }
      ],
      id: "candidate_blocked_nrc2024_exact_source",
      metricIds: ["Rw", "STC", "C", "Ctr"],
      origin: "measured_exact_full_stack",
      outputIds: ["Rw", "STC", "C", "Ctr"]
    },
    {
      basis: input.basis,
      id: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID,
      metricIds: ["Rw", "STC", "C", "Ctr"],
      origin: "calibrated_family_physics",
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
  const selectedSeed = seeds.find((seed) => seed.id === BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID);

  if (!selectedSeed) {
    throw new Error("Broad accuracy triple-leaf calibrated resolver requires a calibrated selected candidate.");
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
    id: "resolver_broad_accuracy_nrc2024_triple_leaf_calibrated",
    inputCompletenessIds: ["nrc_2024_source_family_grouped_triple_leaf_inputs"],
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

export function maybeCalculateBroadAccuracyWallTripleLeafCalibratedPrediction(input: {
  family: { family: DynamicAirborneFamily; notes: string[] };
  layers: readonly ResolvedLayer[];
  options: DynamicAirborneOptions;
  topology: AirborneTopologySummary;
}): DynamicAirborneResult | null {
  if (input.family.family !== "multileaf_multicavity") {
    return null;
  }

  const assemblyId = getNrc2024RuntimeAssemblyId(input.layers, input.options);
  if (!assemblyId) {
    return null;
  }

  const row = getNrc2024RuntimeRow(assemblyId);
  const basis = buildCalibratedBasis(row);
  const candidateResolution = buildCandidateResolution({ basis });
  const screeningRw = input.options.screeningEstimatedRwDb;
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
        rwDb: row.derivedRw,
        selected: true
      }
    ],
    cavityCount: input.topology.cavityCount,
    confidenceClass: "high",
    confidenceScore: 0.84,
    detectedFamily: input.family.family,
    detectedFamilyLabel: "Multi-Leaf / Multi-Cavity",
    familyDecisionClass: "clear",
    hasPorousFill: input.topology.hasPorousFill,
    hasStudLikeSupport: input.topology.hasStudLikeSupport,
    notes: [
      ...input.family.notes,
      `Broad accuracy selected the NRC 2024 source-family calibrated triple-leaf row ${assemblyId}.`,
      `Digitized source-family ratings: Rw ${String(row.derivedRw)}, STC ${String(row.derivedStc)}, C ${String(row.ratings.iso717.C)}, Ctr ${String(row.ratings.iso717.Ctr)}.`,
      "Exact source promotion remains a separate candidate; this lane is calibrated family physics with an explicit 4 dB error budget.",
      "Rockwool, MLV, plaster, generic gypsum board, field, and building outputs remain outside this calibrated source-family corridor."
    ],
    originalSolidLayerCount: input.topology.originalSolidLayerCount,
    porousLayerCount: input.topology.porousLayerCount,
    selectedLabel: getDelegateLabel("triple_leaf_two_cavity_frequency_solver"),
    selectedFamilyScore: 0.84,
    selectedMethod: "triple_leaf_two_cavity_frequency_solver",
    solverSpreadRwDb: ksRound1(Math.abs(row.derivedRw - screeningRw)),
    strategy: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_PREDICTION_STRATEGY,
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
    curve: {
      frequenciesHz: [...row.bandGridHz],
      transmissionLossDb: [...row.figure4TransmissionLossDb]
    },
    id: "dynamic",
    label: "Dynamic Topology",
    ratings: row.ratings,
    rw: row.derivedRw,
    trace,
    warnings: [
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_WARNING,
      "Dynamic airborne confidence is high only inside the NRC 2024 Type C/glass-fiber source-family corridor; local substitution still needs a separate mapping owner."
    ]
  };
}
