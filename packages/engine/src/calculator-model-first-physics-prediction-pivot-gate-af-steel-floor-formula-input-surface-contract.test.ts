import type {
  ImpactPredictorInput,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateImpactOnly } from "./calculate-impact-only";
import {
  buildGateAFSteelFloorFormulaInputSurfaceContract,
  buildSteelFloorFormulaPredictorInputFromSurface,
  hasSteelFloorFormulaInputSurfaceRoute,
  STEEL_FLOOR_FORMULA_INPUT_SURFACE_FIELDS
} from "./steel-floor-formula-input-surface";
import { STEEL_FLOOR_FORMULA_BASIS } from "./steel-floor-impact-formula-corridor";

const TARGET_OUTPUTS = ["Rw", "Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];

const MODULAR_STEEL_FLOOR_ROWS = [
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 10 },
  { floorRole: "floating_screed", materialId: "cement_board", thicknessMm: 18 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 4.5 },
  { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 200 },
  { floorRole: "ceiling_cavity", materialId: "air_gap", thicknessMm: 200 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const COMPLETE_OPEN_WEB_SURFACE = {
  loadBasisKgM2: 64,
  lowerCeilingIsolationSupportForm: "elastic_furred_channels",
  resilientLayerDynamicStiffnessMNm3: 35,
  steelCarrierDepthMm: 200,
  steelCarrierSpacingMm: 600,
  steelSupportForm: "open_web_or_rolled"
} as const;

function stripSurfaceRuntimeFields(input: ImpactPredictorInput | null) {
  return {
    baseDepth: input?.baseSlab?.thicknessMm,
    carrierSpacing: input?.carrierSpacingMm,
    dynamicStiffness: input?.resilientLayer?.dynamicStiffnessMNm3,
    impactSystemType: input?.impactSystemType,
    loadBasis: input?.loadBasisKgM2,
    lowerSupport: input?.lowerTreatment?.supportClass,
    lowerType: input?.lowerTreatment?.type,
    steelSupport: input?.supportForm,
    structuralSupport: input?.structuralSupportType
  };
}

describe("calculator model-first physics prediction pivot Gate AF", () => {
  it("lands the steel-floor formula input surface and selects Gate AG acceptance revalidation", () => {
    const contract = buildGateAFSteelFloorFormulaInputSurfaceContract({
      layers: MODULAR_STEEL_FLOOR_ROWS,
      surface: COMPLETE_OPEN_WEB_SURFACE,
      targetOutputs: TARGET_OUTPUTS
    });

    expect(contract).toMatchObject({
      exactMeasuredRowsRemainPrecedence: true,
      formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
      landedGate: "gate_af_steel_floor_formula_input_surface_plan",
      previousLandedGate: "gate_ae_steel_floor_formula_card_and_report_parity_plan",
      runtimeValueMovement: true,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_ag_steel_floor_formula_input_surface_acceptance_revalidation_plan",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ag-steel-floor-formula-input-surface-acceptance-contract.test.ts",
      selectionStatus:
        "gate_af_steel_floor_formula_input_surface_landed_selected_acceptance_revalidation_gate_ag",
      sourceRowsRequiredForRuntimeSelection: false,
      status: "ready_for_formula_corridor"
    });
    expect(contract.requiredPhysicalInputs).toEqual([...STEEL_FLOOR_FORMULA_INPUT_SURFACE_FIELDS]);
    expect(contract.runtimeFormulaImpact).toMatchObject({
      basis: STEEL_FLOOR_FORMULA_BASIS,
      DeltaLw: 22.4,
      LnW: 55.6,
      labOrField: "lab"
    });
  });

  it("turns construction-image steel rows plus UI fields into the same predictor input the formula corridor expects", () => {
    const surface = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: MODULAR_STEEL_FLOOR_ROWS,
      surface: COMPLETE_OPEN_WEB_SURFACE,
      targetOutputs: TARGET_OUTPUTS
    });

    expect(surface).toMatchObject({
      formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
      formulaTargetOutputRequested: true,
      missingPhysicalInputs: [],
      status: "ready_for_formula_corridor",
      steelFloorStackDetected: true
    });
    expect(stripSurfaceRuntimeFields(surface.impactPredictorInput)).toEqual({
      baseDepth: 200,
      carrierSpacing: 600,
      dynamicStiffness: 35,
      impactSystemType: "combined_upper_lower_system",
      loadBasis: 64,
      lowerSupport: "furred_channels",
      lowerType: "suspended_ceiling_elastic_hanger",
      steelSupport: "open_web_or_rolled",
      structuralSupport: "steel_joists"
    });

    const runtime = calculateImpactOnly(MODULAR_STEEL_FLOOR_ROWS, {
      impactPredictorInput: surface.impactPredictorInput,
      targetOutputs: TARGET_OUTPUTS
    });

    expect(runtime.impact).toMatchObject({
      basis: STEEL_FLOOR_FORMULA_BASIS,
      DeltaLw: 22.4,
      LnW: 55.6,
      labOrField: "lab"
    });
  });

  it("blocks partial UI surfaces before they can blend into a fake steel formula answer", () => {
    const surface = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: MODULAR_STEEL_FLOOR_ROWS,
      surface: {
        ...COMPLETE_OPEN_WEB_SURFACE,
        steelCarrierSpacingMm: undefined
      },
      targetOutputs: TARGET_OUTPUTS
    });

    expect(surface.status).toBe("needs_input");
    expect(surface.missingPhysicalInputs).toEqual(["steelCarrierSpacingMm"]);
    expect(calculateImpactOnly(MODULAR_STEEL_FLOOR_ROWS, {
      impactPredictorInput: surface.impactPredictorInput,
      targetOutputs: TARGET_OUTPUTS
    }).impact?.basis).not.toBe(STEEL_FLOOR_FORMULA_BASIS);
  });

  it("keeps safe floor-row reorder stable and refuses unsafe duplicate steel carriers", () => {
    const safelyReorderedRows = [
      MODULAR_STEEL_FLOOR_ROWS[2],
      MODULAR_STEEL_FLOOR_ROWS[0],
      MODULAR_STEEL_FLOOR_ROWS[1],
      MODULAR_STEEL_FLOOR_ROWS[3],
      MODULAR_STEEL_FLOOR_ROWS[5],
      MODULAR_STEEL_FLOOR_ROWS[4],
      MODULAR_STEEL_FLOOR_ROWS[6]
    ] as const satisfies readonly LayerInput[];
    const unsafeDuplicateBaseRows = [
      ...MODULAR_STEEL_FLOOR_ROWS,
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 200 }
    ] as const satisfies readonly LayerInput[];

    const canonical = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: MODULAR_STEEL_FLOOR_ROWS,
      surface: COMPLETE_OPEN_WEB_SURFACE,
      targetOutputs: TARGET_OUTPUTS
    });
    const reordered = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: safelyReorderedRows,
      surface: COMPLETE_OPEN_WEB_SURFACE,
      targetOutputs: TARGET_OUTPUTS
    });
    const unsafe = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: unsafeDuplicateBaseRows,
      surface: COMPLETE_OPEN_WEB_SURFACE,
      targetOutputs: TARGET_OUTPUTS
    });

    expect(reordered.status).toBe("ready_for_formula_corridor");
    expect(stripSurfaceRuntimeFields(reordered.impactPredictorInput)).toEqual(
      stripSurfaceRuntimeFields(canonical.impactPredictorInput)
    );
    expect(unsafe.status).toBe("unsafe_topology");
    expect(unsafe.impactPredictorInput).toBeNull();
  });

  it("keeps exact measured rows above formula even when the UI surface is complete", () => {
    expect(hasSteelFloorFormulaInputSurfaceRoute({
      layers: MODULAR_STEEL_FLOOR_ROWS,
      targetOutputs: TARGET_OUTPUTS
    })).toBe(true);

    expect(buildGateAFSteelFloorFormulaInputSurfaceContract({
      exactSourceRowAvailable: true,
      layers: MODULAR_STEEL_FLOOR_ROWS,
      surface: COMPLETE_OPEN_WEB_SURFACE,
      targetOutputs: TARGET_OUTPUTS
    })).toMatchObject({
      exactMeasuredRowsRemainPrecedence: true,
      runtimeFormulaImpact: null,
      status: "exact_source_precedence"
    });
  });
});
