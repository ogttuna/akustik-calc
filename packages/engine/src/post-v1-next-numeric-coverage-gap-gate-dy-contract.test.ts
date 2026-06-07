import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_GATE_DY_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_DY_PLAN_DOC_PATH,
  POST_V1_GATE_DY_ROI_ANALYSIS_ITERATIONS,
  POST_V1_GATE_DY_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DY_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTION_STATUS,
  rankPostV1GateDYNumericCoverageCandidates,
  summarizePostV1GateDYNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-dy";
import {
  POST_V1_GATE_DX_COUNTERS,
  POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_LANDED_GATE,
  POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_ACTION,
  POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_FILE,
  POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTION_STATUS
} from "./post-v1-wall-exact-source-field-context-basis-gate-dx";
import {
  buildTimberCltDeltaLwFormulaErrorBudget,
  MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS
} from "./timber-clt-floor-impact-delta-lw-runtime-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

const TUAS_CLT_EXACT_CASE_IDS = [
  "floor-tuas-clt-exact",
  "floor-tuas-clt-260-exact"
] as const;
const CLT_DELTA_LW_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const EXPLICIT_CI_OUTPUTS = [
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

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

describe("post-V1 next numeric coverage gap Gate DY", () => {
  it("lands the no-runtime Gate DY rerank after Gate DX and selects the bounded CLT DeltaLw owner proof", () => {
    const summary = summarizePostV1GateDYNumericCoverageGap();

    expect(POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTION_STATUS).toBe(
      "post_v1_wall_exact_source_field_context_basis_gate_dx_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_dy"
    );
    expect(POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_LANDED_GATE
    );
    expect(POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dy-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_DY_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_DY_PLAN_DOC_PATH,
      previousGateDX: {
        counters: POST_V1_GATE_DX_COUNTERS,
        landedGate: POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_LANDED_GATE,
        selectedNextAction: POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTION_STATUS
      },
      roiAnalysisIterations: POST_V1_GATE_DY_ROI_ANALYSIS_ITERATIONS,
      selectedCandidateId: POST_V1_GATE_DY_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTION_STATUS
    });
    expect(POST_V1_GATE_DY_ROI_ANALYSIS_ITERATIONS).toHaveLength(2);
  });

  it("selects CLT upper-package DeltaLw owner proof over already-capable or unsafe candidates", () => {
    const candidates = rankPostV1GateDYNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_DY_NO_RUNTIME_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_DY_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeBasis: false,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_FILE,
      sliceKind: "accuracy_owner_contract",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: POST_V1_GATE_DY_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    });
    expect(selected?.score).toBeGreaterThan(byId.get("floor.explicit_impact_ci_low_frequency_surface_gap")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("wall.held_aac_board_fill_gap_multicavity_gap")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("floor.astm_iic_aiic_user_band_input_surface")?.score ?? 0);
    expect(byId.get("floor.open_box_or_open_web_delta_lw_subtraction_guess")).toMatchObject({
      passesCalculatorAdvancementTest: false,
      selected: false,
      sliceKind: "blocked_wrong_metric_derivation"
    });

    for (const blockedId of ["broad_source_row_crawl", "confidence_wording", "frontend_ui_polish"] as const) {
      expect(byId.get(blockedId)).toMatchObject({
        passesCalculatorAdvancementTest: false,
        selected: false,
        sliceKind: "blocked_non_goal"
      });
    }
  });

  it("pins the live CLT exact rows as Ln,w-calculable but not DeltaLw-owned yet", () => {
    for (const id of TUAS_CLT_EXACT_CASE_IDS) {
      const testCase = generatedCase(id);
      const result = calculateAssembly(testCase.rows, {
        targetOutputs: CLT_DELTA_LW_OUTPUTS
      });

      expect(resultSnapshot(result)).toMatchObject({
        floorSystemEstimateBasis: null,
        floorSystemMatchId: id === "floor-tuas-clt-exact"
          ? "tuas_x2_clt140_measured_2026"
          : "tuas_c2_clt260_measured_2026",
        impactBasis: "open_measured_floor_system_exact_match",
        lnW: id === "floor-tuas-clt-exact" ? 61 : 55,
        supportedTargetOutputs: ["Ln,w"],
        unsupportedTargetOutputs: ["DeltaLw"]
      });
      expect(result.impact?.DeltaLw).toBeUndefined();
      expect(result.impact?.metricBasis).toMatchObject({
        LnW: "open_measured_floor_system_exact_match"
      });
    }
  });

  it("keeps explicit CI and low-frequency impact outputs out of the selected next slice because they already calculate with route-required inputs", () => {
    const testCase = generatedCase("floor-hollow-core-vinyl");
    const result = calculateAssembly(testCase.rows, {
      impactFieldContext: {
        ci50_2500Db: 4,
        ciDb: -1,
        fieldKDb: 3,
        receivingRoomVolumeM3: 60
      },
      targetOutputs: EXPLICIT_CI_OUTPUTS
    });

    expect(resultSnapshot(result)).toMatchObject({
      impactBasis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      lPrimeNT50: 52.2,
      lnW: 48,
      lnWPlusCI: 47,
      supportedTargetOutputs: [...EXPLICIT_CI_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(result.impact?.CI).toBe(-1);
    expect(result.impact?.CI50_2500).toBe(4);
  });

  it("records why Gate DZ must prove a CLT DeltaLw owner before runtime values move", () => {
    const selected = rankPostV1GateDYNumericCoverageCandidates()[0];
    const errorBudget = buildTimberCltDeltaLwFormulaErrorBudget("mass_timber_clt", 22.6);

    expect(selected.expectedBeforeAfter).toEqual(
      expect.arrayContaining([
        expect.stringContaining("publish exact Ln,w but keep DeltaLw unsupported"),
        expect.stringContaining("CLT Ln,w anchor is not itself a DeltaLw owner"),
        expect.stringContaining("Gate DZ must prove")
      ])
    );
    expect(MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS).toBe("predictor_mass_timber_clt_delta_lw_formula_corridor_estimate");
    expect(errorBudget.terms.map((term) => term.termId)).toEqual(
      expect.arrayContaining([
        "clt_reference_floor_family_spread",
        "reference_floor_ln_w_anchor_scope",
        "delta_lw_holdout_absence"
      ])
    );
    expect(POST_V1_GATE_DY_NO_RUNTIME_COUNTERS).toMatchObject({
      estimatedNextOwnerLedgers: 1,
      frontendImplementationFilesTouched: 0,
      runtimeBasisPromotions: 0,
      runtimeValuesMoved: 0
    });
  });

  it("keeps DY/DZ current-selection docs aligned without touching frontend implementation", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_DY_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("roiAnalysisIterations");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }
  });
});
