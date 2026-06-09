import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  buildCompanyInternalCalculationGradeMainlineMatrixV6,
  summarizeCompanyInternalCalculationGradeMainlineMatrixV6
} from "./company-internal-calculation-grade-mainline-matrix";
import {
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB
} from "./company-internal-opening-leak-building-runtime-corridor";
import {
  POST_V1_GATE_EZ_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EZ_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-ez";
import { evaluatePostV1GateCLResidualLedgers } from "./post-v1-next-numeric-coverage-gap-gate-cl";
import {
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_LANDED_GATE,
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_ACTION,
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_FILE,
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_LABEL,
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTION_STATUS,
  POST_V1_GATE_FA_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_FA_PLAN_DOC_PATH,
  POST_V1_GATE_FA_REQUIRED_CLASSIFICATIONS,
  POST_V1_GATE_FA_SELECTED_GAP_ID,
  POST_V1_GATE_FA_TARGET_OUTPUTS,
  buildPostV1GateFACurrentCoverageAccuracyLedger,
  buildPostV1GateFACurrentImplementationEvidence,
  summarizePostV1GateFACurrentCoverageAccuracyGapLedger
} from "./post-v1-current-coverage-accuracy-gap-ledger-gate-fa";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "README.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/SYSTEM_MAP.md",
  "docs/calculator/USABLE_V1_EXECUTION_PLAN.md",
  "docs/calculator/POST_V1_GATE_EZ_FA_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_PLAN_2026-06-09.md",
  POST_V1_GATE_FA_PLAN_DOC_PATH
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function matrixRow(id: string) {
  const row = buildCompanyInternalCalculationGradeMainlineMatrixV6().find((entry) => entry.id === id);

  if (!row) {
    throw new Error(`Missing company-internal matrix row ${id}`);
  }

  return row;
}

describe("post-V1 current coverage/accuracy gap ledger Gate FA", () => {
  it("lands after Gate EZ and selects the opening/leak common-wall residual owner Gate FB", () => {
    const summary = summarizePostV1GateFACurrentCoverageAccuracyGapLedger();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ez_landed_no_runtime_selected_current_coverage_accuracy_gap_ledger_gate_fa"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_ACTION).toBe(
      POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-current-coverage-accuracy-gap-ledger-gate-fa-contract.test.ts"
    );

    expect(summary).toMatchObject({
      currentImplementationEvidence: buildPostV1GateFACurrentImplementationEvidence(),
      landedGate: POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_FA_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_FA_PLAN_DOC_PATH,
      previousGateEZ: {
        counters: POST_V1_GATE_EZ_NO_RUNTIME_COUNTERS,
        landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_LANDED_GATE,
        selectedCandidateId: POST_V1_GATE_EZ_SELECTED_CANDIDATE_ID,
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTION_STATUS
      },
      requiredClassifications: POST_V1_GATE_FA_REQUIRED_CLASSIFICATIONS,
      selectedGapId: POST_V1_GATE_FA_SELECTED_GAP_ID,
      selectedNextAction: POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTION_STATUS
    });
  });

  it("proves the current matrix has live opening/leak runtime rows plus preserved boundaries", () => {
    const rows = buildCompanyInternalCalculationGradeMainlineMatrixV6();
    const summary = summarizeCompanyInternalCalculationGradeMainlineMatrixV6(rows);

    expect(rows).toHaveLength(71);
    expect(summary.failureClassCounts.coverage_gap).toBe(0);
    expect(summary.hiddenScreeningOriginRowIds).toEqual([]);

    expect(matrixRow("wall.opening_leak_field_runtime.input_surface").runtime).toMatchObject({
      basisId: "company_internal_opening_leak_field_area_energy_runtime_corridor",
      errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB,
      supportedTargetOutputs: ["R'w", "Dn,w", "DnT,w"]
    });
    expect(matrixRow("wall.opening_leak_building_runtime.input_surface").runtime).toMatchObject({
      basisId: "company_internal_opening_leak_building_area_energy_runtime_corridor",
      errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
      supportedTargetOutputs: ["R'w", "DnT,w"]
    });
    expect(matrixRow("wall.opening_leak_a_weighted_field_runtime.input_surface").runtime).toMatchObject({
      basisId: "company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor",
      errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB,
      supportedTargetOutputs: ["Dn,A", "DnT,A"]
    });
    expect(matrixRow("wall.opening_leak_a_weighted_building_runtime.input_surface").runtime).toMatchObject({
      basisId: "company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor",
      errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB,
      supportedTargetOutputs: ["DnT,A"]
    });

    expect(matrixRow("wall.opening_leak_building_missing_owner.needs_input").currentPosture).toBe("needs_input");
    expect(matrixRow("wall.opening_leak_a_weighted_missing_frequency.needs_input").currentPosture).toBe("needs_input");
    expect(matrixRow("wall.opening_leak_a_weighted_building_dna.unsupported").currentPosture).toBe("unsupported");
    expect(matrixRow("wall.opening_leak_a_weighted_lab_alias.unsupported").currentPosture).toBe("unsupported");
    expect(matrixRow("wall.opening_leak_a_weighted_astm_alias.unsupported").currentPosture).toBe("unsupported");
  }, 15000);

  it("ranks same-basis residual ownership above runtime tightening, floor holdouts, rejected heavy-core, closed repeats, and non-goal work", () => {
    const ledgerRows = buildPostV1GateFACurrentCoverageAccuracyLedger();
    const selected = ledgerRows.find((row) => row.selected);
    const byId = new Map(ledgerRows.map((row) => [row.id, row]));
    const classifications = new Set(ledgerRows.map((row) => row.classification));

    expect(ledgerRows).toHaveLength(POST_V1_GATE_FA_NO_RUNTIME_COUNTERS.ledgerRows);
    for (const classification of POST_V1_GATE_FA_REQUIRED_CLASSIFICATIONS) {
      expect(classifications.has(classification), classification).toBe(true);
    }
    expect(ledgerRows.filter((row) => row.selected)).toHaveLength(1);

    expect(selected).toMatchObject({
      classification: "owner_gap",
      id: POST_V1_GATE_FA_SELECTED_GAP_ID,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesNeedsInputUnsupportedBoundaries: true,
      selectedNextActionIfSelected:
        POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected:
        POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_FILE,
      sourceRowsImportedNow: false,
      sourceRowsRequiredBeforeRuntime: true,
      targetMetrics: POST_V1_GATE_FA_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false,
      valueMovementAllowedNow: false
    });
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.opening_leak_field_building_a_weighted_budget_tightening_after_owner")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("floor.raw_bare_and_floating_holdout_candidate_not_selected")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.heavy_core_lined_massive_owner_still_rejected")?.score ?? 0
    );
    expect(byId.get("broad_source_crawl_confidence_frontend_non_goal")).toMatchObject({
      passesCalculatorAdvancementTest: false,
      preservesNeedsInputUnsupportedBoundaries: false,
      valueMovementAllowedNow: false
    });
  });

  it("ties the selected owner gap back to Gate CL residual blockers without moving values", () => {
    const selected = buildPostV1GateFACurrentCoverageAccuracyLedger().find((row) => row.selected);
    const residualLedgers = evaluatePostV1GateCLResidualLedgers();
    const openingLeakResidual = residualLedgers.find((ledger) =>
      ledger.id === "wall.opening_leak_composite.field_building_gate_ck"
    );
    const commonWallResidual = residualLedgers.find((ledger) =>
      ledger.id === "wall.common_flat_double_leaf.building_prediction_gate_cj"
    );

    expect(openingLeakResidual).toMatchObject({
      budgetDecision: "hold_wide_budget",
      budgetTighteningAdmitted: false,
      holdoutRowIds: [],
      metricBasis: "field_and_building_prediction",
      runtimePromotionAdmitted: false
    });
    expect(commonWallResidual).toMatchObject({
      budgetDecision: "hold_wide_budget",
      budgetTighteningAdmitted: false,
      holdoutRowIds: [],
      metricBasis: "building_prediction",
      runtimePromotionAdmitted: false
    });
    expect(selected?.expectedNextEffect).toEqual(
      expect.arrayContaining([
        "prove same-basis residual owners before tightening opening/leak field/building/A-weighted budgets",
        "keep all source-absent runtime values frozen until owner proof passes"
      ])
    );
    expect(POST_V1_GATE_FA_NO_RUNTIME_COUNTERS).toMatchObject({
      frontendImplementationFilesTouched: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("ties every ledger row to implementation evidence and keeps Gate FA no-runtime", () => {
    const ledgerRows = buildPostV1GateFACurrentCoverageAccuracyLedger();

    for (const row of ledgerRows) {
      for (const path of row.currentEvidence) {
        expect(existsSync(join(REPO_ROOT, path)), `${row.id}:${path}`).toBe(true);
      }
    }

    expect(ledgerRows.some((row) => row.valueMovementAllowedNow)).toBe(false);
    expect(ledgerRows.some((row) => row.sourceRowsImportedNow)).toBe(false);
    expect(ledgerRows.some((row) => row.touchesFrontendImplementationNow)).toBe(false);
    expect(ledgerRows.some((row) => row.touchesSharedOrApiSurfaceNow)).toBe(false);
  });

  it("keeps docs and current-gate runner aligned with Gate FA closeout and Gate FB selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);
      const normalizedWhitespaceContent = contents.replace(/\s+/g, " ");

      expect(contents, path).toContain(POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_FA_SELECTED_GAP_ID);
      expect(contents, path).toContain("Gate FB");
      expect(normalizedWhitespaceContent, path).toContain("same-basis residual owner");
      expect(normalizedWhitespaceContent, path).toContain("opening/leak");
      expect(normalizedWhitespaceContent, path).toContain("common wall");
      expect(contents, path).toContain("ledgerRows 11");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const plan = readRepoFile(POST_V1_GATE_FA_PLAN_DOC_PATH);
    expect(plan).toContain("Gate FA Ledger");
    expect(plan).toContain("Gate FB Work Order");
    expect(plan).toContain("field/building/A-weighted");
    expect(plan).toContain("source-absent runtime values frozen");

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-ez-contract.test.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-current-coverage-accuracy-gap-ledger-gate-fa-contract.test.ts"
    );
  });
});
