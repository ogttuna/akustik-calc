import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildGateVFloorImpactDynamicStiffnessContract } from "./dynamic-calculator-floor-impact-dynamic-stiffness-contract";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_W = {
  evidencePromotion: false,
  landedGate: "gate_w_promote_floor_impact_dynamic_stiffness_runtime_for_dynamic_calculator",
  numericRuntimeBehaviorChange: true,
  outputCardStatusChange: true,
  outputSupportChange: true,
  previousLandedGate:
    "gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator",
  proposalReportCopyChange: true,
  routeCardValueChange: true,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_x_select_next_dynamic_calculator_solver_or_field_context_boundary",
  selectionStatus:
    "gate_w_floor_impact_runtime_landed_selected_next_dynamic_calculator_solver_or_field_context_gate_x",
  sourceRowsRequiredForRuntimeSelection: false
} as const;

const REQUIRED_GATE_W_SURFACES = [
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/engine/src/impact-estimate.ts",
  "packages/engine/src/impact-lane.ts",
  "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
  "packages/shared/src/domain/impact-predictor-input.ts",
  "packages/shared/src/api/estimate.ts",
  "apps/web/app/api/estimate/route.ts",
  "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_W_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_W_HANDOFF.md"
] as const;

const LAB_IMPACT_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FIELD_IMPACT_OUTPUTS = ["L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];
const ASTM_IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const HEAVY_FLOATING_FLOOR_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
] as const satisfies readonly LayerInput[];

const MISSING_DYNAMIC_STIFFNESS_UNDERLAY_ID = "gate_w_resilient_underlay_missing_dynamic";

const HEAVY_FLOATING_FLOOR_STACK_MISSING_DYNAMIC = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: MISSING_DYNAMIC_STIFFNESS_UNDERLAY_ID, thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
] as const satisfies readonly LayerInput[];

const COMPLETE_FLOOR_IMPACT_CONTEXT = {
  loadBasisKgM2: 76,
  resilientLayerDynamicStiffnessMNm3: 30
} as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function catalogWithMissingGenericUnderlayDynamicStiffness(): readonly MaterialDefinition[] {
  const catalog = getDefaultMaterialCatalog();
  const base = catalog.find((material) => material.id === "generic_resilient_underlay_s30");

  if (!base) {
    throw new Error("Gate W test requires the generic resilient underlay material.");
  }

  return [
    ...catalog,
    {
      ...base,
      id: MISSING_DYNAMIC_STIFFNESS_UNDERLAY_ID,
      impact: {},
      name: "Gate W resilient underlay without dynamic stiffness"
    }
  ];
}

describe("calculator model-first physics prediction pivot Gate W", () => {
  it("lands Dynamic Calculator floor-impact runtime promotion with the Gate V boundary still in charge", () => {
    expect(MODEL_FIRST_GATE_W).toEqual({
      evidencePromotion: false,
      landedGate: "gate_w_promote_floor_impact_dynamic_stiffness_runtime_for_dynamic_calculator",
      numericRuntimeBehaviorChange: true,
      outputCardStatusChange: true,
      outputSupportChange: true,
      previousLandedGate:
        "gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator",
      proposalReportCopyChange: true,
      routeCardValueChange: true,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_x_select_next_dynamic_calculator_solver_or_field_context_boundary",
      selectionStatus:
        "gate_w_floor_impact_runtime_landed_selected_next_dynamic_calculator_solver_or_field_context_gate_x",
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_W_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes only the complete ISO 717-2 lab Ln,w / DeltaLw lane for Dynamic Calculator", () => {
    const contract = buildGateVFloorImpactDynamicStiffnessContract({
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      layers: HEAVY_FLOATING_FLOOR_STACK,
      targetOutputs: LAB_IMPACT_OUTPUTS
    });
    const result = calculateAssembly(HEAVY_FLOATING_FLOOR_STACK, {
      calculator: "dynamic",
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      targetOutputs: LAB_IMPACT_OUTPUTS
    });

    expect(contract.status).toBe("ready_for_runtime_gate");
    expect(contract.adapterBoundaries).toContainEqual(
      expect.objectContaining({
        adapterId: "ISO_717_2_Lnw_DeltaLw",
        missingPhysicalInputs: [],
        requestedOutputs: ["Ln,w", "DeltaLw"],
        status: "ready"
      })
    );

    expect(result.impact).toMatchObject({
      DeltaLw: 24.3,
      LnW: 50.3,
      availableOutputs: ["Ln,w", "DeltaLw"],
      basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      floatingLoadSurfaceMassKgM2: 76,
      resilientDynamicStiffnessMNm3: 30
    });
    expect(result.impact?.metricBasis).toEqual({
      DeltaLw: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      LnW: "predictor_heavy_floating_floor_iso12354_annexc_estimate"
    });
    expect(result.impact?.confidence).toMatchObject({
      level: "medium",
      provenance: "formula_estimate_narrow_scope",
      score: 0.74
    });
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.impactSupport).toMatchObject({
      basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate"
    });
    expect(result.dynamicImpactTrace).toMatchObject({
      availableMetricLabels: ["Ln,w", "DeltaLw"],
      evidenceTier: "estimate",
      impactBasis: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      predictorInputMode: "derived_from_visible_layers",
      selectedLabel: "Heavy floating-floor formula",
      selectionKind: "formula_estimate"
    });
    expect(result.airborneBasis?.missingPhysicalInputs).toEqual([]);
  });

  it("keeps missing load and missing dynamic stiffness as needs_input, not source-catalog work", () => {
    const missingLoad = calculateAssembly(HEAVY_FLOATING_FLOOR_STACK, {
      calculator: "dynamic",
      targetOutputs: LAB_IMPACT_OUTPUTS
    });
    const missingDynamic = calculateAssembly(HEAVY_FLOATING_FLOOR_STACK_MISSING_DYNAMIC, {
      calculator: "dynamic",
      catalog: catalogWithMissingGenericUnderlayDynamicStiffness(),
      floorImpactContext: {
        loadBasisKgM2: 76
      },
      targetOutputs: LAB_IMPACT_OUTPUTS
    });

    expect(missingLoad.impact).toBeNull();
    expect(missingLoad.supportedTargetOutputs).toEqual([]);
    expect(missingLoad.unsupportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(missingLoad.airborneCandidateResolution?.selectedOrigin).toBe("needs_input");
    expect(missingLoad.airborneBasis?.missingPhysicalInputs).toEqual(["loadBasisKgM2"]);
    expect(missingLoad.warnings).toContain(
      "Dynamic Calculator floor-impact runtime is waiting for loadBasisKgM2 before promoting Ln,w / DeltaLw from the physics lane."
    );

    expect(missingDynamic.impact).toBeNull();
    expect(missingDynamic.supportedTargetOutputs).toEqual([]);
    expect(missingDynamic.unsupportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(missingDynamic.airborneCandidateResolution?.selectedOrigin).toBe("needs_input");
    expect(missingDynamic.airborneBasis?.missingPhysicalInputs).toEqual([
      "resilientLayerDynamicStiffnessMNm3"
    ]);
    expect(missingDynamic.warnings).toContain(
      "Dynamic Calculator floor-impact runtime is waiting for resilientLayerDynamicStiffnessMNm3 before promoting Ln,w / DeltaLw from the physics lane."
    );
  });

  it("lets manual dynamic stiffness fill a missing catalog property and keeps safe reorders stable", () => {
    const missingCatalog = catalogWithMissingGenericUnderlayDynamicStiffness();
    const direct = calculateAssembly(HEAVY_FLOATING_FLOOR_STACK_MISSING_DYNAMIC, {
      calculator: "dynamic",
      catalog: missingCatalog,
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      targetOutputs: LAB_IMPACT_OUTPUTS
    });
    const reordered = calculateAssembly(
      [
        HEAVY_FLOATING_FLOOR_STACK_MISSING_DYNAMIC[3],
        HEAVY_FLOATING_FLOOR_STACK_MISSING_DYNAMIC[1],
        HEAVY_FLOATING_FLOOR_STACK_MISSING_DYNAMIC[0],
        HEAVY_FLOATING_FLOOR_STACK_MISSING_DYNAMIC[2]
      ],
      {
        calculator: "dynamic",
        catalog: missingCatalog,
        floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
        targetOutputs: LAB_IMPACT_OUTPUTS
      }
    );

    expect(direct.impact).toMatchObject({
      DeltaLw: 24.3,
      LnW: 50.3,
      basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate"
    });
    expect(reordered.impact).toMatchObject({
      DeltaLw: direct.impact?.DeltaLw,
      LnW: direct.impact?.LnW,
      basis: direct.impact?.basis
    });
    expect(reordered.supportedTargetOutputs).toEqual(direct.supportedTargetOutputs);
  });

  it("keeps field impact and ASTM ratings out of the lab runtime lane", () => {
    const fieldMissingContext = calculateAssembly(HEAVY_FLOATING_FLOOR_STACK, {
      calculator: "dynamic",
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      targetOutputs: FIELD_IMPACT_OUTPUTS
    });
    const astmOnly = calculateAssembly(HEAVY_FLOATING_FLOOR_STACK, {
      calculator: "dynamic",
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      targetOutputs: ASTM_IMPACT_OUTPUTS
    });
    const labWithAstm = calculateAssembly(HEAVY_FLOATING_FLOOR_STACK, {
      calculator: "dynamic",
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      targetOutputs: ["Ln,w", "IIC", "AIIC"]
    });

    expect(fieldMissingContext.impact).toMatchObject({
      DeltaLw: 31.1,
      LnW: 50
    });
    expect(fieldMissingContext.impact?.LPrimeNW).toBeUndefined();
    expect(fieldMissingContext.impact?.LPrimeNTw).toBeUndefined();
    expect(fieldMissingContext.supportedTargetOutputs).toEqual([]);
    expect(fieldMissingContext.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w"]);
    expect(fieldMissingContext.airborneBasis?.missingPhysicalInputs).toEqual([
      "contextMode",
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S"
    ]);

    expect(astmOnly.impact).toBeNull();
    expect(astmOnly.supportedTargetOutputs).toEqual([]);
    expect(astmOnly.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(astmOnly.airborneCandidateResolution?.selectedOrigin).toBe("unsupported");

    expect(labWithAstm.impact).toMatchObject({
      LnW: 50.3,
      basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate"
    });
    expect(labWithAstm.supportedTargetOutputs).toEqual(["Ln,w"]);
    expect(labWithAstm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
  });

  it("keeps docs and current-gate runner aligned with Gate W closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        "gate_w_floor_impact_runtime_landed_selected_next_dynamic_calculator_solver_or_field_context_gate_x"
      );
      expect(text, path).toContain(
        "gate_x_select_next_dynamic_calculator_solver_or_field_context_boundary"
      );
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts"
    );
  });
});
