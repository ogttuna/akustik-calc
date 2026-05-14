import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  buildCompanyInternalSteelSuspendedCeilingLowFrequencyLnt50SurfaceParityContract,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_LANDED_GATE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTED_NEXT_LABEL,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTION_STATUS
} from "./company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity-contract";
import {
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_LANDED_GATE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTION_STATUS
} from "./company-internal-steel-suspended-ceiling-low-frequency-lnt50-runtime-corridor-contract";
import {
  FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_50_TOLERANCE_DB,
  FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB,
  FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB,
  FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN
} from "./impact-field-adapter-error-budget";
import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
  STEEL_FLOOR_SUSPENDED_CEILING_REFERENCE_FLOOR_TYPE
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_SURFACE_PARITY_FILES = [
  "packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity-contract.ts",
  "packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity-contract.test.ts",
  "apps/web/features/workbench/company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity.test.ts",
  "apps/web/features/workbench/steel-floor-formula-corridor-view.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("company-internal steel suspended-ceiling low-frequency L'nT,50 surface parity", () => {
  it("lands no-runtime surface parity after the selected low-frequency runtime corridor", () => {
    const contract = buildCompanyInternalSteelSuspendedCeilingLowFrequencyLnt50SurfaceParityContract();

    expect(contract).toMatchObject({
      apiSurfaceParityRequired: true,
      cardReportSurfaceParityRequired: true,
      landedGate: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_LANDED_GATE,
      previousRuntimeLandedGate:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_LANDED_GATE,
      previousRuntimeSelectedNextAction:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
      previousRuntimeSelectedNextFile:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
      previousRuntimeSelectionStatus:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTION_STATUS,
      runtimeMovedAtSurfaceParity: false,
      selectedImplementationSlice: "company_internal_calculation_grade_mainline",
      selectedNextAction:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectedNextLabel:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTED_NEXT_LABEL,
      selectionStatus:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTION_STATUS,
      tolerancePins: {
        deltaLw: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
        lnW: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
        lPrimeNT50: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_50_TOLERANCE_DB,
        lPrimeNTw: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB,
        lPrimeNW: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB
      }
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

  it("keeps runtime values frozen while carrying low-frequency basis and budgets onto the visible snapshot", () => {
    const contract = buildCompanyInternalSteelSuspendedCeilingLowFrequencyLnt50SurfaceParityContract();

    expect(contract.runtimeSnapshot).toMatchObject({
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      ci50_2500: -1,
      deltaLw: 22.4,
      fieldKDb: 3,
      lnW: 51.6,
      lPrimeNT50: 50.8,
      lPrimeNT50MetricBasis: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500",
      lPrimeNTw: 51.8,
      lPrimeNTwMetricBasis: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
      lPrimeNW: 54.6,
      lPrimeNWMetricBasis: "estimated_field_lprimenw_from_lnw_plus_k",
      receivingRoomVolumeM3: 60,
      referenceFloorType: STEEL_FLOOR_SUSPENDED_CEILING_REFERENCE_FLOOR_TYPE,
      selectedLabel: "Lightweight-steel suspended-ceiling DeltaLw formula corridor",
      supportedTargetOutputs: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupportedTargetOutputs: ["IIC", "AIIC"]
    });

    expect(contract.runtimeSnapshot.budgetPins).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          estimate: 51.6,
          metricId: "Ln,w",
          origin: "source_absent_formula_error_budget",
          toleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
        }),
        expect.objectContaining({
          estimate: 22.4,
          metricId: "DeltaLw",
          origin: "source_absent_formula_error_budget",
          toleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB
        }),
        expect.objectContaining({
          estimate: 54.6,
          metricId: "L'n,w",
          origin: FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN,
          toleranceDb: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB
        }),
        expect.objectContaining({
          estimate: 51.8,
          metricId: "L'nT,w",
          origin: FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN,
          toleranceDb: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB
        }),
        expect.objectContaining({
          estimate: 50.8,
          max: 57.8,
          metricId: "L'nT,50",
          min: 43.8,
          notMeasuredEvidence: true,
          origin: FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN,
          termIds: expect.arrayContaining(["low_frequency_ci50_2500_owner_precision"]),
          toleranceDb: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_50_TOLERANCE_DB,
          totalBudgetDb: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_50_TOLERANCE_DB
        })
      ])
    );
    expect(contract.runtimeSnapshot.supportFormulaNotes).toEqual(
      expect.arrayContaining([
        "L'nT,50 was computed as L'nT,w + CI,50-2500.",
        "Floor-impact field-volume adapter tolerance remains +/-5 dB for L'n,w, +/-5.5 dB for L'nT,w, and +/-7 dB for L'nT,50 when a low-frequency owner is active."
      ])
    );
  });

  it("does not present low-frequency field parity as a lab-only or ASTM alias", () => {
    const contract = buildCompanyInternalSteelSuspendedCeilingLowFrequencyLnt50SurfaceParityContract();

    expect(contract.runtimeSnapshot.basis).not.toBe(STEEL_FLOOR_FORMULA_BASIS);
    expect(contract.runtimeSnapshot.supportedTargetOutputs).not.toContain("IIC");
    expect(contract.runtimeSnapshot.supportedTargetOutputs).not.toContain("AIIC");
    expect(contract.runtimeSnapshot.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
  });

  it("keeps docs and the current-gate runner aligned with low-frequency surface parity closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_LANDED_GATE);
      expect(content, path).toContain(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTION_STATUS);
      expect(content, path).toContain(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTED_NEXT_FILE);
      expect(content, path).toContain(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTED_NEXT_LABEL);
      expect(content, path).toContain("L'nT,50 50.8");
      expect(content, path).toContain("+/-7 dB");
      expect(content, path).toContain("CI,50-2500");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity-contract.test.ts"
    );
    expect(runner).toContain(
      "company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity.test.ts"
    );
  });
});
