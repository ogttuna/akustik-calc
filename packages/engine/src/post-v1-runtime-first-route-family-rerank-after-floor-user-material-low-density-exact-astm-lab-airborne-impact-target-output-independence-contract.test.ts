import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_LAB_AIRBORNE_IMPACT_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-17.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_landed_no_runtime_selected_wall_user_material_formula_companion_completeness_owner";

const SELECTED_CANDIDATE_ID =
  "wall.user_material_formula_companion_completeness_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_wall_user_material_formula_companion_completeness_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-user-material-formula-companion-completeness-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_COMPANION_COMPLETENESS_OWNER_PLAN_2026-06-17.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall user-material formula companion completeness owner";

const RERANK_COUNTERS = {
  candidateCount: 9,
  estimatedNextCalculableRequestShapes: 2,
  estimatedNextCalculableTargetOutputs: 8,
  estimatedNextRuntimeBasisPromotions: 2,
  estimatedNextRuntimeValuesMoved: 8,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type Candidate = {
  readonly blockedBy?: readonly string[];
  readonly estimatedRuntimeValuesMoved: number;
  readonly id: string;
  readonly reason: string;
  readonly routeFamily: string;
  readonly selected: boolean;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
};

const CANDIDATES = [
  {
    estimatedRuntimeValuesMoved: 8,
    id: SELECTED_CANDIDATE_ID,
    reason:
      "Complete custom double-leaf/framed user-material wall routes already own the direct lab formula curve and Gate AR building adapter, but mixed building requests suppress Rw/STC/C/Ctr lab companions.",
    routeFamily: "wall.double_leaf_framed.user_material",
    selected: true,
    sourceRowsRequiredForRuntimeSelection: false
  },
  {
    blockedBy: ["new_same-family wall source rows still required"],
    estimatedRuntimeValuesMoved: 0,
    id: "wall.timber_stud_formula",
    reason:
      "Existing local contracts close timber-stud runtime widening without new source evidence; selecting it here would reopen stale cartography.",
    routeFamily: "wall.timber_stud",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: true
  },
  {
    blockedBy: ["wall CLT source evidence absent"],
    estimatedRuntimeValuesMoved: 0,
    id: "wall.clt_formula",
    reason:
      "The CLT lane remains a formula-scope/cartography item, not a safe runtime owner, until wall-specific source evidence lands.",
    routeFamily: "wall.clt",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: true
  },
  {
    blockedBy: ["low-confidence proxy fallback"],
    estimatedRuntimeValuesMoved: 0,
    id: "floor.steel_fallback_low_confidence",
    reason:
      "Steel fallback work is lower-confidence and outside the current wall route-family runtime-first opportunity.",
    routeFamily: "floor.steel",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false
  },
  {
    blockedBy: ["no new measured row imported in this rerank"],
    estimatedRuntimeValuesMoved: 0,
    id: "broad_source_crawl",
    reason:
      "Broad source crawling is not a calculator runtime owner and would not improve arbitrary user-entered layer calculation this slice.",
    routeFamily: "source_evidence",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: true
  }
] as const satisfies readonly Candidate[];

const REQUIRED_DOCS = [
  "AGENTS.md",
  "README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/SYSTEM_MAP.md",
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
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: RERANK_STATUS
  };
}

describe("post-V1 runtime-first route-family rerank after low-density exact ASTM target-output independence", () => {
  it("lands the no-runtime rerank and selects the wall user-material formula companion owner", () => {
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

    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_REFRESH_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);
  });

  it("ranks calculator runtime movement above stale formula cartography and source crawling", () => {
    const selected = CANDIDATES.filter((candidate) => candidate.selected);

    expect(selected).toEqual([
      expect.objectContaining({
        estimatedRuntimeValuesMoved: 8,
        id: SELECTED_CANDIDATE_ID,
        routeFamily: "wall.double_leaf_framed.user_material",
        sourceRowsRequiredForRuntimeSelection: false
      })
    ]);
    expect(CANDIDATES.find((candidate) => candidate.id === "wall.timber_stud_formula")).toMatchObject({
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true
    });
    expect(CANDIDATES.find((candidate) => candidate.id === "wall.clt_formula")).toMatchObject({
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true
    });
    expect(CANDIDATES.find((candidate) => candidate.id === "broad_source_crawl")).toMatchObject({
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true
    });
  });

  it("keeps the selected owner bounded to owned formula and building-adapter companions", () => {
    const selected = CANDIDATES.find((candidate) => candidate.selected);

    expect(selected?.reason).toContain("direct lab formula curve");
    expect(selected?.reason).toContain("Gate AR building adapter");
    expect(selected?.reason).toContain("Rw/STC/C/Ctr lab companions");
    expect(RERANK_COUNTERS.runtimeValuesMoved).toBe(0);
    expect(RERANK_COUNTERS.runtimeFormulaRetunes).toBe(0);
    expect(RERANK_COUNTERS.sourceRowsImported).toBe(0);
    expect(RERANK_COUNTERS.frontendImplementationFilesTouched).toBe(0);
  });

  it("keeps docs and current-gate runner aligned with the rerank and selected runtime owner", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(RERANK_ACTION);
      expect(content, path).toContain(RERANK_FILE);
      expect(content, path).toContain(RERANK_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("candidateCount: 9");
      expect(content, path).toContain("roiAnalysisIterations: 4");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 8");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(PREVIOUS_COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
    expect(runner).toContain(RERANK_FILE.replace("packages/engine/", ""));
  });
});
