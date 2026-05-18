import {
  AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE,
  AirborneCandidateResolutionSchema
} from "@dynecho/shared";
import type {
  AirborneCandidate,
  AirborneCandidateRejectionReason,
  AirborneCandidateResolution,
  AirborneContext,
  AirborneResultBasis,
  DynamicAirborneFamily,
  DynamicAirborneTrace,
  LayerInput,
  MaterialDefinition,
  RequestedOutputId,
  ResolvedLayer,
  TransmissionLossCurve
} from "@dynecho/shared";

import type { AirborneTopologySummary } from "./airborne-topology";
import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTION_STATUS,
  evaluateBroadAccuracyWallTripleLeafLocalSubstitutionFormulaCorridor,
  type BroadAccuracyWallTripleLeafLocalSubstitutionFormulaEvaluation
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-formula-corridor";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_WARNING,
  maybeBuildBroadAccuracyWallTripleLeafLocalSubstitutionFieldContextBasis
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-harmonization";
import { buildRatingsFromCurve } from "./curve-rating";
import {
  anchorCurveToMetric,
  getDelegateLabel,
  type DynamicAirborneOptions,
  type DynamicAirborneResult
} from "./dynamic-airborne-helpers";
import { ksRound1 } from "./math";
import { WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_ROWS } from "./wall-triple-leaf-source-curve-digitization-qc";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_LANDED_GATE =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor_plan";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTION_STATUS =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor_landed_selected_surface_parity";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_surface_parity_plan";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-surface-parity-contract.test.ts";

export const BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL =
  "wall triple-leaf local substitution surface parity";

export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD =
  "broad_accuracy_wall_triple_leaf_local_substitution_source_absent_rw_runtime_corridor";

export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_STRATEGY =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor";

export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID =
  "candidate_broad_accuracy_wall_triple_leaf_local_substitution_rw_family_physics_prediction";

export const BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_WARNING =
  "Wall triple-leaf local substitution Rw runtime is active from a source-absent formula corridor. It is not measured exact evidence; STC, C, Ctr, field, and building adapters remain blocked until separately owned.";

export type BroadAccuracyWallTripleLeafLocalSubstitutionRuntimeContract = {
  candidateRuntimeRows: readonly BroadAccuracyWallTripleLeafLocalSubstitutionFormulaEvaluation[];
  exactMeasuredRowsRemainPrecedence: true;
  landedGate: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_LANDED_GATE;
  metricBoundaries: {
    buildingPredictionMetricsBlocked: true;
    fieldMetricsBlocked: true;
    stcCAndCtrAdaptersBlocked: true;
  };
  previousFormulaCorridor: {
    landedGate: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_LANDED_GATE;
    selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_FILE;
    selectionStatus: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTION_STATUS;
  };
  runtimeMethod: typeof BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD;
  runtimeValueMovement: true;
  selectedCandidateId: typeof BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID;
  selectedNextAction: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL;
  selectionStatus: typeof BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTION_STATUS;
  supportedRuntimeOutputs: readonly ["Rw"];
};

type RuntimeCandidateSeed = Omit<AirborneCandidate, "rejectionReasons" | "selected"> & {
  blockedReasons?: readonly AirborneCandidateRejectionReason[];
};

const BLOCKED_LOCAL_SUBSTITUTION_OUTPUTS = new Set<RequestedOutputId>([
  "C",
  "Ctr",
  "Dn,A",
  "Dn,w",
  "DnT,A",
  "DnT,A,k",
  "DnT,w",
  "R'w",
  "STC"
]);
const LOCAL_SUBSTITUTION_LAB_SPECTRUM_OUTPUTS = new Set<RequestedOutputId>(["C", "Ctr", "STC"]);
const LOCAL_SUBSTITUTION_FIELD_OUTPUTS = new Set<RequestedOutputId>(["R'w", "DnT,w"]);

function includeParentRwForLabSpectrumAdapter(
  targetOutputs: readonly RequestedOutputId[] | undefined
): readonly RequestedOutputId[] {
  const outputs = targetOutputs?.length ? [...targetOutputs] : ["Rw" as const];

  if (
    !outputs.includes("Rw") &&
    outputs.some((output) => LOCAL_SUBSTITUTION_LAB_SPECTRUM_OUTPUTS.has(output))
  ) {
    return ["Rw", ...outputs];
  }

  return outputs;
}

function includesFieldContextOutputs(targetOutputs: readonly RequestedOutputId[] | undefined): boolean {
  return Boolean(targetOutputs?.some((output) => LOCAL_SUBSTITUTION_FIELD_OUTPUTS.has(output)));
}

function toLayerInputs(layers: readonly ResolvedLayer[]): readonly LayerInput[] {
  return layers.map((layer) => ({
    floorRole: layer.floorRole,
    materialId: layer.material.id,
    thicknessMm: layer.thicknessMm
  }));
}

function getSourceAnchorCurve(): TransmissionLossCurve {
  const row = WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_ROWS.find(
    (candidate) => candidate.assemblyId === "nrc_2024_assembly_b_internal_board"
  );

  if (!row) {
    throw new Error("Missing NRC 2024 Assembly B source-family curve for local substitution runtime corridor.");
  }

  return {
    frequenciesHz: [...row.bandGridHz],
    transmissionLossDb: [...row.figure4TransmissionLossDb]
  };
}

function buildRuntimeBasis(input: {
  evaluation: BroadAccuracyWallTripleLeafLocalSubstitutionFormulaEvaluation;
  frequenciesHz: readonly number[];
}): AirborneResultBasis {
  const budget = input.evaluation.toleranceBudget?.totalBudgetDb ?? 8;

  return {
    anchorSourceId: "nrc_2024_internal_gypsum_double_stud",
    assumptions: [
      "complete grouped triple-leaf topology reached the local substitution Rw formula corridor",
      "NRC 2024 Assembly B Type C/glass-fiber curve supplies the source-family curve shape only",
      "material substitutions are calculated from the formula-corridor board, porous absorber, cavity/support, MLV, and plaster terms",
      `source-absent design corridor Rw is ${input.evaluation.designCorridorRwDb?.toFixed(1) ?? "unknown"} dB with a +/-${budget.toFixed(0)} dB not-measured budget`,
      "STC, C, Ctr, field, and building outputs remain unsupported until separately owned adapters land"
    ],
    calculationStandard: "engine_triple_leaf_two_cavity_frequency_solver",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: budget,
    family: "multileaf_multicavity",
    frequencyBands: {
      bandSet: "nrc_2024_shifted_local_substitution_third_octave_50_to_5000_hz",
      frequenciesHz: [...input.frequenciesHz]
    },
    kind: "airborne_physics_prediction",
    method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [
      "source_owned_same_stack_local_substitution_holdout_absent",
      "stc_c_ctr_adapter_owner_absent",
      "field_building_adapter_owner_absent"
    ],
    origin: "family_physics_prediction",
    propertyDefaults: input.evaluation.formulaTerms.map((term) => ({
      field: term.owner,
      reason: term.description,
      source: "broad_accuracy_local_substitution_formula_corridor",
      unit: "dB",
      value: term.correctionDb
    })),
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
      "wallTopology.supportTopology",
      ...input.evaluation.formulaTerms.flatMap((term) => term.requiredInputs)
    ],
    toleranceClass: "uncalibrated_prediction"
  };
}

function buildRuntimeCandidateResolution(input: {
  basis: AirborneResultBasis;
  outputIds: readonly RequestedOutputId[];
  selectedCandidateId?: string;
  selectedMetricIds?: readonly RequestedOutputId[];
}): AirborneCandidateResolution {
  const selectedCandidateId =
    input.selectedCandidateId ?? BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID;
  const selectedMetricIds = input.selectedMetricIds ?? (["Rw"] as const);
  const exactBasis: AirborneResultBasis = {
    assumptions: ["exact row promotion requires a rights-safe same-stack local substitution source row"],
    curveBasis: "no_curve",
    family: "multileaf_multicavity",
    kind: "airborne_measured_exact",
    measurementStandard: "source_report",
    method: "verified_airborne_catalog_exact_match",
    missingPhysicalInputs: [],
    missingSourceEvidence: ["rights_safe_same_stack_local_substitution_source_absent"],
    origin: "measured_exact_full_stack",
    propertyDefaults: [],
    ratingStandard: "source_report",
    requiredInputs: ["sameStackSourceRow", "metricBasisOwner", "rightsSafeCurvePayload"],
    toleranceClass: "exact_source"
  };
  const calibratedBasis: AirborneResultBasis = {
    assumptions: ["calibrated local-substitution promotion requires source-owned holdout residuals"],
    calculationStandard: "ISO 12354-1",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 3,
    family: "multileaf_multicavity",
    kind: "airborne_calibrated_prediction",
    measurementStandard: "source_report",
    method: "calibrated_local_substitution_triple_leaf_solver",
    missingPhysicalInputs: [],
    missingSourceEvidence: ["local_substitution_holdout_residual_set_absent"],
    origin: "calibrated_family_physics",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs: ["calibrationSetId", "holdoutResidualOwner", "sameFamilyNegativeBoundaryOwner"],
    toleranceClass: "calibrated_prediction"
  };
  const screeningBasis: AirborneResultBasis = {
    assumptions: ["screening remains lower precedence after the local substitution formula corridor promotes Rw"],
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
  const seeds: RuntimeCandidateSeed[] = [
    {
      basis: exactBasis,
      blockedReasons: [
        {
          code: "missing_source_evidence",
          detail: "Exact promotion is blocked until a rights-safe same-stack local substitution row exists."
        }
      ],
      id: "candidate_blocked_local_substitution_exact_source",
      metricIds: [...input.outputIds],
      origin: "measured_exact_full_stack",
      outputIds: [...input.outputIds]
    },
    {
      basis: calibratedBasis,
      blockedReasons: [
        {
          code: "missing_source_evidence",
          detail: "Calibration promotion waits for source-owned local-substitution holdout residuals."
        }
      ],
      id: "candidate_blocked_local_substitution_calibrated_family",
      metricIds: [...input.outputIds],
      origin: "calibrated_family_physics",
      outputIds: [...input.outputIds]
    },
    {
      basis: input.basis,
      id: selectedCandidateId,
      metricIds: [...selectedMetricIds],
      origin: "family_physics_prediction",
      outputIds: [...selectedMetricIds]
    },
    {
      basis: screeningBasis,
      id: "candidate_multileaf_screening_fallback",
      metricIds: ["Rw"],
      origin: "screening_fallback",
      outputIds: ["Rw"]
    }
  ];
  const selectedSeed = seeds.find(
    (seed) => seed.id === selectedCandidateId
  );

  if (!selectedSeed) {
    throw new Error("Local substitution runtime resolver requires a selected family-physics candidate.");
  }

  const candidates: AirborneCandidate[] = seeds.map((seed) => {
    const selected = seed.id === selectedSeed.id;
    const blockedReasons = [...(seed.blockedReasons ?? [])];

    return {
      basis: seed.basis,
      id: seed.id,
      metricIds: seed.metricIds,
      origin: seed.origin,
      outputIds: seed.outputIds,
      rejectionReasons: selected
        ? []
        : blockedReasons.length > 0
          ? blockedReasons
          : [
              {
                code: "lower_precedence_than_selected",
                detail: `Candidate loses to ${selectedSeed.id} under model-first airborne precedence.`
              }
            ],
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
    id: "resolver_broad_accuracy_wall_triple_leaf_local_substitution_runtime",
    inputCompletenessIds: ["local_substitution_grouped_triple_leaf_rw_formula_inputs"],
    policyId: "model_first_airborne_candidate_precedence_v1",
    ratingAdapterBasisIds: ["iso_717_1_rw_from_airborne_transmission_loss_curve"],
    rejectedCandidateIds: candidates.filter((candidate) => !candidate.selected).map((candidate) => candidate.id),
    runtimeValueMovement: true,
    selectedBasis: selectedSeed.basis,
    selectedCandidateId: selectedSeed.id,
    selectedOrigin: selectedSeed.origin
  });
}

function canPromoteRuntime(evaluation: BroadAccuracyWallTripleLeafLocalSubstitutionFormulaEvaluation): boolean {
  return (
    evaluation.status === "formula_corridor_defined_runtime_gate_required" &&
    evaluation.candidateId !== null &&
    typeof evaluation.designCorridorRwDb === "number" &&
    Number.isFinite(evaluation.designCorridorRwDb) &&
    evaluation.affectedFormulaOutputs.includes("Rw")
  );
}

export function getBroadAccuracyWallTripleLeafLocalSubstitutionRuntimeBlockedOutputs(input: {
  airborneContext?: AirborneContext | null;
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
  targetOutputs: readonly RequestedOutputId[];
}): readonly RequestedOutputId[] {
  if (input.targetOutputs.length === 0) {
    return [];
  }

  const evaluation = evaluateBroadAccuracyWallTripleLeafLocalSubstitutionFormulaCorridor({
    airborneContext: input.airborneContext ?? { contextMode: "element_lab" },
    catalog: input.catalog,
    layers: input.layers,
    targetOutputs: includeParentRwForLabSpectrumAdapter(input.targetOutputs)
  });

  if (
    evaluation.mappingSnapshot.formulaCorridorCandidate &&
    evaluation.mappingSnapshot.status === "formula_corridor_candidate"
  ) {
    return input.targetOutputs.filter((output) => BLOCKED_LOCAL_SUBSTITUTION_OUTPUTS.has(output));
  }

  return [];
}

export function maybeCalculateBroadAccuracyWallTripleLeafLocalSubstitutionRuntimeCorridor(input: {
  family: { family: DynamicAirborneFamily; notes: string[] };
  layers: readonly ResolvedLayer[];
  options: DynamicAirborneOptions;
  topology: AirborneTopologySummary;
}): DynamicAirborneResult | null {
  if (input.family.family !== "multileaf_multicavity") {
    return null;
  }

  const layerInputs = toLayerInputs(input.layers);
  const targetOutputs = input.options.targetOutputs?.length ? input.options.targetOutputs : (["Rw"] as const);
  const fieldContextRequested =
    input.options.airborneContext?.contextMode === "field_between_rooms" &&
    includesFieldContextOutputs(targetOutputs);
  const formulaAirborneContext: AirborneContext =
    fieldContextRequested && input.options.airborneContext
      ? {
          ...input.options.airborneContext,
          contextMode: "element_lab"
        }
      : input.options.airborneContext ?? { contextMode: "element_lab" };
  const evaluation = evaluateBroadAccuracyWallTripleLeafLocalSubstitutionFormulaCorridor({
    airborneContext: formulaAirborneContext,
    layers: layerInputs,
    targetOutputs: fieldContextRequested ? ["Rw"] : includeParentRwForLabSpectrumAdapter(input.options.targetOutputs)
  });

  if (!canPromoteRuntime(evaluation)) {
    return null;
  }

  const sourceCurve = getSourceAnchorCurve();
  const anchored = anchorCurveToMetric(sourceCurve, evaluation.designCorridorRwDb ?? 0, {
    contextMode: "element_lab"
  });
  const basis = buildRuntimeBasis({
    evaluation,
    frequenciesHz: anchored.curve.frequenciesHz
  });
  const fieldContextBasis = fieldContextRequested
    ? maybeBuildBroadAccuracyWallTripleLeafLocalSubstitutionFieldContextBasis({
        baseBasis: basis,
        context: input.options.airborneContext,
        frequencyBands: {
          bandSet: "nrc_2024_shifted_local_substitution_third_octave_50_to_5000_hz",
          frequenciesHz: [...anchored.curve.frequenciesHz]
        }
      })
    : null;

  if (fieldContextRequested && !fieldContextBasis) {
    return null;
  }

  const selectedBasis = fieldContextBasis ?? basis;
  const ratings = buildRatingsFromCurve(
    anchored.curve.frequenciesHz,
    anchored.curve.transmissionLossDb,
    fieldContextBasis ? input.options.airborneContext : { contextMode: "element_lab" }
  );
  const candidateResolution = buildRuntimeCandidateResolution({
    basis: selectedBasis,
    outputIds: targetOutputs,
    selectedCandidateId: fieldContextBasis
      ? BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
      : undefined,
    selectedMetricIds: fieldContextBasis
      ? targetOutputs.filter((output) => LOCAL_SUBSTITUTION_FIELD_OUTPUTS.has(output))
      : undefined
  });
  const screeningRw = input.options.screeningEstimatedRwDb;
  const trace: DynamicAirborneTrace = {
    adjustmentDb: ksRound1((evaluation.designCorridorRwDb ?? ratings.iso717.Rw) - screeningRw),
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
        rwDb: ratings.iso717.Rw,
        selected: true
      }
    ],
    cavityCount: input.topology.cavityCount,
    confidenceClass: evaluation.candidateId === "generic_gypsum_glasswool_source_like_rw_formula" ? "medium" : "medium",
    confidenceScore: evaluation.candidateId === "generic_gypsum_glasswool_source_like_rw_formula" ? 0.66 : 0.58,
    detectedFamily: input.family.family,
    detectedFamilyLabel: "Multi-Leaf / Multi-Cavity",
    familyDecisionClass: "clear",
    hasPorousFill: input.topology.hasPorousFill,
    hasStudLikeSupport: input.topology.hasStudLikeSupport,
    notes: [
      ...input.family.notes,
      `Local substitution runtime selected ${evaluation.candidateId ?? "unknown"} from the source-absent formula corridor.`,
      `Formula design corridor Rw ${(evaluation.designCorridorRwDb ?? ratings.iso717.Rw).toFixed(1)} with live ISO-rounded Rw ${ratings.iso717.Rw.toFixed(0)} and +/-${basis.errorBudgetDb?.toFixed(0) ?? "?"} dB not-measured budget.`,
      "The shifted NRC 2024 Assembly B curve is used only as an anchor shape; this is not measured exact evidence.",
      fieldContextBasis
        ? "Field R'w and DnT,w are harmonized from the local-substitution lab curve plus explicit receiving-room context; building prediction remains blocked."
        : "STC, C, Ctr, field, and building adapters remain blocked by the runtime corridor."
    ],
    originalSolidLayerCount: input.topology.originalSolidLayerCount,
    porousLayerCount: input.topology.porousLayerCount,
    selectedLabel: getDelegateLabel("triple_leaf_two_cavity_frequency_solver"),
    selectedFamilyScore: evaluation.candidateId === "generic_gypsum_glasswool_source_like_rw_formula" ? 0.66 : 0.58,
    selectedMethod: "triple_leaf_two_cavity_frequency_solver",
    solverSpreadRwDb: ksRound1(Math.abs(ratings.iso717.Rw - screeningRw)),
    strategy: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_STRATEGY,
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
    curve: anchored.curve,
    id: "dynamic",
    label: "Dynamic Topology",
    ratings,
    rw: ratings.iso717.Rw,
    trace,
    warnings: fieldContextBasis
      ? [
          BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_WARNING,
          `Local substitution field context carries a +/-${fieldContextBasis.errorBudgetDb?.toFixed(0) ?? "?"} dB source-absent error budget for R'w and DnT,w.`
        ]
      : [
          BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_WARNING,
          `Local substitution runtime carries a +/-${basis.errorBudgetDb?.toFixed(0) ?? "?"} dB source-absent error budget for Rw only.`
        ]
  };
}

export function buildBroadAccuracyWallTripleLeafLocalSubstitutionRuntimeCorridorContract():
  BroadAccuracyWallTripleLeafLocalSubstitutionRuntimeContract {
  const genericContext: AirborneContext = {
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
    candidateRuntimeRows: [
      evaluateBroadAccuracyWallTripleLeafLocalSubstitutionFormulaCorridor({
        airborneContext: genericContext,
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
    landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_LANDED_GATE,
    metricBoundaries: {
      buildingPredictionMetricsBlocked: true,
      fieldMetricsBlocked: true,
      stcCAndCtrAdaptersBlocked: true
    },
    previousFormulaCorridor: {
      landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FORMULA_CORRIDOR_SELECTION_STATUS
    },
    runtimeMethod: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD,
    runtimeValueMovement: true,
    selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID,
    selectedNextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTION_STATUS,
    supportedRuntimeOutputs: ["Rw"]
  };
}
