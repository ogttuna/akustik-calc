import {
  AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE,
  AirborneCandidateResolutionSchema,
  type AirborneCandidate,
  type AirborneCandidateRejectionReason,
  type AirborneCandidateResolution,
  type AirborneResultBasis,
  type AirborneResultOrigin,
  type AirborneContext,
  type DynamicAirborneFamily,
  type LayerInput,
  type RequestedOutputId
} from "@dynecho/shared";

import {
  buildDynamicCalculatorRouteInputTopologyAssessment,
  type DynamicCalculatorRoute,
  type DynamicCalculatorFloorImpactContext,
  type DynamicCalculatorRouteInputTopologyAssessment
} from "./dynamic-calculator-route-input-topology";
import {
  normalizeDynamicCalculatorTopologyInput,
  type DynamicCalculatorTopologyNormalizationResult
} from "./dynamic-calculator-topology-normalizer";
import {
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-s-double-leaf-framed";

export type DynamicCalculatorCandidateResolverSourceAnchor = {
  applied: boolean;
  match: {
    id: string;
    label: string;
    metricLabel: string;
    metricValue?: number;
    sourceMode: "field" | "lab";
  } | null;
};

export type DynamicCalculatorCandidateResolverRuntimeSignal = {
  airborneBasis?: AirborneResultBasis;
  detectedFamily?: DynamicAirborneFamily;
  runtimeValueMovement?: boolean;
  selectedMethod?: string;
  strategy?: string;
};

export type DynamicCalculatorCandidateResolverRuntimeInput = {
  airborneContext?: AirborneContext | null;
  floorImpactContext?: DynamicCalculatorFloorImpactContext | null;
  layers: readonly LayerInput[];
  route: DynamicCalculatorRoute;
  runtimeSignal?: DynamicCalculatorCandidateResolverRuntimeSignal | null;
  sourceAnchor?: DynamicCalculatorCandidateResolverSourceAnchor | null;
  targetOutputs: readonly RequestedOutputId[];
};

export type DynamicCalculatorCandidateResolverRuntimeResult = {
  resolution: AirborneCandidateResolution;
  routeInputAssessment: DynamicCalculatorRouteInputTopologyAssessment;
  runtimeValueMovement: boolean;
  topologyNormalization: DynamicCalculatorTopologyNormalizationResult;
};

type GateMAirborneCandidateSeed = Omit<AirborneCandidate, "rejectionReasons" | "selected"> & {
  blockedReasons?: readonly AirborneCandidateRejectionReason[];
};

type GateMSelectedLane =
  | "anchored_delta"
  | "bounded"
  | "exact_full_stack"
  | "family_physics"
  | "needs_input"
  | "screening"
  | "unsupported";

const DEFAULT_WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OR_FLOOR_OUTPUTS = new Set<RequestedOutputId>([
  "AIIC",
  "CI",
  "CI,50-2500",
  "DeltaLw",
  "HIIC",
  "IIC",
  "ISR",
  "LIIC",
  "LIR",
  "L'n,w",
  "L'nT,50",
  "L'nT,w",
  "Ln,w",
  "Ln,w+CI",
  "LnT,A",
  "NISR"
]);

const FIELD_OR_BUILDING_OUTPUTS = new Set<RequestedOutputId>([
  "Dn,A",
  "Dn,w",
  "DnT,A",
  "DnT,A,k",
  "DnT,w",
  "L'n,w",
  "L'nT,50",
  "L'nT,w",
  "LnT,A",
  "R'w"
]);

const NUMERIC_AIRBORNE_ORIGINS = new Set<AirborneResultOrigin>([
  "bounded_prediction",
  "calibrated_family_physics",
  "family_physics_prediction",
  "measured_exact_full_stack",
  "measured_exact_subassembly_plus_calculated_delta",
  "screening_fallback"
]);

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function outputIds(targetOutputs: readonly RequestedOutputId[], route: DynamicCalculatorRoute): RequestedOutputId[] {
  if (targetOutputs.length > 0) {
    return [...targetOutputs];
  }

  return route === "wall" ? [...DEFAULT_WALL_OUTPUTS] : ["Rw", "Ln,w"];
}

function metricIds(targetOutputs: readonly RequestedOutputId[], route: DynamicCalculatorRoute): string[] {
  return outputIds(targetOutputs, route);
}

function inferOutputBasis(
  targetOutputs: readonly RequestedOutputId[],
  context: AirborneContext | null | undefined
): "building_prediction" | "element_lab" | "field_apparent" {
  if (context?.contextMode === "building_prediction") {
    return "building_prediction";
  }

  if (
    context?.contextMode === "field_between_rooms" ||
    targetOutputs.some((output) => FIELD_OR_BUILDING_OUTPUTS.has(output))
  ) {
    return "field_apparent";
  }

  return "element_lab";
}

export function inferDynamicCalculatorRuntimeRoute(input: {
  layers: readonly LayerInput[];
  targetOutputs: readonly RequestedOutputId[];
}): DynamicCalculatorRoute {
  if (
    input.layers.some((layer) => Boolean(layer.floorRole)) ||
    input.targetOutputs.some((output) => IMPACT_OR_FLOOR_OUTPUTS.has(output))
  ) {
    return "floor";
  }

  return "wall";
}

function missingInputNames(assessment: DynamicCalculatorRouteInputTopologyAssessment): string[] {
  if (assessment.missingPhysicalInputs.length > 0) {
    return [...assessment.missingPhysicalInputs];
  }

  return assessment.route === "wall"
    ? ["sideALeafGroup", "cavity1DepthMm", "internalLeafGroup", "supportTopology"]
    : ["baseSlabOrFloor", "resilientLayerDynamicStiffnessMNm3", "loadBasisKgM2"];
}

function familyFrom(input: DynamicCalculatorCandidateResolverRuntimeInput): DynamicAirborneFamily | undefined {
  return input.runtimeSignal?.airborneBasis?.family ?? input.runtimeSignal?.detectedFamily;
}

function exactBasis(input: {
  exactSourceId?: string;
  family?: DynamicAirborneFamily;
  missingSourceEvidence?: readonly string[];
  outputBasis: "building_prediction" | "element_lab" | "field_apparent";
}): AirborneResultBasis {
  return {
    assumptions: [
      input.outputBasis === "element_lab"
        ? "exact full-stack source matches the requested lab basis"
        : "exact full-stack source matches the requested field/building basis"
    ],
    curveBasis: input.exactSourceId ? "source_single_number_rating" : "no_curve",
    exactSourceId: input.exactSourceId,
    family: input.family,
    kind: "airborne_measured_exact",
    measurementStandard: "source_report",
    method: "verified_airborne_catalog_exact_match",
    missingPhysicalInputs: [],
    missingSourceEvidence: [...(input.missingSourceEvidence ?? [])],
    origin: "measured_exact_full_stack",
    propertyDefaults: [],
    ratingStandard: "source_report",
    requiredInputs: ["exactFullStackSource", "metricBasisOwner", "topologyOwner"],
    toleranceClass: "exact_source"
  };
}

function anchoredDeltaBasis(input: {
  anchorSourceId?: string;
  family?: DynamicAirborneFamily;
  missingSourceEvidence?: readonly string[];
  outputBasis: "building_prediction" | "element_lab" | "field_apparent";
}): AirborneResultBasis {
  return {
    anchorSourceId: input.anchorSourceId,
    assumptions: [
      input.outputBasis === "element_lab"
        ? "exact subassembly source can anchor only a topology-compatible calculated delta"
        : "lab source can anchor field/building output only through an explicit context delta"
    ],
    calculationStandard: "ISO 12354-1",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 5,
    family: input.family,
    kind: "airborne_anchored_delta",
    measurementStandard: "source_report",
    method: "exact_subassembly_source_plus_calculated_delta",
    missingPhysicalInputs: [],
    missingSourceEvidence: [...(input.missingSourceEvidence ?? [])],
    origin: "measured_exact_subassembly_plus_calculated_delta",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs: ["anchorSourceId", "deltaTopology", "metricBasisOwner"],
    toleranceClass: "bounded_prediction"
  };
}

function calibratedBasis(input: {
  family?: DynamicAirborneFamily;
  missingSourceEvidence?: readonly string[];
}): AirborneResultBasis {
  return {
    assumptions: ["family calibration requires topology-compatible rights-safe source and holdout rows"],
    calculationStandard: "ISO 12354-1",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 3,
    family: input.family,
    kind: "airborne_calibrated_prediction",
    measurementStandard: "source_report",
    method: "calibrated_family_physics_solver",
    missingPhysicalInputs: [],
    missingSourceEvidence: [...(input.missingSourceEvidence ?? [])],
    origin: "calibrated_family_physics",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs: ["calibrationSetId", "holdoutSetId", "calibrationResidualOwner"],
    toleranceClass: "calibrated_prediction"
  };
}

function familyPhysicsBasis(input: {
  assessment: DynamicCalculatorRouteInputTopologyAssessment;
  family?: DynamicAirborneFamily;
  runtimeBasis?: AirborneResultBasis;
}): AirborneResultBasis {
  if (input.runtimeBasis?.origin === "family_physics_prediction") {
    return input.runtimeBasis;
  }

  return {
    assumptions: [
      "source absence blocks exact/calibrated promotion only",
      "family physics remains available when required physical topology inputs are complete"
    ],
    calculationStandard:
      input.family === "multileaf_multicavity"
        ? "engine_triple_leaf_two_cavity_frequency_solver"
        : "engine_screening",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 6,
    family: input.family,
    kind: "airborne_physics_prediction",
    method:
      input.family === "multileaf_multicavity"
        ? "triple_leaf_or_multicavity_family_solver"
        : "dynamic_family_physics_solver",
    missingPhysicalInputs: [...input.assessment.missingPhysicalInputs],
    missingSourceEvidence: [],
    origin: "family_physics_prediction",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs:
      input.family === "multileaf_multicavity"
        ? [
            "sideALeafGroup",
            "cavity1DepthMm",
            "internalLeafGroup",
            "internalLeafCoupling",
            "cavity2DepthMm",
            "sideBLeafGroup",
            "supportTopology"
          ]
        : ["layers", "surfaceMass", "familyDetector"],
    toleranceClass: "uncalibrated_prediction"
  };
}

function boundedBasis(input: { family?: DynamicAirborneFamily }): AirborneResultBasis {
  return {
    assumptions: ["bounded candidate is retained as a conservative envelope, not as a design-grade answer"],
    calculationStandard: "engine_bounded_estimate",
    curveBasis: "calculated_single_number_estimate",
    errorBudgetDb: 8,
    family: input.family,
    kind: "airborne_bound",
    method: "bounded_dynamic_family_estimate",
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "bounded_prediction",
    propertyDefaults: [],
    ratingStandard: "engine_native_bounded_estimate",
    requiredInputs: ["massPerArea", "routeScope"],
    toleranceClass: "bounded_prediction"
  };
}

function screeningBasis(input: { family?: DynamicAirborneFamily }): AirborneResultBasis {
  return {
    assumptions: ["screening fallback is diagnostic when topology or family evidence is incomplete"],
    calculationStandard: "engine_screening",
    curveBasis: "screening_mass_law_curve",
    errorBudgetDb: 10,
    family: input.family,
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
}

function needsInputBasis(input: {
  assessment: DynamicCalculatorRouteInputTopologyAssessment;
}): AirborneResultBasis {
  const missingPhysicalInputs = missingInputNames(input.assessment);

  return {
    assumptions: ["missing physical fields are user prompts, not source-packet tasks"],
    calculationStandard: "none",
    curveBasis: "no_curve",
    kind: "airborne_needs_input",
    method: "dynamic_calculator_route_input_contract_missing_physical_fields",
    missingPhysicalInputs,
    missingSourceEvidence: [],
    origin: "needs_input",
    propertyDefaults: [],
    ratingStandard: "none",
    requiredInputs: missingPhysicalInputs
  };
}

function unsupportedBasis(input: {
  assessment: DynamicCalculatorRouteInputTopologyAssessment;
}): AirborneResultBasis {
  return {
    assumptions: ["requested output has no runtime adapter owner for the current Dynamic Calculator route"],
    calculationStandard: "none",
    curveBasis: "no_curve",
    kind: "airborne_unsupported",
    method: "dynamic_calculator_unsupported_output_guard",
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "unsupported",
    propertyDefaults: [],
    ratingStandard: "none",
    requiredInputs: [...input.assessment.unsupportedOutputs]
  };
}

function exactSourceEligible(input: {
  assessment: DynamicCalculatorRouteInputTopologyAssessment;
  sourceAnchor?: DynamicCalculatorCandidateResolverSourceAnchor | null;
}): boolean {
  const match = input.sourceAnchor?.match;
  if (!input.sourceAnchor?.applied || !match) {
    return false;
  }

  return input.assessment.outputBasis === "element_lab" || match.sourceMode === "field";
}

function anchoredDeltaEligible(input: {
  assessment: DynamicCalculatorRouteInputTopologyAssessment;
  sourceAnchor?: DynamicCalculatorCandidateResolverSourceAnchor | null;
}): boolean {
  const match = input.sourceAnchor?.match;
  return Boolean(
    input.sourceAnchor?.applied &&
      match &&
      input.assessment.outputBasis !== "element_lab" &&
      match.sourceMode === "lab"
  );
}

function selectLane(input: {
  assessment: DynamicCalculatorRouteInputTopologyAssessment;
  runtimeSignal?: DynamicCalculatorCandidateResolverRuntimeSignal | null;
  sourceAnchor?: DynamicCalculatorCandidateResolverSourceAnchor | null;
  topologyNormalization: DynamicCalculatorTopologyNormalizationResult;
}): GateMSelectedLane {
  if (
    input.topologyNormalization.status === "unsupported_hostile_input" ||
    input.assessment.status === "unsupported"
  ) {
    return "unsupported";
  }

  if (
    input.topologyNormalization.blockers.length > 0 ||
    input.assessment.missingPhysicalInputs.length > 0 ||
    input.assessment.status === "needs_input"
  ) {
    return "needs_input";
  }

  if (
    exactSourceEligible({
      assessment: input.assessment,
      sourceAnchor: input.sourceAnchor
    })
  ) {
    return "exact_full_stack";
  }

  if (
    anchoredDeltaEligible({
      assessment: input.assessment,
      sourceAnchor: input.sourceAnchor
    })
  ) {
    return "anchored_delta";
  }

  if (input.runtimeSignal?.airborneBasis?.origin === "family_physics_prediction") {
    return "family_physics";
  }

  return "screening";
}

function familyPhysicsCandidateId(runtimeBasis?: AirborneResultBasis): string {
  if (runtimeBasis?.method === GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD) {
    return GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID;
  }

  return "candidate_grouped_rockwool_family_physics_prediction";
}

function candidateIdForLane(
  lane: GateMSelectedLane,
  runtimeBasis?: AirborneResultBasis
): string {
  switch (lane) {
    case "anchored_delta":
      return "candidate_dynamic_exact_subassembly_plus_calculated_delta";
    case "bounded":
      return "candidate_dynamic_bounded_prediction";
    case "exact_full_stack":
      return "candidate_blocked_rockwool_exact_source";
    case "family_physics":
      return familyPhysicsCandidateId(runtimeBasis);
    case "needs_input":
      return "candidate_dynamic_needs_input";
    case "screening":
      return "candidate_multileaf_screening_fallback";
    case "unsupported":
      return "candidate_dynamic_unsupported";
  }
}

function sourceAbsentReason(detail: string): AirborneCandidateRejectionReason {
  return {
    code: "missing_source_evidence",
    detail
  };
}

function missingPhysicalInputReason(assessment: DynamicCalculatorRouteInputTopologyAssessment): AirborneCandidateRejectionReason {
  return {
    code: "missing_physical_input",
    detail: `Cannot select a numeric candidate until ${missingInputNames(assessment).join(", ")} is provided.`
  };
}

function unsupportedRouteReason(assessment: DynamicCalculatorRouteInputTopologyAssessment): AirborneCandidateRejectionReason {
  return {
    code: "unsupported_route",
    detail:
      assessment.unsupportedOutputs.length > 0
        ? `Requested outputs are unsupported in the current runtime: ${assessment.unsupportedOutputs.join(", ")}.`
        : "Current route is unsupported for design-grade airborne candidate promotion."
  };
}

function rejectionReasonsFor(input: {
  assessment: DynamicCalculatorRouteInputTopologyAssessment;
  exactEligible: boolean;
  anchoredEligible: boolean;
  lane: GateMSelectedLane;
  seed: GateMAirborneCandidateSeed;
  selectedCandidateId: string;
}): readonly AirborneCandidateRejectionReason[] {
  if (input.lane === "needs_input") {
    return NUMERIC_AIRBORNE_ORIGINS.has(input.seed.origin)
      ? [missingPhysicalInputReason(input.assessment)]
      : [
          {
            code: "not_selected_route_has_physical_prompts",
            detail: "Needs-input wins because at least one supported requested output is waiting on physical inputs."
          }
        ];
  }

  if (input.lane === "unsupported") {
    return NUMERIC_AIRBORNE_ORIGINS.has(input.seed.origin)
      ? [unsupportedRouteReason(input.assessment)]
      : [
          {
            code: "unsupported_route",
            detail: "Unsupported wins because every requested output is outside the current runtime adapter set."
          }
        ];
  }

  if (input.seed.origin === "measured_exact_full_stack" && !input.exactEligible) {
    return [
      sourceAbsentReason(
        "Exact full-stack promotion is blocked until a rights-safe source row matches topology, material, metric basis, and tolerance ownership."
      )
    ];
  }

  if (
    input.seed.origin === "measured_exact_subassembly_plus_calculated_delta" &&
    !input.anchoredEligible
  ) {
    return [
      sourceAbsentReason(
        "Anchored-delta promotion is blocked until a topology-compatible exact subassembly anchor and calculated delta owner exist."
      )
    ];
  }

  if (input.seed.origin === "calibrated_family_physics") {
    return [
      sourceAbsentReason(
        "Calibrated family promotion waits for rights-safe calibration rows, holdout residuals, and tolerance ownership."
      )
    ];
  }

  if (input.seed.origin === "family_physics_prediction" && input.lane === "screening") {
    return [
      {
        code: "family_solver_unavailable",
        detail: "No stronger family-specific solver is eligible for this exact topology yet, so screening remains selected."
      }
    ];
  }

  if (input.seed.origin === "bounded_prediction" && input.lane === "screening") {
    return [
      {
        code: "bounded_candidate_not_design_grade",
        detail: "The bounded envelope is retained for diagnostics but is not selected over the current screening lane."
      }
    ];
  }

  return [
    {
      code: "lower_precedence_than_selected",
      detail: `Candidate loses to ${input.selectedCandidateId} under model-first airborne precedence.`
    }
  ];
}

function buildSeeds(input: {
  assessment: DynamicCalculatorRouteInputTopologyAssessment;
  family?: DynamicAirborneFamily;
  outputBasis: "building_prediction" | "element_lab" | "field_apparent";
  route: DynamicCalculatorRoute;
  runtimeBasis?: AirborneResultBasis;
  sourceAnchor?: DynamicCalculatorCandidateResolverSourceAnchor | null;
  targetOutputs: readonly RequestedOutputId[];
}): GateMAirborneCandidateSeed[] {
  const metric = metricIds(input.targetOutputs, input.route);
  const outputs = outputIds(input.targetOutputs, input.route);
  const exactEligible = exactSourceEligible({
    assessment: input.assessment,
    sourceAnchor: input.sourceAnchor
  });
  const anchoredEligible = anchoredDeltaEligible({
    assessment: input.assessment,
    sourceAnchor: input.sourceAnchor
  });
  const exactSourceId = exactEligible ? input.sourceAnchor?.match?.id : undefined;
  const anchorSourceId = anchoredEligible ? input.sourceAnchor?.match?.id : undefined;

  return [
    {
      basis: exactBasis({
        exactSourceId,
        family: input.family,
        missingSourceEvidence: exactEligible ? [] : ["rights_safe_exact_full_stack_source_absent"],
        outputBasis: input.outputBasis
      }),
      id: "candidate_blocked_rockwool_exact_source",
      metricIds: metric,
      origin: "measured_exact_full_stack",
      outputIds: outputs
    },
    {
      basis: anchoredDeltaBasis({
        anchorSourceId,
        family: input.family,
        missingSourceEvidence: anchoredEligible ? [] : ["exact_subassembly_anchor_absent"],
        outputBasis: input.outputBasis
      }),
      id: "candidate_dynamic_exact_subassembly_plus_calculated_delta",
      metricIds: metric,
      origin: "measured_exact_subassembly_plus_calculated_delta",
      outputIds: outputs
    },
    {
      basis: calibratedBasis({
        family: input.family,
        missingSourceEvidence: ["calibration_holdout_curve_absent"]
      }),
      id: "candidate_calibrated_triple_leaf_family",
      metricIds: metric,
      origin: "calibrated_family_physics",
      outputIds: outputs
    },
    {
      basis: familyPhysicsBasis({
        assessment: input.assessment,
        family: input.family,
        runtimeBasis: input.runtimeBasis
      }),
      id: familyPhysicsCandidateId(input.runtimeBasis),
      metricIds: metric,
      origin: "family_physics_prediction",
      outputIds: outputs
    },
    {
      basis: boundedBasis({ family: input.family }),
      id: "candidate_dynamic_bounded_prediction",
      metricIds: metric,
      origin: "bounded_prediction",
      outputIds: outputs
    },
    {
      basis: screeningBasis({ family: input.family }),
      id: "candidate_multileaf_screening_fallback",
      metricIds: metric,
      origin: "screening_fallback",
      outputIds: outputs
    },
    {
      basis: needsInputBasis({ assessment: input.assessment }),
      id: "candidate_dynamic_needs_input",
      metricIds: metric,
      origin: "needs_input",
      outputIds: outputs
    },
    {
      basis: unsupportedBasis({ assessment: input.assessment }),
      id: "candidate_dynamic_unsupported",
      metricIds: metric,
      origin: "unsupported",
      outputIds: outputs
    }
  ];
}

function ratingAdapterBasisIds(targetOutputs: readonly RequestedOutputId[]): string[] {
  const ids: string[] = [];

  if (targetOutputs.some((output) => ["C", "Ctr", "Dn,A", "Dn,w", "DnT,A", "DnT,A,k", "DnT,w", "R'w", "Rw"].includes(output))) {
    ids.push("iso_717_1_rw_from_airborne_transmission_loss_curve");
  }

  if (targetOutputs.includes("STC")) {
    ids.push("astm_e413_stc_from_airborne_transmission_loss_curve");
  }

  if (targetOutputs.some((output) => ["Ln,w", "L'n,w", "L'nT,50", "L'nT,w", "LnT,A"].includes(output))) {
    ids.push("iso_717_2_impact_rating_adapter_context");
  }

  if (targetOutputs.some((output) => ["AIIC", "HIIC", "IIC", "LIIC"].includes(output))) {
    ids.push("astm_e989_iic_rating_adapter_missing_runtime_owner");
  }

  return unique(ids);
}

function runtimeMovementFor(input: {
  lane: GateMSelectedLane;
  runtimeSignal?: DynamicCalculatorCandidateResolverRuntimeSignal | null;
  sourceAnchor?: DynamicCalculatorCandidateResolverSourceAnchor | null;
}): boolean {
  if (input.lane === "exact_full_stack" || input.lane === "anchored_delta") {
    return Boolean(input.sourceAnchor?.applied);
  }

  if (input.lane === "family_physics") {
    return Boolean(input.runtimeSignal?.runtimeValueMovement);
  }

  return false;
}

export function buildDynamicCalculatorCandidateResolverRuntime(
  input: DynamicCalculatorCandidateResolverRuntimeInput
): DynamicCalculatorCandidateResolverRuntimeResult {
  const targetOutputs = outputIds(input.targetOutputs, input.route);
  const topologyNormalization = normalizeDynamicCalculatorTopologyInput({
    airborneContext: input.airborneContext ?? undefined,
    floorImpactContext: input.floorImpactContext ?? undefined,
    layers: input.layers,
    route: input.route,
    targetOutputs
  });
  const routeInputAssessment = buildDynamicCalculatorRouteInputTopologyAssessment({
    airborneContext: input.airborneContext ?? undefined,
    floorImpactContext: input.floorImpactContext ?? undefined,
    layers: topologyNormalization.normalizedLayers,
    route: input.route,
    sourceEvidenceAvailable: Boolean(input.sourceAnchor?.applied),
    targetOutputs
  });
  const outputBasis = inferOutputBasis(targetOutputs, input.airborneContext);
  const family = familyFrom(input);
  const lane = selectLane({
    assessment: routeInputAssessment,
    runtimeSignal: input.runtimeSignal,
    sourceAnchor: input.sourceAnchor,
    topologyNormalization
  });
  const selectedCandidateId = candidateIdForLane(lane, input.runtimeSignal?.airborneBasis);
  const exactEligible = exactSourceEligible({
    assessment: routeInputAssessment,
    sourceAnchor: input.sourceAnchor
  });
  const anchoredEligible = anchoredDeltaEligible({
    assessment: routeInputAssessment,
    sourceAnchor: input.sourceAnchor
  });
  const seeds = buildSeeds({
    assessment: routeInputAssessment,
    family,
    outputBasis,
    route: input.route,
    runtimeBasis: input.runtimeSignal?.airborneBasis,
    sourceAnchor: input.sourceAnchor,
    targetOutputs
  });
  const candidates: AirborneCandidate[] = seeds.map((seed) => {
    const selected = seed.id === selectedCandidateId;
    return {
      basis: seed.basis,
      id: seed.id,
      metricIds: seed.metricIds,
      origin: seed.origin,
      outputIds: seed.outputIds,
      rejectionReasons: selected
        ? []
        : [...rejectionReasonsFor({
            assessment: routeInputAssessment,
            anchoredEligible,
            exactEligible,
            lane,
            seed,
            selectedCandidateId
          })],
      selected
    };
  });
  const selectedCandidate = candidates.find((candidate) => candidate.selected);
  if (!selectedCandidate) {
    throw new Error("Gate M dynamic candidate resolver requires exactly one selected candidate.");
  }
  const runtimeValueMovement = runtimeMovementFor({
    lane,
    runtimeSignal: input.runtimeSignal,
    sourceAnchor: input.sourceAnchor
  });
  const resolution = AirborneCandidateResolutionSchema.parse({
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
    id: `resolver_dynamic_calculator_gate_m_${input.route}_${lane}`,
    inputCompletenessIds: routeInputAssessment.inputCompletenessSet.map((entry) => entry.id),
    policyId: "model_first_airborne_candidate_precedence_v1",
    ratingAdapterBasisIds: ratingAdapterBasisIds(targetOutputs),
    rejectedCandidateIds: candidates.filter((candidate) => !candidate.selected).map((candidate) => candidate.id),
    runtimeValueMovement,
    selectedBasis: selectedCandidate.basis,
    selectedCandidateId: selectedCandidate.id,
    selectedOrigin: selectedCandidate.origin
  });

  return {
    resolution,
    routeInputAssessment,
    runtimeValueMovement,
    topologyNormalization
  };
}

export function buildGateMDynamicCandidateResolverRuntimeScenarioPack(): readonly DynamicCalculatorCandidateResolverRuntimeResult[] {
  const wallLabContext: AirborneContext = {
    airtightness: "good",
    contextMode: "element_lab"
  };
  const groupedWallContext: AirborneContext = {
    ...wallLabContext,
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
  const groupedWallLayers: readonly LayerInput[] = [
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "mlv", thicknessMm: 4 },
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "rockwool", thicknessMm: 50 },
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "rockwool", thicknessMm: 50 },
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "gypsum_plaster", thicknessMm: 10 },
    { materialId: "gypsum_board", thicknessMm: 12.5 }
  ];
  const simpleWallLayers: readonly LayerInput[] = [
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "air_gap", thicknessMm: 70 },
    { materialId: "gypsum_board", thicknessMm: 12.5 }
  ];
  const aconLikeWallLayers: readonly LayerInput[] = [
    { materialId: "gypsum_plaster", thicknessMm: 3 },
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "mlv", thicknessMm: 2 },
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "rockwool", thicknessMm: 80 },
    { materialId: "air_gap", thicknessMm: 20 },
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "air_gap", thicknessMm: 30 },
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "rockwool", thicknessMm: 80 },
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "mlv", thicknessMm: 2 },
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "gypsum_plaster", thicknessMm: 3 }
  ];
  const floatingFloorLayers: readonly LayerInput[] = [
    { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 },
    { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
    { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 }
  ];
  const groupedFamilyBasis = familyPhysicsBasis({
    assessment: buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: groupedWallContext,
      layers: groupedWallLayers,
      route: "wall",
      targetOutputs: DEFAULT_WALL_OUTPUTS
    }),
    family: "multileaf_multicavity"
  });

  return [
    buildDynamicCalculatorCandidateResolverRuntime({
      airborneContext: wallLabContext,
      layers: simpleWallLayers,
      route: "wall",
      sourceAnchor: {
        applied: true,
        match: {
          id: "gate_m_exact_simple_wall_source",
          label: "Gate M exact simple wall source",
          metricLabel: "Rw",
          metricValue: 47,
          sourceMode: "lab"
        }
      },
      targetOutputs: ["Rw", "STC"]
    }),
    buildDynamicCalculatorCandidateResolverRuntime({
      airborneContext: groupedWallContext,
      layers: groupedWallLayers,
      route: "wall",
      runtimeSignal: {
        airborneBasis: groupedFamilyBasis,
        detectedFamily: "multileaf_multicavity",
        runtimeValueMovement: true,
        selectedMethod: "triple_leaf_two_cavity_frequency_solver",
        strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction"
      },
      targetOutputs: DEFAULT_WALL_OUTPUTS
    }),
    buildDynamicCalculatorCandidateResolverRuntime({
      airborneContext: wallLabContext,
      layers: aconLikeWallLayers,
      route: "wall",
      runtimeSignal: {
        detectedFamily: "multileaf_multicavity",
        runtimeValueMovement: false,
        selectedMethod: "screening_mass_law_curve_seed_v3",
        strategy: "multileaf_screening_blend"
      },
      targetOutputs: DEFAULT_WALL_OUTPUTS
    }),
    buildDynamicCalculatorCandidateResolverRuntime({
      airborneContext: { contextMode: "field_between_rooms" },
      layers: groupedWallLayers,
      route: "wall",
      runtimeSignal: {
        airborneBasis: groupedFamilyBasis,
        detectedFamily: "multileaf_multicavity",
        runtimeValueMovement: true,
        selectedMethod: "triple_leaf_two_cavity_frequency_solver",
        strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction"
      },
      targetOutputs: ["R'w", "DnT,w"]
    }),
    buildDynamicCalculatorCandidateResolverRuntime({
      layers: floatingFloorLayers,
      route: "floor",
      targetOutputs: ["IIC", "AIIC"]
    })
  ];
}
