import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  assertCompanyInternalOpeningLeakAWeightedAdapterOwnerContract,
  buildCompanyInternalOpeningLeakAWeightedAdapterOwnerContract,
  buildCompanyInternalOpeningLeakAWeightedOwnerGroups,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_LANDED_GATE,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_LABEL,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTION_STATUS,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_OWNER_INPUTS,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_PHYSICAL_INPUTS,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_OWNER_INPUTS,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_PHYSICAL_INPUTS
} from "./company-internal-opening-leak-a-weighted-spectrum-adapter-owner-contract";
import {
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_LANDED_GATE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTION_STATUS
} from "./company-internal-calculation-grade-mainline-matrix";
import {
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB
} from "./company-internal-opening-leak-building-runtime-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_OPENING_LEAK_A_WEIGHTED_OWNER_FILES = [
  "packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-owner-contract.ts",
  "packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-owner-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_OWNER_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-14_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_OWNER_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("company-internal opening/leak A-weighted spectrum-adapter owner contract", () => {
  it("lands the selected owner contract after Matrix V5 and selects the formula corridor next", () => {
    const contract = buildCompanyInternalOpeningLeakAWeightedAdapterOwnerContract();

    expect(contract).toMatchObject({
      aWeightedRuntimePromoted: false,
      exactAWeightedSourceRowsRemainPrecedence: true,
      fieldAndBuildingAWeightedOwnersSeparated: true,
      landedGate: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_LANDED_GATE,
      labRwOrStcAliasedToAWeighted: false,
      noRuntimeValueMovement: true,
      previousMatrixV5: {
        landedGate: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_LANDED_GATE,
        selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_ACTION,
        selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_FILE,
        selectionStatus: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTION_STATUS
      },
      selectedImplementationSlice: "company_internal_calculation_grade_mainline",
      selectedNextAction: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_FILE,
      selectedNextLabel: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_LABEL,
      selectionStatus: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });

    expect(COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_ACTION).toBe(
      COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_LANDED_GATE
    );
    expect(() => assertCompanyInternalOpeningLeakAWeightedAdapterOwnerContract(contract)).toThrow(
      "Opening/leak field A-weighted owner contract moved runtime values or promoted A-weighted outputs."
    );

    for (const path of REQUIRED_OPENING_LEAK_A_WEIGHTED_OWNER_FILES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("defines separate field and building A-weighted owner groups without requiring a broad source crawl", () => {
    expect(buildCompanyInternalOpeningLeakAWeightedOwnerGroups()).toEqual([
      {
        adapterBasis: "field_apparent",
        baseRuntimeMethod: COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
        baseRuntimeOutputsRequired: ["Dn,w", "DnT,w"],
        id: "field_apparent_opening_leak_a_weighted_spectrum_adapter_owners",
        requiredOwnerInputs: [...COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_OWNER_INPUTS],
        requiredPhysicalInputs: [...COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_PHYSICAL_INPUTS],
        targetOutputs: ["Dn,A", "DnT,A"]
      },
      {
        adapterBasis: "building_prediction",
        baseRuntimeMethod: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
        baseRuntimeOutputsRequired: ["DnT,w"],
        id: "building_prediction_opening_leak_a_weighted_spectrum_adapter_owners",
        requiredOwnerInputs: [...COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_OWNER_INPUTS],
        requiredPhysicalInputs: [...COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_PHYSICAL_INPUTS],
        targetOutputs: ["DnT,A"]
      }
    ]);
  });

  it("keeps current opening/leak A-weighted requests unsupported while preserving base field/building values", () => {
    const { buildingAWeightedProbe, fieldAWeightedProbe } =
      buildCompanyInternalOpeningLeakAWeightedAdapterOwnerContract().currentRuntimeProbes;

    expect(fieldAWeightedProbe).toMatchObject({
      basisId: COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
      cAdapterDb: -0.8,
      computedDnADb: null,
      computedDnTADb: null,
      computedDnTwDb: 36.9,
      computedDnWDb: null,
      computedRwPrimeDb: 36.4,
      errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB,
      origin: "family_physics_prediction",
      requestedMetrics: ["Dn,A", "DnT,A"],
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Dn,A", "DnT,A"],
      warningMatched: true
    });

    expect(buildingAWeightedProbe).toMatchObject({
      basisId: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
      cAdapterDb: -0.8,
      computedDnADb: null,
      computedDnTADb: null,
      computedDnTwDb: 32.1,
      computedDnWDb: null,
      computedRwPrimeDb: 31.6,
      errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
      origin: "family_physics_prediction",
      requestedMetrics: ["DnT,A", "Dn,A"],
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["DnT,A", "Dn,A"],
      warningMatched: true
    });
  });

  it("classifies ready, missing-owner, missing-input, and wrong-basis A-weighted scenarios", () => {
    const scenarios = buildCompanyInternalOpeningLeakAWeightedAdapterOwnerContract().scenarioPack;

    expect(scenarios).toHaveLength(7);
    expect(scenarios.find((scenario) =>
      scenario.id === "company_internal_opening_leak_field_a_weighted_complete_ready_for_formula_corridor"
    )).toMatchObject({
      blockedOutputs: [],
      labRwOrStcAliasAllowed: false,
      missingOwnerInputs: [],
      missingPhysicalInputs: [],
      readyOutputs: ["Dn,A", "DnT,A"],
      runtimePromotionAllowedAtGate: false,
      status: "ready_for_formula_corridor",
      unsupportedOutputs: []
    });
    expect(scenarios.find((scenario) =>
      scenario.id === "company_internal_opening_leak_field_a_weighted_missing_spectrum_owner"
    )).toMatchObject({
      blockedOutputs: ["Dn,A", "DnT,A"],
      missingOwnerInputs: ["fieldOpeningLeakAWeightedSpectrumCurveOwner"],
      status: "adapter_owner_missing"
    });
    expect(scenarios.find((scenario) =>
      scenario.id === "company_internal_opening_leak_field_a_weighted_missing_frequency_band_set"
    )).toMatchObject({
      blockedOutputs: ["DnT,A"],
      missingPhysicalInputs: ["frequencyBandSet"],
      status: "needs_input"
    });
    expect(scenarios.find((scenario) =>
      scenario.id === "company_internal_opening_leak_building_dna_stays_out_of_building_owner"
    )).toMatchObject({
      readyOutputs: [],
      status: "unsupported_basis",
      unsupportedOutputs: ["Dn,A"]
    });
    expect(scenarios.find((scenario) =>
      scenario.id === "company_internal_opening_leak_lab_rw_stc_not_a_weighted_alias"
    )).toMatchObject({
      labRwOrStcAliasAllowed: false,
      status: "unsupported_basis",
      unsupportedOutputs: ["Rw", "STC", "Dn,A", "DnT,A"]
    });
  });

  it("keeps docs and the current-gate runner aligned with the A-weighted owner closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_LANDED_GATE);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTION_STATUS);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_FILE);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_LABEL);
      expect(content, path).toContain("Dn,A");
      expect(content, path).toContain("DnT,A");
      expect(content, path).toContain("frequencyBandSet");
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "company-internal-opening-leak-a-weighted-spectrum-adapter-owner-contract.test.ts"
    );
  });
});
