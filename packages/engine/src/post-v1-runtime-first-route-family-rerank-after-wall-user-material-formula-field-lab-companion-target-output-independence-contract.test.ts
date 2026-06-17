import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-target-output-independence-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_owner_landed_runtime_selected_coverage_refresh";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_target_output_independence_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-field-lab-companion-target-output-independence-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_USER_MATERIAL_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-17.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_target_output_independence_landed_no_runtime_selected_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_owner";

const SELECTED_CANDIDATE_ID =
  "wall.timber_stud_clt_formula_field_lab_companion_target_output_independence_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-timber-stud-clt-formula-field-lab-companion-target-output-independence-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_TIMBER_STUD_CLT_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-17.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall timber-stud + CLT formula field lab-companion target-output independence owner";

const RERANK_COUNTERS = {
  candidateCount: 8,
  estimatedNextAccuracyPromotedRequestShapes: 4,
  estimatedNextAccuracyPromotedTargetOutputs: 8,
  estimatedNextNewCalculableRequestShapes: 3,
  estimatedNextNewCalculableTargetOutputs: 3,
  estimatedNextRuntimeBasisPromotions: 2,
  estimatedNextRuntimeValuesMoved: 6,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type Candidate = {
  readonly blockedBy?: readonly string[];
  readonly estimatedAccuracyPromotedTargetOutputs: number;
  readonly estimatedRuntimeValuesMoved: number;
  readonly id: string;
  readonly reason: string;
  readonly routeFamily: string;
  readonly selected: boolean;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
};

const CANDIDATES = [
  {
    estimatedAccuracyPromotedTargetOutputs: 8,
    estimatedRuntimeValuesMoved: 6,
    id: SELECTED_CANDIDATE_ID,
    reason:
      "Generated timber-stud and CLT wall field requests already own Gate I field outputs over a complete Gate DN/Gate H lab-family curve, but requested lab companions are target-output dependent and inherit field-adapter Rw/STC/C/Ctr values or park Rw.",
    routeFamily: "wall.timber_stud_clt_formula.field_between_rooms",
    selected: true,
    sourceRowsRequiredForRuntimeSelection: false
  },
  {
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "wall.user_material_formula_field_lab_companion_target_output_independence_owner_closed",
    reason:
      "The previous user-material owner and refresh already protect custom double-leaf/framed field lab companions.",
    routeFamily: "wall.double_leaf_framed.user_material.field_between_rooms",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false
  },
  {
    blockedBy: ["numeric source or bounded-rule retune evidence remains absent"],
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "wall.timber_stud_formula_retune_or_source_promotion",
    reason:
      "Timber-stud numeric retuning still needs exact source or bounded-family evidence; this rerank selects only the already-owned lab companion basis fix.",
    routeFamily: "wall.timber_stud",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: true
  },
  {
    blockedBy: ["wall CLT measured-source evidence remains absent"],
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "wall.clt_formula_retune_or_source_promotion",
    reason:
      "CLT source promotion remains unsafe, but CLT field lab companions can use the already-owned Gate H calculated curve without source substitution.",
    routeFamily: "wall.clt",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: true
  },
  {
    blockedBy: ["exact source precedence and calculated-companion boundaries are already separate"],
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "wall.lsf_exact_source_field_lab_companion",
    reason:
      "The LSF exact-source lane has separate Gate DV/Gate DX ownership and must not be swept into a source-absent timber/CLT formula owner.",
    routeFamily: "wall.light_steel_stud.exact_source",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false
  },
  {
    blockedBy: ["recent low-density exact ASTM chain is closed and lower incremental ROI here"],
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "floor.low_density_exact_astm_continuation",
    reason:
      "The low-density exact ASTM target-output independence chain is already refreshed; the wall formula companion bug moves more common wall target outputs now.",
    routeFamily: "floor.low_density_exact_astm",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false
  },
  {
    blockedBy: ["no bounded measured row imported in this rerank"],
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "broad_source_crawl",
    reason:
      "Broad source crawling is not a bounded runtime owner and would displace an already reproduced wrong-answer fix.",
    routeFamily: "source_evidence",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: true
  },
  {
    blockedBy: ["not calculator runtime movement"],
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "ui_or_process_cleanup",
    reason:
      "UI/process work is outside this calculator-first runtime slice.",
    routeFamily: "non_calculator",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false
  }
] as const satisfies readonly Candidate[];

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/RUNTIME_FIRST_ROUTE_FAMILY_CAMPAIGN_PLAN_2026-06-17.md",
  RERANK_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function summarizeRerank() {
  return {
    counters: RERANK_COUNTERS,
    landedGate: RERANK_ACTION,
    previousCoverageRefresh: {
      landedGate: PREVIOUS_COVERAGE_REFRESH_ACTION,
      selectedNextFile: PREVIOUS_COVERAGE_REFRESH_FILE,
      selectionStatus: PREVIOUS_COVERAGE_REFRESH_STATUS
    },
    previousRuntimeOwner: {
      landedGate: PREVIOUS_OWNER_ACTION,
      selectedNextFile: PREVIOUS_OWNER_FILE,
      selectionStatus: PREVIOUS_OWNER_STATUS
    },
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: RERANK_STATUS
  };
}

describe("post-V1 runtime-first route-family rerank after wall user-material formula field lab-companion target-output independence", () => {
  it("lands the no-runtime rerank and selects the timber-stud + CLT formula field lab-companion owner", () => {
    expect(summarizeRerank()).toMatchObject({
      counters: RERANK_COUNTERS,
      landedGate: RERANK_ACTION,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: RERANK_STATUS
    });

    for (const path of [
      PREVIOUS_COVERAGE_REFRESH_FILE,
      PREVIOUS_OWNER_FILE,
      RERANK_FILE,
      RERANK_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ranks an owned formula lab-companion accuracy fix above source crawling and stale retunes", () => {
    const selected = CANDIDATES.filter((candidate) => candidate.selected);

    expect(selected).toEqual([
      expect.objectContaining({
        estimatedAccuracyPromotedTargetOutputs: 8,
        estimatedRuntimeValuesMoved: 6,
        id: SELECTED_CANDIDATE_ID,
        routeFamily: "wall.timber_stud_clt_formula.field_between_rooms",
        sourceRowsRequiredForRuntimeSelection: false
      })
    ]);
    expect(CANDIDATES.find((candidate) => candidate.id === "wall.timber_stud_formula_retune_or_source_promotion"))
      .toMatchObject({
        selected: false,
        sourceRowsRequiredForRuntimeSelection: true
      });
    expect(CANDIDATES.find((candidate) => candidate.id === "wall.clt_formula_retune_or_source_promotion"))
      .toMatchObject({
        selected: false,
        sourceRowsRequiredForRuntimeSelection: true
      });
    expect(CANDIDATES.find((candidate) => candidate.id === "ui_or_process_cleanup")).toMatchObject({
      selected: false,
      routeFamily: "non_calculator"
    });
    expect(RERANK_COUNTERS.runtimeValuesMoved).toBe(0);
    expect(RERANK_COUNTERS.runtimeFormulaRetunes).toBe(0);
    expect(RERANK_COUNTERS.sourceRowsImported).toBe(0);
    expect(RERANK_COUNTERS.frontendImplementationFilesTouched).toBe(0);
  });

  it("keeps active docs and the current-gate runner aligned to the selected owner", () => {
    for (const path of REQUIRED_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(RERANK_ACTION);
      expect(contents, path).toContain(RERANK_STATUS);
      expect(contents, path).toContain(SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(SELECTED_NEXT_FILE);
      expect(contents, path).toContain(SELECTED_NEXT_PLAN_DOC);
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-field-lab-companion-target-output-independence-contract.test.ts");
  });
});
