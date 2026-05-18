import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneCandidate, AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_G = {
  apiShapeChange: false,
  confidencePromotion: true,
  evidencePromotion: false,
  landedGate: "gate_g_promote_grouped_rockwool_triple_leaf_family_physics_prediction_with_benchmarks",
  numericRuntimeBehaviorChange: true,
  outputCardStatusChange: true,
  outputSupportChange: false,
  proposalReportCopyChange: true,
  routeCardValueChange: true,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction:
    "gate_h_calibrate_sources_and_exact_promotion_without_deleting_physics_solver",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-h-source-calibration-exact-promotion-contract.test.ts",
  selectionStatus:
    "gate_g_grouped_rockwool_family_physics_prediction_landed_selected_source_calibration_gate_h",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_G_SURFACES = [
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-g-grouped-rockwool-prediction-contract.test.ts",
  "packages/engine/src/dynamic-airborne.ts",
  "packages/engine/src/dynamic-airborne-helpers.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/shared/src/domain/airborne-basis.ts",
  "packages/shared/src/domain/dynamic-airborne.ts",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_G_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_G_HANDOFF.md"
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

const GROUPED_SPLIT_ROCKWOOL_FIELD_CONTEXT: AirborneContext = {
  ...GROUPED_SPLIT_ROCKWOOL_CONTEXT,
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const GROUPED_INCOMPLETE_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
  wallTopology: {
    cavity1DepthMm: 50,
    cavity1LayerIndices: [3],
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    topologyMode: "grouped_triple_leaf"
  }
};

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"] as const satisfies readonly RequestedOutputId[];

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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("calculator model-first physics prediction pivot Gate G", () => {
  it("lands grouped Rockwool runtime prediction and selects calibration Gate H", () => {
    expect(MODEL_FIRST_GATE_G).toEqual({
      apiShapeChange: false,
      confidencePromotion: true,
      evidencePromotion: false,
      landedGate: "gate_g_promote_grouped_rockwool_triple_leaf_family_physics_prediction_with_benchmarks",
      numericRuntimeBehaviorChange: true,
      outputCardStatusChange: true,
      outputSupportChange: false,
      proposalReportCopyChange: true,
      routeCardValueChange: true,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        "gate_h_calibrate_sources_and_exact_promotion_without_deleting_physics_solver",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-h-source-calibration-exact-promotion-contract.test.ts",
      selectionStatus:
        "gate_g_grouped_rockwool_family_physics_prediction_landed_selected_source_calibration_gate_h",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_G_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes complete grouped Rockwool lab topology to family physics prediction", () => {
    const result = calculateAssembly(GROUPED_SPLIT_ROCKWOOL_STACK, {
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(result.metrics.estimatedRwDb).toBe(53);
    expect(result.metrics.estimatedStc).toBe(64);
    expect(result.metrics.estimatedCDb).toBe(1.6);
    expect(result.metrics.estimatedCtrDb).toBe(-7.2);
    expect(result.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "multileaf_multicavity",
      selectedMethod: "triple_leaf_two_cavity_frequency_solver",
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor"
    });
    expect(result.dynamicAirborneTrace?.candidateMethods).toEqual([
      {
        label: "Screening Seed",
        method: "screening_mass_law_curve_seed_v3",
        rwDb: 40.2,
        selected: false
      },
      {
        label: "Triple-Leaf Two-Cavity Solver",
        method: "triple_leaf_two_cavity_frequency_solver",
        rwDb: 53,
        selected: true
      }
    ]);
    expect(result.warnings.join("\n")).toContain("lab spectrum adapter is active");
    expect(result.warnings.join("\n")).not.toContain("source-required screening");
  });

  it("carries field outputs through the local-substitution field context without lab/field collapse", () => {
    const result = calculateAssembly(GROUPED_SPLIT_ROCKWOOL_STACK, {
      airborneContext: GROUPED_SPLIT_ROCKWOOL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });

    expect(result.metrics.estimatedRwDb).toBe(52);
    expect(result.metrics.estimatedRwPrimeDb).toBe(52);
    expect(result.metrics.estimatedDnTwDb).toBe(54);
    expect(result.metrics.estimatedDnTADb).toBe(55.4);
    expect(result.metrics.estimatedDnWDb).toBe(52);
    expect(result.metrics.estimatedDnADb).toBe(53.9);
    expect(result.metrics.estimatedStc).toBe(63);
    expect(result.supportedTargetOutputs).toEqual(["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"]);
    expect(result.dynamicAirborneTrace?.selectedMethod).toBe("triple_leaf_two_cavity_frequency_solver");
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: 10,
      method: "broad_accuracy_wall_triple_leaf_local_substitution_field_context_harmonization_runtime"
    });
    expect(result.warnings.join("\n")).toContain("Airborne field-side overlay active");
    expect(result.warnings.join("\n")).toContain("local substitution field-context harmonization is active");
    expect(result.warnings.join("\n")).not.toContain("Airborne building-prediction route is parked");
  });

  it("populates model-first basis and selected/rejected candidate metadata for runtime movement", () => {
    const result = calculateAssembly(GROUPED_SPLIT_ROCKWOOL_STACK, {
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(result.airborneBasis).toMatchObject({
      calculationStandard: "engine_triple_leaf_two_cavity_frequency_solver",
      curveBasis: "calculated_frequency_curve",
      errorBudgetDb: 8,
      family: "multileaf_multicavity",
      kind: "airborne_physics_prediction",
      method: "broad_accuracy_wall_triple_leaf_local_substitution_lab_spectrum_adapter_runtime",
      missingPhysicalInputs: [],
      missingSourceEvidence: [
        "source_owned_same_stack_local_substitution_holdout_absent",
        "field_building_adapter_owner_absent",
        "source_owned_same_stack_stc_c_ctr_holdout_absent"
      ],
      origin: "family_physics_prediction",
      ratingStandard: "ISO 717-1",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      policyId: "model_first_airborne_candidate_precedence_v1",
      runtimeValueMovement: true,
      selectedCandidateId: "candidate_broad_accuracy_wall_triple_leaf_local_substitution_lab_spectrum_adapter_family_physics_prediction",
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.airborneCandidateResolution?.rejectedCandidateIds).toEqual([
      "candidate_blocked_rockwool_exact_source",
      "candidate_dynamic_exact_subassembly_plus_calculated_delta",
      "candidate_calibrated_triple_leaf_family",
      "candidate_dynamic_bounded_prediction",
      "candidate_multileaf_screening_fallback",
      "candidate_dynamic_needs_input",
      "candidate_dynamic_unsupported"
    ]);
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

  it("keeps flat-list and incomplete topology from fake solver promotion", () => {
    const flatList = calculateAssembly(GROUPED_SPLIT_ROCKWOOL_STACK, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const incomplete = calculateAssembly(GROUPED_SPLIT_ROCKWOOL_STACK, {
      airborneContext: GROUPED_INCOMPLETE_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(flatList.metrics.estimatedRwDb).toBe(41);
    expect(flatList.dynamicAirborneTrace?.strategy).toBe("multileaf_screening_blend");
    expect(flatList.supportedTargetOutputs).toEqual([]);
    expect(flatList.unsupportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(flatList.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });

    expect(incomplete.dynamicAirborneTrace?.selectedMethod).not.toBe("triple_leaf_two_cavity_frequency_solver");
    expect(incomplete.dynamicAirborneTrace?.strategy).toBe("multileaf_screening_blend");
    expect(incomplete.airborneBasis).toMatchObject({
      origin: "needs_input"
    });
    expect(incomplete.warnings.join("\n")).toContain("Missing:");
  });

  it("keeps docs and current-gate runner aligned with Gate G closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        "gate_g_grouped_rockwool_family_physics_prediction_landed_selected_source_calibration_gate_h"
      );
      expect(text, path).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-h-source-calibration-exact-promotion-contract.test.ts"
      );
      expect(text, path).toContain(
        "gate_h_calibrate_sources_and_exact_promotion_without_deleting_physics_solver"
      );
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-g-grouped-rockwool-prediction-contract.test.ts"
    );
  });
});
