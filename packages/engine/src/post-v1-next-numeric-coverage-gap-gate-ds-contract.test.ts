import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { findVerifiedAirborneAssemblyMatch } from "./airborne-verified-catalog";
import { calculateAssembly } from "./calculate-assembly";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_GATE_DS_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_DS_PLAN_DOC_PATH,
  POST_V1_GATE_DS_ROI_ANALYSIS_ITERATIONS,
  POST_V1_GATE_DS_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DS_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTION_STATUS,
  rankPostV1GateDSNumericCoverageCandidates,
  summarizePostV1GateDSNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-ds";
import {
  POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_LANDED_GATE,
  POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTED_NEXT_ACTION,
  POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTED_NEXT_FILE,
  POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTION_STATUS
} from "./post-v1-wall-exact-source-zero-delta-basis-gate-dr";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

const MASONRY_GENERATED_CASE_ID = "wall-masonry-brick" as const;
const MASONRY_EXACT_SOURCE_ID = "wienerberger_porotherm_100_dense_plaster_primary_2026" as const;
const MASONRY_MIXED_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function generatedCase(id: string) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === id);

  if (!found) {
    throw new Error(`Missing generated case ${id}`);
  }

  return found;
}

describe("post-V1 next numeric coverage gap Gate DS", () => {
  it("lands the no-runtime Gate DS rerank after Gate DR and selects masonry mixed-metric companion Gate DT", () => {
    const summary = summarizePostV1GateDSNumericCoverageGap();

    expect(POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTION_STATUS).toBe(
      "post_v1_wall_exact_source_zero_delta_basis_gate_dr_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_ds"
    );
    expect(POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_LANDED_GATE
    );
    expect(POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ds-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_DS_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_DS_PLAN_DOC_PATH,
      previousGateDR: {
        landedGate: POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_LANDED_GATE,
        selectedNextAction: POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTION_STATUS
      },
      roiAnalysisIterations: POST_V1_GATE_DS_ROI_ANALYSIS_ITERATIONS,
      selectedCandidateId: POST_V1_GATE_DS_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTION_STATUS
    });
    expect(POST_V1_GATE_DS_ROI_ANALYSIS_ITERATIONS).toHaveLength(2);
  });

  it("selects the highest-ROI mixed exact-Rw plus calculated-companion basis repair", () => {
    const candidates = rankPostV1GateDSNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_DS_NO_RUNTIME_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_DS_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeBasis: true,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_FILE,
      sliceKind: "runtime_basis_accuracy_repair",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DS_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    });
    expect(selected?.score).toBeGreaterThan(byId.get("wall.lsf_exact_lab_anchor_field_input_surface_gap")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("wall.clt_laminated_leaf_bounded_rule_owner_gap")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("floor.astm_iic_aiic_user_band_input_surface")?.score ?? 0);

    for (const blockedId of ["broad_source_row_crawl", "confidence_wording", "frontend_ui_polish"] as const) {
      expect(byId.get(blockedId)).toMatchObject({
        passesCalculatorAdvancementTest: false,
        selected: false,
        sliceKind: "blocked_non_goal"
      });
    }
  });

  it("records the mixed masonry basis gap that Gate DT must close without reducing output scope", () => {
    const testCase = generatedCase(MASONRY_GENERATED_CASE_ID);
    const result = calculateAssembly(testCase.rows, testCase.labOptions);
    const exactMatch = findVerifiedAirborneAssemblyMatch(result.layers, testCase.labOptions.airborneContext);

    expect(resultSnapshot(result)).toMatchObject({
      c: -1,
      ctr: -5.5,
      dynamicFamily: "masonry_nonhomogeneous",
      rw: 43,
      rwDb: 43,
      stc: 43,
      supportedTargetOutputs: [...MASONRY_MIXED_LAB_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(exactMatch?.id).toBe(MASONRY_EXACT_SOURCE_ID);
    expect(rankPostV1GateDSNumericCoverageCandidates()[0].expectedBeforeAfter).toEqual(
      expect.arrayContaining([
        expect.stringContaining("mixed Rw/STC/C/Ctr request still reports a generic screening basis"),
        expect.stringContaining("Gate DT can select")
      ])
    );
  });

  it("keeps DS/DT current-selection docs aligned without touching frontend implementation", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_DS_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("roiAnalysisIterations");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }
  });
});
