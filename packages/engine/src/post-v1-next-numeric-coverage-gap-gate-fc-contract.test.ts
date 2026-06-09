import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  evaluatePostV1GateCLResidualLedgers
} from "./post-v1-next-numeric-coverage-gap-gate-cl";
import {
  POST_V1_GATE_FB_COUNTERS,
  POST_V1_GATE_FB_OWNER_DECISION_ID,
  POST_V1_GATE_FB_PLAN_DOC_PATH,
  POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_LANDED_GATE,
  POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_ACTION,
  POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_FILE,
  POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTION_STATUS
} from "./post-v1-opening-leak-common-wall-same-basis-residual-owner-gate-fb";
import {
  POST_V1_GATE_FC_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_FC_PLAN_DOC_PATH,
  POST_V1_GATE_FC_ROI_ANALYSIS_ITERATIONS,
  POST_V1_GATE_FC_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_FC_SELECTED_RESIDUAL_LEDGER_IDS,
  POST_V1_GATE_FC_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTION_STATUS,
  buildPostV1GateFCCurrentEvidence,
  buildPostV1GateFCSelectedFloorResidualLedgers,
  rankPostV1GateFCNumericCoverageCandidates,
  summarizePostV1GateFCNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-fc";

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
  POST_V1_GATE_FB_PLAN_DOC_PATH,
  POST_V1_GATE_FC_PLAN_DOC_PATH
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage/accuracy gap Gate FC", () => {
  it("lands after Gate FB and selects the floor raw-bare/floating holdout prerequisite Gate FD", () => {
    const summary = summarizePostV1GateFCNumericCoverageGap();

    expect(POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTION_STATUS).toBe(
      "post_v1_opening_leak_common_wall_same_basis_residual_owner_gate_fb_landed_no_runtime_owner_rejected_selected_next_numeric_coverage_gap_gate_fc"
    );
    expect(POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_LANDED_GATE
    );
    expect(POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-fc-contract.test.ts"
    );

    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_FC_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_FC_PLAN_DOC_PATH,
      previousGateFB: {
        counters: POST_V1_GATE_FB_COUNTERS,
        landedGate: POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_LANDED_GATE,
        ownerDecisionId: POST_V1_GATE_FB_OWNER_DECISION_ID,
        planDocPath: POST_V1_GATE_FB_PLAN_DOC_PATH,
        selectedNextAction:
          POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_ACTION,
        selectedNextFile:
          POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_FILE,
        selectionStatus:
          POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTION_STATUS
      },
      roiAnalysisIterations: POST_V1_GATE_FC_ROI_ANALYSIS_ITERATIONS,
      selectedCandidateId: POST_V1_GATE_FC_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_FC_TARGET_OUTPUTS
    });
  });

  it("selects only Gate CL floor residual ledgers that still lack same-basis holdouts", () => {
    const selectedLedgers = buildPostV1GateFCSelectedFloorResidualLedgers();
    const allResidualLedgers = evaluatePostV1GateCLResidualLedgers();

    expect(selectedLedgers.map((ledger) => ledger.id)).toEqual(
      POST_V1_GATE_FC_SELECTED_RESIDUAL_LEDGER_IDS
    );
    expect(selectedLedgers).toHaveLength(POST_V1_GATE_FC_NO_RUNTIME_COUNTERS.floorResidualLedgersSelected);
    expect(allResidualLedgers.filter((ledger) => ledger.route === "floor")).toHaveLength(3);

    for (const ledger of selectedLedgers) {
      expect(ledger).toMatchObject({
        budgetDecision: "hold_wide_budget",
        budgetTighteningAdmitted: false,
        holdoutRowIds: [],
        noRuntimeValueMovement: true,
        observedMaeDb: null,
        route: "floor",
        runtimePromotionAdmitted: false
      });
      expect(ledger.currentErrorBudgetDb, ledger.id).toBeGreaterThanOrEqual(8);
      expect(ledger.blockers.length, ledger.id).toBeGreaterThan(0);
      expect(ledger.metrics.some((metric) => POST_V1_GATE_FC_TARGET_OUTPUTS.includes(metric))).toBe(true);
    }
  });

  it("ranks the targeted floor prerequisite above Gate FB-blocked wall paths, heavy-core retune, closed repeats, and non-goal work", () => {
    const candidates = rankPostV1GateFCNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_FC_NO_RUNTIME_COUNTERS.candidateCount);
    expect(candidates.map((candidate) => candidate.candidateOrder)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(POST_V1_GATE_FC_ROI_ANALYSIS_ITERATIONS).toHaveLength(2);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_FC_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      preservesBoundaryCorrectness: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_FILE,
      sliceKind: "targeted_accuracy_holdout_prerequisite",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: POST_V1_GATE_FC_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    });
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.opening_leak_field_building_a_weighted_budget_tightening_rejected_by_gate_fb")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.common_flat_double_leaf_building_budget_tightening_rejected_by_gate_fb")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.heavy_core_lined_massive_owner_still_rejected_after_gate_ey")?.score ?? 0
    );
    expect(byId.get("broad_source_crawl_confidence_frontend_non_goal")).toMatchObject({
      passesCalculatorAdvancementTest: false,
      preservesBoundaryCorrectness: false,
      selected: false,
      sliceKind: "blocked_non_goal"
    });
  });

  it("keeps Gate FC no-runtime and records why no immediate value movement is safe", () => {
    expect(buildPostV1GateFCCurrentEvidence()).toEqual({
      gateFBRejectedOpeningLeakCommonWallOwner: true,
      gateFBRuntimeBudgetTighteningAdmitted: 0,
      immediateValueMovingCandidateCount: 0,
      selectedCandidateId: POST_V1_GATE_FC_SELECTED_CANDIDATE_ID,
      selectedResidualLedgerIds: POST_V1_GATE_FC_SELECTED_RESIDUAL_LEDGER_IDS
    });
    expect(POST_V1_GATE_FC_NO_RUNTIME_COUNTERS).toMatchObject({
      blockedByGateFBOwnerRejectionRows: 2,
      blockedHeavyCoreOwnerRejectedRows: 1,
      broadSourceCrawlSelected: false,
      closedRepeatRows: 5,
      immediateRuntimeCandidatesSelected: 0,
      runtimeBasisPromotions: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
    expect(rankPostV1GateFCNumericCoverageCandidates().some((candidate) =>
      candidate.nextActionMovesRuntimeValues
    )).toBe(false);
  });

  it("ties every candidate to existing implementation evidence", () => {
    for (const candidate of rankPostV1GateFCNumericCoverageCandidates()) {
      for (const path of candidate.currentEvidencePaths) {
        expect(existsSync(join(REPO_ROOT, path)), `${candidate.id}:${path}`).toBe(true);
      }
    }
  });

  it("keeps docs and current-gate runner aligned with Gate FC closeout and Gate FD selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);
      const normalizedWhitespaceContent = contents.replace(/\s+/g, " ");

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_FC_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("Gate FD");
      expect(contents, path).toContain("floor raw-bare");
      expect(normalizedWhitespaceContent, path).toContain("same-basis holdout");
      expect(contents, path).toContain("roiAnalysisIterations: 2");
      expect(contents, path).toContain("estimatedNextTargetedHoldoutLedgers 3");
      expect(contents, path).toContain("broadSourceCrawlSelected false");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const plan = readRepoFile(POST_V1_GATE_FC_PLAN_DOC_PATH);
    expect(plan).toContain("Gate FC Iteration 1");
    expect(plan).toContain("Gate FC Iteration 2");
    expect(plan).toContain("Gate FD Work Order");
    expect(plan.replace(/\s+/g, " ")).toContain("not a broad source crawl");

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-opening-leak-common-wall-same-basis-residual-owner-gate-fb-contract.test.ts"
    );
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-fc-contract.test.ts");
  });
});
