import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildDynamicCalculatorCandidateResolverRuntime } from "./dynamic-calculator-candidate-resolver-runtime";
import { buildDynamicCalculatorRouteInputTopologyAssessment } from "./dynamic-calculator-route-input-topology";
import {
  GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD,
  GATE_H_CLT_MASS_TIMBER_WALL_SELECTED_CANDIDATE_ID,
  GATE_H_CLT_MASS_TIMBER_WALL_WARNING,
  GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD,
  GATE_H_LINED_MASSIVE_WALL_SELECTED_CANDIDATE_ID,
  GATE_H_LINED_MASSIVE_WALL_WARNING
} from "./dynamic-airborne-gate-h-lined-masonry-clt";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-i-airborne-field-context";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_H = {
  apiShapeChange: true,
  evidencePromotion: false,
  landedGate: "gate_h_personal_use_mvp_lined_masonry_clt_wall_upgrade_plan",
  numericRuntimeBehaviorChange: false,
  previousLandedGate: "gate_g_personal_use_mvp_generalized_wall_multicavity_route_readiness_plan",
  runtimeOriginPromotion: true,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_i_personal_use_mvp_airborne_field_context_continuation_plan",
  selectedNextFile:
    "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-i-airborne-field-context-continuation-contract.test.ts",
  selectionStatus:
    "gate_h_personal_use_mvp_lined_masonry_clt_wall_upgrade_landed_selected_airborne_field_context_gate_i",
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_H_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-h-lined-masonry-clt-wall-upgrade-contract.test.ts",
  "packages/engine/src/dynamic-airborne-gate-h-lined-masonry-clt.ts",
  "packages/engine/src/dynamic-airborne.ts",
  "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
  "packages/engine/src/dynamic-calculator-route-input-topology.ts",
  "packages/shared/src/domain/airborne-context.ts",
  "packages/shared/src/domain/input-completeness.ts",
  "docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_H_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_G_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_H_HANDOFF.md"
] as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_LAB_OUTPUTS_WITHOUT_CTR = ["Rw", "STC", "C"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const WALL_FIELD_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "field_between_rooms",
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42
};

const LINED_MASSIVE_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

const CLT_WALL: readonly LayerInput[] = [
  { materialId: "clt_panel", thicknessMm: 120 }
] as const;

const SINGLE_GYPSUM_BOARD: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const DOUBLE_GYPSUM_LEAF: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 70 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

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

const COMPLETE_LINED_MASSIVE_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 80,
    cavity1FillCoverage: "partial",
    cavity1LayerIndices: [1, 2],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [3],
    supportTopology: "direct_fixed",
    topologyMode: "lined_massive_wall"
  }
};

const PARTIAL_LINED_MASSIVE_CONTEXT: AirborneContext = {
  ...COMPLETE_LINED_MASSIVE_CONTEXT,
  wallTopology: {
    ...COMPLETE_LINED_MASSIVE_CONTEXT.wallTopology,
    cavity1AbsorptionClass: undefined,
    cavity1DepthMm: undefined,
    cavity1FillCoverage: undefined
  }
};

const MASS_TIMBER_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
  wallTopology: {
    topologyMode: "mass_timber_panel"
  }
};

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate H lined masonry and CLT wall upgrade", () => {
  it("lands the focused lined massive / CLT wall upgrade and selects field-context Gate I", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_H).toEqual({
      apiShapeChange: true,
      evidencePromotion: false,
      landedGate: "gate_h_personal_use_mvp_lined_masonry_clt_wall_upgrade_plan",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_g_personal_use_mvp_generalized_wall_multicavity_route_readiness_plan",
      runtimeOriginPromotion: true,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_i_personal_use_mvp_airborne_field_context_continuation_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-i-airborne-field-context-continuation-contract.test.ts",
      selectionStatus:
        "gate_h_personal_use_mvp_lined_masonry_clt_wall_upgrade_landed_selected_airborne_field_context_gate_i",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_H_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes complete lined massive/masonry wall runtime basis without retuning numeric values", () => {
    const lined = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(lined.metrics).toMatchObject({
      estimatedRwDb: 60,
      estimatedStc: 60
    });
    expect(lined.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "lined_massive_wall",
      selectedMethod: "mass_law"
    });
    expect(lined.airborneBasis).toMatchObject({
      calculationStandard: "engine_double_leaf_cavity",
      curveBasis: "calculated_frequency_curve",
      errorBudgetDb: 6,
      family: "lined_massive_wall",
      kind: "airborne_bound",
      method: GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD,
      origin: "bounded_prediction",
      ratingStandard: "ISO 717-1",
      toleranceClass: "bounded_prediction"
    });
    expect(lined.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: GATE_H_LINED_MASSIVE_WALL_SELECTED_CANDIDATE_ID,
      selectedOrigin: "bounded_prediction"
    });
    expect(lined.warnings).toContain(GATE_H_LINED_MASSIVE_WALL_WARNING);
  });

  it("promotes complete CLT / mass-timber wall runtime basis without exact-source claims", () => {
    const clt = calculateAssembly(CLT_WALL, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS_WITHOUT_CTR
    });

    expect(clt.metrics).toMatchObject({
      estimatedRwDb: 42,
      estimatedStc: 42
    });
    expect(clt.supportedTargetOutputs).toEqual(["Rw", "STC", "C"]);
    expect(clt.unsupportedTargetOutputs).toEqual([]);
    expect(clt.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "single_leaf_panel",
      selectedMethod: "sharp",
      strategy: "timber_panel_blend"
    });
    expect(clt.airborneBasis).toMatchObject({
      calculationStandard: "engine_mass_law",
      curveBasis: "calculated_frequency_curve",
      errorBudgetDb: 6,
      family: "single_leaf_panel",
      method: GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      ratingStandard: "ISO 717-1",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(clt.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: GATE_H_CLT_MASS_TIMBER_WALL_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(clt.warnings).toContain(GATE_H_CLT_MASS_TIMBER_WALL_WARNING);
  });

  it("keeps ordinary single leaf, double/framed, and grouped triple-leaf routes out of Gate H", () => {
    const single = calculateAssembly(SINGLE_GYPSUM_BOARD, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const doubleLeaf = calculateAssembly(DOUBLE_GYPSUM_LEAF, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const grouped = calculateAssembly(GROUPED_TRIPLE_LEAF_STACK, {
      airborneContext: GROUPED_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(single.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      GATE_H_CLT_MASS_TIMBER_WALL_SELECTED_CANDIDATE_ID
    );
    expect(single.airborneBasis?.method).not.toBe(GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD);
    expect(doubleLeaf.airborneBasis?.method).not.toBe(GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD);
    expect(doubleLeaf.airborneBasis?.method).not.toBe(GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD);
    expect(grouped.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_broad_accuracy_wall_triple_leaf_local_substitution_lab_spectrum_adapter_family_physics_prediction",
      selectedOrigin: "family_physics_prediction"
    });
    expect(grouped.airborneBasis?.method).toBe("broad_accuracy_wall_triple_leaf_local_substitution_lab_spectrum_adapter_runtime");
  });

  it("blocks partial explicit lined and mass-timber wall inputs as needs_input", () => {
    const partialLined = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: PARTIAL_LINED_MASSIVE_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const partialCltIntent = calculateAssembly(SINGLE_GYPSUM_BOARD, {
      airborneContext: MASS_TIMBER_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const linedAssessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: PARTIAL_LINED_MASSIVE_CONTEXT,
      layers: LINED_MASSIVE_WALL,
      route: "wall",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(partialLined.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(partialLined.airborneBasis?.missingPhysicalInputs).toEqual([
      "cavity1DepthMm",
      "cavity1FillCoverage",
      "absorberClass"
    ]);
    expect(linedAssessment).toMatchObject({
      routeFamilies: ["lined_massive_airborne"],
      status: "needs_input"
    });

    expect(partialCltIntent.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(partialCltIntent.airborneBasis?.missingPhysicalInputs).toEqual([
      "materialClass",
      "densityKgM3"
    ]);
  });

  it("keeps field outputs and exact-source precedence basis-explicit after Gate I", () => {
    const linedField = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: WALL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const runtime = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const exactOverride = buildDynamicCalculatorCandidateResolverRuntime({
      airborneContext: WALL_LAB_CONTEXT,
      layers: LINED_MASSIVE_WALL,
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
          id: "gate_h_rights_safe_exact_lined_massive_lab_row",
          label: "Gate H exact lined massive lab row",
          metricLabel: "Rw",
          metricValue: 61,
          sourceMode: "lab"
        }
      },
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(linedField.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(linedField.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(linedField.airborneBasis?.method).not.toBe(GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD);

    expect(exactOverride.resolution).toMatchObject({
      selectedCandidateId: "candidate_blocked_rockwool_exact_source",
      selectedOrigin: "measured_exact_full_stack"
    });
    expect(exactOverride.resolution.selectedBasis).toMatchObject({
      exactSourceId: "gate_h_rights_safe_exact_lined_massive_lab_row",
      origin: "measured_exact_full_stack"
    });
  });

  it("keeps docs and current-gate runner aligned with Gate H closeout", () => {
    const completeLinedAssessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: COMPLETE_LINED_MASSIVE_CONTEXT,
      layers: LINED_MASSIVE_WALL,
      route: "wall",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const completeMassTimberAssessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: MASS_TIMBER_CONTEXT,
      layers: CLT_WALL,
      route: "wall",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(completeLinedAssessment).toMatchObject({
      routeFamilies: ["lined_massive_airborne"],
      status: "complete_with_defaults"
    });
    expect(completeMassTimberAssessment).toMatchObject({
      routeFamilies: ["mass_timber_airborne"],
      status: "complete_with_defaults"
    });

    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_H.selectionStatus);
      expect(text, path).toContain(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_H.selectedNextFile);
      expect(text, path).toContain(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_H.selectedNextAction);
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-personal-use-mvp-coverage-sprint-gate-h-lined-masonry-clt-wall-upgrade-contract.test.ts"
    );
  });
});
