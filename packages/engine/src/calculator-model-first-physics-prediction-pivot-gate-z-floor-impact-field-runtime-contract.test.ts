import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildGateYFloorImpactFieldContextAssessment } from "./dynamic-calculator-floor-impact-field-context-contract";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_Z = {
  evidencePromotion: false,
  landedGate: "gate_z_promote_floor_impact_field_context_runtime_for_dynamic_calculator",
  numericRuntimeBehaviorChange: true,
  outputCardStatusChange: true,
  outputSupportChange: true,
  previousLandedGate: "gate_y_define_floor_impact_field_context_boundary_for_dynamic_calculator",
  proposalReportCopyChange: true,
  routeCardValueChange: true,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_aa_construction_image_accuracy_incident_route_selection_and_solver_recovery_plan",
  selectedNextFile:
    "docs/calculator/ACCURACY_INCIDENT_2026-05-07_CONSTRUCTION_IMAGE_ROUTE_SELECTION.md",
  selectionStatus:
    "gate_z_floor_impact_field_runtime_landed_selected_construction_image_accuracy_incident_gate_aa",
  sourceRowsRequiredForRuntimeSelection: false
} as const;

const REQUIRED_GATE_Z_SURFACES = [
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-z-floor-impact-field-runtime-contract.test.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/engine/src/dynamic-calculator-floor-impact-field-context-contract.ts",
  "packages/engine/src/dynamic-calculator-floor-impact-dynamic-stiffness-contract.ts",
  "packages/engine/src/impact-field-context.ts",
  "packages/engine/src/impact-lane.ts",
  "packages/engine/src/target-output-support.ts",
  "docs/calculator/ACCURACY_INCIDENT_2026-05-07_CONSTRUCTION_IMAGE_ROUTE_SELECTION.md",
  "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_Z_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_Z_HANDOFF.md"
] as const;

const FIELD_IMPACT_OUTPUTS = ["L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];
const FIELD_IMPACT_OUTPUTS_WITH_LOW_FREQUENCY = [
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];
const LAB_AND_FIELD_IMPACT_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const HEAVY_FLOATING_FLOOR_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
] as const satisfies readonly LayerInput[];

const COMPLETE_FLOOR_IMPACT_CONTEXT = {
  loadBasisKgM2: 76,
  resilientLayerDynamicStiffnessMNm3: 30
} as const;

const COMPLETE_AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2700,
  panelWidthMm: 5000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 55
} as const;

const COMPLETE_IMPACT_FIELD_CONTEXT = {
  enableSmallRoomEstimate: true,
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function expectGateZFieldImpactValues(
  result: ReturnType<typeof calculateAssembly>
): void {
  expect(result.impact).toMatchObject({
    DeltaLw: 24.3,
    LPrimeNTw: 49.9,
    LPrimeNW: 52.3,
    LnW: 50.3,
    availableOutputs: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"],
    basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
    fieldEstimateKCorrectionDb: 2,
    fieldEstimateProfile: "explicit_field_lprimenw_from_lnw_plus_k",
    floatingLoadSurfaceMassKgM2: 76,
    resilientDynamicStiffnessMNm3: 30
  });
  expect(result.impact?.metricBasis).toEqual({
    DeltaLw: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
    LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
    LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
    LnW: "predictor_heavy_floating_floor_iso12354_annexc_estimate"
  });
  expect(result.impactSupport).toMatchObject({
    basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
    formulaNotes: expect.arrayContaining([
      "L'n,w = Ln,w + K.",
      "L'nT,w = L'n,w + 10 log10(31.3 / V) on the standardized field-volume path."
    ])
  });
  expect(result.dynamicImpactTrace).toMatchObject({
    availableMetricLabels: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"],
    evidenceTier: "estimate",
    fieldContinuation: "standardized_room_volume",
    fieldOutputsActive: true,
    hasFieldContext: true,
    impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
    predictorInputMode: "derived_from_visible_layers",
    selectedLabel: "Heavy floating-floor formula",
    selectionKind: "formula_estimate",
    standardizedFieldActive: true
  });
}

describe("calculator model-first physics prediction pivot Gate Z", () => {
  it("lands field-impact runtime promotion and selects the construction-image accuracy incident plan", () => {
    expect(MODEL_FIRST_GATE_Z).toEqual({
      evidencePromotion: false,
      landedGate: "gate_z_promote_floor_impact_field_context_runtime_for_dynamic_calculator",
      numericRuntimeBehaviorChange: true,
      outputCardStatusChange: true,
      outputSupportChange: true,
      previousLandedGate: "gate_y_define_floor_impact_field_context_boundary_for_dynamic_calculator",
      proposalReportCopyChange: true,
      routeCardValueChange: true,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_aa_construction_image_accuracy_incident_route_selection_and_solver_recovery_plan",
      selectedNextFile:
        "docs/calculator/ACCURACY_INCIDENT_2026-05-07_CONSTRUCTION_IMAGE_ROUTE_SELECTION.md",
      selectionStatus:
        "gate_z_floor_impact_field_runtime_landed_selected_construction_image_accuracy_incident_gate_aa",
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_Z_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes field-only L'n,w and L'nT,w from the owned lab anchor plus field context", () => {
    const assessment = buildGateYFloorImpactFieldContextAssessment({
      airborneContext: COMPLETE_AIRBORNE_FIELD_CONTEXT,
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: COMPLETE_IMPACT_FIELD_CONTEXT,
      layers: HEAVY_FLOATING_FLOOR_STACK,
      scenarioId: "gate_y_complete_lab_anchor_and_field_context_ready_except_low_frequency",
      targetOutputs: FIELD_IMPACT_OUTPUTS
    });
    const result = calculateAssembly(HEAVY_FLOATING_FLOOR_STACK, {
      airborneContext: COMPLETE_AIRBORNE_FIELD_CONTEXT,
      calculator: "dynamic",
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: COMPLETE_IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_IMPACT_OUTPUTS
    });

    expect(assessment.status).toBe("ready_for_runtime_gate");
    expect(assessment.readyOutputs).toEqual(FIELD_IMPACT_OUTPUTS);
    expect(assessment.missingOwnerInputs).toEqual([]);
    expect(assessment.missingPhysicalInputs).toEqual([]);

    expectGateZFieldImpactValues(result);
    expect(result.supportedTargetOutputs).toEqual(FIELD_IMPACT_OUTPUTS);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.warnings).toContain(
      "Live field-side supplement is active on the main impact lane. K and receiving-room context are now carried through the engine boundary, not only the guide lane."
    );
    expect(result.warnings).not.toContain(
      "Dynamic Calculator floor-impact runtime did not promote this adapter set; lab Ln,w / DeltaLw, field impact, and ASTM IIC/AIIC stay on separate runtime boundaries."
    );
  });

  it("keeps field-only and lab-anchored mixed requests numerically identical for shared field outputs", () => {
    const fieldOnly = calculateAssembly(HEAVY_FLOATING_FLOOR_STACK, {
      airborneContext: COMPLETE_AIRBORNE_FIELD_CONTEXT,
      calculator: "dynamic",
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: COMPLETE_IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_IMPACT_OUTPUTS
    });
    const labAnchoredMixed = calculateAssembly(HEAVY_FLOATING_FLOOR_STACK, {
      airborneContext: COMPLETE_AIRBORNE_FIELD_CONTEXT,
      calculator: "dynamic",
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: COMPLETE_IMPACT_FIELD_CONTEXT,
      targetOutputs: LAB_AND_FIELD_IMPACT_OUTPUTS
    });

    expectGateZFieldImpactValues(fieldOnly);
    expectGateZFieldImpactValues(labAnchoredMixed);
    expect(fieldOnly.impact?.LPrimeNW).toBe(labAnchoredMixed.impact?.LPrimeNW);
    expect(fieldOnly.impact?.LPrimeNTw).toBe(labAnchoredMixed.impact?.LPrimeNTw);
    expect(fieldOnly.impact?.LnW).toBe(labAnchoredMixed.impact?.LnW);
    expect(fieldOnly.impact?.DeltaLw).toBe(labAnchoredMixed.impact?.DeltaLw);

    expect(fieldOnly.supportedTargetOutputs).toEqual(FIELD_IMPACT_OUTPUTS);
    expect(fieldOnly.unsupportedTargetOutputs).toEqual([]);
    expect(labAnchoredMixed.supportedTargetOutputs).toEqual([
      "Ln,w",
      "DeltaLw",
      "L'n,w",
      "L'nT,w"
    ]);
    expect(labAnchoredMixed.unsupportedTargetOutputs).toEqual(["L'nT,50"]);
  });

  it("continues to block L'nT,50 until a low-frequency impact owner exists", () => {
    const assessment = buildGateYFloorImpactFieldContextAssessment({
      airborneContext: COMPLETE_AIRBORNE_FIELD_CONTEXT,
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: COMPLETE_IMPACT_FIELD_CONTEXT,
      layers: HEAVY_FLOATING_FLOOR_STACK,
      scenarioId: "gate_y_complete_lab_anchor_and_field_context_ready_except_low_frequency",
      targetOutputs: FIELD_IMPACT_OUTPUTS_WITH_LOW_FREQUENCY
    });
    const result = calculateAssembly(HEAVY_FLOATING_FLOOR_STACK, {
      airborneContext: COMPLETE_AIRBORNE_FIELD_CONTEXT,
      calculator: "dynamic",
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: COMPLETE_IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_IMPACT_OUTPUTS_WITH_LOW_FREQUENCY
    });

    expect(assessment.readyOutputs).toEqual(FIELD_IMPACT_OUTPUTS);
    expect(assessment.blockedOutputs).toEqual(["L'nT,50"]);
    expect(assessment.missingOwnerInputs).toEqual(["lowFrequencyImpactSpectrumOrCI50_2500Owner"]);

    expectGateZFieldImpactValues(result);
    expect(result.impact?.LPrimeNT50).toBeUndefined();
    expect(result.impact?.availableOutputs).not.toContain("L'nT,50");
    expect(result.supportedTargetOutputs).toEqual(FIELD_IMPACT_OUTPUTS);
    expect(result.unsupportedTargetOutputs).toEqual(["L'nT,50"]);
    expect(result.warnings).toContain(
      "Some requested impact sound outputs are still unavailable for the current input/path: L'nT,50. DynEcho kept those outputs explicit instead of fabricating unsupported ratings."
    );
  });

  it("still asks for missing field context instead of fabricating field impact outputs", () => {
    const result = calculateAssembly(HEAVY_FLOATING_FLOOR_STACK, {
      airborneContext: COMPLETE_AIRBORNE_FIELD_CONTEXT,
      calculator: "dynamic",
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      targetOutputs: FIELD_IMPACT_OUTPUTS
    });

    expect(result.impact).toMatchObject({
      DeltaLw: 31.1,
      LnW: 50
    });
    expect(result.impact?.LPrimeNW).toBeUndefined();
    expect(result.impact?.LPrimeNTw).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(FIELD_IMPACT_OUTPUTS);
    expect(result.warnings.join("\n")).toContain("impactFieldContext");
    expect(result.warnings.join("\n")).toContain("L'n,w");
  });

  it("keeps docs and current-gate runner aligned with the landed Gate Z and next Gate AA plan", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const body = readRepoFile(path);

      expect(body, path).toContain(MODEL_FIRST_GATE_Z.landedGate);
      expect(body, path).toContain(MODEL_FIRST_GATE_Z.selectedNextAction);
      expect(body, path).toContain(MODEL_FIRST_GATE_Z.selectionStatus);
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-z-floor-impact-field-runtime-contract.test.ts"
    );
  });
});
