import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-cavity-depth-numeric-sensitivity-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-double-leaf-framed-cavity-depth-numeric-sensitivity-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_DOUBLE_LEAF_FRAMED_CAVITY_DEPTH_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-22.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_leaf_surface_mass_numeric_sensitivity_owner";

const SELECTED_CANDIDATE_ID = "wall.double_leaf_framed.leaf_surface_mass_numeric_sensitivity_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_leaf_surface_mass_numeric_sensitivity_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-leaf-surface-mass-numeric-sensitivity-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_LEAF_SURFACE_MASS_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-22.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed leaf surface-mass numeric sensitivity owner";

const RERANK_COUNTERS = {
  candidateCount: 8,
  estimatedNextAccuracyPromotedRequestShapes: 3,
  estimatedNextAccuracyPromotedTargetOutputs: 13,
  estimatedNextRuntimeBasisPromotions: 0,
  estimatedNextRuntimeValuesMoved: 13,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type Candidate = {
  readonly blockedBy?: readonly string[];
  readonly estimatedAccuracyPromotedRequestShapes: number;
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
    estimatedAccuracyPromotedRequestShapes: 3,
    estimatedAccuracyPromotedTargetOutputs: 13,
    estimatedRuntimeValuesMoved: 13,
    id: SELECTED_CANDIDATE_ID,
    reason:
      "After flow resistivity, absorber coverage ratio, support spacing, absorber thickness, and cavity depth are closed, side-leaf surface mass is the remaining high-ROI numeric input in the owned Gate S / Gate I / Gate AR double-leaf/framed formula route. It controls total leaf mass, leaf mass ratio, and mass-air-mass resonance without needing source rows.",
    routeFamily: "wall.double_leaf_framed.context_owned_porous_cavity",
    selected: true,
    sourceRowsRequiredForRuntimeSelection: false
  },
  {
    estimatedAccuracyPromotedRequestShapes: 0,
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "wall.double_leaf_framed.cavity_depth_numeric_sensitivity_owner_closed",
    reason:
      "The previous owner and refresh already protect topology and advanced-only cavity-depth sensitivity.",
    routeFamily: "wall.double_leaf_framed.context_owned_porous_cavity",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false
  },
  {
    estimatedAccuracyPromotedRequestShapes: 0,
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "wall.double_leaf_framed.porous_absorber_thickness_numeric_sensitivity_owner_closed",
    reason:
      "Porous absorber thickness sensitivity already landed and has a coverage refresh, so reopening it would be a support loop.",
    routeFamily: "wall.double_leaf_framed.context_owned_porous_cavity",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false
  },
  {
    estimatedAccuracyPromotedRequestShapes: 0,
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "wall.double_leaf_framed.bridge_support_spacing_numeric_sensitivity_owner_closed",
    reason:
      "Support spacing is already numerically active and protected for 400, 600, and 1200 mm spacing.",
    routeFamily: "wall.double_leaf_framed.context_owned_porous_cavity",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false
  },
  {
    blockedBy: ["larger blast radius than the selected local physical-input owner"],
    estimatedAccuracyPromotedRequestShapes: 0,
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "wall.frequency_band_backbone",
    reason:
      "Frequency backbone work remains strategically important, but this slice has a bounded local formula input with lower risk and immediate calculator accuracy impact.",
    routeFamily: "wall.airborne.frequency_backbone",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false
  },
  {
    blockedBy: ["field/building adapters are already available for this route"],
    estimatedAccuracyPromotedRequestShapes: 0,
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "wall.building_flanking_broadening",
    reason:
      "Building/flanking work is valid, but the selected issue is the direct element physics sensitivity feeding those adapters.",
    routeFamily: "wall.airborne.building_prediction",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false
  },
  {
    blockedBy: ["not a bounded runtime owner"],
    estimatedAccuracyPromotedRequestShapes: 0,
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "broad_source_crawl",
    reason:
      "Broad source crawling is not the next calculator behavior and would not improve the owned source-absent formula route in this slice.",
    routeFamily: "source_evidence",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: true
  },
  {
    blockedBy: ["not calculator runtime movement"],
    estimatedAccuracyPromotedRequestShapes: 0,
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "ui_or_process_cleanup",
    reason:
      "UI/process cleanup does not increase formula scope, numeric accuracy, input capture, or metric/basis integrity for this slice.",
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

describe("post-V1 runtime-first route-family rerank after wall double-leaf/framed cavity-depth numeric sensitivity coverage refresh", () => {
  it("lands the no-runtime rerank and selects the leaf surface-mass numeric sensitivity owner", () => {
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

  it("ranks a real formula-input sensitivity owner above stale lanes and source crawling", () => {
    const selected = CANDIDATES.filter((candidate) => candidate.selected);

    expect(selected).toEqual([
      expect.objectContaining({
        estimatedAccuracyPromotedRequestShapes: 3,
        estimatedAccuracyPromotedTargetOutputs: 13,
        estimatedRuntimeValuesMoved: 13,
        id: SELECTED_CANDIDATE_ID,
        routeFamily: "wall.double_leaf_framed.context_owned_porous_cavity",
        sourceRowsRequiredForRuntimeSelection: false
      })
    ]);
    expect(
      CANDIDATES.find(
        (candidate) => candidate.id === "wall.double_leaf_framed.cavity_depth_numeric_sensitivity_owner_closed"
      )
    ).toMatchObject({ selected: false });
    expect(CANDIDATES.find((candidate) => candidate.id === "wall.frequency_band_backbone")).toMatchObject({
      selected: false
    });
    expect(CANDIDATES.find((candidate) => candidate.id === "broad_source_crawl")).toMatchObject({
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true
    });
    expect(CANDIDATES.find((candidate) => candidate.id === "ui_or_process_cleanup")).toMatchObject({
      selected: false
    });
  });

  it("keeps the selected owner bounded to owned double-leaf/framed physics inputs", () => {
    const selected = CANDIDATES.find((candidate) => candidate.selected);

    expect(selected?.reason).toContain("side-leaf surface mass");
    expect(selected?.reason).toContain("Gate S / Gate I / Gate AR");
    expect(selected?.reason).toContain("total leaf mass");
    expect(selected?.reason).toContain("leaf mass ratio");
    expect(selected?.reason).toContain("mass-air-mass resonance");
    expect(selected?.reason).toContain("without needing source rows");
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
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 13");
      expect(content, path).toContain("estimatedNextAccuracyPromotedTargetOutputs: 13");
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
