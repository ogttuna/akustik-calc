import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE,
  AirborneCandidateResolutionSchema,
  type AirborneCandidate,
  type AirborneCandidateRejectionReason,
  type AirborneCandidateResolution,
  type AirborneContext,
  type AirborneResultBasis,
  type LayerInput,
  type RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  evaluateAirborneSourcePromotionReadiness,
  type AirborneSourcePromotionDecision,
  type AirborneSourcePromotionInput
} from "./airborne-source-promotion";
import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_H = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: true,
  landedGate: "gate_h_calibrate_sources_and_exact_promotion_without_deleting_physics_solver",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_i_expand_family_material_properties_and_benchmark_scenarios",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-i-family-material-expansion-contract.test.ts",
  selectionStatus:
    "gate_h_source_calibration_exact_promotion_policy_landed_no_runtime_selected_family_material_expansion_gate_i",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_H_SURFACES = [
  "packages/engine/src/airborne-source-promotion.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-h-source-calibration-exact-promotion-contract.test.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-g-grouped-rockwool-prediction-contract.test.ts",
  "packages/engine/src/dynamic-airborne-gate-g-rockwool.ts",
  "packages/shared/src/domain/airborne-basis.ts",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_H_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_H_HANDOFF.md"
] as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

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

const EXACT_TOPOLOGY_FINGERPRINT = "rockwool_grouped_triple_leaf_two_50mm_cavities_v1";
const EXACT_MATERIAL_FINGERPRINT = "gypsum_mlv_rockwool_gypsum_rockwool_gypsum_plasterboard_v1";

type AirborneCandidateSeed = Omit<AirborneCandidate, "rejectionReasons" | "selected"> & {
  blockedReasons?: readonly AirborneCandidateRejectionReason[];
};

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function originRank(origin: AirborneCandidate["origin"]): number {
  return AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE.indexOf(origin);
}

function resolveSourcePromotionCandidates(
  seeds: readonly AirborneCandidateSeed[],
  id = "resolver_gate_h_source_promotion_contract"
): AirborneCandidateResolution {
  const eligible = seeds.filter((seed) => (seed.blockedReasons ?? []).length === 0);
  const selectedSeed = [...eligible].sort((left, right) => {
    const precedenceDelta = originRank(left.origin) - originRank(right.origin);
    return precedenceDelta === 0 ? left.id.localeCompare(right.id) : precedenceDelta;
  })[0];

  if (!selectedSeed) {
    throw new Error("Gate H source promotion resolver requires at least one eligible candidate.");
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
                  ? "Candidate has the same origin as the selected source candidate but loses the stable id tie-breaker."
                  : `Candidate loses to ${selectedSeed.id} under model-first airborne source promotion precedence.`
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

function exactPromotionInput(
  overrides: Partial<AirborneSourcePromotionInput> = {}
): AirborneSourcePromotionInput {
  const base: AirborneSourcePromotionInput = {
    candidateId: "candidate_rockwool_grouped_exact_full_stack",
    mode: "exact_full_stack",
    requested: {
      family: "multileaf_multicavity",
      materialFingerprint: EXACT_MATERIAL_FINGERPRINT,
      metricIds: ["Rw", "STC"],
      metricScope: "element_lab",
      topologyFingerprint: EXACT_TOPOLOGY_FINGERPRINT
    },
    source: {
      family: "multileaf_multicavity",
      materialFingerprint: EXACT_MATERIAL_FINGERPRINT,
      materialOwner: true,
      metricContextOwner: true,
      metricIds: ["Rw", "STC", "C", "Ctr"],
      metricScope: "element_lab",
      negativeBoundaryTestIds: ["gate_h_exact_negative_metric_scope", "gate_h_exact_negative_topology_scope"],
      positiveTestIds: ["gate_h_exact_positive_same_stack"],
      rightsSafeSourceOwnedCurvePayload: true,
      sourceId: "source_rockwool_grouped_triple_leaf_lab_curve_2026",
      toleranceOwner: true,
      topologyFingerprint: EXACT_TOPOLOGY_FINGERPRINT,
      topologyOwner: true
    }
  };

  return {
    ...base,
    ...overrides,
    requested: {
      ...base.requested,
      ...overrides.requested
    },
    source: {
      ...base.source,
      ...overrides.source
    }
  };
}

function calibratedPromotionInput(
  overrides: Partial<AirborneSourcePromotionInput> = {}
): AirborneSourcePromotionInput {
  return exactPromotionInput({
    calibration: {
      calibrationSetId: "calibration_set_rockwool_grouped_triple_leaf_v1",
      failureCaseIds: ["holdout_failure_overcoupled_internal_leaf"],
      holdoutSetId: "holdout_set_rockwool_grouped_triple_leaf_v1",
      holdoutTestIds: ["holdout_grouped_rockwool_50_50_lab_curve"],
      holdoutToleranceDb: 3,
      rightsSafeCalibrationCurves: true
    },
    candidateId: "candidate_rockwool_grouped_calibrated_family",
    mode: "calibrated_family",
    requested: {
      family: "multileaf_multicavity",
      materialFingerprint: "nearby_gypsum_rockwool_grouped_triple_leaf_variant",
      metricIds: ["Rw", "STC"],
      metricScope: "element_lab",
      topologyFingerprint: "nearby_grouped_triple_leaf_two_cavity_variant"
    },
    ...overrides
  });
}

function anchoredPromotionInput(
  overrides: Partial<AirborneSourcePromotionInput> = {}
): AirborneSourcePromotionInput {
  return exactPromotionInput({
    anchor: {
      anchorSourceId: "source_rockwool_double_leaf_subassembly_anchor",
      deltaLayerSetId: "delta_internal_leaf_and_second_cavity",
      deltaMethod: "triple_leaf_two_cavity_delta_from_exact_double_leaf_anchor"
    },
    candidateId: "candidate_rockwool_subassembly_anchor_plus_delta",
    mode: "anchored_delta",
    requested: {
      family: "multileaf_multicavity",
      materialFingerprint: "anchored_delta_full_stack_variant",
      metricIds: ["Rw", "STC"],
      metricScope: "element_lab",
      topologyFingerprint: "anchored_delta_grouped_triple_leaf_variant"
    },
    ...overrides
  });
}

function exactBasis(decision: AirborneSourcePromotionDecision): AirborneResultBasis {
  return {
    assumptions: ["full-stack source fingerprint exactly matches the requested grouped topology"],
    curveBasis: "measured_frequency_curve",
    exactSourceId: decision.sourceId,
    family: "multileaf_multicavity",
    frequencyBands: {
      bandSet: "third_octave_100_3150_hz"
    },
    kind: "airborne_measured_exact",
    measurementStandard: "ISO 10140-2",
    method: "verified_airborne_catalog_exact_match",
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "measured_exact_full_stack",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs: ["exactTopologyFingerprint", "exactMaterialFingerprint", "metricContextOwner", "toleranceOwner"],
    toleranceClass: "exact_source"
  };
}

function calibratedBasis(): AirborneResultBasis {
  return {
    assumptions: [
      "family calibration rows are rights-safe and topology-compatible",
      "holdout tests and documented failure cases bound the calibrated tolerance"
    ],
    calculationStandard: "ISO 12354-1",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 3,
    family: "multileaf_multicavity",
    kind: "airborne_calibrated_prediction",
    measurementStandard: "ISO 10140-2",
    method: "calibrated_triple_leaf_family_solver",
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "calibrated_family_physics",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs: ["calibrationSetId", "holdoutSetId", "holdoutToleranceDb", "failureCaseIds"],
    toleranceClass: "calibrated_prediction"
  };
}

function anchoredBasis(decision: AirborneSourcePromotionDecision): AirborneResultBasis {
  return {
    anchorSourceId: decision.sourceId,
    assumptions: ["subassembly anchor is exact", "remaining leaves/cavities are calculated as a named delta"],
    calculationStandard: "engine_triple_leaf_two_cavity_frequency_solver",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 3,
    family: "multileaf_multicavity",
    kind: "airborne_anchored_delta",
    measurementStandard: "ISO 10140-2",
    method: "exact_subassembly_plus_triple_leaf_delta",
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "measured_exact_subassembly_plus_calculated_delta",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs: ["anchorSourceId", "deltaMethod", "deltaLayerSetId"],
    toleranceClass: "calibrated_prediction"
  };
}

function predictionBasis(): AirborneResultBasis {
  return {
    assumptions: ["formula-backed prediction remains available even when source candidates are eligible"],
    calculationStandard: "engine_triple_leaf_two_cavity_frequency_solver",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 5,
    family: "multileaf_multicavity",
    kind: "airborne_physics_prediction",
    method: "triple_leaf_two_cavity_frequency_solver",
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "family_physics_prediction",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs: ["groupedTopology"],
    toleranceClass: "uncalibrated_prediction"
  };
}

function seedFromDecision(
  decision: AirborneSourcePromotionDecision,
  basis: AirborneResultBasis
): AirborneCandidateSeed {
  return {
    basis,
    blockedReasons: decision.eligible ? [] : decision.rejectionReasons,
    id: decision.candidateId,
    metricIds: ["Rw", "STC"],
    origin: decision.origin,
    outputIds: ["Rw", "STC"]
  };
}

function physicsPredictionSeed(): AirborneCandidateSeed {
  return {
    basis: predictionBasis(),
    id: "candidate_grouped_rockwool_family_physics_prediction",
    metricIds: ["Rw", "STC"],
    origin: "family_physics_prediction",
    outputIds: ["Rw", "STC"]
  };
}

describe("calculator model-first physics prediction pivot Gate H", () => {
  it("lands source calibration/exact promotion policy and selects family/material expansion Gate I", () => {
    expect(MODEL_FIRST_GATE_H).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: true,
      landedGate: "gate_h_calibrate_sources_and_exact_promotion_without_deleting_physics_solver",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_i_expand_family_material_properties_and_benchmark_scenarios",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-i-family-material-expansion-contract.test.ts",
      selectionStatus:
        "gate_h_source_calibration_exact_promotion_policy_landed_no_runtime_selected_family_material_expansion_gate_i",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_H_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("allows measured exact promotion only for the topology/material/metric scope the source owns", () => {
    const ready = evaluateAirborneSourcePromotionReadiness(exactPromotionInput());
    const topologyMismatch = evaluateAirborneSourcePromotionReadiness(
      exactPromotionInput({
        requested: {
          family: "multileaf_multicavity",
          materialFingerprint: EXACT_MATERIAL_FINGERPRINT,
          metricIds: ["Rw", "STC"],
          metricScope: "element_lab",
          topologyFingerprint: "different_grouped_triple_leaf_topology"
        }
      })
    );
    const fieldMetricMismatch = evaluateAirborneSourcePromotionReadiness(
      exactPromotionInput({
        requested: {
          family: "multileaf_multicavity",
          materialFingerprint: EXACT_MATERIAL_FINGERPRINT,
          metricIds: ["R'w", "DnT,w"],
          metricScope: "building_prediction",
          topologyFingerprint: EXACT_TOPOLOGY_FINGERPRINT
        }
      })
    );

    expect(ready).toMatchObject({
      eligible: true,
      origin: "measured_exact_full_stack",
      rejectionReasons: []
    });
    expect(ready.evidenceIds).toEqual([
      "source_rockwool_grouped_triple_leaf_lab_curve_2026",
      "gate_h_exact_positive_same_stack",
      "gate_h_exact_negative_metric_scope",
      "gate_h_exact_negative_topology_scope"
    ]);

    expect(topologyMismatch.eligible).toBe(false);
    expect(topologyMismatch.rejectionReasons.map((reason) => reason.code)).toContain("topology_scope_mismatch");

    expect(fieldMetricMismatch.eligible).toBe(false);
    expect(fieldMetricMismatch.rejectionReasons.map((reason) => reason.code)).toEqual(
      expect.arrayContaining(["metric_scope_mismatch", "metric_ownership_missing"])
    );
  });

  it("calibrates a family only with explicit calibration metadata and holdout failure cases", () => {
    const ready = evaluateAirborneSourcePromotionReadiness(calibratedPromotionInput());
    const exactAttemptForNearbyVariant = evaluateAirborneSourcePromotionReadiness(
      exactPromotionInput({
        requested: {
          family: "multileaf_multicavity",
          materialFingerprint: "nearby_gypsum_rockwool_grouped_triple_leaf_variant",
          metricIds: ["Rw", "STC"],
          metricScope: "element_lab",
          topologyFingerprint: "nearby_grouped_triple_leaf_two_cavity_variant"
        }
      })
    );
    const missingHoldout = evaluateAirborneSourcePromotionReadiness(
      calibratedPromotionInput({
        calibration: {
          calibrationSetId: "calibration_set_rockwool_grouped_triple_leaf_v1",
          failureCaseIds: [],
          holdoutSetId: undefined,
          holdoutTestIds: [],
          holdoutToleranceDb: undefined,
          rightsSafeCalibrationCurves: true
        }
      })
    );

    expect(ready).toMatchObject({
      eligible: true,
      origin: "calibrated_family_physics",
      rejectionReasons: []
    });
    expect(ready.evidenceIds).toContain("calibration_set_rockwool_grouped_triple_leaf_v1");
    expect(ready.evidenceIds).toContain("holdout_set_rockwool_grouped_triple_leaf_v1");
    expect(exactAttemptForNearbyVariant.eligible).toBe(false);
    expect(exactAttemptForNearbyVariant.rejectionReasons.map((reason) => reason.code)).toEqual(
      expect.arrayContaining(["topology_scope_mismatch", "material_scope_mismatch"])
    );
    expect(missingHoldout.eligible).toBe(false);
    expect(missingHoldout.rejectionReasons.map((reason) => reason.code)).toEqual(
      expect.arrayContaining(["calibration_metadata_missing", "holdout_tolerance_missing", "holdout_tests_missing"])
    );
  });

  it("lets measured subassemblies anchor a calculated delta without becoming full-stack exact", () => {
    const ready = evaluateAirborneSourcePromotionReadiness(anchoredPromotionInput());
    const missingDelta = evaluateAirborneSourcePromotionReadiness(
      anchoredPromotionInput({
        anchor: {
          anchorSourceId: "source_rockwool_double_leaf_subassembly_anchor"
        }
      })
    );

    expect(ready).toMatchObject({
      eligible: true,
      origin: "measured_exact_subassembly_plus_calculated_delta",
      rejectionReasons: []
    });
    expect(ready.evidenceIds).toContain("source_rockwool_double_leaf_subassembly_anchor");

    expect(missingDelta.eligible).toBe(false);
    expect(missingDelta.rejectionReasons.map((reason) => reason.code)).toContain("delta_method_missing");
  });

  it("keeps exact, calibrated, anchored, and uncalibrated physics candidates coexisting under resolver precedence", () => {
    const exact = evaluateAirborneSourcePromotionReadiness(exactPromotionInput());
    const calibrated = evaluateAirborneSourcePromotionReadiness(calibratedPromotionInput());
    const anchored = evaluateAirborneSourcePromotionReadiness(anchoredPromotionInput());

    const exactWins = resolveSourcePromotionCandidates([
      seedFromDecision(exact, exactBasis(exact)),
      seedFromDecision(calibrated, calibratedBasis()),
      seedFromDecision(anchored, anchoredBasis(anchored)),
      physicsPredictionSeed()
    ]);

    expect(exactWins).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: "candidate_rockwool_grouped_exact_full_stack",
      selectedOrigin: "measured_exact_full_stack"
    });
    expect(exactWins.candidates.map((candidate) => candidate.id)).toContain(
      "candidate_grouped_rockwool_family_physics_prediction"
    );
    expect(exactWins.rejectedCandidateIds).toEqual([
      "candidate_rockwool_grouped_calibrated_family",
      "candidate_rockwool_subassembly_anchor_plus_delta",
      "candidate_grouped_rockwool_family_physics_prediction"
    ]);
    expect(
      exactWins.candidates
        .filter((candidate) => !candidate.selected)
        .map((candidate) => candidate.rejectionReasons[0]?.code)
    ).toEqual([
      "lower_precedence_than_selected",
      "lower_precedence_than_selected",
      "lower_precedence_than_selected"
    ]);

    const exactBlocked = evaluateAirborneSourcePromotionReadiness(
      exactPromotionInput({
        requested: {
          family: "multileaf_multicavity",
          materialFingerprint: "nearby_gypsum_rockwool_grouped_triple_leaf_variant",
          metricIds: ["Rw", "STC"],
          metricScope: "element_lab",
          topologyFingerprint: "nearby_grouped_triple_leaf_two_cavity_variant"
        }
      })
    );
    const calibratedWins = resolveSourcePromotionCandidates([
      seedFromDecision(exactBlocked, exactBasis(exactBlocked)),
      seedFromDecision(calibrated, calibratedBasis()),
      physicsPredictionSeed()
    ]);

    expect(calibratedWins).toMatchObject({
      selectedCandidateId: "candidate_rockwool_grouped_calibrated_family",
      selectedOrigin: "calibrated_family_physics"
    });
    expect(calibratedWins.candidates.find((candidate) => candidate.id === exactBlocked.candidateId)?.rejectionReasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "topology_scope_mismatch" }),
        expect.objectContaining({ code: "material_scope_mismatch" })
      ])
    );
    expect(calibratedWins.candidates.map((candidate) => candidate.origin)).toEqual([
      "measured_exact_full_stack",
      "calibrated_family_physics",
      "family_physics_prediction"
    ]);
  });

  it("does not move Gate G grouped Rockwool runtime values while source promotion policy lands", () => {
    const result = calculateAssembly(GROUPED_SPLIT_ROCKWOOL_STACK, {
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: 1.6,
      estimatedCtrDb: -7.2,
      estimatedRwDb: 53,
      estimatedStc: 64
    });
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: 8,
      origin: "family_physics_prediction",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: "candidate_broad_accuracy_wall_triple_leaf_local_substitution_lab_spectrum_adapter_family_physics_prediction",
      selectedOrigin: "family_physics_prediction"
    });
    expect(
      (result.airborneCandidateSet ?? [])
        .filter((candidate: AirborneCandidate) => !candidate.selected)
        .flatMap((candidate: AirborneCandidate) => candidate.rejectionReasons.map((reason) => reason.code))
    ).toEqual([
      "missing_source_evidence",
      "missing_source_evidence",
      "missing_source_evidence",
      "lower_precedence_than_selected",
      "lower_precedence_than_selected",
      "lower_precedence_than_selected",
      "lower_precedence_than_selected"
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate H closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        "gate_h_source_calibration_exact_promotion_policy_landed_no_runtime_selected_family_material_expansion_gate_i"
      );
      expect(text, path).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-i-family-material-expansion-contract.test.ts"
      );
      expect(text, path).toContain("gate_i_expand_family_material_properties_and_benchmark_scenarios");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-h-source-calibration-exact-promotion-contract.test.ts"
    );
  });
});
