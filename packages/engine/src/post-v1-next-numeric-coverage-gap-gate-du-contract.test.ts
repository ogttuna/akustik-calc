import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  ENGINE_MIXED_GENERATED_CASES
} from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_GATE_DU_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_DU_PLAN_DOC_PATH,
  POST_V1_GATE_DU_ROI_ANALYSIS_ITERATIONS,
  POST_V1_GATE_DU_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DU_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTION_STATUS,
  rankPostV1GateDUNumericCoverageCandidates,
  summarizePostV1GateDUNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-du";
import {
  POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_LANDED_GATE,
  POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_ACTION,
  POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_FILE,
  POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTION_STATUS
} from "./post-v1-wall-masonry-exact-source-mixed-metric-companion-gate-dt";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate DU", () => {
  it("lands the no-runtime Gate DU rerank after Gate DT and selects LSF mixed companion Gate DV", () => {
    const summary = summarizePostV1GateDUNumericCoverageGap();

    expect(POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTION_STATUS).toBe(
      "post_v1_wall_masonry_exact_source_mixed_metric_companion_gate_dt_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_du"
    );
    expect(POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_LANDED_GATE
    );
    expect(POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-du-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_DU_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_DU_PLAN_DOC_PATH,
      previousGateDT: {
        landedGate: POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_LANDED_GATE,
        selectedNextAction: POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTION_STATUS
      },
      roiAnalysisIterations: POST_V1_GATE_DU_ROI_ANALYSIS_ITERATIONS,
      selectedCandidateId: POST_V1_GATE_DU_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTION_STATUS
    });
    expect(POST_V1_GATE_DU_ROI_ANALYSIS_ITERATIONS).toHaveLength(2);
  });

  it("selects the highest-ROI LSF exact-Rw plus calculated companion scope repair", () => {
    const candidates = rankPostV1GateDUNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_DU_NO_RUNTIME_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_DU_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeBasis: true,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_FILE,
      sliceKind: "runtime_scope_and_basis_repair",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DU_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    });
    expect(selected?.score).toBeGreaterThan(byId.get("wall.lsf_exact_lab_anchor_field_airtightness_input_gap")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("wall.clt_laminated_leaf_bounded_rule_owner_gap")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("floor.astm_iic_aiic_user_band_input_surface")?.score ?? 0);

    expect(byId.get("wall.masonry_exact_source_mixed_metric_companion_policy_gap")).toMatchObject({
      selected: false,
      sliceKind: "closed_runtime_gap"
    });
    for (const blockedId of ["broad_source_row_crawl", "confidence_wording", "frontend_ui_polish"] as const) {
      expect(byId.get(blockedId)).toMatchObject({
        passesCalculatorAdvancementTest: false,
        selected: false,
        sliceKind: "blocked_non_goal"
      });
    }
  });

  it("records the generated LSF exact-source mixed lab gap that Gate DV must close", () => {
    const testCase = ENGINE_MIXED_GENERATED_CASES.find((candidate) => candidate.id === "wall-lsf-knauf");
    const selected = rankPostV1GateDUNumericCoverageCandidates()[0];

    expect(testCase).toBeDefined();
    expect(selected.expectedBeforeAfter).toEqual(
      expect.arrayContaining([
        expect.stringContaining("exact source Rw 55"),
        expect.stringContaining("STC 55, C -1.5, and Ctr -6.4"),
        expect.stringContaining("calculated companions")
      ])
    );
  });

  it("keeps DU/DV current-selection docs aligned without touching frontend implementation", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_DU_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("roiAnalysisIterations");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }
  });
});
