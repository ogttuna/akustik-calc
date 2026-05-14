import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildCompanyInternalSteelSuspendedCeilingLowFrequencyLnt50OwnerContract,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_ALIAS_TARGET_OUTPUTS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_FIELD_TARGET_OUTPUTS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_ONLY_TARGET_OUTPUTS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_INPUTS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_LANDED_GATE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTION_STATUS
} from "./company-internal-steel-suspended-ceiling-low-frequency-lnt50-owner-contract";
import {
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_LANDED_GATE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTION_STATUS
} from "./company-internal-calculation-grade-mainline-matrix";
import {
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE
} from "./company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract";
import { buildSteelFloorFormulaPredictorInputFromSurface } from "./steel-floor-formula-input-surface";
import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_LOW_FREQUENCY_OWNER_FILES = [
  "packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-owner-contract.ts",
  "packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-owner-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("company-internal steel suspended-ceiling low-frequency L'nT,50 owner contract", () => {
  it("lands the low-frequency owner contract after Matrix V3 and selects the runtime corridor next", () => {
    const contract = buildCompanyInternalSteelSuspendedCeilingLowFrequencyLnt50OwnerContract();

    expect(contract).toMatchObject({
      allowedOwnerRoutes: [
        "field_volume_plus_ci50_2500",
        "local_guide_lnwci_plus_k_plus_hd",
        "exact_field_band_curve"
      ],
      labLnWDeltaLwRuntimeRemainsFrozen: true,
      landedGate: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_LANDED_GATE,
      newNumericLnt50RuntimeMovement: false,
      ownerInputs: [...COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_INPUTS],
      previousMatrixV3LandedGate: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_LANDED_GATE,
      previousMatrixV3SelectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_ACTION,
      previousMatrixV3SelectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_FILE,
      previousMatrixV3SelectionStatus: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTION_STATUS,
      selectedImplementationSlice: "company_internal_calculation_grade_mainline",
      selectedNextAction: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_FILE,
      selectionStatus: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      steelDeltaLwRuntimeBasis: STEEL_FLOOR_FORMULA_BASIS,
      steelDeltaLwTolerancePins: {
        deltaLw: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
        lnW: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
      }
    });

    for (const path of REQUIRED_LOW_FREQUENCY_OWNER_FILES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("preserves field L'n,w / L'nT,w but blocks L'nT,50 until the low-frequency owner exists", () => {
    const contract = buildCompanyInternalSteelSuspendedCeilingLowFrequencyLnt50OwnerContract();

    expect(contract.completeFieldProbe).toMatchObject({
      basisId: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      budgetMetricIds: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"],
      deltaLw: 22.4,
      lnW: 51.6,
      lPrimeNT50: null,
      lPrimeNTw: 51.8,
      lPrimeNW: 54.6,
      metricBasisLPrimeNT50: null,
      requestedMetrics: [...COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_FIELD_TARGET_OUTPUTS],
      supportedTargetOutputs: ["L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: ["L'nT,50"]
    });
  });

  it("keeps L'nT,50-only requests unsupported instead of aliasing lab or field budgets", () => {
    const contract = buildCompanyInternalSteelSuspendedCeilingLowFrequencyLnt50OwnerContract();

    expect(contract.lnt50OnlyProbe).toMatchObject({
      budgetMetricIds: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"],
      lPrimeNT50: null,
      metricBasisLPrimeNT50: null,
      requestedMetrics: [...COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_ONLY_TARGET_OUTPUTS],
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["L'nT,50"]
    });
    expect(contract.lnt50OnlyProbe.budgetMetricIds).not.toContain("L'nT,50");
  });

  it("does not treat ASTM ratings or the lab DeltaLw corridor as a low-frequency owner", () => {
    const surface = buildSteelFloorFormulaPredictorInputFromSurface({
      layers: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
      surface: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
      targetOutputs: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_ALIAS_TARGET_OUTPUTS
    });
    const result = calculateAssembly(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS, {
      impactFieldContext: { fieldKDb: 3, receivingRoomVolumeM3: 60 },
      impactPredictorInput: surface.impactPredictorInput,
      targetOutputs: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_ALIAS_TARGET_OUTPUTS
    });
    const contract = buildCompanyInternalSteelSuspendedCeilingLowFrequencyLnt50OwnerContract();

    expect(result.impact).toMatchObject({
      DeltaLw: 22.4,
      LnW: 51.6,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(result.impact?.LPrimeNT50).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["IIC", "AIIC", "L'nT,50"]);
    expect(contract.aliasBoundaryProbe).toMatchObject({
      requestedMetrics: [...COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_ALIAS_TARGET_OUTPUTS],
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["IIC", "AIIC", "L'nT,50"]
    });
  });

  it("recognizes exact field band packets as a separate owner route, not source-absent steel runtime movement", () => {
    const contract = buildCompanyInternalSteelSuspendedCeilingLowFrequencyLnt50OwnerContract();

    expect(contract.exactFieldPacketProbe).toEqual({
      basisId: "exact_source_band_curve_iso7172",
      lPrimeNT50: 55,
      metricBasisLPrimeNT50: "exact_source_band_curve_iso7172",
      supportedTargetOutputs: ["L'nT,50"],
      unsupportedTargetOutputs: []
    });
    expect(contract.newNumericLnt50RuntimeMovement).toBe(false);
    expect(contract.sourceRowsRequiredForRuntimeSelection).toBe(false);
  });

  it("keeps docs and current-gate runner aligned with low-frequency owner closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_LANDED_GATE);
      expect(content, path).toContain(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTION_STATUS);
      expect(content, path).toContain(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_FILE);
      expect(content, path).toContain("lowFrequencyImpactSpectrumOrCI50_2500Owner");
      expect(content, path).toContain("L'nT,50");
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "company-internal-steel-suspended-ceiling-low-frequency-lnt50-owner-contract.test.ts"
    );
  });
});
