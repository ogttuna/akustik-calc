import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE,
  AirborneCandidateResolutionSchema,
  AssemblyCalculationSchema,
  type AirborneCandidate,
  type AirborneCandidateRejectionReason,
  type AirborneCandidateResolution,
  type AirborneContext,
  type AirborneResultBasis,
  type LayerInput,
  type RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_E = {
  apiShapeChange: true,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_e_define_airborne_candidate_resolver_selected_rejected_candidates_without_value_movement",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction:
    "gate_g_promote_grouped_rockwool_triple_leaf_family_physics_prediction_with_benchmarks",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-g-grouped-rockwool-prediction-contract.test.ts",
  selectionStatus:
    "gate_e_airborne_candidate_resolver_landed_no_runtime_selected_grouped_rockwool_prediction_gate_g",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_E_SURFACES = [
  "packages/shared/src/domain/airborne-basis.ts",
  "packages/shared/src/domain/assembly.ts",
  "packages/shared/src/index.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-e-airborne-candidate-resolver-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_E_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_E_HANDOFF.md"
] as const;

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const GROUPED_SPLIT_ROCKWOOL_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
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

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const ADJACENT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const GROUPED_SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

type AirborneCandidateSeed = Omit<AirborneCandidate, "rejectionReasons" | "selected"> & {
  blockedReasons?: readonly AirborneCandidateRejectionReason[];
};

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function originRank(origin: AirborneCandidate["origin"]): number {
  return AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE.indexOf(origin);
}

function resolveAirborneCandidates(
  seeds: readonly AirborneCandidateSeed[],
  id = "resolver_grouped_rockwool_gate_e_contract"
): AirborneCandidateResolution {
  const eligible = seeds.filter((seed) => (seed.blockedReasons ?? []).length === 0);
  const selectedSeed = [...eligible].sort((left, right) => {
    const precedenceDelta = originRank(left.origin) - originRank(right.origin);
    return precedenceDelta === 0 ? left.id.localeCompare(right.id) : precedenceDelta;
  })[0];

  if (!selectedSeed) {
    throw new Error("Gate E contract resolver needs at least one eligible stop or numeric candidate");
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
              code:
                seed.origin === selectedSeed.origin
                  ? "stable_candidate_id_tie_breaker_lost"
                  : "lower_precedence_than_selected",
              detail:
                seed.origin === selectedSeed.origin
                  ? "Candidate has the same origin as the winner but loses the deterministic id tie-breaker."
                  : `Candidate loses to ${selectedSeed.id} under model-first airborne precedence.`
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
    id,
    inputCompletenessIds: ["triple_leaf_multicavity_airborne_minimum_inputs"],
    policyId: "model_first_airborne_candidate_precedence_v1",
    ratingAdapterBasisIds: [
      "iso_717_1_rw_from_airborne_transmission_loss_curve",
      "astm_e413_stc_from_airborne_transmission_loss_curve"
    ],
    rejectedCandidateIds: candidates.filter((candidate) => !candidate.selected).map((candidate) => candidate.id),
    runtimeValueMovement: false,
    selectedBasis: selectedSeed.basis,
    selectedCandidateId: selectedSeed.id,
    selectedOrigin: selectedSeed.origin
  });
}

function exactFullStackSeed(id = "candidate_exact_full_stack_usg_w123"): AirborneCandidateSeed {
  return {
    basis: {
      assumptions: [],
      curveBasis: "measured_frequency_curve",
      exactSourceId: "source_usg_w123_exact",
      family: "double_leaf",
      frequencyBands: {
        bandSet: "third_octave_100_3150_hz",
        frequenciesHz: [100, 125, 160, 200, 250, 315, 400, 500]
      },
      kind: "airborne_measured_exact",
      measurementStandard: "ASTM E90",
      method: "verified_airborne_catalog_exact_match",
      missingPhysicalInputs: [],
      missingSourceEvidence: [],
      origin: "measured_exact_full_stack",
      propertyDefaults: [],
      ratingStandard: "ASTM E413",
      requiredInputs: ["layers", "metricBasis", "exactTopologyMatch"],
      toleranceClass: "exact_source"
    },
    id,
    metricIds: ["Rw", "STC"],
    origin: "measured_exact_full_stack",
    outputIds: ["Rw", "STC"]
  };
}

function partialAnchorSeed(): AirborneCandidateSeed {
  return {
    basis: {
      anchorSourceId: "source_british_gypsum_double_leaf_anchor",
      assumptions: ["subassembly anchor is exact", "remaining finish delta uses named cavity method"],
      calculationStandard: "engine_double_leaf_cavity",
      curveBasis: "calculated_frequency_curve",
      errorBudgetDb: 3,
      family: "double_leaf",
      kind: "airborne_anchored_delta",
      measurementStandard: "source_report",
      method: "exact_subassembly_plus_named_finish_delta",
      missingPhysicalInputs: [],
      missingSourceEvidence: [],
      origin: "measured_exact_subassembly_plus_calculated_delta",
      propertyDefaults: [],
      ratingStandard: "ISO 717-1",
      requiredInputs: ["anchorSourceId", "remainingDeltaMethod", "deltaLayerSet"],
      toleranceClass: "calibrated_prediction"
    },
    id: "candidate_partial_anchor_plus_delta",
    metricIds: ["Rw", "STC"],
    origin: "measured_exact_subassembly_plus_calculated_delta",
    outputIds: ["Rw", "STC"]
  };
}

function calibratedFamilySeed(
  blockedReasons: readonly AirborneCandidateRejectionReason[] = []
): AirborneCandidateSeed {
  return {
    basis: {
      assumptions: ["family calibration rows are topology-compatible"],
      calculationStandard: "ISO 12354-1",
      curveBasis: "calculated_frequency_curve",
      errorBudgetDb: 3,
      family: "multileaf_multicavity",
      kind: "airborne_calibrated_prediction",
      measurementStandard: "source_report",
      method: "calibrated_triple_leaf_family_solver",
      missingPhysicalInputs: [],
      missingSourceEvidence:
        blockedReasons.length > 0 ? ["rights_safe_calibration_holdout_curve_absent"] : [],
      origin: "calibrated_family_physics",
      propertyDefaults: [],
      ratingStandard: "ISO 717-1",
      requiredInputs: ["calibrationSetId", "holdoutSetId", "groupedTopology"],
      toleranceClass: "calibrated_prediction"
    },
    blockedReasons,
    id: "candidate_calibrated_triple_leaf_family",
    metricIds: ["Rw", "STC", "C", "Ctr"],
    origin: "calibrated_family_physics",
    outputIds: ["Rw", "STC", "C", "Ctr"]
  };
}

function groupedRockwoolPhysicsSeed(): AirborneCandidateSeed {
  return {
    basis: {
      assumptions: [
        "grouped triple-leaf topology is explicit",
        "Rockwool cavity flow resistivity uses a visible family default until material-property widening"
      ],
      calculationStandard: "engine_triple_leaf_two_cavity_frequency_solver",
      curveBasis: "calculated_frequency_curve",
      errorBudgetDb: 5,
      family: "multileaf_multicavity",
      frequencyBands: {
        bandSet: "third_octave_100_3150_hz",
        frequenciesHz: [100, 125, 160, 200, 250, 315, 400, 500]
      },
      kind: "airborne_physics_prediction",
      method: "triple_leaf_two_cavity_frequency_solver",
      missingPhysicalInputs: [],
      missingSourceEvidence: [],
      origin: "family_physics_prediction",
      propertyDefaults: [
        {
          field: "rockwool.flowResistivity",
          reason: "No calibrated project material property exists yet; prediction carries uncalibrated error budget.",
          source: "engine_family_default_until_material_property_widening",
          unit: "Pa.s/m2",
          value: "family_default"
        }
      ],
      ratingStandard: "ISO 717-1",
      requiredInputs: [
        "wallTopology.topologyMode",
        "wallTopology.sideALeafLayerIndices",
        "wallTopology.cavity1DepthMm",
        "wallTopology.internalLeafLayerIndices",
        "wallTopology.cavity2DepthMm",
        "wallTopology.sideBLeafLayerIndices",
        "wallTopology.supportTopology"
      ],
      toleranceClass: "uncalibrated_prediction"
    },
    id: "candidate_grouped_rockwool_family_physics_prediction",
    metricIds: ["Rw", "STC", "C", "Ctr"],
    origin: "family_physics_prediction",
    outputIds: ["Rw", "STC", "C", "Ctr"]
  };
}

function boundedPredictionSeed(): AirborneCandidateSeed {
  return {
    basis: {
      assumptions: ["route is recognized but solver confidence is below family prediction threshold"],
      calculationStandard: "engine_bounded_estimate",
      curveBasis: "calculated_single_number_estimate",
      errorBudgetDb: 8,
      family: "multileaf_multicavity",
      kind: "airborne_bound",
      method: "airborne_bounded_estimate",
      missingPhysicalInputs: [],
      missingSourceEvidence: [],
      origin: "bounded_prediction",
      propertyDefaults: [],
      ratingStandard: "engine_native_bounded_estimate",
      requiredInputs: ["surfaceMassKgM2", "cavityCount"],
      toleranceClass: "bounded_prediction"
    },
    id: "candidate_multileaf_bounded_estimate",
    metricIds: ["Rw"],
    origin: "bounded_prediction",
    outputIds: ["Rw"]
  };
}

function screeningFallbackSeed(): AirborneCandidateSeed {
  return {
    basis: {
      assumptions: ["ambiguous topology is screened conservatively"],
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
    },
    id: "candidate_multileaf_screening_fallback",
    metricIds: ["Rw"],
    origin: "screening_fallback",
    outputIds: ["Rw"]
  };
}

function sourceBlockedExactSeed(): AirborneCandidateSeed {
  return {
    ...exactFullStackSeed("candidate_blocked_rockwool_exact_source"),
    basis: {
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
      requiredInputs: ["sourceOwnedCurvePayload", "metricContextOwner", "toleranceOwner"]
    },
    blockedReasons: [
      {
        code: "missing_source_evidence",
        detail: "Exact promotion is blocked until a rights-safe source-owned curve exists."
      }
    ],
    origin: "measured_exact_full_stack"
  };
}

function physicalInputBlockedPhysicsSeed(): AirborneCandidateSeed {
  const basis: AirborneResultBasis = {
    ...groupedRockwoolPhysicsSeed().basis,
    curveBasis: "no_curve",
    missingPhysicalInputs: [
      "wallTopology.cavity1DepthMm",
      "wallTopology.internalLeafLayerIndices",
      "wallTopology.cavity2DepthMm"
    ],
    requiredInputs: [
      "wallTopology.cavity1DepthMm",
      "wallTopology.internalLeafLayerIndices",
      "wallTopology.cavity2DepthMm"
    ]
  };

  return {
    basis,
    blockedReasons: [
      {
        code: "missing_physical_input",
        detail: "Grouped triple-leaf prediction cannot run until both cavities and the internal leaf are explicit."
      }
    ],
    id: "candidate_grouped_rockwool_physics_missing_topology",
    metricIds: ["Rw", "STC"],
    origin: "family_physics_prediction",
    outputIds: ["Rw", "STC"]
  };
}

function needsInputSeed(): AirborneCandidateSeed {
  return {
    basis: {
      assumptions: [],
      curveBasis: "no_curve",
      family: "multileaf_multicavity",
      kind: "airborne_needs_input",
      method: "triple_leaf_input_completeness_matrix",
      missingPhysicalInputs: [
        "wallTopology.cavity1DepthMm",
        "wallTopology.internalLeafLayerIndices",
        "wallTopology.cavity2DepthMm"
      ],
      missingSourceEvidence: [],
      origin: "needs_input",
      propertyDefaults: [],
      requiredInputs: [
        "wallTopology.cavity1DepthMm",
        "wallTopology.internalLeafLayerIndices",
        "wallTopology.cavity2DepthMm"
      ]
    },
    id: "candidate_triple_leaf_needs_input",
    metricIds: ["Rw", "STC"],
    origin: "needs_input",
    outputIds: ["Rw", "STC"]
  };
}

describe("calculator model-first physics prediction pivot Gate E", () => {
  it("lands airborne candidate resolver no-runtime and selects grouped Rockwool prediction Gate G", () => {
    expect(MODEL_FIRST_GATE_E).toEqual({
      apiShapeChange: true,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_e_define_airborne_candidate_resolver_selected_rejected_candidates_without_value_movement",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        "gate_g_promote_grouped_rockwool_triple_leaf_family_physics_prediction_with_benchmarks",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-g-grouped-rockwool-prediction-contract.test.ts",
      selectionStatus:
        "gate_e_airborne_candidate_resolver_landed_no_runtime_selected_grouped_rockwool_prediction_gate_g",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_E_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("defines model-first precedence and selected/rejected candidate trace", () => {
    const resolution = resolveAirborneCandidates([
      screeningFallbackSeed(),
      groupedRockwoolPhysicsSeed(),
      exactFullStackSeed(),
      boundedPredictionSeed(),
      calibratedFamilySeed(),
      partialAnchorSeed()
    ]);

    expect(resolution.runtimeValueMovement).toBe(false);
    expect(resolution.candidatePrecedence).toEqual([
      "measured_exact_full_stack",
      "measured_exact_subassembly_plus_calculated_delta",
      "calibrated_family_physics",
      "family_physics_prediction",
      "bounded_prediction",
      "screening_fallback",
      "needs_input",
      "unsupported"
    ]);
    expect(resolution.selectedCandidateId).toBe("candidate_exact_full_stack_usg_w123");
    expect(resolution.selectedOrigin).toBe("measured_exact_full_stack");
    expect(resolution.rejectedCandidateIds).toEqual([
      "candidate_multileaf_screening_fallback",
      "candidate_grouped_rockwool_family_physics_prediction",
      "candidate_multileaf_bounded_estimate",
      "candidate_calibrated_triple_leaf_family",
      "candidate_partial_anchor_plus_delta"
    ]);
    expect(
      resolution.candidates
        .filter((candidate) => !candidate.selected)
        .flatMap((candidate) => candidate.rejectionReasons.map((reason) => reason.code))
    ).toContain("lower_precedence_than_selected");
  });

  it("lets source absence reject exact/calibrated promotion while formula-backed prediction still wins", () => {
    const resolution = resolveAirborneCandidates([
      sourceBlockedExactSeed(),
      calibratedFamilySeed([
        {
          code: "missing_source_evidence",
          detail: "Calibration promotion waits for a rights-safe holdout curve."
        }
      ]),
      groupedRockwoolPhysicsSeed(),
      boundedPredictionSeed(),
      screeningFallbackSeed()
    ]);

    expect(resolution.selectedCandidateId).toBe("candidate_grouped_rockwool_family_physics_prediction");
    expect(resolution.selectedOrigin).toBe("family_physics_prediction");
    expect(resolution.selectedBasis).toMatchObject({
      calculationStandard: "engine_triple_leaf_two_cavity_frequency_solver",
      errorBudgetDb: 5,
      origin: "family_physics_prediction",
      toleranceClass: "uncalibrated_prediction"
    });

    const blockedExact = resolution.candidates.find(
      (candidate) => candidate.id === "candidate_blocked_rockwool_exact_source"
    );
    const blockedCalibration = resolution.candidates.find(
      (candidate) => candidate.id === "candidate_calibrated_triple_leaf_family"
    );

    expect(blockedExact?.basis.missingSourceEvidence).toEqual([
      "rights_safe_source_owned_curve_payload_absent"
    ]);
    expect(blockedExact?.basis.missingPhysicalInputs).toEqual([]);
    expect(blockedExact?.rejectionReasons).toEqual([
      {
        code: "missing_source_evidence",
        detail: "Exact promotion is blocked until a rights-safe source-owned curve exists."
      }
    ]);
    expect(blockedCalibration?.basis.missingSourceEvidence).toEqual([
      "rights_safe_calibration_holdout_curve_absent"
    ]);
    expect(blockedCalibration?.basis.missingPhysicalInputs).toEqual([]);
  });

  it("selects needs_input when physical topology is absent and rejects fake numeric movement", () => {
    const resolution = resolveAirborneCandidates([
      physicalInputBlockedPhysicsSeed(),
      needsInputSeed()
    ]);

    expect(resolution.selectedCandidateId).toBe("candidate_triple_leaf_needs_input");
    expect(resolution.selectedOrigin).toBe("needs_input");
    expect(resolution.selectedBasis?.missingPhysicalInputs).toEqual([
      "wallTopology.cavity1DepthMm",
      "wallTopology.internalLeafLayerIndices",
      "wallTopology.cavity2DepthMm"
    ]);
    expect(resolution.candidates[0]?.rejectionReasons).toEqual([
      {
        code: "missing_physical_input",
        detail: "Grouped triple-leaf prediction cannot run until both cavities and the internal leaf are explicit."
      }
    ]);

    expect(() =>
      AirborneCandidateResolutionSchema.parse({
        ...resolution,
        candidates: resolution.candidates.map((candidate) =>
          candidate.id === "candidate_grouped_rockwool_physics_missing_topology"
            ? {
                ...candidate,
                rejectionReasons: [
                  {
                    code: "missing_source_evidence",
                    detail: "This is not a physical-input blocker and must not justify needs_input selection."
                  }
                ]
              }
            : candidate
        )
      })
    ).toThrow(/physically blocked/);
  });

  it("is deterministic under duplicate rows and safe candidate reorders", () => {
    const duplicateA = exactFullStackSeed("candidate_exact_duplicate_a");
    const duplicateB = exactFullStackSeed("candidate_exact_duplicate_b");

    const forward = resolveAirborneCandidates([
      duplicateB,
      groupedRockwoolPhysicsSeed(),
      duplicateA,
      screeningFallbackSeed()
    ]);
    const reversed = resolveAirborneCandidates([
      screeningFallbackSeed(),
      duplicateA,
      groupedRockwoolPhysicsSeed(),
      duplicateB
    ]);

    expect(forward.selectedCandidateId).toBe("candidate_exact_duplicate_a");
    expect(reversed.selectedCandidateId).toBe("candidate_exact_duplicate_a");
    expect(
      forward.candidates.find((candidate) => candidate.id === "candidate_exact_duplicate_b")?.rejectionReasons
    ).toEqual([
      {
        code: "stable_candidate_id_tie_breaker_lost",
        detail: "Candidate has the same origin as the winner but loses the deterministic id tie-breaker."
      }
    ]);
  });

  it("parses optional resolver metadata on assembly results without populating runtime yet", () => {
    const legacyResult = calculateAssembly(ADJACENT_ROCKWOOL_STACK, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const resolution = resolveAirborneCandidates([
      sourceBlockedExactSeed(),
      groupedRockwoolPhysicsSeed(),
      boundedPredictionSeed(),
      screeningFallbackSeed()
    ]);
    const parsed = AssemblyCalculationSchema.parse({
      ...legacyResult,
      airborneBasis: resolution.selectedBasis,
      airborneCandidateResolution: resolution,
      airborneCandidateSet: resolution.candidates
    });

    expect(parsed.airborneCandidateResolution).toMatchObject({
      policyId: "model_first_airborne_candidate_precedence_v1",
      runtimeValueMovement: false,
      selectedCandidateId: "candidate_grouped_rockwool_family_physics_prediction"
    });
    expect(parsed.airborneCandidateSet).toHaveLength(4);
    expect(legacyResult).not.toHaveProperty("airborneCandidateResolution");
  });

  it("keeps resolver metadata populated after Gate G grouped Rockwool prediction movement", () => {
    const adjacent = calculateAssembly(ADJACENT_ROCKWOOL_STACK, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const grouped = calculateAssembly(GROUPED_SPLIT_ROCKWOOL_STACK, {
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(adjacent.metrics.estimatedRwDb).toBe(51);
    expect(adjacent.metrics.estimatedStc).toBe(51);
    expect(adjacent.dynamicAirborneTrace?.detectedFamily).toBe("double_leaf");
    expect(adjacent.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);

    expect(grouped.metrics.estimatedRwDb).toBe(50);
    expect(grouped.metrics.estimatedStc).toBe(55);
    expect(grouped.dynamicAirborneTrace?.detectedFamily).toBe("multileaf_multicavity");
    expect(grouped.dynamicAirborneTrace?.strategy).toBe(
      "triple_leaf_two_cavity_frequency_solver_family_physics_prediction"
    );
    expect(grouped.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: "candidate_grouped_rockwool_family_physics_prediction",
      selectedOrigin: "family_physics_prediction"
    });
    expect(grouped.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
  });

  it("keeps docs and current-gate runner aligned with Gate E closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        "gate_e_airborne_candidate_resolver_landed_no_runtime_selected_grouped_rockwool_prediction_gate_g"
      );
      expect(text, path).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-g-grouped-rockwool-prediction-contract.test.ts"
      );
      expect(text, path).toContain(
        "gate_g_promote_grouped_rockwool_triple_leaf_family_physics_prediction_with_benchmarks"
      );
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-e-airborne-candidate-resolver-contract.test.ts"
    );
  });
});
