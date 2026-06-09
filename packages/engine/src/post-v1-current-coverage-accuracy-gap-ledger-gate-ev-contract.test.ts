import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  POST_V1_GATE_EU_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EU_PLAN_DOC_PATH,
  POST_V1_GATE_EU_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-eu";
import {
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_LANDED_GATE,
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_ACTION,
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_FILE,
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_LABEL,
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTION_STATUS,
  POST_V1_GATE_EV_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EV_PLAN_DOC_PATH,
  POST_V1_GATE_EV_REQUIRED_CLASSIFICATIONS,
  POST_V1_GATE_EV_SELECTED_GAP_ID,
  POST_V1_GATE_EV_TARGET_OUTPUTS,
  buildPostV1GateEVCurrentCoverageAccuracyLedger,
  summarizePostV1GateEVCurrentCoverageAccuracyGapLedger
} from "./post-v1-current-coverage-accuracy-gap-ledger-gate-ev";

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
  POST_V1_GATE_EU_PLAN_DOC_PATH,
  POST_V1_GATE_EV_PLAN_DOC_PATH
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 current coverage/accuracy gap ledger Gate EV", () => {
  it("lands after Gate EU and selects the heavy-core / lined-massive calibration owner Gate EW", () => {
    const summary = summarizePostV1GateEVCurrentCoverageAccuracyGapLedger();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_eu_landed_no_runtime_selected_current_coverage_accuracy_gap_ledger_gate_ev"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_ACTION).toBe(
      POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-current-coverage-accuracy-gap-ledger-gate-ev-contract.test.ts"
    );

    expect(summary).toMatchObject({
      landedGate: POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_EV_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_EV_PLAN_DOC_PATH,
      previousGateEU: {
        counters: POST_V1_GATE_EU_NO_RUNTIME_COUNTERS,
        landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_LANDED_GATE,
        selectedCandidateId: POST_V1_GATE_EU_SELECTED_CANDIDATE_ID,
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTION_STATUS
      },
      requiredClassifications: POST_V1_GATE_EV_REQUIRED_CLASSIFICATIONS,
      selectedGapId: POST_V1_GATE_EV_SELECTED_GAP_ID,
      selectedNextAction: POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTION_STATUS
    });
  });

  it("ranks the owner gap above retune, closed-repeat, blocked-source, and non-goal rows", () => {
    const ledgerRows = buildPostV1GateEVCurrentCoverageAccuracyLedger();
    const selected = ledgerRows.find((row) => row.selected);
    const byId = new Map(ledgerRows.map((row) => [row.id, row]));
    const classifications = new Set(ledgerRows.map((row) => row.classification));

    expect(ledgerRows).toHaveLength(POST_V1_GATE_EV_NO_RUNTIME_COUNTERS.ledgerRows);
    for (const classification of POST_V1_GATE_EV_REQUIRED_CLASSIFICATIONS) {
      expect(classifications.has(classification), classification).toBe(true);
    }
    expect(ledgerRows.filter((row) => row.selected)).toHaveLength(1);

    expect(selected).toMatchObject({
      classification: "owner_gap",
      id: POST_V1_GATE_EV_SELECTED_GAP_ID,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesNeedsInputUnsupportedBoundaries: true,
      selectedNextActionIfSelected:
        POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected:
        POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_FILE,
      sourceRowsImportedNow: false,
      sourceRowsRequiredBeforeRuntime: true,
      targetMetrics: POST_V1_GATE_EV_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false,
      valueMovementAllowedNow: false
    });
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.heavy_core_lined_massive_runtime_retune_after_owner")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.visible_route_reconciliation_closed_repeat")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("opening_leak_common_wall_holdout_tightening_blocked")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("broad_source_crawl_confidence_frontend_non_goal")?.score ?? 0
    );
  });

  it("ties every ledger row to current evidence and keeps Gate EV no-runtime", () => {
    const ledgerRows = buildPostV1GateEVCurrentCoverageAccuracyLedger();

    for (const row of ledgerRows) {
      for (const path of row.evidencePaths) {
        expect(existsSync(join(REPO_ROOT, path)), `${row.id}:${path}`).toBe(true);
      }
    }

    expect(POST_V1_GATE_EV_NO_RUNTIME_COUNTERS).toMatchObject({
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeBasisPromotions: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
    expect(ledgerRows.some((row) => row.valueMovementAllowedNow)).toBe(false);
    expect(ledgerRows.some((row) => row.sourceRowsImportedNow)).toBe(false);
    expect(ledgerRows.some((row) => row.touchesFrontendImplementationNow)).toBe(false);
    expect(ledgerRows.some((row) => row.touchesSharedOrApiSurfaceNow)).toBe(false);
  });

  it("guards the heavy-core / lined-massive retune behind the selected owner proof", () => {
    const byId = new Map(
      buildPostV1GateEVCurrentCoverageAccuracyLedger().map((row) => [row.id, row])
    );
    const selected = byId.get(POST_V1_GATE_EV_SELECTED_GAP_ID);
    const runtimeCandidate = byId.get("wall.heavy_core_lined_massive_runtime_retune_after_owner");
    const nonGoal = byId.get("broad_source_crawl_confidence_frontend_non_goal");

    expect(selected?.expectedNextEffect).toEqual(
      expect.arrayContaining([
        "prove whether the existing bounded lined-massive/heavy-core wall route has a calibration owner",
        "keep the current bounded_prediction values frozen during owner proof"
      ])
    );
    expect(runtimeCandidate).toMatchObject({
      classification: "runtime_candidate",
      ownerProofRequiredBeforeRuntime: true,
      sourceRowsImportedNow: false,
      sourceRowsRequiredBeforeRuntime: true,
      valueMovementAllowedNow: false
    });
    expect(nonGoal).toMatchObject({
      classification: "blocked_non_goal",
      passesCalculatorAdvancementTest: false,
      preservesNeedsInputUnsupportedBoundaries: false,
      valueMovementAllowedNow: false
    });
  });

  it("keeps docs and current-gate runner aligned with Gate EV closeout and Gate EW selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);
      const normalizedWhitespaceContent = contents.replace(/\s+/g, " ");

      expect(contents, path).toContain(
        POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTION_STATUS
      );
      expect(contents, path).toContain(
        POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_ACTION
      );
      expect(contents, path).toContain(
        POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_FILE
      );
      expect(contents, path).toContain(POST_V1_GATE_EV_SELECTED_GAP_ID);
      expect(contents, path).toContain("Gate EW");
      expect(normalizedWhitespaceContent, path).toContain(
        "heavy-core / lined-massive calibration owner"
      );
      expect(contents, path).toContain("ledgerRows 10");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const plan = readRepoFile(POST_V1_GATE_EV_PLAN_DOC_PATH);
    expect(plan).toContain("Gate EV Ledger");
    expect(plan).toContain("Gate EW Work Order");
    expect(plan).toContain("wall-specific lined concrete or heavy-masonry source row");
    expect(plan).toContain("bounded_prediction values frozen");
    expect(plan).toContain("runtimeValuesMoved 0");

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-eu-contract.test.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-current-coverage-accuracy-gap-ledger-gate-ev-contract.test.ts"
    );
  });
});
