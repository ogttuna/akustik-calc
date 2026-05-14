import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  buildCompanyInternalSteelSuspendedCeilingLowFrequencyLnt50RuntimeCorridorContract,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_FIELD_CONTEXT,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_ALIAS_TARGET_OUTPUTS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_LANDED_GATE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTION_STATUS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_ONLY_TARGET_OUTPUTS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_TARGET_OUTPUTS
} from "./company-internal-steel-suspended-ceiling-low-frequency-lnt50-runtime-corridor-contract";
import {
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_LANDED_GATE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTION_STATUS
} from "./company-internal-steel-suspended-ceiling-low-frequency-lnt50-owner-contract";
import {
  FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_50_TOLERANCE_DB,
  FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB,
  FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB,
  FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN
} from "./impact-field-adapter-error-budget";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_LOW_FREQUENCY_RUNTIME_FILES = [
  "packages/shared/src/domain/impact-field-context.ts",
  "packages/engine/src/impact-field-context.ts",
  "packages/engine/src/impact-field-adapter-error-budget.ts",
  "packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-runtime-corridor-contract.ts",
  "packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-runtime-corridor-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("company-internal steel suspended-ceiling low-frequency L'nT,50 runtime corridor", () => {
  it("lands the selected runtime corridor after the owner contract and selects surface parity next", () => {
    const contract = buildCompanyInternalSteelSuspendedCeilingLowFrequencyLnt50RuntimeCorridorContract();

    expect(contract).toMatchObject({
      labLnWDeltaLwRuntimeRemainsFrozen: true,
      landedGate: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_LANDED_GATE,
      newNumericLnt50RuntimeMovement: true,
      previousOwnerLandedGate: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_LANDED_GATE,
      previousOwnerSelectedNextAction:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_ACTION,
      previousOwnerSelectedNextFile:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_FILE,
      previousOwnerSelectionStatus:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTION_STATUS,
      selectedImplementationSlice: "company_internal_calculation_grade_mainline",
      selectedNextAction: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
      selectionStatus: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      tolerancePins: {
        deltaLw: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
        lnW: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
        lPrimeNT50: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_50_TOLERANCE_DB,
        lPrimeNTw: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB,
        lPrimeNW: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB
      }
    });

    for (const path of REQUIRED_LOW_FREQUENCY_RUNTIME_FILES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("calculates source-absent L'nT,50 only when CI,50-2500 ownership is explicit", () => {
    const contract = buildCompanyInternalSteelSuspendedCeilingLowFrequencyLnt50RuntimeCorridorContract();

    expect(contract.completeRuntimeProbe).toMatchObject({
      basisId: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      ci50_2500: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_FIELD_CONTEXT.ci50_2500Db,
      deltaLw: 22.4,
      formulaStatus: "ready_for_formula_corridor",
      lnW: 51.6,
      lPrimeNT50: 50.8,
      lPrimeNTw: 51.8,
      lPrimeNW: 54.6,
      metricBasisLPrimeNT50: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500",
      missingPhysicalInputs: [],
      requestedMetrics: [...COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_TARGET_OUTPUTS],
      supportedTargetOutputs: ["L'n,w", "L'nT,w", "L'nT,50"],
      unsupportedTargetOutputs: []
    });
    expect(contract.completeRuntimeProbe.budgetPins).toEqual([
      expect.objectContaining({
        estimate: 51.6,
        metricId: "Ln,w",
        toleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
      }),
      expect.objectContaining({
        estimate: 22.4,
        metricId: "DeltaLw",
        toleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB
      }),
      {
        estimate: 54.6,
        max: 59.6,
        metricId: "L'n,w",
        min: 49.6,
        origin: FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN,
        termIds: ["lab_anchor_basis_transfer", "field_k_or_mass_ratio_policy", "source_absent_field_holdout_absence"],
        toleranceDb: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB,
        totalBudgetDb: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB
      },
      {
        estimate: 51.8,
        max: 57.3,
        metricId: "L'nT,w",
        min: 46.3,
        origin: FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN,
        termIds: [
          "lab_anchor_basis_transfer",
          "field_k_or_mass_ratio_policy",
          "source_absent_field_holdout_absence",
          "room_volume_normalization_precision"
        ],
        toleranceDb: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB,
        totalBudgetDb: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB
      },
      {
        estimate: 50.8,
        max: 57.8,
        metricId: "L'nT,50",
        min: 43.8,
        origin: FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN,
        termIds: [
          "lab_anchor_basis_transfer",
          "field_k_or_mass_ratio_policy",
          "source_absent_field_holdout_absence",
          "room_volume_normalization_precision",
          "low_frequency_ci50_2500_owner_precision"
        ],
        toleranceDb: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_50_TOLERANCE_DB,
        totalBudgetDb: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_50_TOLERANCE_DB
      }
    ]);
  });

  it("supports L'nT,50-only requests without requiring the user to request intermediate field metrics", () => {
    const contract = buildCompanyInternalSteelSuspendedCeilingLowFrequencyLnt50RuntimeCorridorContract();

    expect(contract.lnt50OnlyProbe).toMatchObject({
      basisId: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      ci50_2500: -1,
      deltaLw: 22.4,
      lnW: 51.6,
      lPrimeNT50: 50.8,
      lPrimeNTw: 51.8,
      lPrimeNW: 54.6,
      metricBasisLPrimeNT50: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500",
      requestedMetrics: [...COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_ONLY_TARGET_OUTPUTS],
      supportedTargetOutputs: ["L'nT,50"],
      unsupportedTargetOutputs: []
    });
  });

  it("keeps the Dynamic Calculator gate open only after the low-frequency owner is present", () => {
    const contract = buildCompanyInternalSteelSuspendedCeilingLowFrequencyLnt50RuntimeCorridorContract();

    expect(contract.dynamicCalculatorRuntimeProbe).toMatchObject({
      basisId: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      lPrimeNT50: 50.8,
      requestedMetrics: ["L'nT,50"],
      supportedTargetOutputs: ["L'nT,50"],
      unsupportedTargetOutputs: []
    });
  });

  it("blocks missing low-frequency ownership without removing the existing field L'n,w / L'nT,w route", () => {
    const contract = buildCompanyInternalSteelSuspendedCeilingLowFrequencyLnt50RuntimeCorridorContract();

    expect(contract.missingLowFrequencyOwnerProbe).toMatchObject({
      basisId: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      ci50_2500: null,
      lPrimeNT50: null,
      lPrimeNTw: 51.8,
      lPrimeNW: 54.6,
      metricBasisLPrimeNT50: null,
      supportedTargetOutputs: ["L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: ["L'nT,50"]
    });
    expect(contract.missingLowFrequencyOwnerProbe.budgetPins.map((budget) => budget.metricId)).toEqual([
      "Ln,w",
      "DeltaLw",
      "L'n,w",
      "L'nT,w"
    ]);
  });

  it("does not alias ASTM ratings while allowing the explicit low-frequency field output", () => {
    const contract = buildCompanyInternalSteelSuspendedCeilingLowFrequencyLnt50RuntimeCorridorContract();

    expect(contract.aliasBoundaryProbe).toMatchObject({
      basisId: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      requestedMetrics: [...COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_ALIAS_TARGET_OUTPUTS],
      supportedTargetOutputs: ["L'nT,50"],
      unsupportedTargetOutputs: ["IIC", "AIIC"]
    });
  });

  it("keeps exact field-band packets as exact precedence, not source-absent steel evidence", () => {
    const contract = buildCompanyInternalSteelSuspendedCeilingLowFrequencyLnt50RuntimeCorridorContract();

    expect(contract.exactFieldPacketProbe).toEqual({
      basisId: "exact_source_band_curve_iso7172",
      lPrimeNT50: 55,
      metricBasisLPrimeNT50: "exact_source_band_curve_iso7172",
      supportedTargetOutputs: ["L'nT,50"],
      unsupportedTargetOutputs: []
    });
  });

  it("keeps docs and the current-gate runner aligned with low-frequency runtime closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_LANDED_GATE);
      expect(content, path).toContain(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTION_STATUS);
      expect(content, path).toContain(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE);
      expect(content, path).toContain(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL);
      expect(content, path).toContain("CI,50-2500");
      expect(content, path).toContain("L'nT,50");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "company-internal-steel-suspended-ceiling-low-frequency-lnt50-runtime-corridor-contract.test.ts"
    );
  });
});
