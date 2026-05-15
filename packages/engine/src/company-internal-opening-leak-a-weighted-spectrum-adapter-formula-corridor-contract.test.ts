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

describe("company-internal opening/leak A-weighted spectrum-adapter formula corridor", () => {
  it("lands the selected no-runtime formula corridor after the owner gate and selects runtime next", () => {
    const contract = buildCompanyInternalOpeningLeakAWeightedFormulaCorridorContract();

    expect(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_ACTION).toBe(
      COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_LANDED_GATE
    );
    expect(contract).toMatchObject({
      adapterDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_DB,
      currentRuntimeValueMovement: false,
      exactAWeightedSourceRowsRemainPrecedence: true,
      landedGate: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_LANDED_GATE,
      previousOwnerLandedGate: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_LANDED_GATE,
      previousOwnerSelectedNextAction: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_ACTION,
      previousOwnerSelectedNextFile: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_FILE,
      previousOwnerSelectionStatus: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTION_STATUS,
      runtimePromotionAllowedInGate: false,
      selectedImplementationSlice: "company_internal_calculation_grade_mainline",
      selectedNextAction: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
      selectedNextLabel: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
      selectionStatus: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTION_STATUS,
      sourceRowsRequiredForFormulaDesign: false,
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(contract.basisAliasBlocked).toEqual({
      astmIicAiic: true,
      buildingDnA: true,
      labRwOrStc: true
    });
    assertCompanyInternalOpeningLeakAWeightedFormulaCorridorContract(contract);

    for (const path of REQUIRED_A_WEIGHTED_FORMULA_FILES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("defines field and building A-weighted candidates from same-route base values and owned C adapter", () => {
    const contract = buildCompanyInternalOpeningLeakAWeightedFormulaCorridorContract();
    const candidates = new Map(
      contract.candidateFormulaCorridors.map((candidate) => [
        `${candidate.adapterBasis}:${candidate.metricId}`,
        candidate
      ])
    );

    expect(candidates.get("field_apparent:Dn,A")).toMatchObject({
      adapterBasis: "field_apparent",
      baseMetricId: "Dn,w",
      baseRuntimeMethod: COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
      baseValueDb: 36.7,
      basisId: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_BASIS,
      corridorStatus: "formula_corridor_defined_runtime_gate_required",
      designCorridorEstimateDb: 35.9,
      metricId: "Dn,A",
      ownedAdapterDb: -0.8,
      proposedRuntimeEstimateDb: null,
      runtimePromotionAllowedInGate: false
    });
    expect(candidates.get("field_apparent:DnT,A")).toMatchObject({
      baseMetricId: "DnT,w",
      baseRuntimeMethod: COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
      baseValueDb: 36.9,
      designCorridorEstimateDb: 36.1,
      metricId: "DnT,A"
    });
    expect(candidates.get("building_prediction:DnT,A")).toMatchObject({
      adapterBasis: "building_prediction",
      baseMetricId: "DnT,w",
      baseRuntimeMethod: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
      baseValueDb: 32.1,
      designCorridorEstimateDb: 31.3,
      metricId: "DnT,A"
    });

    expect(candidates.has("building_prediction:Dn,A")).toBe(false);
    expect(candidates.get("field_apparent:Dn,A")?.requiredPhysicalInputs).toEqual([
      ...COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_PHYSICAL_INPUTS
    ]);
    expect(candidates.get("field_apparent:Dn,A")?.requiredOwnerInputs).toEqual([
      ...COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_OWNER_INPUTS
    ]);
    expect(candidates.get("building_prediction:DnT,A")?.requiredPhysicalInputs).toEqual([
      ...COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_PHYSICAL_INPUTS
    ]);
    expect(candidates.get("building_prediction:DnT,A")?.requiredOwnerInputs).toEqual([
      ...COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_OWNER_INPUTS
    ]);
  });

  it("keeps the A-weighted adapter budget visible and separate from measured evidence", () => {
    const contract = buildCompanyInternalOpeningLeakAWeightedFormulaCorridorContract();
    const fieldCandidate = contract.candidateFormulaCorridors.find(
      (candidate) => candidate.adapterBasis === "field_apparent" && candidate.metricId === "Dn,A"
    );
    const buildingCandidate = contract.candidateFormulaCorridors.find(
      (candidate) => candidate.adapterBasis === "building_prediction" && candidate.metricId === "DnT,A"
    );

    expect(fieldCandidate?.toleranceBudget).toMatchObject({
      adapterBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_BUDGET_DB,
      baseErrorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB,
      metricId: "Dn,A",
      notMeasuredEvidence: true,
      totalBudgetDb: 9
    });
    expect(buildingCandidate?.toleranceBudget).toMatchObject({
      adapterBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_BUDGET_DB,
      baseErrorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
      metricId: "DnT,A",
      notMeasuredEvidence: true,
      totalBudgetDb: 11
    });
    expect(fieldCandidate?.toleranceBudget.terms.map((term) => term.termId)).toEqual([
      "opening_leak_field_building_base_runtime_budget",
      "a_weighted_single_number_adapter_surrogate"
    ]);
    expect(fieldCandidate?.formulaTerms.map((term) => term.termId)).toEqual([
      "same_route_base_weighted_level",
      "iso_717_c_or_a_weighted_adapter",
      "owned_third_octave_band_set",
      "exact_a_weighted_packet_precedence",
      "a_weighted_adapter_uncertainty_budget"
    ]);
  });

  it("keeps missing-input, missing-owner, wrong-basis, and exact-precedence boundaries explicit", () => {
    const boundaries = buildCompanyInternalOpeningLeakAWeightedFormulaCorridorContract().negativeBoundaries;

    expect(boundaries).toEqual([
      expect.objectContaining({
        adapterBasis: "field_apparent",
        expectedDesignCorridorEstimateDb: null,
        missingPhysicalInputs: ["frequencyBandSet"],
        scenarioStatus: "needs_input",
        targetOutputs: ["DnT,A"]
      }),
      expect.objectContaining({
        adapterBasis: "field_apparent",
        expectedDesignCorridorEstimateDb: null,
        missingOwnerInputs: ["fieldOpeningLeakAWeightedSpectrumCurveOwner"],
        scenarioStatus: "adapter_owner_missing",
        targetOutputs: ["Dn,A", "DnT,A"]
      }),
      expect.objectContaining({
        adapterBasis: "building_prediction",
        scenarioStatus: "unsupported_basis",
        targetOutputs: ["Dn,A"],
        unsupportedOutputs: ["Dn,A"]
      }),
      expect.objectContaining({
        adapterBasis: "element_lab",
        scenarioStatus: "unsupported_basis",
        targetOutputs: ["Rw", "STC", "Dn,A", "DnT,A"]
      }),
      expect.objectContaining({
        adapterBasis: "astm_rating_boundary",
        scenarioStatus: "unsupported_basis",
        targetOutputs: ["IIC", "AIIC"]
      }),
      expect.objectContaining({
        adapterBasis: "exact_source_row",
        scenarioStatus: "exact_precedence_reserved",
        targetOutputs: ["Dn,A", "DnT,A"]
      })
    ]);
  });

  it("freezes current runtime outputs until the selected runtime corridor lands", () => {
    const { buildingAWeightedProbe, fieldAWeightedProbe } =
      buildCompanyInternalOpeningLeakAWeightedAdapterOwnerContract().currentRuntimeProbes;

    expect(fieldAWeightedProbe).toMatchObject({
      cAdapterDb: -0.8,
      computedDnADb: null,
      computedDnTADb: null,
      computedDnTwDb: 36.9,
      computedDnWDb: 36.7,
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
