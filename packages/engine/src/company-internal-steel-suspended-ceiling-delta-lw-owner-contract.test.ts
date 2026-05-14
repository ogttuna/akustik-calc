import { describe, expect, it } from "vitest";

import {
  buildCompanyInternalSteelSuspendedCeilingDeltaLwOwnerContract,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_LANDED_GATE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTION_STATUS
} from "./company-internal-steel-suspended-ceiling-delta-lw-owner-contract";
import {
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTION_STATUS
} from "./company-internal-calculation-grade-mainline-matrix";
import {
  GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE,
  GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bl";
import {
  buildSteelFloorFormulaPredictorInputFromSurface,
  STEEL_FLOOR_SUSPENDED_CEILING_DELTA_LW_OWNER_INPUTS
} from "./steel-floor-formula-input-surface";
import {
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS
} from "./steel-floor-impact-formula-corridor";
import { calculateAssembly } from "./calculate-assembly";

describe("Company-internal steel suspended-ceiling DeltaLw owner contract", () => {
  it("lands the selected company-internal DeltaLw owner contract and selects the next runtime-terms lane", () => {
    const contract = buildCompanyInternalSteelSuspendedCeilingDeltaLwOwnerContract();

    expect(contract).toMatchObject({
      exactSourcePrecedenceRemainsFirst: true,
      landedGate: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_LANDED_GATE,
      newNumericDeltaLwRuntimeMovement: false,
      perOutputDeltaLwMissingInputs: [...STEEL_FLOOR_SUSPENDED_CEILING_DELTA_LW_OWNER_INPUTS],
      previousMatrixRefreshSelectedNextAction:
        COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
      previousMatrixRefreshSelectedNextFile:
        COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_FILE,
      previousMatrixRefreshSelectionStatus:
        COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTION_STATUS,
      selectedImplementationSlice: "company_internal_calculation_grade_mainline",
      selectedNextAction: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTED_NEXT_FILE,
      selectionStatus: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      suspendedCeilingFormulaBasis: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS
    });
  });

  it("turns suspended-ceiling-only DeltaLw into a precise upper/reference-package input prompt", () => {
    const surface = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS,
      surface: GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE,
      targetOutputs: ["DeltaLw"]
    });
    const result = calculateAssembly(GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS, {
      impactPredictorInput: surface.impactPredictorInput,
      targetOutputs: ["DeltaLw"]
    });

    expect(surface).toMatchObject({
      formulaBasis: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
      missingPhysicalInputs: [],
      status: "ready_for_formula_corridor",
      targetOutputMissingPhysicalInputs: {
        DeltaLw: [
          "toppingOrFloatingLayer",
          "resilientLayerDynamicStiffnessMNm3",
          "loadBasisKgM2"
        ]
      }
    });
    expect(result.impact).toMatchObject({
      basis: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
      LnW: 62.2,
      labOrField: "lab"
    });
    expect(result.impact?.DeltaLw).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["DeltaLw"]);
  });

  it("preserves supported Ln,w when a mixed Ln,w / DeltaLw request needs only DeltaLw owner inputs", () => {
    const contract = buildCompanyInternalSteelSuspendedCeilingDeltaLwOwnerContract();

    expect(contract.mixedLnWDeltaLwProbe).toMatchObject({
      basisId: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
      deltaLw: null,
      lnW: 62.2,
      missingPhysicalInputs: [
        "toppingOrFloatingLayer",
        "resilientLayerDynamicStiffnessMNm3",
        "loadBasisKgM2"
      ],
      requestedMetrics: ["Ln,w", "DeltaLw"],
      supportedTargetOutputs: ["Ln,w"],
      unsupportedTargetOutputs: ["DeltaLw"]
    });
    expect(contract.deltaLwOnlyProbe).toMatchObject({
      deltaLw: null,
      lnW: 62.2,
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["DeltaLw"]
    });
  });
});
