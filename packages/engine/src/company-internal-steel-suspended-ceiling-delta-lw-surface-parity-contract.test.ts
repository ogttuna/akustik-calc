import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildCompanyInternalSteelSuspendedCeilingDeltaLwSurfaceParityContract,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_LANDED_GATE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTION_STATUS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_TARGET_OUTPUTS
} from "./company-internal-steel-suspended-ceiling-delta-lw-surface-parity-contract";
import {
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_LANDED_GATE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTION_STATUS
} from "./company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract";
import { buildSteelFloorFormulaPredictorInputFromSurface } from "./steel-floor-formula-input-surface";
import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
  STEEL_FLOOR_SUSPENDED_CEILING_REFERENCE_FLOOR_TYPE
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_SURFACE_PARITY_FILES = [
  "packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-surface-parity-contract.ts",
  "packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-surface-parity-contract.test.ts",
  "apps/web/features/workbench/company-internal-steel-suspended-ceiling-delta-lw-surface-parity.test.ts",
  "apps/web/features/workbench/steel-floor-formula-corridor-view.ts",
  "packages/engine/src/dynamic-impact.ts",
  "packages/engine/src/impact-support.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_HANDOFF.md",
  "docs/calculator/SLICE_COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "AGENTS.md",
  "tools/dev/run-calculator-current-gate.ts"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("company-internal steel suspended-ceiling DeltaLw surface parity", () => {
  it("lands no-runtime surface parity after the selected steel DeltaLw runtime corridor", () => {
    const contract = buildCompanyInternalSteelSuspendedCeilingDeltaLwSurfaceParityContract();

    expect(contract).toMatchObject({
      apiSurfaceParityRequired: true,
      cardReportSurfaceParityRequired: true,
      landedGate: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_LANDED_GATE,
      previousRuntimeLandedGate: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_LANDED_GATE,
      previousRuntimeSelectedNextAction:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
      previousRuntimeSelectedNextFile:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
      previousRuntimeSelectionStatus:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTION_STATUS,
      runtimeMovedAtSurfaceParity: false,
      selectedImplementationSlice: "company_internal_calculation_grade_mainline",
      selectedNextAction: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectionStatus: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTION_STATUS
    });

    expect(contract.visibleSurfaceTargets).toEqual([
      "output_cards",
      "corridor_dossier",
      "local_saved_replay",
      "server_snapshot_replay",
      "calculator_api_payload",
      "impact_only_api_payload",
      "markdown_report"
    ]);

    for (const path of REQUIRED_SURFACE_PARITY_FILES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps runtime values frozen while naming the suspended-ceiling lower reference on the visible trace", () => {
    const surface = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
      surface: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
      targetOutputs: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_TARGET_OUTPUTS
    });
    const result = calculateAssembly(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS, {
      impactPredictorInput: surface.impactPredictorInput,
      targetOutputs: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_TARGET_OUTPUTS
    });

    expect(result.impact).toMatchObject({
      DeltaLw: 22.4,
      LnW: 51.6,
      basis: STEEL_FLOOR_FORMULA_BASIS,
      labOrField: "lab",
      referenceFloorType: STEEL_FLOOR_SUSPENDED_CEILING_REFERENCE_FLOOR_TYPE
    });
    expect(result.impact?.errorBudgets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          metricId: "Ln,w",
          toleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
        }),
        expect.objectContaining({
          metricId: "DeltaLw",
          toleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB
        })
      ])
    );
    expect(result.dynamicImpactTrace).toMatchObject({
      selectedLabel: "Lightweight-steel suspended-ceiling DeltaLw formula corridor",
      systemTypeLabel: "Combined upper and lower system"
    });
    expect(result.impactSupport?.formulaNotes).toEqual(
      expect.arrayContaining([
        "Steel suspended-ceiling DeltaLw runtime uses the Gate BK lower suspended-ceiling reference before applying the upper-package reduction.",
        "Corridor tolerance remains +/-4.5 dB for Ln,w and +/-2 dB for DeltaLw."
      ])
    );
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(result.unsupportedTargetOutputs).toEqual(["IIC", "L'nT,50"]);
  });

  it("keeps docs and the current-gate runner aligned with surface parity closeout and matrix v3 selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_LANDED_GATE);
      expect(content, path).toContain(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTION_STATUS);
      expect(content, path).toContain(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTED_NEXT_FILE);
      expect(content, path).toContain("Ln,w 51.6");
      expect(content, path).toContain("DeltaLw 22.4");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "company-internal-steel-suspended-ceiling-delta-lw-surface-parity-contract.test.ts"
    );
    expect(runner).toContain(
      "company-internal-steel-suspended-ceiling-delta-lw-surface-parity.test.ts"
    );
  });
});
