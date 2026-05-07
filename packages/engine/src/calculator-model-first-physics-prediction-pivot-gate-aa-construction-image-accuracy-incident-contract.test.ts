import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { solveWallTripleLeafFrequencyBands } from "./wall-triple-leaf-frequency-solver";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_AA = {
  evidencePromotion: false,
  landedGate: "gate_aa_construction_image_accuracy_incident_route_selection_and_solver_recovery_plan",
  numericRuntimeBehaviorChange: true,
  outputCardStatusChange: true,
  outputSupportChange: false,
  previousLandedGate: "gate_z_promote_floor_impact_field_context_runtime_for_dynamic_calculator",
  proposalReportCopyChange: true,
  routeCardValueChange: true,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction:
    "gate_ab_construction_image_floor_family_source_guard_and_steel_impact_route_plan",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ab-floor-family-source-guard-contract.test.ts",
  selectionStatus:
    "gate_aa_construction_image_route_selection_recovered_selected_floor_family_guard_gate_ab",
  sourceRowsRequiredForRuntimeSelection: false
} as const;

const REQUIRED_GATE_AA_SURFACES = [
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aa-construction-image-accuracy-incident-contract.test.ts",
  "packages/engine/src/dynamic-airborne-gate-g-rockwool.ts",
  "packages/engine/src/dynamic-airborne.ts",
  "packages/engine/src/wall-triple-leaf-frequency-solver.ts",
  "docs/calculator/ACCURACY_INCIDENT_2026-05-07_CONSTRUCTION_IMAGE_ROUTE_SELECTION.md",
  "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AA_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AA_HANDOFF.md"
] as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const SHARED_WALL_CONSTRUCTION_IMAGE_STACK: readonly LayerInput[] = [
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
] as const;

const FLAT_LIST_CONSTRUCTION_IMAGE_STACK: readonly LayerInput[] = [
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
] as const;

function groupedSharedWallContext(cavity1DepthMm = 80, cavity2DepthMm = 80): AirborneContext {
  return {
    ...WALL_LAB_CONTEXT,
    wallTopology: {
      cavity1AbsorptionClass: "porous_absorptive",
      cavity1DepthMm,
      cavity1FillCoverage: "full",
      cavity1LayerIndices: [4, 5],
      cavity2AbsorptionClass: "porous_absorptive",
      cavity2DepthMm,
      cavity2FillCoverage: "full",
      cavity2LayerIndices: [9],
      internalLeafCoupling: "independent",
      internalLeafLayerIndices: [6, 7, 8],
      sideALeafLayerIndices: [0, 1, 2, 3],
      sideBLeafLayerIndices: [10, 11, 12, 13],
      supportTopology: "independent_frames",
      topologyMode: "grouped_triple_leaf"
    }
  };
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("calculator model-first physics prediction pivot Gate AA", () => {
  it("lands the construction-image route-selection recovery and selects floor-family guard Gate AB", () => {
    expect(MODEL_FIRST_GATE_AA).toEqual({
      evidencePromotion: false,
      landedGate: "gate_aa_construction_image_accuracy_incident_route_selection_and_solver_recovery_plan",
      numericRuntimeBehaviorChange: true,
      outputCardStatusChange: true,
      outputSupportChange: false,
      previousLandedGate: "gate_z_promote_floor_impact_field_context_runtime_for_dynamic_calculator",
      proposalReportCopyChange: true,
      routeCardValueChange: true,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        "gate_ab_construction_image_floor_family_source_guard_and_steel_impact_route_plan",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ab-floor-family-source-guard-contract.test.ts",
      selectionStatus:
        "gate_aa_construction_image_route_selection_recovered_selected_floor_family_guard_gate_ab",
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_AA_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("routes the shared-wall 80/80 grouped construction image through the triple-leaf solver instead of screening", () => {
    const context = groupedSharedWallContext();
    const directSolver = solveWallTripleLeafFrequencyBands({
      airborneContext: context,
      layers: SHARED_WALL_CONSTRUCTION_IMAGE_STACK
    });
    const appPath = calculateAssembly(SHARED_WALL_CONSTRUCTION_IMAGE_STACK, {
      airborneContext: context,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(directSolver.calculationBlocked).toBe(false);
    expect(directSolver.ratings?.iso717.Rw).toBe(61);
    expect(appPath.metrics.estimatedRwDb).toBe(directSolver.ratings?.iso717.Rw);
    expect(appPath.metrics).toMatchObject({
      estimatedCDb: -1.7,
      estimatedCtrDb: -6.8,
      estimatedRwDb: 61,
      estimatedStc: 61
    });
    expect(appPath.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "multileaf_multicavity",
      selectedMethod: "triple_leaf_two_cavity_frequency_solver",
      strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction"
    });
    expect(appPath.dynamicAirborneTrace?.candidateMethods).toEqual([
      {
        label: "Screening Seed",
        method: "screening_mass_law_curve_seed_v3",
        rwDb: 37.1,
        selected: false
      },
      {
        label: "Triple-Leaf Two-Cavity Solver",
        method: "triple_leaf_two_cavity_frequency_solver",
        rwDb: 61,
        selected: true
      }
    ]);
    expect(appPath.airborneBasis).toMatchObject({
      calculationStandard: "engine_triple_leaf_two_cavity_frequency_solver",
      curveBasis: "calculated_frequency_curve",
      errorBudgetDb: 5,
      family: "multileaf_multicavity",
      method: "triple_leaf_two_cavity_frequency_solver",
      origin: "family_physics_prediction",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(appPath.airborneCandidateResolution).toMatchObject({
      ratingAdapterBasisIds: [
        "iso_717_1_rw_from_airborne_transmission_loss_curve",
        "astm_e413_stc_from_airborne_transmission_loss_curve"
      ],
      runtimeValueMovement: true,
      selectedCandidateId: "candidate_grouped_rockwool_family_physics_prediction",
      selectedOrigin: "family_physics_prediction"
    });
    expect(appPath.airborneCandidateResolution?.rejectedCandidateIds).toContain(
      "candidate_multileaf_screening_fallback"
    );
    expect(appPath.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(appPath.unsupportedTargetOutputs).toEqual([]);
    expect(appPath.warnings.join("\n")).toContain("not measured exact or source-validated");
    expect(appPath.warnings.join("\n")).not.toContain("not a premium multi-cavity solver");
  });

  it("keeps the grouped triple-leaf selector domain-based instead of replacing the old 50/50 fixture with an 80/80 fixture", () => {
    for (const [cavity1DepthMm, cavity2DepthMm] of [
      [65, 95],
      [95, 65]
    ] as const) {
      const context = groupedSharedWallContext(cavity1DepthMm, cavity2DepthMm);
      const directSolver = solveWallTripleLeafFrequencyBands({
        airborneContext: context,
        layers: SHARED_WALL_CONSTRUCTION_IMAGE_STACK
      });
      const appPath = calculateAssembly(SHARED_WALL_CONSTRUCTION_IMAGE_STACK, {
        airborneContext: context,
        calculator: "dynamic",
        targetOutputs: WALL_LAB_OUTPUTS
      });

      expect(directSolver.calculationBlocked).toBe(false);
      expect(appPath.metrics.estimatedRwDb).toBe(directSolver.ratings?.iso717.Rw);
      expect(appPath.dynamicAirborneTrace).toMatchObject({
        selectedMethod: "triple_leaf_two_cavity_frequency_solver",
        strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction"
      });
      expect(appPath.dynamicAirborneTrace?.candidateMethods[0]).toMatchObject({
        method: "screening_mass_law_curve_seed_v3",
        selected: false
      });
      expect(appPath.dynamicAirborneTrace?.candidateMethods[1]).toMatchObject({
        method: "triple_leaf_two_cavity_frequency_solver",
        selected: true
      });
    }
  });

  it("keeps flat-list construction-image input as needs_input rather than fake grouped solver support", () => {
    const flatList = calculateAssembly(FLAT_LIST_CONSTRUCTION_IMAGE_STACK, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(flatList.metrics.estimatedRwDb).toBe(40);
    expect(flatList.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "multileaf_multicavity",
      selectedMethod: "screening_mass_law_curve_seed_v3",
      strategy: "multileaf_screening_blend"
    });
    expect(flatList.airborneBasis).toMatchObject({
      missingPhysicalInputs: [
        "sideALeafGroup",
        "cavity1DepthMm",
        "internalLeafGroup",
        "internalLeafCoupling",
        "cavity2DepthMm",
        "sideBLeafGroup",
        "supportTopology"
      ],
      origin: "needs_input"
    });
    expect(flatList.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(flatList.supportedTargetOutputs).toEqual([]);
    expect(flatList.unsupportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
  });

  it("keeps docs and current-gate runner aligned with Gate AA closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        "gate_aa_construction_image_route_selection_recovered_selected_floor_family_guard_gate_ab"
      );
      expect(text, path).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ab-floor-family-source-guard-contract.test.ts"
      );
      expect(text, path).toContain(
        "gate_ab_construction_image_floor_family_source_guard_and_steel_impact_route_plan"
      );
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-aa-construction-image-accuracy-incident-contract.test.ts"
    );
  });
});
