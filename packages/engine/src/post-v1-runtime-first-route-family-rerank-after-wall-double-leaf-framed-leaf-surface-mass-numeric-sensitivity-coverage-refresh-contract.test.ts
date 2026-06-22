import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_wall_double_leaf_framed_leaf_surface_mass_numeric_sensitivity_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-leaf-surface-mass-numeric-sensitivity-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_leaf_surface_mass_numeric_sensitivity_coverage_refresh_landed_input_boundary_selected_runtime_first_route_family_rerank";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_double_leaf_framed_leaf_surface_mass_numeric_sensitivity_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-double-leaf-framed-leaf-surface-mass-numeric-sensitivity-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_DOUBLE_LEAF_FRAMED_LEAF_SURFACE_MASS_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-22.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_wall_double_leaf_framed_leaf_surface_mass_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_frequency_backbone_numeric_sensitivity_owner";

const SELECTED_CANDIDATE_ID =
  "wall.double_leaf_framed.frequency_backbone_numeric_sensitivity_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_frequency_backbone_numeric_sensitivity_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-frequency-backbone-numeric-sensitivity-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_FREQUENCY_BACKBONE_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-22.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed frequency-backbone numeric sensitivity owner";

const RERANK_COUNTERS = {
  candidateCount: 8,
  estimatedNextAccuracyPromotedRequestShapes: 4,
  estimatedNextAccuracyPromotedTargetOutputs: 16,
  estimatedNextRuntimeBasisPromotions: 0,
  estimatedNextRuntimeValuesMoved: 16,
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
    estimatedAccuracyPromotedRequestShapes: 4,
    estimatedAccuracyPromotedTargetOutputs: 16,
    estimatedRuntimeValuesMoved: 16,
    id: SELECTED_CANDIDATE_ID,
    reason:
      "After flow resistivity, absorber coverage ratio, support spacing, absorber thickness, cavity depth, and side-leaf surface mass are closed, the highest-ROI local calculator move is to tighten the calculated frequency curve that feeds Gate S lab Rw/STC/C/Ctr. This keeps the route on owned double-leaf/framed physics, uses the existing ISO 717-1 and ASTM E413 rating adapters, and does not require source rows.",
    routeFamily: "wall.double_leaf_framed.context_owned_porous_cavity",
    selected: true,
    sourceRowsRequiredForRuntimeSelection: false
  },
  {
    blockedBy: ["downstream adapters inherit the direct curve and have larger blast radius"],
    estimatedAccuracyPromotedRequestShapes: 0,
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "wall.double_leaf_framed.building_flanking_context_broadening",
    reason:
      "Building/flanking broadening is valid calculator work, but the direct separating-element curve should be tightened first because field/building outputs consume that owned base.",
    routeFamily: "wall.airborne.building_prediction",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false
  },
  {
    blockedBy: ["less local than the just-landed Gate S physical-input chain"],
    estimatedAccuracyPromotedRequestShapes: 0,
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "wall.advanced_wall_source_absent_adjacent_physical_inputs",
    reason:
      "Source-absent advanced-wall inputs remain important, but this rerank has a more local owner unlocked by the completed double-leaf/framed physical-input sensitivity chain.",
    routeFamily: "wall.advanced_wall.source_absent_inputs",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false
  },
  {
    blockedBy: ["different formula family and not immediately unlocked by the wall chain"],
    estimatedAccuracyPromotedRequestShapes: 0,
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "floor.impact_dynamic_stiffness_load_basis",
    reason:
      "Floor impact dynamic-stiffness/load-basis ownership is high value, but it should be selected from a dedicated impact rerank rather than interrupting the active wall frequency-backbone chain.",
    routeFamily: "floor.impact",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false
  },
  {
    blockedBy: ["evidence bridge, not the next owned formula-route improvement"],
    estimatedAccuracyPromotedRequestShapes: 0,
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "project_user_measured_wall_anchors",
    reason:
      "Project/user measured anchors can accelerate exact or same-family evidence, but the next calculator move should improve the source-absent owned calculation rather than replace it with evidence rows.",
    routeFamily: "wall.user_measurement_evidence",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: true
  },
  {
    blockedBy: ["already landed and protected"],
    estimatedAccuracyPromotedRequestShapes: 0,
    estimatedAccuracyPromotedTargetOutputs: 0,
    estimatedRuntimeValuesMoved: 0,
    id: "wall.double_leaf_framed.leaf_surface_mass_numeric_sensitivity_owner_closed",
    reason:
      "Leaf surface-mass sensitivity just landed and has coverage, so reopening it would be a support loop.",
    routeFamily: "wall.double_leaf_framed.context_owned_porous_cavity",
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
      "Broad source crawling is not the next calculator behavior and does not improve the owned source-absent formula route in this slice.",
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

describe("post-V1 runtime-first route-family rerank after wall double-leaf/framed leaf surface-mass numeric sensitivity coverage refresh", () => {
  it("lands the no-runtime rerank and selects the frequency-backbone numeric sensitivity owner", () => {
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

  it("ranks the calculated curve backbone above broader adapters, source rows, and UI work", () => {
    const selected = CANDIDATES.filter((candidate) => candidate.selected);

    expect(selected).toEqual([
      expect.objectContaining({
        estimatedAccuracyPromotedRequestShapes: 4,
        estimatedAccuracyPromotedTargetOutputs: 16,
        estimatedRuntimeValuesMoved: 16,
        id: SELECTED_CANDIDATE_ID,
        routeFamily: "wall.double_leaf_framed.context_owned_porous_cavity",
        sourceRowsRequiredForRuntimeSelection: false
      })
    ]);
    expect(
      CANDIDATES.find(
        (candidate) => candidate.id === "wall.double_leaf_framed.building_flanking_context_broadening"
      )
    ).toMatchObject({ selected: false });
    expect(
      CANDIDATES.find(
        (candidate) => candidate.id === "wall.advanced_wall_source_absent_adjacent_physical_inputs"
      )
    ).toMatchObject({ selected: false });
    expect(CANDIDATES.find((candidate) => candidate.id === "broad_source_crawl")).toMatchObject({
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true
    });
    expect(CANDIDATES.find((candidate) => candidate.id === "ui_or_process_cleanup")).toMatchObject({
      selected: false
    });
  });

  it("keeps the selected owner bounded to owned Gate S frequency-curve physics", () => {
    const selected = CANDIDATES.find((candidate) => candidate.selected);

    expect(selected?.reason).toContain("calculated frequency curve");
    expect(selected?.reason).toContain("Gate S");
    expect(selected?.reason).toContain("Rw/STC/C/Ctr");
    expect(selected?.reason).toContain("ISO 717-1");
    expect(selected?.reason).toContain("ASTM E413");
    expect(selected?.reason).toContain("does not require source rows");
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
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 16");
      expect(content, path).toContain("estimatedNextAccuracyPromotedTargetOutputs: 16");
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
