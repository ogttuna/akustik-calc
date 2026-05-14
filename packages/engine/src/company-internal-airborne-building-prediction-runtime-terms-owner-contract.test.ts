import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  assertCompanyInternalAirborneBuildingPredictionRuntimeTermsOwnerContract,
  buildCompanyInternalAirborneBuildingPredictionRuntimeTermsOwnerContract,
  COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_LANDED_GATE,
  COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTED_NEXT_LABEL,
  COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTION_STATUS
} from "./company-internal-airborne-building-prediction-runtime-terms-owner-contract";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_BUILDING_ERROR_BUDGET_DB,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_BUILDING_RUNTIME_METHOD
} from "./calculator-personal-use-mvp-coverage-sprint-gate-at";
import {
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTION_STATUS
} from "./company-internal-steel-suspended-ceiling-delta-lw-owner-contract";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB } from "./dynamic-airborne-gate-o-building-prediction-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_COMPANY_INTERNAL_BUILDING_RECONCILIATION_SURFACES = [
  "packages/engine/src/company-internal-airborne-building-prediction-runtime-terms-owner-contract.ts",
  "packages/engine/src/company-internal-airborne-building-prediction-runtime-terms-owner-contract.test.ts",
  "packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-owner-contract.ts",
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ar-airborne-building-prediction-all-owner-runtime-corridor-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-as-airborne-building-prediction-surface-parity-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-at-acceptance-matrix-refresh-after-building-prediction-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_RESEARCH_BACKED_COMPANY_INTERNAL_ROADMAP.md",
  "docs/calculator/SLICE_COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
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
  "docs/calculator/CHECKPOINT_2026-05-14_RESEARCH_BACKED_COMPANY_INTERNAL_ROADMAP.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("company-internal airborne building-prediction runtime terms owner reconciliation", () => {
  it("lands the selected company-internal reconciliation contract and selects matrix v2 refresh", () => {
    const contract = buildCompanyInternalAirborneBuildingPredictionRuntimeTermsOwnerContract();

    expect(contract).toMatchObject({
      existingGateAtRuntimeAccepted: true,
      gateAtBuildingErrorBudgetDb: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_BUILDING_ERROR_BUDGET_DB,
      gateAtBuildingRuntimeMethod: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_BUILDING_RUNTIME_METHOD,
      landedGate: COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_LANDED_GATE,
      newNumericRuntimeBehaviorChange: false,
      previousSteelOwnerSelectedNextAction:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTED_NEXT_ACTION,
      previousSteelOwnerSelectedNextFile:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTED_NEXT_FILE,
      previousSteelOwnerSelectionStatus:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTION_STATUS,
      selectedImplementationSlice: "company_internal_calculation_grade_mainline",
      selectedNextAction: COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTED_NEXT_FILE,
      selectedNextLabel: COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTED_NEXT_LABEL,
      selectionStatus: COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });

    assertCompanyInternalAirborneBuildingPredictionRuntimeTermsOwnerContract(contract);

    for (const path of REQUIRED_COMPANY_INTERNAL_BUILDING_RECONCILIATION_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("accepts the existing Gate AR/AS/AT complete building runtime without moving values", () => {
    const contract = buildCompanyInternalAirborneBuildingPredictionRuntimeTermsOwnerContract();

    expect(contract.completeBuildingProbe).toMatchObject({
      basisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      candidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      dnTw: 59,
      errorBudgetDb: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction",
      requestedMetrics: ["R'w", "DnT,w"],
      rwPrime: 58,
      supportedTargetOutputs: ["R'w", "DnT,w"],
      unsupportedTargetOutputs: []
    });
    expect(contract.existingGateAtBuildingRowsToImport).toEqual([
      "wall.complete_building_prediction.runtime",
      "wall.complete_building_prediction_broad_targets.alias_boundary"
    ]);
  });

  it("keeps partial context, lab aliases, and opening/leak building requests fail-closed", () => {
    const contract = buildCompanyInternalAirborneBuildingPredictionRuntimeTermsOwnerContract();

    expect(contract.partialBuildingProbe).toMatchObject({
      basisId: "dynamic_calculator_route_input_contract_missing_physical_fields",
      candidateId: "candidate_dynamic_needs_input",
      dnTw: null,
      errorBudgetDb: null,
      missingPhysicalInputs: ["receivingRoomVolumeM3", "receivingRoomRt60S"],
      origin: "needs_input",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["R'w", "DnT,w"]
    });
    expect(contract.labAliasProbe).toMatchObject({
      basisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      candidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      dnTw: 59,
      errorBudgetDb: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
      origin: "family_physics_prediction",
      requestedMetrics: ["Rw", "STC", "R'w", "DnT,w"],
      rwPrime: 58,
      supportedTargetOutputs: ["R'w", "DnT,w"],
      unsupportedTargetOutputs: ["Rw", "STC"]
    });
    expect(contract.openingLeakBuildingProbe).toMatchObject({
      basisId: "dynamic_calculator_building_prediction_runtime_adapter_owner_missing",
      candidateId: "candidate_dynamic_unsupported",
      dnTw: null,
      errorBudgetDb: null,
      origin: "unsupported",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Rw", "STC", "R'w", "DnT,w"]
    });
  });

  it("documents the active company matrix drift that matrix v2 must fix next", () => {
    const contract = buildCompanyInternalAirborneBuildingPredictionRuntimeTermsOwnerContract();

    expect(contract.currentCompanyMatrixRows).toBe(61);
    expect(contract.currentCompanyMatrixStaleBuildingRowIds).toEqual([
      "wall.building_prediction_missing_context.needs_input"
    ]);
    expect(contract.currentCompanyMatrixHiddenScreeningOriginRowIds).toEqual([
      "floor.heavy_concrete_floating_floor.lab"
    ]);
  });

  it("keeps docs and current-gate runner aligned with the landed reconciliation and matrix-v2 selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_LANDED_GATE);
      expect(content, path).toContain(COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTION_STATUS);
      expect(content, path).toContain(
        COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTED_NEXT_ACTION
      );
      expect(content, path).toContain(
        COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTED_NEXT_FILE
      );
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "company-internal-airborne-building-prediction-runtime-terms-owner-contract.test.ts"
    );
  });
});
