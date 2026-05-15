import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  assertCompanyInternalOpeningLeakAWeightedRuntimeCorridorContract,
  buildCompanyInternalOpeningLeakAWeightedRuntimeCorridorContract,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_RUNTIME_TARGET_OUTPUTS,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_RUNTIME_TARGET_OUTPUTS,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_LANDED_GATE,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTION_STATUS
} from "./company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract";
import {
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_LANDED_GATE,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTION_STATUS
} from "./company-internal-opening-leak-a-weighted-spectrum-adapter-formula-corridor-contract";
import {
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB
} from "./company-internal-opening-leak-building-runtime-corridor";
import { GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD } from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_A_WEIGHTED_RUNTIME_FILES = [
  "packages/shared/src/domain/airborne-context.ts",
  "packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract.ts",
  "packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract.test.ts",
  "packages/engine/src/company-internal-opening-leak-building-runtime-corridor.ts",
  "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
  "docs/calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-15_COMPANY_INTERNAL_REMAINING_GAP_ANALYSIS_AND_PLAN.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("company-internal opening/leak A-weighted spectrum-adapter runtime corridor", () => {
  it("lands the selected runtime corridor after the formula gate and selects surface parity next", () => {
    const contract = buildCompanyInternalOpeningLeakAWeightedRuntimeCorridorContract();

    expect(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION).toBe(
      COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_LANDED_GATE
    );
    expect(contract).toMatchObject({
      adapterDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_DB,
      basisAliasBlocked: {
        astmIicAiic: true,
        buildingDnA: true,
        labRwOrStc: true
      },
      exactAWeightedSourceRowsRemainPrecedence: true,
      landedGate: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_LANDED_GATE,
      newNumericAWeightedRuntimeMovement: true,
      previousFormulaLandedGate: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_LANDED_GATE,
      previousFormulaSelectedNextAction: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
      previousFormulaSelectedNextFile: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
      previousFormulaSelectionStatus: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTION_STATUS,
      runtimePromotionAllowedInGate: true,
      selectedImplementationSlice: "company_internal_calculation_grade_mainline",
      selectedNextAction: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
      selectedNextLabel: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL,
      selectionStatus: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      tolerancePins: {
        buildingAWeighted: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB,
        fieldAWeighted: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB
      }
    });
    assertCompanyInternalOpeningLeakAWeightedRuntimeCorridorContract(contract);

    for (const path of REQUIRED_A_WEIGHTED_RUNTIME_FILES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes explicit field Dn,A / DnT,A from same-route Dn,w / DnT,w and the owned adapter", () => {
    const contract = buildCompanyInternalOpeningLeakAWeightedRuntimeCorridorContract();

    expect(contract.fieldRuntimeProbe).toMatchObject({
      basisId: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
      computedDnADb: 35.9,
      computedDnTADb: 36.1,
      computedDnTwDb: 36.9,
      computedDnWDb: 36.7,
      computedRwPrimeDb: 36.4,
      errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB,
      frequencyBandSet: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET,
      origin: "family_physics_prediction",
      requestedMetrics: [...COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_RUNTIME_TARGET_OUTPUTS],
      selectedCandidateId: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID,
      supportedTargetOutputs: ["Dn,A", "DnT,A", "Dn,w", "DnT,w", "R'w"],
      unsupportedTargetOutputs: [],
      warningMatched: true
    });
  });

  it("promotes explicit building DnT,A without opening a building Dn,A alias", () => {
    const contract = buildCompanyInternalOpeningLeakAWeightedRuntimeCorridorContract();

    expect(contract.buildingRuntimeProbe).toMatchObject({
      basisId: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
      computedDnADb: null,
      computedDnTADb: 31.3,
      computedDnTwDb: 32.1,
      computedDnWDb: null,
      computedRwPrimeDb: 31.6,
      errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB,
      frequencyBandSet: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET,
      origin: "family_physics_prediction",
      requestedMetrics: [...COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_RUNTIME_TARGET_OUTPUTS],
      selectedCandidateId: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID,
      supportedTargetOutputs: ["DnT,A", "DnT,w", "R'w"],
      unsupportedTargetOutputs: ["Dn,A"],
      warningMatched: true
    });
    expect(contract.buildingDnAUnsupportedProbe).toMatchObject({
      basisId: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
      computedDnADb: null,
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Dn,A"]
    });
  });

  it("keeps frequency-band, lab alias, and base-runtime boundaries fail-closed", () => {
    const contract = buildCompanyInternalOpeningLeakAWeightedRuntimeCorridorContract();

    expect(contract.missingFrequencyBandSetProbe).toMatchObject({
      basisId: COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
      computedDnADb: null,
      computedDnTADb: null,
      computedDnTwDb: 36.9,
      computedDnWDb: 36.7,
      errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB,
      frequencyBandSet: null,
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Dn,A", "DnT,A"],
      warningMatched: false,
      warningMissingFrequencyBandSetMatched: true
    });
    expect(contract.labAliasProbe).toMatchObject({
      basisId: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      computedDnADb: null,
      computedDnTADb: null,
      computedRwDb: 38.2,
      supportedTargetOutputs: ["Rw", "STC"],
      unsupportedTargetOutputs: ["Dn,A", "DnT,A"]
    });
  });

  it("keeps docs and the current-gate runner aligned with the runtime closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_LANDED_GATE);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTION_STATUS);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE);
      expect(content, path).toContain(COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL);
      expect(content, path).toContain("field `Dn,A 35.9`");
      expect(content, path).toContain("field `DnT,A 36.1`");
      expect(content, path).toContain("building `DnT,A 31.3`");
      expect(content, path).toContain("frequencyBandSet");
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract.test.ts"
    );
  });
});
