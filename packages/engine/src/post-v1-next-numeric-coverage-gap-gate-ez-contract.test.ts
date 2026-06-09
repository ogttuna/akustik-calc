import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  POST_V1_GATE_EY_EVIDENCE_DECISION_ID,
  POST_V1_GATE_EY_NO_RUNTIME_COUNTERS,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_LANDED_GATE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_ACTION,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_FILE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTION_STATUS
} from "./post-v1-wall-heavy-core-lined-massive-targeted-evidence-acquisition-gate-ey";
import {
  POST_V1_GATE_EZ_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EZ_PLAN_DOC_PATH,
  POST_V1_GATE_EZ_ROI_ANALYSIS_ITERATIONS,
  POST_V1_GATE_EZ_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_EZ_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTION_STATUS,
  buildPostV1GateEZClosedRouteEvidence,
  rankPostV1GateEZNumericCoverageCandidates,
  summarizePostV1GateEZNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-ez";

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
  POST_V1_GATE_EZ_PLAN_DOC_PATH
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage/accuracy gap Gate EZ", () => {
  it("lands after Gate EY and selects the current coverage/accuracy ledger Gate FA", () => {
    const summary = summarizePostV1GateEZNumericCoverageGap();

    expect(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTION_STATUS).toBe(
      "post_v1_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey_landed_no_runtime_owner_remains_rejected_selected_next_numeric_coverage_gap_gate_ez"
    );
    expect(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_LANDED_GATE
    );
    expect(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ez-contract.test.ts"
    );

    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_EZ_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_EZ_PLAN_DOC_PATH,
      previousGateEY: {
        counters: POST_V1_GATE_EY_NO_RUNTIME_COUNTERS,
        decisionId: POST_V1_GATE_EY_EVIDENCE_DECISION_ID,
        landedGate: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_LANDED_GATE,
        selectedNextAction: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTION_STATUS
      },
      roiAnalysisIterations: POST_V1_GATE_EZ_ROI_ANALYSIS_ITERATIONS,
      selectedCandidateId: POST_V1_GATE_EZ_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTION_STATUS
    });
  });

  it("ranks the fresh current ledger above blocked heavy-core retune, opening/leak holdouts, closed repeats, and non-goal work", () => {
    const candidates = rankPostV1GateEZNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_EZ_NO_RUNTIME_COUNTERS.candidateCount);
    expect(POST_V1_GATE_EZ_ROI_ANALYSIS_ITERATIONS).toHaveLength(2);
    expect(candidates.map((candidate) => candidate.candidateOrder)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_EZ_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      preservesBoundaryCorrectness: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_FILE,
      sliceKind: "current_coverage_accuracy_gap_ledger",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EZ_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    });
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.heavy_core_lined_massive_runtime_retune_after_gate_ey_still_blocked")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("opening_leak_holdout_tightening_without_current_owner_ledger_blocked")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(byId.get("wall.direct_fixed_field_building_closed_repeat")?.score ?? 0);
    expect(byId.get("broad_source_crawl_confidence_frontend_non_goal")).toMatchObject({
      passesCalculatorAdvancementTest: false,
      preservesBoundaryCorrectness: false,
      sliceKind: "blocked_non_goal"
    });
  });

  it("records why Gate EZ cannot safely choose the old heavy-core or holdout candidates", () => {
    expect(buildPostV1GateEZClosedRouteEvidence()).toEqual({
      heavyCoreOwnerRemainsRejectedAfterGateEY: true,
      mwi2aAndB226010ContextOnly: true,
      oldGateEVEXCandidateListExhaustedOrBlocked: true,
      requiresFreshImplementationLedgerBeforeRuntimeMovement: true,
      selectedCandidateId: POST_V1_GATE_EZ_SELECTED_CANDIDATE_ID
    });

    expect(POST_V1_GATE_EZ_NO_RUNTIME_COUNTERS).toMatchObject({
      broadSourceCrawlSelected: false,
      heavyCoreLinedMassiveRuntimeStillBlocked: true,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("ties every candidate to implementation evidence and keeps Gate EZ no-runtime", () => {
    const candidates = rankPostV1GateEZNumericCoverageCandidates();

    for (const candidate of candidates) {
      for (const path of candidate.implementationEvidencePaths) {
        expect(existsSync(join(REPO_ROOT, path)), `${candidate.id}:${path}`).toBe(true);
      }
    }

    expect(candidates.some((candidate) => candidate.nextActionMovesRuntimeValues)).toBe(false);
    expect(candidates.some((candidate) => candidate.touchesFrontendImplementationNow)).toBe(false);
    expect(candidates.some((candidate) => candidate.touchesSharedOrApiSurfaceNow)).toBe(false);
    expect(POST_V1_GATE_EZ_NO_RUNTIME_COUNTERS).toMatchObject({
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeBasisPromotions: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("keeps docs and current-gate runner aligned with Gate EZ closeout and Gate FA selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);
      const normalizedWhitespaceContent = contents.replace(/\s+/g, " ");

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_EZ_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("Gate FA");
      expect(normalizedWhitespaceContent, path).toContain("current coverage/accuracy gap ledger");
      expect(normalizedWhitespaceContent, path).toContain("Gate EY");
      expect(normalizedWhitespaceContent, path).toContain("heavy-core");
      expect(normalizedWhitespaceContent, path).toContain("owner remains rejected");
      expect(contents, path).toContain("roiAnalysisIterations: 2");
      expect(contents, path).toContain("estimatedNextGapLedgers 1");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const plan = readRepoFile(POST_V1_GATE_EZ_PLAN_DOC_PATH);
    expect(plan).toContain("Gate EZ Iteration 1");
    expect(plan).toContain("Gate EZ Iteration 2");
    expect(plan).toContain("Gate FA Work Order");

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-heavy-core-lined-massive-targeted-evidence-acquisition-gate-ey-contract.test.ts"
    );
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-ez-contract.test.ts");
  });
});
