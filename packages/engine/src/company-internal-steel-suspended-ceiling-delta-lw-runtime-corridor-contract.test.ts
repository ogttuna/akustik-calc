import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  buildCompanyInternalSteelSuspendedCeilingDeltaLwRuntimeCorridorContract,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_LANDED_GATE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTION_STATUS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_TARGET_OUTPUTS
} from "./company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract";
import {
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTION_STATUS
} from "./company-internal-calculation-grade-mainline-matrix";
import {
  GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bl";
import {
  buildSteelFloorFormulaPredictorInputFromSurface,
  STEEL_FLOOR_SUSPENDED_CEILING_DELTA_LW_OWNER_INPUTS
} from "./steel-floor-formula-input-surface";
import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS
} from "./steel-floor-impact-formula-corridor";
import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_RUNTIME_CORRIDOR_SURFACES = [
  "packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract.ts",
  "packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_HANDOFF.md",
  "docs/calculator/SLICE_COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "AGENTS.md",
  "tools/dev/run-calculator-current-gate.ts"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("company-internal steel suspended-ceiling DeltaLw runtime corridor", () => {
  it("lands the selected runtime corridor after matrix v2 and selects surface parity next", () => {
    const contract = buildCompanyInternalSteelSuspendedCeilingDeltaLwRuntimeCorridorContract();

    expect(contract).toMatchObject({
      astmFieldBuildingAndLowFrequencyStayBlocked: true,
      exactSourcePrecedenceRemainsFirst: true,
      landedGate: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_LANDED_GATE,
      newNumericDeltaLwRuntimeMovement: true,
      previousMatrixV2SelectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_ACTION,
      previousMatrixV2SelectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_FILE,
      previousMatrixV2SelectionStatus: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTION_STATUS,
      runtimeFormulaBasis: STEEL_FLOOR_FORMULA_BASIS,
      selectedImplementationSlice: "company_internal_calculation_grade_mainline",
      selectedNextAction: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
      selectionStatus: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      suspendedCeilingBareReferenceBasis: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS
    });

    for (const path of REQUIRED_RUNTIME_CORRIDOR_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("calculates lab DeltaLw only when the lower suspended ceiling and upper reference package are complete", () => {
    const contract = buildCompanyInternalSteelSuspendedCeilingDeltaLwRuntimeCorridorContract();

    expect(contract.completeRuntimeProbe).toMatchObject({
      bareReferenceLnW: 62.2,
      basisId: STEEL_FLOOR_FORMULA_BASIS,
      deltaLw: 22.4,
      deltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      formulaStatus: "ready_for_formula_corridor",
      impactSystemType: "combined_upper_lower_system",
      lnW: 51.6,
      lnWToleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
      missingPhysicalInputs: [],
      requestedMetrics: [...COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_TARGET_OUTPUTS],
      supportedTargetOutputs: ["Ln,w", "DeltaLw"],
      targetOutputMissingPhysicalInputs: {},
      unsupportedTargetOutputs: []
    });
  });

  it("blocks the runtime when stiffness/load are present but the topping or floating layer is not owned", () => {
    const surface = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS,
      surface: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
      targetOutputs: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_TARGET_OUTPUTS
    });
    const result = calculateAssembly(GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS, {
      impactPredictorInput: surface.impactPredictorInput,
      targetOutputs: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_TARGET_OUTPUTS
    });

    expect(surface).toMatchObject({
      formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
      missingPhysicalInputs: ["toppingOrFloatingLayer"],
      status: "needs_input"
    });
    expect(result.impact).toBeNull();
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(result.warnings).toContain(
      "Steel-floor formula corridor needs toppingOrFloatingLayer before calculating lab Ln,w / DeltaLw. DynEcho blocked the broad family fallback instead of fabricating impact ratings."
    );
  });

  it("keeps the previous suspended-ceiling-only input as a DeltaLw owner prompt without moving Ln,w", () => {
    const contract = buildCompanyInternalSteelSuspendedCeilingDeltaLwRuntimeCorridorContract();

    expect(contract.missingUpperPackageProbe).toMatchObject({
      basisId: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
      deltaLw: null,
      formulaStatus: "ready_for_formula_corridor",
      impactSystemType: "suspended_ceiling_only",
      lnW: 62.2,
      missingPhysicalInputs: [],
      supportedTargetOutputs: ["Ln,w"],
      targetOutputMissingPhysicalInputs: {
        DeltaLw: [...STEEL_FLOOR_SUSPENDED_CEILING_DELTA_LW_OWNER_INPUTS]
      },
      unsupportedTargetOutputs: ["DeltaLw"]
    });
  });

  it("does not alias the new lab DeltaLw runtime to ASTM, field, or low-frequency outputs", () => {
    const targetOutputs = ["IIC", "AIIC", "L'nT,50"] as const;
    const surface = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
      surface: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
      targetOutputs
    });
    const result = calculateAssembly(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS, {
      impactPredictorInput: surface.impactPredictorInput,
      targetOutputs
    });

    expect(result.impact).toMatchObject({
      DeltaLw: 22.4,
      LnW: 51.6,
      basis: STEEL_FLOOR_FORMULA_BASIS,
      labOrField: "lab"
    });
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["IIC", "AIIC", "L'nT,50"]);
  });

  it("keeps docs and the current-gate runner aligned with the new runtime closeout", () => {
    for (const path of REQUIRED_RUNTIME_CORRIDOR_SURFACES) {
      const content = readRepoFile(path);

      if (path.endsWith(".md") || path === "AGENTS.md") {
        expect(content, path).toContain(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_LANDED_GATE);
        expect(content, path).toContain(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTION_STATUS);
        expect(content, path).toContain(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION);
        expect(content, path).toContain(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE);
      }
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract.test.ts"
    );
  });
});
