import {
  AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE,
  AirborneCandidateResolutionSchema,
  AirborneResultBasisSchema
} from "@dynecho/shared";
import type {
  AirborneCandidate,
  AirborneCandidateRejectionReason,
  AirborneCandidateResolution,
  AirborneResultBasis,
  DynamicAirborneFamily,
  DynamicAirborneTrace,
  RequestedOutputId,
  ResolvedLayer,
  TransmissionLossCurve
} from "@dynecho/shared";

import type { AirborneTopologySummary } from "./airborne-topology";
import { buildRatingsFromCurve, buildCalibratedMassLawCurve } from "./curve-rating";
import {
  anchorCurveToMetric,
  getDelegateLabel,
  type DynamicAirborneOptions,
  type DynamicAirborneResult
} from "./dynamic-airborne-helpers";
import {
  buildGateRDoubleLeafFramedBridgeSolverContract,
  type GateRDoubleLeafFramedBridgeBenchmarkRange,
  type GateRDoubleLeafFramedBridgePhysicalInputs
} from "./dynamic-calculator-double-leaf-framed-bridge-solver-contract";
import { ksRound1 } from "./math";

export const GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD =
  "gate_s_double_leaf_framed_bridge_mass_air_mass_bridge_damping_runtime";

export const GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID =
  "candidate_double_leaf_framed_bridge_family_physics_prediction";

export const GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_WARNING =
  "Double-leaf / framed bridge family physics prediction is active from the mass-air-mass bridge/damping solver. It is source-absent and uncalibrated; use the visible error budget until exact source override or calibration lands.";

function buildGateSCurve(input: {
  benchmark: GateRDoubleLeafFramedBridgeBenchmarkRange;
  frequenciesHz?: readonly number[];
  physicalInputs: GateRDoubleLeafFramedBridgePhysicalInputs;
}): TransmissionLossCurve {
  const targetRw = input.benchmark.estimatedRwDb.center;
  const totalLeafMass =
    (input.physicalInputs.sideALeafMassKgM2 ?? 0) +
    (input.physicalInputs.sideBLeafMassKgM2 ?? 0);
  const baseCurve = buildCalibratedMassLawCurve(
    Math.max(totalLeafMass, 1),
    targetRw,
    input.frequenciesHz
  );
  const resonanceHz = input.benchmark.massAirMassResonanceHz;
  const shapedCurve: TransmissionLossCurve = {
    frequenciesHz: [...baseCurve.frequenciesHz],
    transmissionLossDb: baseCurve.transmissionLossDb.map((value, index) => {
      const frequency = baseCurve.frequenciesHz[index] ?? 1;
      const octaveDistance = Math.abs(Math.log2(Math.max(frequency, 1) / resonanceHz));
      const resonanceNotchDb = Math.max(0, 2.4 * (1 - (octaveDistance / 1.35)));
      const bridgeLossTiltDb =
        input.benchmark.bridgeCouplingDeltaDb < 0 && frequency >= 500
          ? Math.min(3, Math.log2(frequency / 400) * 0.9)
          : 0;

      return Math.max(0, Math.min(95, value - resonanceNotchDb - bridgeLossTiltDb));
    })
  };

  return anchorCurveToMetric(shapedCurve, targetRw).curve;
}

function buildGateSBasis(input: {
  baseBasis: AirborneResultBasis;
  benchmark: GateRDoubleLeafFramedBridgeBenchmarkRange;
  curve: TransmissionLossCurve;
  physicalInputs: GateRDoubleLeafFramedBridgePhysicalInputs;
}): AirborneResultBasis {
  return AirborneResultBasisSchema.parse({
    ...input.baseBasis,
    assumptions: [
      "Gate S promotes the explicit double-leaf/framed bridge solver into Dynamic Calculator runtime for complete inputs only.",
      "Side A and side B leaf masses, cavity depth, bridge class, support topology, support spacing, and porous damping are explicit physical inputs.",
      "Exact full-stack or calibrated source rows can still override this source-absent prediction through the Gate H source-promotion policy.",
      "Rw and STC remain separate rating-adapter outputs over the calculated curve; STC is not an alias of Rw."
    ],
    errorBudgetDb: input.benchmark.toleranceDb,
    frequencyBands: {
      bandSet: "gate_s_double_leaf_framed_bridge_runtime_curve",
      frequenciesHz: [...input.curve.frequenciesHz]
    },
    method: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    propertyDefaults: input.baseBasis.propertyDefaults,
    requiredInputs: [
      "sideALeafGroup",
      "sideBLeafGroup",
      "sideALeafMassKgM2",
      "sideBLeafMassKgM2",
      "cavity1DepthMm",
      "frameBridgeClass",
      "supportTopology",
      "supportSpacingMm",
      "massAirMassResonanceHz",
      "bridgeCouplingDeltaDb",
      "porousCavityDampingCreditDb",
      "ISO717-1 Rw adapter",
      "ASTM E413 STC adapter boundary"
    ]
  });
}

type GateSAirborneCandidateSeed = Omit<AirborneCandidate, "rejectionReasons" | "selected"> & {
  blockedReasons?: readonly AirborneCandidateRejectionReason[];
};

const GATE_S_WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

function measuredExactBasis(family: DynamicAirborneFamily): AirborneResultBasis {
  return {
    assumptions: ["Exact full-stack promotion waits for a topology/material/metric/tolerance-owned source row."],
    curveBasis: "no_curve",
    family,
    kind: "airborne_measured_exact",
    measurementStandard: "source_report",
    method: "verified_airborne_catalog_exact_match",
    missingPhysicalInputs: [],
    missingSourceEvidence: ["rights_safe_exact_full_stack_source_absent"],
    origin: "measured_exact_full_stack",
    propertyDefaults: [],
    ratingStandard: "source_report",
    requiredInputs: ["exactFullStackSource", "metricBasisOwner", "topologyOwner"],
    toleranceClass: "exact_source"
  };
}

function calibratedBasis(family: DynamicAirborneFamily): AirborneResultBasis {
  return {
    assumptions: ["Calibration promotion waits for rights-safe paired rows and holdout residual ownership."],
    calculationStandard: "ISO 12354-1",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 3,
    family,
    kind: "airborne_calibrated_prediction",
    measurementStandard: "source_report",
    method: "calibrated_double_leaf_framed_bridge_solver",
    missingPhysicalInputs: [],
    missingSourceEvidence: ["calibration_holdout_curve_absent"],
    origin: "calibrated_family_physics",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs: ["calibrationSetId", "holdoutSetId", "bridgeTopology"],
    toleranceClass: "calibrated_prediction"
  };
}

function screeningBasis(family: DynamicAirborneFamily): AirborneResultBasis {
  return {
    assumptions: ["Screening remains available as a lower-precedence diagnostic lane."],
    calculationStandard: "engine_screening",
    curveBasis: "screening_mass_law_curve",
    errorBudgetDb: 10,
    family,
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

function buildGateSCandidateResolution(input: {
  basis: AirborneResultBasis;
  family: DynamicAirborneFamily;
  targetOutputs: readonly RequestedOutputId[];
}): AirborneCandidateResolution {
  const outputIds: RequestedOutputId[] =
    input.targetOutputs.length > 0 ? [...input.targetOutputs] : [...GATE_S_WALL_OUTPUTS];
  const metricIds: string[] = [...outputIds];
  const seeds: GateSAirborneCandidateSeed[] = [
    {
      basis: measuredExactBasis(input.family),
      blockedReasons: [
        {
          code: "missing_source_evidence",
          detail:
            "Exact full-stack promotion is blocked until a rights-safe row matches the double-leaf/framed topology, materials, metric basis, and tolerance owner."
        }
      ],
      id: "candidate_blocked_double_leaf_framed_exact_source",
      metricIds: [...metricIds],
      origin: "measured_exact_full_stack",
      outputIds: [...outputIds]
    },
    {
      basis: calibratedBasis(input.family),
      blockedReasons: [
        {
          code: "missing_source_evidence",
          detail:
            "Calibrated double-leaf/framed promotion waits for rights-safe calibration rows and holdout residual metadata."
        }
      ],
      id: "candidate_calibrated_double_leaf_framed_bridge_family",
      metricIds: [...metricIds],
      origin: "calibrated_family_physics",
      outputIds: [...outputIds]
    },
    {
      basis: input.basis,
      id: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
      metricIds: [...metricIds],
      origin: "family_physics_prediction",
      outputIds: [...outputIds]
    },
    {
      basis: screeningBasis(input.family),
      id: "candidate_double_leaf_framed_screening_fallback",
      metricIds: [...metricIds],
      origin: "screening_fallback",
      outputIds: [...outputIds]
    }
  ];

  const candidates: AirborneCandidate[] = seeds.map((seed) => {
    const selected = seed.id === GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID;
    const rejectionReasons: AirborneCandidateRejectionReason[] = selected
      ? []
      : [
          ...(seed.blockedReasons ?? [
            {
              code: "lower_precedence_than_selected",
              detail: `Candidate loses to ${GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID} under model-first airborne precedence.`
            }
          ])
        ];

    return {
      basis: seed.basis,
      id: seed.id,
      metricIds: [...seed.metricIds],
      origin: seed.origin,
      outputIds: [...seed.outputIds],
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
    id: "resolver_double_leaf_framed_bridge_gate_s_runtime",
    inputCompletenessIds: ["gate_q_double_leaf_framed_bridge_route_inputs"],
    policyId: "model_first_airborne_candidate_precedence_v1",
    ratingAdapterBasisIds: [
      "iso_717_1_rw_from_airborne_transmission_loss_curve",
      "astm_e413_stc_from_airborne_transmission_loss_curve"
    ],
    rejectedCandidateIds: candidates.filter((candidate) => !candidate.selected).map((candidate) => candidate.id),
    runtimeValueMovement: true,
    selectedBasis: input.basis,
    selectedCandidateId: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction"
  });
}

function familyLabel(family: DynamicAirborneFamily): string {
  return family === "double_stud_system" ? "Double Frame / Double Stud" : "Stud Wall Surrogate";
}

export function maybeCalculateGateSDoubleLeafFramedBridgeRuntime(input: {
  family: { family: DynamicAirborneFamily; notes: string[] };
  layers: readonly ResolvedLayer[];
  options: DynamicAirborneOptions;
  topology: AirborneTopologySummary;
}): DynamicAirborneResult | null {
  const contract = buildGateRDoubleLeafFramedBridgeSolverContract({
    airborneContext: input.options.airborneContext ?? undefined,
    layers: input.layers,
    targetOutputs: ["Rw", "STC", "C", "Ctr"]
  });

  if (
    contract.readinessStatus !== "solver_candidate_ready" ||
    !contract.benchmarkRange ||
    !contract.candidateBasis ||
    !contract.candidateFamily
  ) {
    return null;
  }

  const curve = buildGateSCurve({
    benchmark: contract.benchmarkRange,
    frequenciesHz: input.options.frequenciesHz,
    physicalInputs: contract.physicalInputs
  });
  const ratings = buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb);
  const basis = buildGateSBasis({
    baseBasis: contract.candidateBasis,
    benchmark: contract.benchmarkRange,
    curve,
    physicalInputs: contract.physicalInputs
  });
  const candidateResolution = buildGateSCandidateResolution({
    basis,
    family: contract.candidateFamily,
    targetOutputs: ["Rw", "STC", "C", "Ctr"]
  });
  const solverRw = ratings.iso717.Rw;
  const screeningRw = input.options.screeningEstimatedRwDb;
  const trace: DynamicAirborneTrace = {
    adjustmentDb: ksRound1(solverRw - screeningRw),
    candidateMethods: [
      {
        label: getDelegateLabel("screening_mass_law_curve_seed_v3"),
        method: "screening_mass_law_curve_seed_v3",
        rwDb: screeningRw,
        selected: false
      },
      {
        label: "Double-Leaf Bridge Solver",
        method: "mass_law",
        rwDb: solverRw,
        selected: true
      }
    ],
    cavityCount: input.topology.cavityCount,
    confidenceClass: "medium",
    confidenceScore: 0.64,
    detectedFamily: contract.candidateFamily,
    detectedFamilyLabel: familyLabel(contract.candidateFamily),
    familyDecisionClass: "clear",
    hasPorousFill: input.topology.hasPorousFill,
    hasStudLikeSupport: input.topology.hasStudLikeSupport,
    notes: [
      ...input.family.notes,
      "Gate S selected the explicit double-leaf/framed bridge family physics runtime lane.",
      `Leaf masses are ${contract.physicalInputs.sideALeafMassKgM2?.toFixed(1)} and ${contract.physicalInputs.sideBLeafMassKgM2?.toFixed(1)} kg/m2.`,
      `Mass-air-mass resonance is ${contract.benchmarkRange.massAirMassResonanceHz.toFixed(1)} Hz.`,
      `Bridge coupling delta is ${contract.benchmarkRange.bridgeCouplingDeltaDb.toFixed(1)} dB and porous damping credit is ${contract.benchmarkRange.dampingCreditDb.toFixed(1)} dB.`,
      "Source absence is retained as an exact/calibration blocker, not as a blocker for this formula-backed prediction."
    ],
    originalSolidLayerCount: input.topology.originalSolidLayerCount,
    porousLayerCount: input.topology.porousLayerCount,
    selectedLabel: "Double-Leaf Bridge Solver",
    selectedFamilyScore: 0.64,
    selectedMethod: "mass_law",
    solverSpreadRwDb: ksRound1(Math.abs(solverRw - screeningRw)),
    strategy: "double_leaf_framed_bridge_mass_air_mass_runtime",
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
    curve,
    id: "dynamic",
    label: "Dynamic Topology",
    ratings,
    rw: solverRw,
    trace,
    warnings: [
      GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_WARNING,
      `Double-leaf/framed runtime is uncalibrated with a ${contract.benchmarkRange.toleranceDb} dB error budget.`
    ]
  };
}
