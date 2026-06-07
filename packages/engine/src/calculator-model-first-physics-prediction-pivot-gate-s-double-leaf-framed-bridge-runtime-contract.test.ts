import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  AirborneCandidate,
  AirborneCandidateRejectionReason,
  AirborneContext,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildDynamicCalculatorCandidateResolverRuntime } from "./dynamic-calculator-candidate-resolver-runtime";
import {
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID,
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_WARNING,
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_WARNING
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_S = {
  apiShapeChange: true,
  confidencePromotion: true,
  evidencePromotion: false,
  landedGate: "gate_s_promote_double_leaf_framed_bridge_solver_runtime_for_dynamic_calculator",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: true,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: true,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_t_close_remaining_family_material_property_gaps_for_dynamic_calculator",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-t-family-material-gap-closure-contract.test.ts",
  selectionStatus:
    "gate_s_double_leaf_framed_bridge_runtime_landed_selected_family_material_gap_gate_t",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_S_SURFACES = [
  "packages/engine/src/dynamic-airborne-gate-s-double-leaf-framed.ts",
  "packages/engine/src/dynamic-calculator-double-leaf-framed-bridge-solver-contract.ts",
  "packages/engine/src/dynamic-airborne.ts",
  "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-s-double-leaf-framed-bridge-runtime-contract.test.ts",
  "apps/web/features/workbench/wall-double-leaf-framed-bridge-runtime-route-card-matrix.test.ts",
  "packages/engine/src/index.ts",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_S_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_S_HANDOFF.md"
] as const;

const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const DOUBLE_LEAF_ABSORBED_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const DIRECT_FIXED_EMPTY_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 45 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const DOUBLE_LEAF_COMPLETE_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

const RESILIENT_COMPLETE_CONTEXT: AirborneContext = {
  connectionType: "resilient_channel",
  contextMode: "element_lab",
  resilientBarSideCount: "both_sides",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 75,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "resilient_channel",
    topologyMode: "double_leaf_framed"
  }
};

const RESILIENT_MISSING_SIDE_COUNT_CONTEXT: AirborneContext = {
  connectionType: "resilient_channel",
  contextMode: "element_lab",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 75,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "resilient_channel",
    topologyMode: "double_leaf_framed"
  }
};

const DIRECT_FIXED_CONTEXT: AirborneContext = {
  connectionType: "direct_fix",
  contextMode: "element_lab",
  studSpacingMm: 400,
  wallTopology: {
    cavity1AbsorptionClass: "none",
    cavity1DepthMm: 45,
    cavity1FillCoverage: "empty",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "direct_fixed",
    topologyMode: "double_leaf_framed"
  }
};

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

describe("calculator model-first physics prediction pivot Gate S", () => {
  it("lands the double-leaf/framed bridge runtime contract and selects Gate T", () => {
    expect(MODEL_FIRST_GATE_S).toEqual({
      apiShapeChange: true,
      confidencePromotion: true,
      evidencePromotion: false,
      landedGate: "gate_s_promote_double_leaf_framed_bridge_solver_runtime_for_dynamic_calculator",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: true,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: true,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_t_close_remaining_family_material_property_gaps_for_dynamic_calculator",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-t-family-material-gap-closure-contract.test.ts",
      selectionStatus:
        "gate_s_double_leaf_framed_bridge_runtime_landed_selected_family_material_gap_gate_t",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_S_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes complete independent absorbed double-leaf/framed walls to family physics without moving the pinned number", () => {
    const result = calculateAssembly(DOUBLE_LEAF_ABSORBED_STACK, {
      airborneContext: DOUBLE_LEAF_COMPLETE_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 45,
      estimatedStc: 45
    });
    expect(result.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "double_stud_system",
      detectedFamilyLabel: "Double Frame / Double Stud",
      selectedLabel: "Double-Leaf Framed Formula Solver",
      strategy: "double_leaf_framed_bridge_mass_air_mass_runtime"
    });
    expect(result.airborneBasis).toMatchObject({
      calculationStandard: "engine_double_leaf_cavity",
      curveBasis: "calculated_frequency_curve",
      errorBudgetDb: 7,
      family: "double_stud_system",
      kind: "airborne_physics_prediction",
      method: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      missingSourceEvidence: ["exact_full_stack_source_absent"],
      origin: "family_physics_prediction",
      ratingStandard: "ISO 717-1",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(result.airborneBasis?.propertyDefaults).toEqual([
      expect.objectContaining({
        field: "porousFill.flowResistivityPaSM2",
        source: "engineering_default"
      })
    ]);
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(
      result.airborneCandidateResolution?.candidates.find((candidate: AirborneCandidate) => candidate.selected)
    ).toMatchObject({
      id: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
      origin: "family_physics_prediction"
    });
    expect(
      result.airborneCandidateResolution?.candidates
        .filter((candidate: AirborneCandidate) =>
          ["measured_exact_full_stack", "calibrated_family_physics"].includes(candidate.origin)
        )
        .flatMap((candidate: AirborneCandidate) =>
          candidate.rejectionReasons.map((reason: AirborneCandidateRejectionReason) => reason.code)
        )
    ).toEqual(["missing_source_evidence", "missing_source_evidence"]);
    expect(result.warnings).toContain(GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_WARNING);
  });

  it("promotes resilient bridge only when side count is explicit and keeps the adapter boundary non-aliased", () => {
    const result = calculateAssembly(DOUBLE_LEAF_ABSORBED_STACK, {
      airborneContext: RESILIENT_COMPLETE_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedRwDb: 46,
      estimatedStc: 46
    });
    expect(result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "stud_wall_system",
      strategy: "double_leaf_framed_bridge_mass_air_mass_runtime"
    });
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: 8,
      family: "stud_wall_system",
      method: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(result.airborneBasis?.assumptions.join("\n")).toMatch(/STC is not an alias of Rw/i);
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID
    });
  });

  it("keeps exact source precedence above the Gate S runtime candidate", () => {
    const result = calculateAssembly(DOUBLE_LEAF_ABSORBED_STACK, {
      airborneContext: DOUBLE_LEAF_COMPLETE_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const resolution = buildDynamicCalculatorCandidateResolverRuntime({
      airborneContext: DOUBLE_LEAF_COMPLETE_CONTEXT,
      layers: DOUBLE_LEAF_ABSORBED_STACK,
      route: "wall",
      runtimeSignal: {
        airborneBasis: result.airborneBasis,
        detectedFamily: result.dynamicAirborneTrace?.detectedFamily,
        runtimeValueMovement: result.airborneCandidateResolution?.runtimeValueMovement,
        selectedMethod: result.dynamicAirborneTrace?.selectedMethod,
        strategy: result.dynamicAirborneTrace?.strategy
      },
      sourceAnchor: {
        applied: true,
        match: {
          id: "gate_s_rights_safe_exact_double_leaf_lab_row",
          label: "Gate S exact double-leaf lab row",
          metricLabel: "Rw",
          metricValue: 47,
          sourceMode: "lab"
        }
      },
      targetOutputs: WALL_OUTPUTS
    });

    expect(resolution.resolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: "candidate_blocked_rockwool_exact_source",
      selectedOrigin: "measured_exact_full_stack"
    });
    expect(resolution.resolution.selectedBasis).toMatchObject({
      exactSourceId: "gate_s_rights_safe_exact_double_leaf_lab_row",
      origin: "measured_exact_full_stack"
    });
  });

  it("keeps missing-input boundaries out of Gate S and routes direct-fixed through the later Gate EO owner", () => {
    const missingSideCount = calculateAssembly(DOUBLE_LEAF_ABSORBED_STACK, {
      airborneContext: RESILIENT_MISSING_SIDE_COUNT_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const directFixed = calculateAssembly(DIRECT_FIXED_EMPTY_STACK, {
      airborneContext: DIRECT_FIXED_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    expect(missingSideCount.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(missingSideCount.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["resilientBarSideCount"],
      origin: "needs_input"
    });
    expect(missingSideCount.airborneBasis?.method).not.toBe(GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD);
    expect(missingSideCount.warnings).not.toContain(GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_WARNING);

    expect(directFixed.metrics).toMatchObject({
      estimatedCDb: -1.2,
      estimatedCtrDb: -5.9,
      estimatedRwDb: 31,
      estimatedStc: 31
    });
    expect(directFixed.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(directFixed.airborneBasis).toMatchObject({
      errorBudgetDb: 6,
      method: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(directFixed.warnings).not.toContain(GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_WARNING);
    expect(directFixed.warnings).toContain(GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_WARNING);
  });

  it("keeps prior Gate G/O runtime pins stable after Gate S lands", () => {
    const groupedRockwool = calculateAssembly(GROUPED_SPLIT_ROCKWOOL_STACK, {
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const singleGypsum = calculateAssembly([{ materialId: "gypsum_board", thicknessMm: 12.5 }], {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    expect(groupedRockwool.metrics).toMatchObject({ estimatedRwDb: 53, estimatedStc: 64 });
    expect(groupedRockwool.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: "candidate_broad_accuracy_wall_triple_leaf_local_substitution_lab_spectrum_adapter_family_physics_prediction",
      selectedOrigin: "family_physics_prediction"
    });
    expect(groupedRockwool.airborneBasis).toMatchObject({
      method: "broad_accuracy_wall_triple_leaf_local_substitution_lab_spectrum_adapter_runtime",
      origin: "family_physics_prediction"
    });

    expect(singleGypsum.metrics).toMatchObject({ estimatedRwDb: 31, estimatedStc: 31 });
    expect(singleGypsum.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId:
        LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(singleGypsum.airborneBasis).toMatchObject({
      method: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      origin: "family_physics_prediction"
    });
  });

  it("keeps docs and current-gate runner aligned with Gate S closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        "gate_s_double_leaf_framed_bridge_runtime_landed_selected_family_material_gap_gate_t"
      );
      expect(text, path).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-t-family-material-gap-closure-contract.test.ts"
      );
      expect(text, path).toContain(
        "gate_t_close_remaining_family_material_property_gaps_for_dynamic_calculator"
      );
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-s-double-leaf-framed-bridge-runtime-contract.test.ts"
    );
  });
});
