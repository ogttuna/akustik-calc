import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  assertCompanyInternalOpeningLeakAWeightedFormulaCorridorContract,
  buildCompanyInternalOpeningLeakAWeightedFormulaCorridorContract,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_BUDGET_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_BASIS,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_LANDED_GATE,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTION_STATUS
} from "./company-internal-opening-leak-a-weighted-spectrum-adapter-formula-corridor-contract";
import {
  buildCompanyInternalOpeningLeakAWeightedAdapterOwnerContract,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_LANDED_GATE,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTION_STATUS,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_OWNER_INPUTS,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_PHYSICAL_INPUTS,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_OWNER_INPUTS,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_PHYSICAL_INPUTS
} from "./company-internal-opening-leak-a-weighted-spectrum-adapter-owner-contract";
import {
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB
} from "./company-internal-opening-leak-building-runtime-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_A_WEIGHTED_FORMULA_FILES = [
  "packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-formula-corridor-contract.ts",
  "packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-formula-corridor-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_REMAINING_GAP_ANALYSIS_AND_PLAN.md",
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
  "docs/calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_REMAINING_GAP_ANALYSIS_AND_PLAN.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function expectFormulaCorridorSupersededByRuntime(): void {
  expect(() => buildCompanyInternalOpeningLeakAWeightedFormulaCorridorContract()).toThrow(
    "Opening/leak A-weighted formula corridor is missing same-route base values."
  );
}

describe("company-internal opening/leak A-weighted spectrum-adapter formula corridor", () => {
  it("keeps the historical formula corridor superseded after the selected runtime corridor lands", () => {
    expect(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_ACTION).toBe(
      COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_LANDED_GATE
    );
    expect(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION).toBe(
      "company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_plan"
    );
    expect(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_DB).toBe(-0.8);
    expectFormulaCorridorSupersededByRuntime();

    for (const path of REQUIRED_A_WEIGHTED_FORMULA_FILES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the superseded formula candidate inputs documented without rebuilding stale base values", () => {
    expect(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_BASIS).toBe(
      "company_internal_opening_leak_a_weighted_spectrum_adapter_source_absent_formula_corridor"
    );
    expect(COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD).toBe(
      "company_internal_opening_leak_field_area_energy_runtime_corridor"
    );
    expect(COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD).toBe(
      "company_internal_opening_leak_building_area_energy_runtime_corridor"
    );
    expect(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_PHYSICAL_INPUTS).toContain("frequencyBandSet");
    expect(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_OWNER_INPUTS).toContain(
      "fieldOpeningLeakAWeightedSpectrumCurveOwner"
    );
    expect(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_PHYSICAL_INPUTS).toContain(
      "buildingPredictionOutputBasis"
    );
    expect(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_OWNER_INPUTS).toContain(
      "buildingOpeningLeakAWeightedSpectrumCurveOwner"
    );
    expectFormulaCorridorSupersededByRuntime();
  });

  it("keeps the A-weighted adapter budget constants visible and separate from measured evidence", () => {
    expect({
      adapterBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_BUDGET_DB,
      baseErrorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB,
      metricId: "Dn,A",
      notMeasuredEvidence: true,
      totalBudgetDb: 9
    }).toMatchObject({
      adapterBudgetDb: 1,
      baseErrorBudgetDb: 8,
      metricId: "Dn,A",
      notMeasuredEvidence: true,
      totalBudgetDb: 9
    });
    expect({
      adapterBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_BUDGET_DB,
      baseErrorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
      metricId: "DnT,A",
      notMeasuredEvidence: true,
      totalBudgetDb: 11
    }).toMatchObject({
      adapterBudgetDb: 1,
      baseErrorBudgetDb: 10,
      metricId: "DnT,A",
      notMeasuredEvidence: true,
      totalBudgetDb: 11
    });
    expectFormulaCorridorSupersededByRuntime();
  });

  it("keeps missing-input, missing-owner, wrong-basis, and exact-precedence boundaries explicit through owner assessments", () => {
    const boundaries = buildCompanyInternalOpeningLeakAWeightedAdapterOwnerContract().scenarioPack;

    expect(boundaries).toEqual(expect.arrayContaining([
      expect.objectContaining({
        adapterBasis: "field_apparent",
        missingPhysicalInputs: ["frequencyBandSet"],
        status: "needs_input",
        targetOutputs: ["DnT,A"]
      }),
      expect.objectContaining({
        adapterBasis: "field_apparent",
        missingOwnerInputs: ["fieldOpeningLeakAWeightedSpectrumCurveOwner"],
        status: "adapter_owner_missing",
        targetOutputs: ["Dn,A", "DnT,A"]
      }),
      expect.objectContaining({
        adapterBasis: "building_prediction",
        status: "unsupported_basis",
        targetOutputs: ["Dn,A"],
        unsupportedOutputs: ["Dn,A"]
      }),
      expect.objectContaining({
        adapterBasis: "element_lab",
        status: "unsupported_basis",
        targetOutputs: ["Rw", "STC", "Dn,A", "DnT,A"]
      }),
      expect.objectContaining({
        adapterBasis: "astm_rating_boundary",
        status: "unsupported_basis",
        targetOutputs: ["IIC", "AIIC"]
      })
    ]));
    expectFormulaCorridorSupersededByRuntime();
  });

  it("freezes current runtime outputs until the selected runtime corridor lands", () => {
    const { buildingAWeightedProbe, fieldAWeightedProbe } =
      buildCompanyInternalOpeningLeakAWeightedAdapterOwnerContract().currentRuntimeProbes;

    expect(fieldAWeightedProbe).toMatchObject({
      cAdapterDb: -0.8,
      computedDnADb: null,
      computedDnTADb: null,
      computedDnTwDb: 36.9,
      computedDnWDb: null,
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Dn,A", "DnT,A"]
    });
    expect(buildingAWeightedProbe).toMatchObject({
      cAdapterDb: -0.8,
      computedDnADb: null,
      computedDnTADb: null,
      computedDnTwDb: 32.1,
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["DnT,A", "Dn,A"]
    });
  });

  it("keeps docs and the current-gate runner aligned with the formula-corridor closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_LANDED_GATE);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTION_STATUS);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL);
      expect(content, path).toContain("field `Dn,A 35.9`");
      expect(content, path).toContain("field `DnT,A 36.1`");
      expect(content, path).toContain("building `DnT,A 31.3`");
      expect(content, path).toContain("frequencyBandSet");
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "company-internal-opening-leak-a-weighted-spectrum-adapter-formula-corridor-contract.test.ts"
    );
  });
});
