import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildGateVFloorImpactDynamicStiffnessContract,
  buildGateVFloorImpactDynamicStiffnessScenarioPack
} from "./dynamic-calculator-floor-impact-dynamic-stiffness-contract";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_V = {
  apiShapeChange: true,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate:
    "gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_w_promote_floor_impact_dynamic_stiffness_runtime_for_dynamic_calculator",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts",
  selectionStatus:
    "gate_v_floor_impact_dynamic_stiffness_contract_landed_no_runtime_selected_floor_impact_runtime_gate_w",
  workbenchInputBehaviorChange: true
} as const;

const REQUIRED_GATE_V_SURFACES = [
  "packages/engine/src/dynamic-calculator-floor-impact-dynamic-stiffness-contract.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-v-floor-impact-dynamic-stiffness-contract.test.ts",
  "packages/engine/src/dynamic-calculator-route-input-topology.ts",
  "packages/engine/src/dynamic-calculator-topology-normalizer.ts",
  "packages/shared/src/domain/input-completeness.ts",
  "packages/engine/src/index.ts",
  "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_V_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_V_HANDOFF.md"
] as const;

const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];

const HEAVY_FLOATING_FLOOR_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
] as const satisfies readonly LayerInput[];

const COMPLETE_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2700,
  panelWidthMm: 5000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 55
};

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("calculator model-first physics prediction pivot Gate V", () => {
  it("lands floor-impact dynamic-stiffness input and adapter ownership without runtime movement", () => {
    expect(MODEL_FIRST_GATE_V).toEqual({
      apiShapeChange: true,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate:
        "gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_w_promote_floor_impact_dynamic_stiffness_runtime_for_dynamic_calculator",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts",
      selectionStatus:
        "gate_v_floor_impact_dynamic_stiffness_contract_landed_no_runtime_selected_floor_impact_runtime_gate_w",
      workbenchInputBehaviorChange: true
    });

    for (const path of REQUIRED_GATE_V_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ships a scenario pack that treats source rows as optional anchors, not the whole calculator", () => {
    const scenarioPack = buildGateVFloorImpactDynamicStiffnessScenarioPack();

    expect(scenarioPack.map((entry) => entry.id)).toEqual([
      "gate_v_complete_heavy_floating_floor_dynamic_stiffness_ready",
      "gate_v_missing_dynamic_stiffness_needs_input",
      "gate_v_missing_load_basis_needs_input",
      "gate_v_field_impact_without_room_context_needs_input",
      "gate_v_iic_aiic_rating_adapter_stays_unsupported",
      "gate_v_manual_dynamic_stiffness_can_fill_missing_catalog_property",
      "gate_v_role_defined_floor_reorder_stays_stable"
    ]);

    for (const entry of scenarioPack) {
      expect(entry.contract.status, entry.id).toBe(entry.expectedStatus);
      expect(entry.contract.missingPhysicalInputs, entry.id).toEqual(entry.expectedMissingPhysicalInputs);
      expect(entry.contract.sourceRowsRequiredForInputContract).toBe(false);
      expect(entry.contract.sourceRowsRequiredForRuntimeSelection).toBe(false);
      expect(entry.contract.runtimePromotionAllowed).toBe(false);
      expect(entry.contract.runtimeValueMovement).toBe(false);
    }
  });

  it("uses dynamic stiffness and load basis as physical inputs with targeted nearby negatives", () => {
    const byId = new Map(
      buildGateVFloorImpactDynamicStiffnessScenarioPack().map((entry) => [entry.id, entry.contract])
    );
    const complete = byId.get("gate_v_complete_heavy_floating_floor_dynamic_stiffness_ready");
    const missingDynamic = byId.get("gate_v_missing_dynamic_stiffness_needs_input");
    const missingLoad = byId.get("gate_v_missing_load_basis_needs_input");
    const manualDynamic = byId.get("gate_v_manual_dynamic_stiffness_can_fill_missing_catalog_property");

    expect(complete).toMatchObject({
      requiredBeforeRuntimePromotion: [
        "baseSlabOrFloor",
        "toppingOrFloatingLayer",
        "resilientLayerDynamicStiffnessMNm3",
        "loadBasisKgM2"
      ],
      status: "ready_for_runtime_gate"
    });
    expect(complete?.routeInputAssessment.routeFamilies).toEqual(["floating_floor_impact"]);
    expect(complete?.routeInputAssessment.sourceAbsenceBlocksOnlyExactOrCalibration).toBe(true);

    expect(missingDynamic?.missingPhysicalInputs).toEqual([
      "resilientLayerDynamicStiffnessMNm3"
    ]);
    expect(missingDynamic?.routeInputAssessment.prompts).toContainEqual(
      expect.objectContaining({
        fieldId: "resilientLayerDynamicStiffnessMNm3",
        source: "material_property"
      })
    );

    expect(missingLoad?.missingPhysicalInputs).toEqual(["loadBasisKgM2"]);
    expect(missingLoad?.routeInputAssessment.prompts).toContainEqual(
      expect.objectContaining({
        fieldId: "loadBasisKgM2",
        source: "floor_role"
      })
    );

    expect(manualDynamic).toMatchObject({
      missingPhysicalInputs: [],
      status: "ready_for_runtime_gate"
    });
  });

  it("keeps ISO 717-2 lab impact, field impact, and ASTM E989 rating adapters separate", () => {
    const lab = buildGateVFloorImpactDynamicStiffnessContract({
      floorImpactContext: { loadBasisKgM2: 100 },
      layers: HEAVY_FLOATING_FLOOR_STACK,
      targetOutputs: IMPACT_OUTPUTS
    });
    const fieldMissing = buildGateVFloorImpactDynamicStiffnessContract({
      airborneContext: { contextMode: "element_lab" },
      floorImpactContext: { loadBasisKgM2: 100 },
      layers: HEAVY_FLOATING_FLOOR_STACK,
      targetOutputs: ["L'n,w", "L'nT,w"]
    });
    const fieldReady = buildGateVFloorImpactDynamicStiffnessContract({
      airborneContext: COMPLETE_FIELD_CONTEXT,
      floorImpactContext: { loadBasisKgM2: 100 },
      layers: HEAVY_FLOATING_FLOOR_STACK,
      targetOutputs: ["L'n,w", "L'nT,w"]
    });
    const astm = buildGateVFloorImpactDynamicStiffnessContract({
      floorImpactContext: { loadBasisKgM2: 100 },
      layers: HEAVY_FLOATING_FLOOR_STACK,
      targetOutputs: ["Ln,w", "IIC", "AIIC"]
    });

    expect(lab.adapterBoundaries).toContainEqual(
      expect.objectContaining({
        adapterId: "ISO_717_2_Lnw_DeltaLw",
        requestedOutputs: ["Ln,w", "DeltaLw"],
        status: "ready"
      })
    );
    expect(fieldMissing.adapterBoundaries).toContainEqual(
      expect.objectContaining({
        adapterId: "field_impact_context",
        missingPhysicalInputs: [
          "contextMode",
          "partitionAreaM2",
          "receivingRoomVolumeM3",
          "receivingRoomRt60S"
        ],
        requestedOutputs: ["L'n,w", "L'nT,w"],
        status: "needs_input"
      })
    );
    expect(fieldReady.status).toBe("ready_for_runtime_gate");
    expect(fieldReady.adapterBoundaries).toContainEqual(
      expect.objectContaining({
        adapterId: "field_impact_context",
        missingPhysicalInputs: [],
        status: "ready"
      })
    );
    expect(astm).toMatchObject({
      fieldOutputAliasBlocked: true,
      status: "partial_ready_unsupported_adapter",
      unsupportedOutputs: ["IIC", "AIIC"]
    });
    expect(astm.adapterBoundaries).toContainEqual(
      expect.objectContaining({
        adapterId: "ASTM_E989_IIC_AIIC",
        requestedOutputs: ["IIC", "AIIC"],
        status: "unsupported",
        unsupportedOutputs: ["IIC", "AIIC"]
      })
    );
  });

  it("keeps role-defined floor edits stable and current runtime values pinned", () => {
    const reordered = buildGateVFloorImpactDynamicStiffnessContract({
      floorImpactContext: { loadBasisKgM2: 100 },
      layers: [
        HEAVY_FLOATING_FLOOR_STACK[3],
        HEAVY_FLOATING_FLOOR_STACK[1],
        HEAVY_FLOATING_FLOOR_STACK[0],
        HEAVY_FLOATING_FLOOR_STACK[2]
      ],
      previousLayers: HEAVY_FLOATING_FLOOR_STACK,
      targetOutputs: IMPACT_OUTPUTS
    });
    const runtime = calculateAssembly(HEAVY_FLOATING_FLOOR_STACK, {
      impactPredictorInput: {
        baseSlab: {
          densityKgM3: 2400,
          materialClass: "heavy_concrete",
          thicknessMm: 150
        },
        floatingScreed: {
          densityKgM3: 2000,
          materialClass: "generic_screed",
          thicknessMm: 30
        },
        floorCovering: {
          densityKgM3: 2000,
          materialClass: "ceramic_tile",
          mode: "material_layer",
          thicknessMm: 8
        },
        impactSystemType: "heavy_floating_floor",
        resilientLayer: {
          dynamicStiffnessMNm3: 30,
          thicknessMm: 8
        },
        structuralSupportType: "reinforced_concrete"
      },
      targetOutputs: IMPACT_OUTPUTS
    });

    expect(reordered.normalizedTopology.safeReorderApplied).toBe(true);
    expect(reordered.normalizedTopology.normalizedLayers.map((layer) => layer.floorRole)).toEqual([
      "base_structure",
      "resilient_layer",
      "floating_screed",
      "floor_covering"
    ]);
    expect(reordered.status).toBe("ready_for_runtime_gate");
    expect(reordered.runtimeValueMovement).toBe(false);

    expect(runtime.impact).toMatchObject({
      DeltaLw: 24.3,
      LnW: 50.3,
      basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate"
    });
    expect(runtime.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
  });

  it("keeps docs and current-gate runner aligned with Gate V closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        "gate_v_floor_impact_dynamic_stiffness_contract_landed_no_runtime_selected_floor_impact_runtime_gate_w"
      );
      expect(text, path).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts"
      );
      expect(text, path).toContain(
        "gate_w_promote_floor_impact_dynamic_stiffness_runtime_for_dynamic_calculator"
      );
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-v-floor-impact-dynamic-stiffness-contract.test.ts"
    );
  });
});
