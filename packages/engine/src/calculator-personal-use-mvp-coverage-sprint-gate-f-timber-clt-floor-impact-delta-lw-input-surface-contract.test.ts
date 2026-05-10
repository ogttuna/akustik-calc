import type { ImpactErrorBudget, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildGateFTimberCltDeltaLwInputSurfaceContract,
  buildTimberCltDeltaLwPredictorInputFromSurface
} from "./timber-clt-delta-lw-input-surface";
import {
  GATE_B_CLT_LAYERS,
  GATE_B_TIMBER_JOIST_LAYERS
} from "./timber-clt-floor-impact-delta-lw-input-contract";
import {
  MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS,
  TIMBER_JOIST_DELTA_LW_FORMULA_BASIS
} from "./timber-clt-floor-impact-delta-lw-runtime-corridor";

const LAB_TARGET_OUTPUTS = ["Rw", "Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FIELD_TARGET_OUTPUTS = ["L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

const COMPLETE_TIMBER_SURFACE = {
  impactSystemType: "combined_upper_lower_system",
  loadBasisKgM2: 72,
  lowerAssemblyType: "suspended_ceiling_elastic_hanger",
  lowerBoardLayerCount: 2,
  lowerBoardThicknessMm: 12.5,
  lowerCavityDepthMm: 27,
  lowerCavityFillThicknessMm: 100,
  lowerSupportClass: "furred_channels",
  resilientLayerDynamicStiffnessMNm3: 30,
  resilientLayerThicknessMm: 30,
  structuralSupportType: "timber_joists",
  upperTreatmentDensityKgM3: 1150,
  upperTreatmentThicknessMm: 25
} as const;

const COMPLETE_CLT_SURFACE = {
  baseFloorDensityKgM3: 470,
  impactSystemType: "dry_floating_floor",
  loadBasisKgM2: 90,
  lowerAssemblyType: "none",
  resilientLayerDynamicStiffnessMNm3: 40,
  resilientLayerThicknessMm: 20,
  structuralSupportType: "mass_timber_clt",
  upperFillDensityKgM3: 500,
  upperFillThicknessMm: 70,
  upperTreatmentDensityKgM3: 1150,
  upperTreatmentThicknessMm: 22
} as const;

function calculateFromSurface(input: {
  layers: readonly LayerInput[];
  surface: Parameters<typeof buildTimberCltDeltaLwPredictorInputFromSurface>[0]["surface"];
  targetOutputs?: readonly RequestedOutputId[];
}) {
  const surfaceResult = buildTimberCltDeltaLwPredictorInputFromSurface({
    layers: input.layers,
    surface: input.surface,
    targetOutputs: input.targetOutputs ?? LAB_TARGET_OUTPUTS
  });

  return {
    result: calculateAssembly(input.layers, {
      impactPredictorInput: surfaceResult.impactPredictorInput,
      targetOutputs: input.targetOutputs ?? LAB_TARGET_OUTPUTS
    }),
    surfaceResult
  };
}

describe("Personal-Use MVP Coverage Sprint Gate F timber/CLT DeltaLw input surface", () => {
  it("lands the first-class input surface and selects the next wall multicavity readiness gate", () => {
    const contract = buildGateFTimberCltDeltaLwInputSurfaceContract({
      layers: GATE_B_TIMBER_JOIST_LAYERS,
      surface: COMPLETE_TIMBER_SURFACE,
      targetOutputs: LAB_TARGET_OUTPUTS
    });

    expect(contract).toMatchObject({
      exactMeasuredRowsRemainPrecedence: true,
      formulaBasis: TIMBER_JOIST_DELTA_LW_FORMULA_BASIS,
      landedGate: "gate_f_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_surface_plan",
      missingPhysicalInputs: [],
      previousLandedGate: "gate_e_personal_use_mvp_timber_clt_floor_impact_delta_lw_surface_parity_plan",
      requiredPhysicalInputs: [
        "baseSlabOrFloor",
        "toppingOrFloatingLayer",
        "resilientLayerDynamicStiffnessMNm3",
        "loadBasisKgM2",
        "ceilingOrLowerAssembly"
      ],
      runtimeFormulaImpact: {
        basis: TIMBER_JOIST_DELTA_LW_FORMULA_BASIS,
        DeltaLw: 25.2,
        labOrField: "lab"
      },
      runtimeValueMovement: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_g_personal_use_mvp_generalized_wall_multicavity_route_readiness_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-g-generalized-wall-multicavity-route-readiness-contract.test.ts",
      selectionStatus:
        "gate_f_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_surface_landed_selected_wall_multicavity_gate_g",
      sourceRowsRequiredForRuntimeSelection: false,
      status: "ready_for_formula_corridor"
    });
  });

  it("feeds UI-derived timber and CLT surfaces into the existing runtime formula corridor", () => {
    const timber = calculateFromSurface({
      layers: GATE_B_TIMBER_JOIST_LAYERS,
      surface: COMPLETE_TIMBER_SURFACE
    });
    const clt = calculateFromSurface({
      layers: GATE_B_CLT_LAYERS,
      surface: COMPLETE_CLT_SURFACE
    });

    expect(timber.surfaceResult).toMatchObject({
      detectedStructuralSupportType: "timber_joists",
      formulaBasis: TIMBER_JOIST_DELTA_LW_FORMULA_BASIS,
      missingPhysicalInputs: [],
      status: "ready_for_formula_corridor"
    });
    expect(timber.result.impact).toMatchObject({
      basis: "official_floor_system_exact_match",
      DeltaLw: 25.2,
      LnW: 51,
      metricBasis: {
        DeltaLw: TIMBER_JOIST_DELTA_LW_FORMULA_BASIS
      }
    });

    expect(clt.surfaceResult).toMatchObject({
      detectedStructuralSupportType: "mass_timber_clt",
      formulaBasis: MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS,
      missingPhysicalInputs: [],
      status: "ready_for_formula_corridor"
    });
    expect(clt.result.impact).toMatchObject({
      basis: "predictor_mass_timber_clt_dataholz_dry_estimate",
      DeltaLw: 22.6,
      LnW: 50,
      metricBasis: {
        DeltaLw: MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS
      }
    });
  });

  it("parks partial physical input with precise missing fields and no DeltaLw budget", () => {
    const { result, surfaceResult } = calculateFromSurface({
      layers: GATE_B_TIMBER_JOIST_LAYERS,
      surface: {
        ...COMPLETE_TIMBER_SURFACE,
        loadBasisKgM2: undefined,
        lowerAssemblyType: undefined,
        resilientLayerDynamicStiffnessMNm3: undefined,
        upperTreatmentDensityKgM3: undefined
      }
    });

    expect(surfaceResult).toMatchObject({
      missingPhysicalInputs: [
        "toppingOrFloatingLayer",
        "resilientLayerDynamicStiffnessMNm3",
        "loadBasisKgM2",
        "ceilingOrLowerAssembly"
      ],
      status: "needs_input"
    });
    expect(result.impact?.DeltaLw).toBeUndefined();
    expect(result.impact?.metricBasis?.DeltaLw).toBeUndefined();
    expect(result.impact?.errorBudgets?.some((budget: ImpactErrorBudget) => budget.metricId === "DeltaLw") ?? false).toBe(false);
  });

  it("keeps source precedence, field non-aliasing, wrong-family, duplicate-carrier, and safe-reorder boundaries", () => {
    const exactPrecedence = buildGateFTimberCltDeltaLwInputSurfaceContract({
      exactSourceRowAvailable: true,
      layers: GATE_B_TIMBER_JOIST_LAYERS,
      surface: COMPLETE_TIMBER_SURFACE,
      targetOutputs: LAB_TARGET_OUTPUTS
    });
    expect(exactPrecedence).toMatchObject({
      runtimeFormulaImpact: null,
      status: "exact_source_precedence"
    });

    const field = calculateFromSurface({
      layers: GATE_B_TIMBER_JOIST_LAYERS,
      surface: COMPLETE_TIMBER_SURFACE,
      targetOutputs: FIELD_TARGET_OUTPUTS
    });
    expect(field.surfaceResult.status).toBe("inactive");
    expect(field.result.impact?.DeltaLw).toBeUndefined();
    expect(field.result.unsupportedTargetOutputs).toEqual(expect.arrayContaining([...FIELD_TARGET_OUTPUTS]));

    const wrongFamily = buildTimberCltDeltaLwPredictorInputFromSurface({
      layers: [
        { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 200 },
        { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 }
      ],
      surface: COMPLETE_TIMBER_SURFACE,
      targetOutputs: LAB_TARGET_OUTPUTS
    });
    expect(wrongFamily).toMatchObject({
      status: "inactive",
      timberCltStackDetected: false
    });

    const duplicateCarrier = buildTimberCltDeltaLwPredictorInputFromSurface({
      layers: [
        ...GATE_B_TIMBER_JOIST_LAYERS,
        { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: 240 }
      ],
      surface: COMPLETE_TIMBER_SURFACE,
      targetOutputs: LAB_TARGET_OUTPUTS
    });
    expect(duplicateCarrier.status).toBe("unsafe_topology");

    const safelyReordered = calculateFromSurface({
      layers: [
        GATE_B_TIMBER_JOIST_LAYERS[1]!,
        GATE_B_TIMBER_JOIST_LAYERS[2]!,
        GATE_B_TIMBER_JOIST_LAYERS[0]!,
        GATE_B_TIMBER_JOIST_LAYERS[3]!,
        GATE_B_TIMBER_JOIST_LAYERS[4]!,
        GATE_B_TIMBER_JOIST_LAYERS[5]!,
        GATE_B_TIMBER_JOIST_LAYERS[6]!
      ],
      surface: COMPLETE_TIMBER_SURFACE
    });
    expect(safelyReordered.surfaceResult.status).toBe("ready_for_formula_corridor");
    expect(safelyReordered.result.impact).toMatchObject({
      DeltaLw: 25.2,
      LnW: 51
    });
  });
});
