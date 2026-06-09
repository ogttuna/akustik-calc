import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_LANDED_GATE,
  POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTION_STATUS,
  POST_V1_GATE_FD_COUNTERS,
  POST_V1_GATE_FD_OWNER_DECISION_ID,
  POST_V1_GATE_FD_PLAN_DOC_PATH
} from "./post-v1-floor-raw-bare-and-floating-same-basis-holdout-gate-fd";
import {
  POST_V1_GATE_FE_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_FE_PLAN_DOC_PATH,
  POST_V1_GATE_FE_ROI_ANALYSIS_ITERATIONS,
  POST_V1_GATE_FE_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_FE_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTION_STATUS,
  buildPostV1GateFECurrentEvidence,
  rankPostV1GateFENumericCoverageCandidates,
  summarizePostV1GateFENumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-fe";

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
  POST_V1_GATE_FD_PLAN_DOC_PATH,
  POST_V1_GATE_FE_PLAN_DOC_PATH
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage/accuracy gap Gate FE", () => {
  it("lands after Gate FD and selects the current formula scope/accuracy ledger Gate FF", () => {
    const summary = summarizePostV1GateFENumericCoverageGap();

    expect(POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTION_STATUS).toBe(
      "post_v1_floor_raw_bare_and_floating_same_basis_holdout_gate_fd_landed_no_runtime_owner_rejected_selected_next_numeric_coverage_gap_gate_fe"
    );
    expect(POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_LANDED_GATE
    );
    expect(POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-fe-contract.test.ts"
    );

    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_FE_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_FE_PLAN_DOC_PATH,
      previousGateFD: {
        counters: POST_V1_GATE_FD_COUNTERS,
        landedGate: POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_LANDED_GATE,
        ownerDecisionId: POST_V1_GATE_FD_OWNER_DECISION_ID,
        planDocPath: POST_V1_GATE_FD_PLAN_DOC_PATH,
        selectedNextAction:
          POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_ACTION,
        selectedNextFile:
          POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_FILE,
        selectionStatus:
          POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTION_STATUS
      },
      roiAnalysisIterations: POST_V1_GATE_FE_ROI_ANALYSIS_ITERATIONS,
      selectedCandidateId: POST_V1_GATE_FE_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_FE_TARGET_OUTPUTS
    });
  });

  it("ranks the current formula scope ledger above rejected budget work and stale cartography labels", () => {
    const candidates = rankPostV1GateFENumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_FE_NO_RUNTIME_COUNTERS.candidateCount);
    expect(candidates.map((candidate) => candidate.candidateOrder)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(POST_V1_GATE_FE_ROI_ANALYSIS_ITERATIONS).toHaveLength(2);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_FE_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      preservesBoundaryCorrectness: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_FILE,
      sliceKind: "current_formula_scope_accuracy_gap_ledger",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_FE_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    });
    expect(selected?.score).toBeGreaterThan(
      byId.get("floor.raw_bare_floating_budget_tightening_rejected_by_gate_fd")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.opening_leak_common_wall_budget_tightening_rejected_by_gate_fb")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.concrete_heavy_core_cartography_runtime_widening_stale_after_gate_ey")?.score ?? 0
    );
    expect(byId.get("rockwool_split_triple_leaf_source_packet_refresh_not_current_runtime_candidate")).toMatchObject({
      passesCalculatorAdvancementTest: false,
      selected: false,
      sliceKind: "blocked_source_packet"
    });
  });

  it("records why Gate FE is no-runtime and why Gate FF is required before values move", () => {
    expect(buildPostV1GateFECurrentEvidence()).toEqual({
      gateFDOwnerRejected: true,
      gateFDRuntimeBudgetTighteningAdmitted: 0,
      immediateSafeRuntimeCandidateCount: 0,
      requiresCurrentFormulaScopeLedgerBeforeRuntimeMovement: true,
      selectedCandidateId: POST_V1_GATE_FE_SELECTED_CANDIDATE_ID,
      staleCartographyRuntimeWideningIds: [
        "wall.concrete_heavy_core_screening.field",
        "wall.timber_stud_formula.field",
        "wall.clt_formula.field",
        "floor.steel_fallback_low_confidence.field"
      ]
    });
    expect(POST_V1_GATE_FE_NO_RUNTIME_COUNTERS).toMatchObject({
      blockedOwnerOrHoldoutRows: 3,
      broadSourceCrawlSelected: false,
      immediateRuntimeCandidatesSelected: 0,
      runtimeBasisPromotions: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourcePacketRowsRejectedAsCurrentRuntime: 1,
      sourceRowsImported: 0,
      staleCartographyRuntimeWideningRows: 4
    });
    expect(rankPostV1GateFENumericCoverageCandidates().some((candidate) =>
      candidate.nextActionMovesRuntimeValues
    )).toBe(false);
  });

  it("ties every Gate FE candidate to existing implementation evidence", () => {
    for (const candidate of rankPostV1GateFENumericCoverageCandidates()) {
      for (const path of candidate.implementationEvidencePaths) {
        expect(existsSync(join(REPO_ROOT, path)), `${candidate.id}:${path}`).toBe(true);
      }
    }
  });

  it("keeps docs and current-gate runner aligned with Gate FE closeout and Gate FF selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);
      const normalizedWhitespaceContent = contents.replace(/\s+/g, " ");

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_FE_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("Gate FF");
      expect(normalizedWhitespaceContent, path).toContain("formula scope");
      expect(contents, path).toContain("roiAnalysisIterations: 2");
      expect(contents, path).toContain("staleCartographyRuntimeWideningRows 4");
      expect(contents, path).toContain("immediateRuntimeCandidatesSelected 0");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const plan = readRepoFile(POST_V1_GATE_FE_PLAN_DOC_PATH);
    expect(plan).toContain("Gate FE Iteration 1");
    expect(plan).toContain("Gate FE Iteration 2");
    expect(plan).toContain("Gate FF Work Order");
    expect(plan.replace(/\s+/g, " ")).toContain("not a broad source crawl");

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-raw-bare-and-floating-same-basis-holdout-gate-fd-contract.test.ts"
    );
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-fe-contract.test.ts");
  });
});
