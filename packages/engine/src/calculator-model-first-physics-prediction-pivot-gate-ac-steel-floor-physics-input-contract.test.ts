import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactPredictorInput, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateImpactOnly } from "./calculate-impact-only";
import {
  buildGateACSteelFloorPhysicsInputContract,
  buildGateACSteelFloorPhysicsScenarioPack
} from "./steel-floor-impact-physics-input-contract";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_AC = {
  apiShapeChange: true,
  evidencePromotion: false,
  landedGate: "gate_ac_steel_floor_physics_input_contract_and_formula_readiness_plan",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  previousLandedGate: "gate_ab_construction_image_floor_family_source_guard_and_steel_impact_route_plan",
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_ad_steel_floor_impact_formula_numeric_corridor_plan",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ad-steel-floor-impact-formula-corridor-contract.test.ts",
  selectionStatus:
    "gate_ac_steel_floor_physics_input_contract_landed_selected_formula_corridor_gate_ad",
  sourceRowsRequiredForRuntimeSelection: false
} as const;

const REQUIRED_GATE_AC_SURFACES = [
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ac-steel-floor-physics-input-contract.test.ts",
  "packages/engine/src/steel-floor-impact-physics-input-contract.ts",
  "packages/shared/src/domain/impact-predictor-input.ts",
  "packages/shared/src/domain/input-completeness.ts",
  "packages/engine/src/index.ts",
  "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AC_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AC_HANDOFF.md"
] as const;

const IMPACT_TARGET_OUTPUTS = ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

const MODULAR_GENERIC_STEEL_FLOOR_IMAGE_STACK = [
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 10 },
  { floorRole: "floating_screed", materialId: "cement_board", thicknessMm: 18 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 4.5 },
  { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 200 },
  { floorRole: "ceiling_cavity", materialId: "air_gap", thicknessMm: 200 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const COMPLETE_OPEN_WEB_STEEL_INPUT = {
  baseSlab: {
    materialClass: "lightweight_steel_carrier",
    thicknessMm: 200
  },
  carrierSpacingMm: 600,
  floatingScreed: {
    densityKgM3: 1250,
    materialClass: "cement_board",
    thicknessMm: 18
  },
  floorCovering: {
    materialClass: "ceramic_tile",
    mode: "material_layer",
    thicknessMm: 10
  },
  impactSystemType: "combined_upper_lower_system",
  loadBasisKgM2: 64,
  lowerTreatment: {
    boardLayerCount: 1,
    boardMaterialClass: "gypsum_board",
    boardThicknessMm: 12.5,
    cavityDepthMm: 200,
    cavityFillThicknessMm: 100,
    supportClass: "furred_channels",
    type: "suspended_ceiling_elastic_hanger"
  },
  resilientLayer: {
    dynamicStiffnessMNm3: 35,
    thicknessMm: 4.5
  },
  structuralSupportType: "steel_joists",
  supportForm: "open_web_or_rolled"
} as const satisfies ImpactPredictorInput;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("calculator model-first physics prediction pivot Gate AC", () => {
  it("lands the steel-floor physics input/formula-readiness contract and selects Gate AD", () => {
    expect(MODEL_FIRST_GATE_AC).toEqual({
      apiShapeChange: true,
      evidencePromotion: false,
      landedGate: "gate_ac_steel_floor_physics_input_contract_and_formula_readiness_plan",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      previousLandedGate: "gate_ab_construction_image_floor_family_source_guard_and_steel_impact_route_plan",
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_ad_steel_floor_impact_formula_numeric_corridor_plan",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ad-steel-floor-impact-formula-corridor-contract.test.ts",
      selectionStatus:
        "gate_ac_steel_floor_physics_input_contract_landed_selected_formula_corridor_gate_ad",
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_AC_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("turns the Gate AB generic steel block into targeted physical input prompts", () => {
    const contract = buildGateACSteelFloorPhysicsInputContract({
      layers: MODULAR_GENERIC_STEEL_FLOOR_IMAGE_STACK,
      targetOutputs: IMPACT_TARGET_OUTPUTS
    });

    expect(contract.status).toBe("needs_input");
    expect(contract.missingPhysicalInputs).toEqual([
      "steelSupportForm",
      "steelCarrierSpacingMm",
      "resilientLayerDynamicStiffnessMNm3",
      "loadBasisKgM2",
      "lowerCeilingIsolationSupportForm"
    ]);
    expect(contract.requiredPhysicalInputs).toEqual([
      "steelSupportForm",
      "steelCarrierDepthMm",
      "steelCarrierSpacingMm",
      "resilientLayerDynamicStiffnessMNm3",
      "loadBasisKgM2",
      "lowerCeilingIsolationSupportForm"
    ]);
    expect(contract.sourceRowsRequiredForInputContract).toBe(false);
    expect(contract.sourceRowsRequiredForRuntimeSelection).toBe(false);
    expect(contract.runtimePromotionAllowedInGateAC).toBe(false);
    expect(contract.formulaCorridorReady).toBe(false);
    expect(contract.inputCompleteness).toMatchObject({
      id: "gate_ac_steel_floor_impact_route_inputs",
      routeFamily: "floating_floor_impact",
      status: "needs_input"
    });
    expect(contract.prompts.map((prompt) => prompt.fieldId)).toEqual(contract.missingPhysicalInputs);
  });

  it("marks complete steel predictor input as formula-corridor ready before Gate AD runtime promotion", () => {
    const contract = buildGateACSteelFloorPhysicsInputContract({
      impactPredictorInput: COMPLETE_OPEN_WEB_STEEL_INPUT,
      targetOutputs: IMPACT_TARGET_OUTPUTS
    });
    const runtime = calculateImpactOnly([], {
      impactPredictorInput: COMPLETE_OPEN_WEB_STEEL_INPUT,
      targetOutputs: ["Ln,w", "DeltaLw"] satisfies RequestedOutputId[]
    });

    expect(contract).toMatchObject({
      basisBoundaries: [
        "lab_element_impact_Ln_w_DeltaLw",
        "field_impact_Lprime_nw_Lprime_nT_w_requires_Gate_Z_context"
      ],
      formulaCorridorReady: true,
      missingFormulaOwners: [
        "steelFloorMassSpringTransferFunctionOwner",
        "steelCarrierGeometryCalibrationOwner",
        "lowerCeilingIsolationCalibrationOwner",
        "steelFloorSourceHoldoutSetOwner",
        "numericCorridorAcceptanceOwner"
      ],
      missingPhysicalInputs: [],
      runtimePromotionAllowedInGateAC: false,
      runtimeValueMovement: false,
      status: "ready_for_formula_corridor_gate"
    });
    expect(contract.formulaLanes).toContainEqual(
      expect.objectContaining({
        appliesToSupportForm: "open_web_or_rolled",
        laneId: "steel_open_web_mass_spring_delta_lnw",
        status: "ready_for_formula_corridor_gate"
      })
    );
    expect(contract.formulaLanes).toContainEqual(
      expect.objectContaining({
        appliesToSupportForm: "joist_or_purlin",
        laneId: "steel_joist_or_purlin_mass_spring_delta_lnw",
        status: "not_applicable"
      })
    );

    expect(runtime.impact?.basis).toBe("predictor_lightweight_steel_mass_spring_holdout_corridor_estimate");
    expect(runtime.impactPredictorStatus).toMatchObject({
      implementedFamilyEstimate: false,
      implementedFormulaEstimate: true,
      implementedLowConfidenceEstimate: false
    });
  });

  it("keeps exact source promotion separate from formula readiness", () => {
    const contract = buildGateACSteelFloorPhysicsInputContract({
      exactSourceRowAvailable: true,
      impactPredictorInput: {
        structuralSupportType: "steel_joists",
        supportForm: "joist_or_purlin"
      },
      targetOutputs: ["Ln,w"]
    });

    expect(contract.status).toBe("exact_source_can_promote_without_formula");
    expect(contract.sourceRowsRequiredForInputContract).toBe(false);
    expect(contract.sourceRowsRequiredForRuntimeSelection).toBe(false);
    expect(contract.precedenceOrder).toEqual([
      "exact_full_stack_measured_source",
      "calibrated_same_family_physics",
      "uncalibrated_family_physics",
      "bound_or_screening_support",
      "needs_input"
    ]);
    expect(contract.formulaCorridorReady).toBe(false);
  });

  it("ships a scenario pack with paired positives and nearby negatives", () => {
    const scenarioPack = buildGateACSteelFloorPhysicsScenarioPack();

    expect(scenarioPack.map((scenario) => scenario.id)).toEqual([
      "gate_ac_generic_construction_image_steel_floor_needs_physical_inputs",
      "gate_ac_complete_open_web_steel_floor_formula_corridor_ready",
      "gate_ac_missing_carrier_spacing_nearby_negative",
      "gate_ac_missing_lower_isolation_nearby_negative",
      "gate_ac_exact_source_can_promote_without_formula"
    ]);
    expect(scenarioPack.map((scenario) => scenario.contract.status)).toEqual([
      "needs_input",
      "ready_for_formula_corridor_gate",
      "needs_input",
      "needs_input",
      "exact_source_can_promote_without_formula"
    ]);
    for (const scenario of scenarioPack) {
      expect(scenario.contract.runtimeValueMovement, scenario.id).toBe(false);
      expect(scenario.contract.sourceRowsRequiredForInputContract, scenario.id).toBe(false);
    }
  });

  it("keeps docs and current-gate runner aligned with Gate AC closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain("gate_ac_steel_floor_physics_input_contract_and_formula_readiness_plan");
      expect(text, path).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ad-steel-floor-impact-formula-corridor-contract.test.ts"
      );
      expect(text, path).toContain("gate_ad_steel_floor_impact_formula_numeric_corridor_plan");
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-ac-steel-floor-physics-input-contract.test.ts"
    );
  });
});
