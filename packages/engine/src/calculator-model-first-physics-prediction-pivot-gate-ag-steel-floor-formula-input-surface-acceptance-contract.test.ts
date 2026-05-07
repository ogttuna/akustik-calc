import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildGateAFSteelFloorFormulaInputSurfaceContract,
  buildSteelFloorFormulaPredictorInputFromSurface
} from "./steel-floor-formula-input-surface";
import { STEEL_FLOOR_FORMULA_BASIS } from "./steel-floor-impact-formula-corridor";

const LAB_TARGET_OUTPUTS = ["Rw", "Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FIELD_TARGET_OUTPUTS = ["L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

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

function buildGateAGAcceptanceContract() {
  const surface = buildSteelFloorFormulaPredictorInputFromSurface({
    layers: MODULAR_STEEL_FLOOR_ROWS,
    surface: COMPLETE_OPEN_WEB_SURFACE,
    targetOutputs: LAB_TARGET_OUTPUTS
  });
  const runtime = calculateAssembly(MODULAR_STEEL_FLOOR_ROWS, {
    impactPredictorInput: surface.impactPredictorInput,
    targetOutputs: LAB_TARGET_OUTPUTS
  });

  return {
    acceptedSurfaces: [
      "live_workbench_state",
      "local_saved_replay",
      "server_snapshot_replay",
      "output_cards",
      "report_payload",
      "calculator_api_payload",
      "hostile_ui_edits"
    ],
    formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
    landedGate: "gate_ag_steel_floor_formula_input_surface_acceptance_revalidation_plan",
    previousLandedGate: "gate_af_steel_floor_formula_input_surface_plan",
    runtimeFormulaImpact: runtime.impact,
    runtimeValueMovement: false,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: "gate_ah_steel_floor_formula_accuracy_benchmark_expansion_plan",
    selectedNextFile:
      "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ah-steel-floor-formula-accuracy-benchmark-contract.test.ts",
    selectionStatus:
      "gate_ag_steel_floor_formula_input_surface_acceptance_landed_selected_accuracy_benchmark_gate_ah",
    status: surface.status
  };
}

describe("calculator model-first physics prediction pivot Gate AG", () => {
  it("lands steel-floor input-surface acceptance and selects Gate AH accuracy benchmark expansion", () => {
    expect(buildGateAGAcceptanceContract()).toMatchObject({
      acceptedSurfaces: [
        "live_workbench_state",
        "local_saved_replay",
        "server_snapshot_replay",
        "output_cards",
        "report_payload",
        "calculator_api_payload",
        "hostile_ui_edits"
      ],
      formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
      landedGate: "gate_ag_steel_floor_formula_input_surface_acceptance_revalidation_plan",
      previousLandedGate: "gate_af_steel_floor_formula_input_surface_plan",
      runtimeFormulaImpact: {
        basis: STEEL_FLOOR_FORMULA_BASIS,
        DeltaLw: 22.4,
        LnW: 55.6,
        labOrField: "lab"
      },
      runtimeValueMovement: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_ah_steel_floor_formula_accuracy_benchmark_expansion_plan",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ah-steel-floor-formula-accuracy-benchmark-contract.test.ts",
      selectionStatus:
        "gate_ag_steel_floor_formula_input_surface_acceptance_landed_selected_accuracy_benchmark_gate_ah",
      status: "ready_for_formula_corridor"
    });
  });

  it("keeps field impact outputs unsupported instead of promoting the lab formula basis", () => {
    const surface = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: MODULAR_STEEL_FLOOR_ROWS,
      surface: COMPLETE_OPEN_WEB_SURFACE,
      targetOutputs: FIELD_TARGET_OUTPUTS
    });
    const runtime = calculateAssembly(MODULAR_STEEL_FLOOR_ROWS, {
      impactPredictorInput: surface.impactPredictorInput,
      targetOutputs: FIELD_TARGET_OUTPUTS
    });

    expect(runtime.impact).toMatchObject({
      basis: STEEL_FLOOR_FORMULA_BASIS,
      labOrField: "lab"
    });
    expect(runtime.unsupportedTargetOutputs).toEqual(expect.arrayContaining([...FIELD_TARGET_OUTPUTS]));
    expect(runtime.impact?.LPrimeNW).toBeUndefined();
    expect(runtime.impact?.LPrimeNTw).toBeUndefined();
  });

  it("keeps exact measured source precedence visible after acceptance coverage lands", () => {
    expect(buildGateAFSteelFloorFormulaInputSurfaceContract({
      exactSourceRowAvailable: true,
      layers: MODULAR_STEEL_FLOOR_ROWS,
      surface: COMPLETE_OPEN_WEB_SURFACE,
      targetOutputs: LAB_TARGET_OUTPUTS
    })).toMatchObject({
      exactMeasuredRowsRemainPrecedence: true,
      runtimeFormulaImpact: null,
      status: "exact_source_precedence"
    });
  });
});
