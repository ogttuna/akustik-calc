import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  POST_V1_GATE_DW_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_DW_PLAN_DOC_PATH,
  POST_V1_GATE_DW_ROI_ANALYSIS_ITERATIONS,
  POST_V1_GATE_DW_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DW_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTION_STATUS,
  rankPostV1GateDWNumericCoverageCandidates,
  summarizePostV1GateDWNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-dw";
import {
  POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_LANDED_GATE,
  POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_ACTION,
  POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_FILE,
  POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTION_STATUS
} from "./post-v1-wall-lsf-exact-source-mixed-metric-companion-gate-dv";

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

describe("post-V1 next numeric coverage gap Gate DW", () => {
  it("lands the no-runtime Gate DW rerank after Gate DV and selects wall field-context basis Gate DX", () => {
    const summary = summarizePostV1GateDWNumericCoverageGap();

    expect(POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTION_STATUS).toBe(
      "post_v1_wall_lsf_exact_source_mixed_metric_companion_gate_dv_landed_runtime_scope_basis_selected_next_numeric_coverage_gap_gate_dw"
    );
    expect(POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_LANDED_GATE
    );
    expect(POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dw-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_DW_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_DW_PLAN_DOC_PATH,
      previousGateDV: {
        landedGate: POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_LANDED_GATE,
        selectedNextAction: POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTION_STATUS
      },
      roiAnalysisIterations: POST_V1_GATE_DW_ROI_ANALYSIS_ITERATIONS,
      selectedCandidateId: POST_V1_GATE_DW_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTION_STATUS
    });
    expect(POST_V1_GATE_DW_ROI_ANALYSIS_ITERATIONS).toHaveLength(2);
  });

  it("selects the highest-ROI calculated field-context basis repair", () => {
    const candidates = rankPostV1GateDWNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_DW_NO_RUNTIME_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_DW_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeBasis: true,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_FILE,
      sliceKind: "runtime_basis_accuracy_repair",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DW_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    });
    expect(selected?.score).toBeGreaterThan(byId.get("wall.lsf_exact_lab_anchor_field_airtightness_input_gap")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("wall.held_aac_board_fill_gap_multicavity_gap")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("floor.impact_explicit_ci_surface_gap")?.score ?? 0);

    for (const blockedId of ["broad_source_row_crawl", "confidence_wording", "frontend_ui_polish"] as const) {
      expect(byId.get(blockedId)).toMatchObject({
        passesCalculatorAdvancementTest: false,
        selected: false,
        sliceKind: "blocked_non_goal"
      });
    }
  });

  it("records before-after pins for Gate DX without selecting source crawl, frontend, or numeric retune", () => {
    const selected = rankPostV1GateDWNumericCoverageCandidates()[0];

    expect(selected.expectedBeforeAfter).toEqual(
      expect.arrayContaining([
        expect.stringContaining("wall-masonry-brick field publishes R'w 40"),
        expect.stringContaining("wall-lsf-knauf field publishes R'w 51"),
        expect.stringContaining("select a calculated family field-context basis")
      ])
    );
    expect(POST_V1_GATE_DW_NO_RUNTIME_COUNTERS).toMatchObject({
      estimatedNextRuntimeBasisPromotions: 2,
      estimatedNextRuntimeCorrectedLayerTemplates: 2,
      estimatedNextRuntimeCorrectedRequestShapes: 8,
      frontendImplementationFilesTouched: 0,
      runtimeValuesMoved: 0
    });
  });

  it("keeps DW/DX current-selection docs aligned without touching frontend implementation", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_DW_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("roiAnalysisIterations");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }
  });
});
