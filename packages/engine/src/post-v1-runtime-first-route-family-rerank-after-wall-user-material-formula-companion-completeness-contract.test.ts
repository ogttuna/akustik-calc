import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_wall_user_material_formula_companion_completeness_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-user-material-formula-companion-completeness-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_wall_user_material_formula_companion_completeness_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_companion_completeness_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-companion-completeness-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_USER_MATERIAL_FORMULA_COMPANION_COMPLETENESS_PLAN_2026-06-17.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_companion_completeness_landed_no_runtime_selected_wall_user_material_formula_field_lab_companion_basis_integrity_owner";

const SELECTED_CANDIDATE_ID =
  "wall.user_material_formula_field_lab_companion_basis_integrity_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-basis-integrity-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_FIELD_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-17.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall user-material formula field lab-companion basis integrity owner";

const RERANK_COUNTERS = {
  candidateCount: 8,
  estimatedNextAccuracyPromotedRequestShapes: 2,
  estimatedNextAccuracyPromotedTargetOutputs: 4,
  estimatedNextRuntimeBasisPromotions: 1,
  estimatedNextRuntimeValuesMoved: 3,
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
    estimatedAccuracyPromotedTargetOutputs: 4,
    estimatedRuntimeValuesMoved: 3,
    id: SELECTED_CANDIDATE_ID,
    reason:
      "Complete custom double-leaf/framed user-material wall field requests already own the direct lab formula curve and Gate I field adapter, but mixed field requests publish Rw/STC/C/Ctr from the field basis instead of the direct lab companion basis.",
    routeFamily: "wall.double_leaf_framed.user_material.field_between_rooms",
    selected: true,
    sourceRowsRequiredForRuntimeSelection: false
  },
  {
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "wall.user_material_formula_companion_completeness_owner_closed",
    reason:
      "The previous owner already moved complete custom user-material building mixed requests to direct lab companions.",
    routeFamily: "wall.double_leaf_framed.user_material.building_prediction",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false
  },
  {
    blockedBy: ["new_same-family wall source rows still required"],
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "wall.timber_stud_formula",
    reason:
      "Timber-stud formula expansion still needs source evidence; selecting it here would reopen stale formula cartography instead of a bounded owner.",
    routeFamily: "wall.timber_stud",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: true
  },
  {
    blockedBy: ["wall CLT source evidence absent"],
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "wall.clt_formula",
    reason:
      "The CLT lane remains source-evidence blocked and cannot safely promote user-entered wall values without family substitution.",
    routeFamily: "wall.clt",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: true
  },
  {
    blockedBy: ["screening or bounded-rule evidence remains weaker than the selected field basis bug"],
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "wall.heavy_core_lined_massive",
    reason:
      "Heavy-core / lined-massive work is lower confidence here because the selected field user-material bug has complete formula and adapter ownership already in runtime.",
    routeFamily: "wall.heavy_core_lined_massive",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false
  },
  {
    blockedBy: ["low-confidence proxy fallback"],
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "floor.steel_fallback_low_confidence",
    reason:
      "Steel fallback cleanup remains lower-confidence than a direct metric-basis correction on an already owned user-material wall route.",
    routeFamily: "floor.steel",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false
  },
  {
    blockedBy: ["no bounded measured row imported in this rerank"],
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "broad_source_crawl",
    reason:
      "Broad source crawling is not a calculator runtime owner and would not improve arbitrary user-entered layer calculation this slice.",
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
      "UI/process work is explicitly out of scope for this runtime-first calculator slice.",
    routeFamily: "non_calculator",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false
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

describe("post-V1 runtime-first route-family rerank after wall user-material formula companion completeness", () => {
  it("lands the no-runtime rerank and selects the field lab-companion basis-integrity owner", () => {
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

  it("ranks a real basis-integrity runtime correction above source crawling and stale formula lanes", () => {
    const selected = CANDIDATES.filter((candidate) => candidate.selected);

    expect(selected).toEqual([
      expect.objectContaining({
        estimatedAccuracyPromotedTargetOutputs: 4,
        estimatedRuntimeValuesMoved: 3,
        id: SELECTED_CANDIDATE_ID,
        routeFamily: "wall.double_leaf_framed.user_material.field_between_rooms",
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
    expect(CANDIDATES.find((candidate) => candidate.id === "ui_or_process_cleanup")).toMatchObject({
      selected: false
    });
  });

  it("keeps the selected owner bounded to complete field context plus owned direct lab formula", () => {
    const selected = CANDIDATES.find((candidate) => candidate.selected);

    expect(selected?.reason).toContain("direct lab formula curve");
    expect(selected?.reason).toContain("Gate I field adapter");
    expect(selected?.reason).toContain("mixed field requests");
    expect(selected?.reason).toContain("direct lab companion basis");
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
      expect(content, path).toContain("candidateCount: 8");
      expect(content, path).toContain("roiAnalysisIterations: 4");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 3");
      expect(content, path).toContain("estimatedNextAccuracyPromotedTargetOutputs: 4");
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
