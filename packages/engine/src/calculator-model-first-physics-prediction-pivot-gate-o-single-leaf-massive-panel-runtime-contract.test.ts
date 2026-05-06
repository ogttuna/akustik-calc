import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildDynamicCalculatorCandidateResolverRuntime } from "./dynamic-calculator-candidate-resolver-runtime";
import {
  GATE_O_SINGLE_LEAF_MASSIVE_PANEL_PREDICTION_WARNING,
  maybeBuildGateOSingleLeafMassivePanelBasis
} from "./dynamic-airborne-gate-o-single-leaf";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_O = {
  apiShapeChange: true,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_o_promote_single_leaf_massive_panel_family_solver_runtime_for_dynamic_calculator",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: true,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_p_select_next_family_solver_upgrade_after_single_leaf_runtime_promotion",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-p-next-family-solver-upgrade-selection-contract.test.ts",
  selectionStatus:
    "gate_o_single_leaf_massive_panel_runtime_promotion_landed_no_value_selected_next_family_solver_gate_p",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_O_SURFACES = [
  "packages/engine/src/dynamic-airborne-gate-o-single-leaf.ts",
  "packages/engine/src/dynamic-airborne.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-o-single-leaf-massive-panel-runtime-contract.test.ts",
  "packages/engine/src/index.ts",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_O_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_O_HANDOFF.md"
] as const;

const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const SINGLE_GYPSUM_BOARD: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const DOUBLE_GYPSUM_BOARD_LAMINATED: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const RIGID_CONCRETE_PANEL: readonly LayerInput[] = [
  { materialId: "concrete", thicknessMm: 150 }
] as const;

const CLT_PANEL: readonly LayerInput[] = [
  { materialId: "clt_panel", thicknessMm: 100 }
] as const;

const GROUPED_SPLIT_ROCKWOOL_CONTEXT: AirborneContext = {
  airtightness: "good",
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

describe("calculator model-first physics prediction pivot Gate O", () => {
  it("lands the single-leaf/massive-panel runtime promotion contract and selects Gate P", () => {
    expect(MODEL_FIRST_GATE_O).toEqual({
      apiShapeChange: true,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_o_promote_single_leaf_massive_panel_family_solver_runtime_for_dynamic_calculator",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: true,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_p_select_next_family_solver_upgrade_after_single_leaf_runtime_promotion",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-p-next-family-solver-upgrade-selection-contract.test.ts",
      selectionStatus:
        "gate_o_single_leaf_massive_panel_runtime_promotion_landed_no_value_selected_next_family_solver_gate_p",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_O_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
    expect(typeof maybeBuildGateOSingleLeafMassivePanelBasis).toBe("function");
  });

  it("promotes ordinary single-leaf and massive-panel dynamic results to family physics without moving values or support", () => {
    const gypsum = calculateAssembly(SINGLE_GYPSUM_BOARD, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const laminated = calculateAssembly(DOUBLE_GYPSUM_BOARD_LAMINATED, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const concrete = calculateAssembly(RIGID_CONCRETE_PANEL, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    expect(gypsum.metrics).toMatchObject({ estimatedRwDb: 31, estimatedStc: 31 });
    expect(gypsum.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(gypsum.unsupportedTargetOutputs).toEqual([]);
    expect(gypsum.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "single_leaf_panel",
      selectedMethod: "sharp",
      strategy: "single_leaf_sharp_delegate"
    });
    expect(gypsum.airborneBasis).toMatchObject({
      calculationStandard: "engine_mass_law",
      curveBasis: "calculated_frequency_curve",
      errorBudgetDb: 5,
      family: "single_leaf_panel",
      kind: "airborne_physics_prediction",
      method: "gate_o_single_leaf_massive_panel_sharp_single_leaf_panel_coincidence_delegate",
      origin: "family_physics_prediction",
      ratingStandard: "ISO 717-1",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(gypsum.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedOrigin: "family_physics_prediction"
    });
    expect(gypsum.warnings).toContain(GATE_O_SINGLE_LEAF_MASSIVE_PANEL_PREDICTION_WARNING);

    expect(laminated.metrics).toMatchObject({ estimatedRwDb: 34, estimatedStc: 34 });
    expect(laminated.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(laminated.unsupportedTargetOutputs).toEqual([]);
    expect(laminated.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "laminated_single_leaf",
      selectedMethod: "sharp",
      strategy: "laminated_leaf_sharp_delegate"
    });
    expect(laminated.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedOrigin: "family_physics_prediction"
    });
    expect(laminated.airborneBasis).toMatchObject({
      family: "laminated_single_leaf",
      origin: "family_physics_prediction"
    });

    expect(concrete.metrics).toMatchObject({ estimatedRwDb: 55, estimatedStc: 55 });
    expect(concrete.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(concrete.unsupportedTargetOutputs).toEqual([]);
    expect(concrete.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "rigid_massive_wall",
      selectedMethod: "ks_rw_calibrated",
      strategy: "rigid_massive_blend"
    });
    expect(concrete.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedOrigin: "family_physics_prediction"
    });
    expect(concrete.airborneBasis).toMatchObject({
      family: "rigid_massive_wall",
      method: "gate_o_single_leaf_massive_panel_ks_massive_wall_reference_curve_delegate",
      origin: "family_physics_prediction"
    });
  });

  it("keeps exact source precedence and higher-risk family boundaries intact", () => {
    const gypsumRuntime = calculateAssembly(SINGLE_GYPSUM_BOARD, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const exactOverride = buildDynamicCalculatorCandidateResolverRuntime({
      airborneContext: { contextMode: "element_lab" },
      layers: SINGLE_GYPSUM_BOARD,
      route: "wall",
      runtimeSignal: {
        airborneBasis: gypsumRuntime.airborneBasis,
        detectedFamily: gypsumRuntime.dynamicAirborneTrace?.detectedFamily,
        runtimeValueMovement: false,
        selectedMethod: gypsumRuntime.dynamicAirborneTrace?.selectedMethod,
        strategy: gypsumRuntime.dynamicAirborneTrace?.strategy
      },
      sourceAnchor: {
        applied: true,
        match: {
          id: "gate_o_rights_safe_exact_single_gypsum_lab_row",
          label: "Gate O exact single gypsum lab row",
          metricLabel: "Rw",
          metricValue: 32,
          sourceMode: "lab"
        }
      },
      targetOutputs: WALL_OUTPUTS
    });
    const clt = calculateAssembly(CLT_PANEL, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const groupedRockwool = calculateAssembly(GROUPED_SPLIT_ROCKWOOL_STACK, {
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    expect(exactOverride.resolution).toMatchObject({
      runtimeValueMovement: true,
      selectedOrigin: "measured_exact_full_stack"
    });
    expect(exactOverride.resolution.selectedBasis).toMatchObject({
      exactSourceId: "gate_o_rights_safe_exact_single_gypsum_lab_row",
      origin: "measured_exact_full_stack"
    });

    expect(clt.metrics).toMatchObject({ estimatedRwDb: 40, estimatedStc: 40 });
    expect(clt.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "single_leaf_panel",
      selectedMethod: "sharp",
      strategy: "timber_panel_blend"
    });
    expect(clt.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedOrigin: "screening_fallback"
    });
    expect(clt.airborneBasis).toMatchObject({
      method: "screening_mass_law_curve_seed_v3",
      origin: "screening_fallback"
    });
    expect(clt.warnings).not.toContain(GATE_O_SINGLE_LEAF_MASSIVE_PANEL_PREDICTION_WARNING);

    expect(groupedRockwool.metrics).toMatchObject({
      estimatedRwDb: 50,
      estimatedStc: 55
    });
    expect(groupedRockwool.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedOrigin: "family_physics_prediction"
    });
    expect(groupedRockwool.airborneBasis).toMatchObject({
      family: "multileaf_multicavity",
      method: "triple_leaf_two_cavity_frequency_solver",
      origin: "family_physics_prediction"
    });
  });

  it("keeps docs and current-gate runner aligned with Gate O closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        "gate_o_single_leaf_massive_panel_runtime_promotion_landed_no_value_selected_next_family_solver_gate_p"
      );
      expect(text, path).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-p-next-family-solver-upgrade-selection-contract.test.ts"
      );
      expect(text, path).toContain(
        "gate_p_select_next_family_solver_upgrade_after_single_leaf_runtime_promotion"
      );
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-o-single-leaf-massive-panel-runtime-contract.test.ts"
    );
  });
});
