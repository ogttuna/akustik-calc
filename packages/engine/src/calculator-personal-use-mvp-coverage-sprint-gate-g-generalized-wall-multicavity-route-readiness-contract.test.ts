import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildDynamicCalculatorCandidateResolverRuntime } from "./dynamic-calculator-candidate-resolver-runtime";
import { buildDynamicCalculatorRouteInputTopologyAssessment } from "./dynamic-calculator-route-input-topology";
import { validateWallTripleLeafLayerGroups } from "./wall-triple-leaf-topology-readiness";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_G = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: "gate_g_personal_use_mvp_generalized_wall_multicavity_route_readiness_plan",
  numericRuntimeBehaviorChange: false,
  previousLandedGate: "gate_f_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_surface_plan",
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_h_personal_use_mvp_lined_masonry_clt_wall_upgrade_plan",
  selectedNextFile:
    "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-h-lined-masonry-clt-wall-upgrade-contract.test.ts",
  selectionStatus:
    "gate_g_personal_use_mvp_generalized_wall_multicavity_route_readiness_landed_selected_lined_masonry_clt_wall_gate_h",
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_G_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-g-generalized-wall-multicavity-route-readiness-contract.test.ts",
  "packages/engine/src/dynamic-airborne.ts",
  "packages/engine/src/dynamic-airborne-flat-list-multileaf-guard.ts",
  "packages/engine/src/dynamic-airborne-gate-g-rockwool.ts",
  "packages/engine/src/wall-triple-leaf-topology-readiness.ts",
  "packages/engine/src/dynamic-calculator-route-input-topology.ts",
  "docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_G_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-10_STRATEGIC_ROI_REVALIDATION_AND_GATE_G_PLAN_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_G_HANDOFF.md"
] as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const GROUPED_TRIPLE_LEAF_CONTEXT: AirborneContext = {
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

const GROUPED_NON_50_50_CONTEXT: AirborneContext = {
  ...GROUPED_TRIPLE_LEAF_CONTEXT,
  wallTopology: {
    ...GROUPED_TRIPLE_LEAF_CONTEXT.wallTopology,
    cavity1DepthMm: 70,
    cavity2DepthMm: 35
  }
};

const GROUPED_TRIPLE_LEAF_STACK: readonly LayerInput[] = [
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

const FLAT_MULTICAVITY_STACK: readonly LayerInput[] = [
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

const LINED_MASSIVE_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

const CLT_WALL: readonly LayerInput[] = [
  { materialId: "clt_panel", thicknessMm: 120 }
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateGrouped(context: AirborneContext = GROUPED_TRIPLE_LEAF_CONTEXT) {
  return calculateAssembly(GROUPED_TRIPLE_LEAF_STACK, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs: WALL_LAB_OUTPUTS
  });
}

describe("Personal-Use MVP Coverage Sprint Gate G generalized wall multicavity route readiness", () => {
  it("lands the focused route-readiness gate and selects lined masonry/CLT wall Gate H", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_G).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_g_personal_use_mvp_generalized_wall_multicavity_route_readiness_plan",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_f_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_surface_plan",
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_h_personal_use_mvp_lined_masonry_clt_wall_upgrade_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-h-lined-masonry-clt-wall-upgrade-contract.test.ts",
      selectionStatus:
        "gate_g_personal_use_mvp_generalized_wall_multicavity_route_readiness_landed_selected_lined_masonry_clt_wall_gate_h",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_G_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("pins complete grouped 50/50 and non-50/50 mineral-wool triple-leaf routes without exact-source claims", () => {
    const fixture5050 = calculateGrouped();
    const non5050 = calculateGrouped(GROUPED_NON_50_50_CONTEXT);

    expect(fixture5050.metrics).toMatchObject({
      estimatedRwDb: 50,
      estimatedStc: 55
    });
    expect(fixture5050.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "multileaf_multicavity",
      selectedMethod: "triple_leaf_two_cavity_frequency_solver",
      strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction"
    });
    expect(fixture5050.airborneBasis).toMatchObject({
      errorBudgetDb: 5,
      method: "triple_leaf_two_cavity_frequency_solver",
      origin: "family_physics_prediction",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(fixture5050.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_grouped_rockwool_family_physics_prediction",
      selectedOrigin: "family_physics_prediction"
    });

    expect(non5050.metrics).toMatchObject({
      estimatedRwDb: 55,
      estimatedStc: 56
    });
    expect(non5050.dynamicAirborneTrace?.selectedMethod).toBe("triple_leaf_two_cavity_frequency_solver");
    expect(non5050.airborneBasis?.origin).toBe("family_physics_prediction");
    expect(non5050.warnings.join("\n")).toContain("not measured exact or source-validated");
  });

  it("keeps unequal cavities and safe explicit group reorders stable on the physical route", () => {
    const unequal = calculateGrouped(GROUPED_NON_50_50_CONTEXT);
    const safelyReorderedGroups = calculateGrouped({
      ...GROUPED_TRIPLE_LEAF_CONTEXT,
      wallTopology: {
        ...GROUPED_TRIPLE_LEAF_CONTEXT.wallTopology,
        sideALeafLayerIndices: [2, 1, 0],
        sideBLeafLayerIndices: [8, 7, 6]
      }
    });

    expect(unequal.metrics.estimatedRwDb).toBe(55);
    expect(unequal.dynamicAirborneTrace?.selectedMethod).toBe("triple_leaf_two_cavity_frequency_solver");
    expect(safelyReorderedGroups.metrics.estimatedRwDb).toBe(50);
    expect(safelyReorderedGroups.metrics.estimatedStc).toBe(55);
    expect(safelyReorderedGroups.dynamicAirborneTrace?.selectedMethod).toBe(
      "triple_leaf_two_cavity_frequency_solver"
    );
  });

  it("keeps flat-list multicavity ambiguity and partial grouped topology as precise needs_input", () => {
    const flatList = calculateAssembly(FLAT_MULTICAVITY_STACK, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const partialGrouped = calculateGrouped({
      ...GROUPED_TRIPLE_LEAF_CONTEXT,
      wallTopology: {
        ...GROUPED_TRIPLE_LEAF_CONTEXT.wallTopology,
        cavity2AbsorptionClass: undefined,
        cavity2FillCoverage: undefined
      }
    });

    expect(flatList.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(flatList.airborneBasis?.missingPhysicalInputs).toEqual([
      "sideALeafGroup",
      "cavity1DepthMm",
      "internalLeafGroup",
      "internalLeafCoupling",
      "cavity2DepthMm",
      "sideBLeafGroup",
      "supportTopology"
    ]);
    expect(flatList.supportedTargetOutputs).toEqual([]);

    expect(partialGrouped.dynamicAirborneTrace?.selectedMethod).not.toBe(
      "triple_leaf_two_cavity_frequency_solver"
    );
    expect(partialGrouped.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(partialGrouped.airborneBasis?.missingPhysicalInputs).toEqual([
      "cavity2FillCoverage",
      "absorberClass"
    ]);
    expect(partialGrouped.warnings.join("\n")).toContain("cavity 2 depth/fill/absorption");
  });

  it("refuses duplicate or out-of-range grouped layer ownership before formula promotion", () => {
    const invalidTopology = {
      ...GROUPED_TRIPLE_LEAF_CONTEXT.wallTopology,
      cavity1LayerIndices: [3, 99],
      sideALeafLayerIndices: [0, 1, 2, 3]
    };
    const validation = validateWallTripleLeafLayerGroups({
      layerCount: GROUPED_TRIPLE_LEAF_STACK.length,
      topology: invalidTopology
    });
    const invalidResult = calculateGrouped({
      ...GROUPED_TRIPLE_LEAF_CONTEXT,
      wallTopology: invalidTopology
    });

    expect(validation).toMatchObject({
      duplicateLayerIndices: [3],
      issueIds: ["duplicate_layer_group_indices", "out_of_range_layer_group_indices"],
      outOfRangeLayerIndices: [99],
      valid: false
    });
    expect(invalidResult.dynamicAirborneTrace?.selectedMethod).not.toBe(
      "triple_leaf_two_cavity_frequency_solver"
    );
    expect(invalidResult.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(invalidResult.airborneBasis?.missingPhysicalInputs).toEqual(["leafGrouping"]);
  });

  it("keeps lined massive/masonry and CLT walls out of the triple-leaf route", () => {
    const lined = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const clt = calculateAssembly(CLT_WALL, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(lined.dynamicAirborneTrace?.detectedFamily).not.toBe("multileaf_multicavity");
    expect(lined.dynamicAirborneTrace?.selectedMethod).not.toBe("triple_leaf_two_cavity_frequency_solver");
    expect(clt.dynamicAirborneTrace?.detectedFamily).not.toBe("multileaf_multicavity");
    expect(clt.dynamicAirborneTrace?.selectedMethod).not.toBe("triple_leaf_two_cavity_frequency_solver");
  });

  it("keeps field outputs and exact-source precedence basis-explicit", () => {
    const missingFieldContext = calculateAssembly(GROUPED_TRIPLE_LEAF_STACK, {
      airborneContext: GROUPED_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const runtime = calculateGrouped();
    const exactOverride = buildDynamicCalculatorCandidateResolverRuntime({
      airborneContext: GROUPED_TRIPLE_LEAF_CONTEXT,
      layers: GROUPED_TRIPLE_LEAF_STACK,
      route: "wall",
      runtimeSignal: {
        airborneBasis: runtime.airborneBasis,
        detectedFamily: runtime.dynamicAirborneTrace?.detectedFamily,
        runtimeValueMovement: runtime.airborneCandidateResolution?.runtimeValueMovement,
        selectedMethod: runtime.dynamicAirborneTrace?.selectedMethod,
        strategy: runtime.dynamicAirborneTrace?.strategy
      },
      sourceAnchor: {
        applied: true,
        match: {
          id: "gate_g_rights_safe_exact_grouped_triple_leaf_lab_row",
          label: "Gate G exact grouped triple-leaf lab row",
          metricLabel: "Rw",
          metricValue: 52,
          sourceMode: "lab"
        }
      },
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(missingFieldContext.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(missingFieldContext.airborneBasis?.missingPhysicalInputs).toEqual([
      "contextMode",
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S"
    ]);
    expect(missingFieldContext.airborneBasis?.origin).not.toBe("family_physics_prediction");

    expect(exactOverride.resolution).toMatchObject({
      selectedCandidateId: "candidate_blocked_rockwool_exact_source",
      selectedOrigin: "measured_exact_full_stack"
    });
    expect(exactOverride.resolution.selectedBasis).toMatchObject({
      exactSourceId: "gate_g_rights_safe_exact_grouped_triple_leaf_lab_row",
      origin: "measured_exact_full_stack"
    });
  });

  it("keeps route-input assessment, docs, and current-gate runner aligned with Gate G closeout", () => {
    const partialAssessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: {
        ...GROUPED_TRIPLE_LEAF_CONTEXT,
        wallTopology: {
          ...GROUPED_TRIPLE_LEAF_CONTEXT.wallTopology,
          cavity1FillCoverage: undefined,
          cavity2AbsorptionClass: undefined
        }
      },
      layers: GROUPED_TRIPLE_LEAF_STACK,
      route: "wall",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(partialAssessment).toMatchObject({
      missingPhysicalInputs: ["cavity1FillCoverage", "absorberClass"],
      status: "needs_input"
    });

    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_G.selectionStatus);
      expect(text, path).toContain(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_G.selectedNextFile);
      expect(text, path).toContain(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_G.selectedNextAction);
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-personal-use-mvp-coverage-sprint-gate-g-generalized-wall-multicavity-route-readiness-contract.test.ts"
    );
  });
});
