import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_wall_user_material_double_leaf_building_leaf_mass_boundary_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-wall-user-material-double-leaf-building-leaf-mass-boundary-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_wall_user_material_double_leaf_building_leaf_mass_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_wall_user_material_double_leaf_building_leaf_mass_boundary_coverage_refresh";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_user_material_double_leaf_building_leaf_mass_boundary_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-double-leaf-building-leaf-mass-boundary-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_WALL_USER_MATERIAL_DOUBLE_LEAF_BUILDING_LEAF_MASS_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-24.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_wall_user_material_double_leaf_building_leaf_mass_boundary_coverage_refresh_landed_no_runtime_selected_wall_user_material_double_leaf_building_lab_companion_target_output_independence_owner";

const SELECTED_CANDIDATE_ID =
  "wall.user_material_double_leaf_building_lab_companion_target_output_independence_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_wall_user_material_double_leaf_building_lab_companion_target_output_independence_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-user-material-double-leaf-building-lab-companion-target-output-independence-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_USER_MATERIAL_DOUBLE_LEAF_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-24.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall user-material double-leaf building lab-companion target-output independence owner";

const RERANK_COUNTERS = {
  candidateCount: 7,
  estimatedNextAccuracyPromotedRequestShapes: 10,
  estimatedNextCalculableRequestShapes: 0,
  estimatedNextCalculableTargetOutputs: 0,
  estimatedNextRequiredPhysicalInputsCaptured: 0,
  estimatedNextRuntimeValuesMoved: 40,
  estimatedNextTargetOutputIndependentMetricSets: 10,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_already_landed"
  | "rejected_catalog_or_impact_lane"
  | "rejected_lower_local_roi"
  | "rejected_support_only"
  | "selected_runtime_metric_integrity_owner";

type Candidate = {
  readonly decision: CandidateDecision;
  readonly estimatedRuntimeValuesMoved: number;
  readonly id: string;
  readonly reason: string;
  readonly routeFamily: string;
  readonly selected: boolean;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetOutputs: readonly RequestedOutputId[];
};

const LAB_COMPANION_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];

const CANDIDATES = [
  {
    decision: "selected_runtime_metric_integrity_owner",
    estimatedRuntimeValuesMoved: RERANK_COUNTERS.estimatedNextRuntimeValuesMoved,
    id: SELECTED_CANDIDATE_ID,
    reason:
      "The just-covered leaf-mass boundary makes the complete positive-mass user-material double-leaf building route safe. Live probes showed the same Gate AR route published different Rw/STC/C/Ctr companion metrics depending on whether the request asked for one lab output, one field/building output, or the mixed output set. The next owner should normalize the lab companions from the owned direct curve without widening supported outputs or changing formulas.",
    routeFamily: "wall.user_material.double_leaf_framed.building_prediction.lab_companion_metric_integrity",
    selected: true,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: [...LAB_COMPANION_OUTPUTS, ...FIELD_BUILDING_OUTPUTS]
  },
  {
    decision: "rejected_already_landed",
    estimatedRuntimeValuesMoved: 0,
    id: "wall.user_material_double_leaf_building_leaf_mass_boundary_owner",
    reason:
      "The missing or zero side-leaf mass false Gate AR promotion is already blocked and covered; reopening it would continue support work instead of moving the next runtime behavior.",
    routeFamily: "wall.user_material.double_leaf_framed.building_prediction.leaf_mass_boundary",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: [...LAB_COMPANION_OUTPUTS, ...FIELD_BUILDING_OUTPUTS]
  },
  {
    decision: "rejected_lower_local_roi",
    estimatedRuntimeValuesMoved: 0,
    id: "wall.user_material_double_leaf_frequency_formula_retune",
    reason:
      "A formula retune may be useful later, but target-output independence is a smaller correctness owner with direct live evidence and no coefficient or source-evidence dependency.",
    routeFamily: "wall.user_material.double_leaf_framed.frequency_accuracy",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: LAB_COMPANION_OUTPUTS
  },
  {
    decision: "rejected_already_landed",
    estimatedRuntimeValuesMoved: 0,
    id: "wall.user_material_formula_required_input_surface_owner",
    reason:
      "The source-absent user-material input surface and its coverage refresh already landed; the current issue is positive-mass output parity, not missing leaf input capture.",
    routeFamily: "wall.user_material.formula_input_surface",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: [...LAB_COMPANION_OUTPUTS, ...FIELD_BUILDING_OUTPUTS]
  },
  {
    decision: "rejected_already_landed",
    estimatedRuntimeValuesMoved: 0,
    id: "project_user_measured_wall_frequency_chain",
    reason:
      "The project/user measured frequency bridge and field/building lab-companion integrity chains already have owner and coverage contracts.",
    routeFamily: "wall.project_user_measured_frequency",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: [...LAB_COMPANION_OUTPUTS, ...FIELD_BUILDING_OUTPUTS]
  },
  {
    decision: "rejected_catalog_or_impact_lane",
    estimatedRuntimeValuesMoved: 0,
    id: "impact_material_catalog_delta_lw_matcher_followup",
    reason:
      "Impact catalog matcher safety is a valid separate lane, but another agent is working there and this rerank has a live wall engine metric-integrity defect with smaller blast radius.",
    routeFamily: "floor.impact.catalog_matcher",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: true,
    targetOutputs: ["Ln,w", "DeltaLw", "IIC", "AIIC"]
  },
  {
    decision: "rejected_support_only",
    estimatedRuntimeValuesMoved: 0,
    id: "ui_report_or_docs_cleanup",
    reason:
      "UI, report wording, docs-only cleanup, and confidence-label work do not move calculator route ownership, numeric accuracy, or target-output basis integrity for this slice.",
    routeFamily: "non_calculator",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: []
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
      action: PREVIOUS_COVERAGE_ACTION,
      file: PREVIOUS_COVERAGE_FILE,
      status: PREVIOUS_COVERAGE_STATUS
    },
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: RERANK_STATUS
  };
}

describe("post-V1 runtime-first rerank after wall user-material double-leaf building leaf-mass boundary coverage refresh", () => {
  it("lands the no-runtime rerank and selects the lab-companion target-output independence owner", () => {
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

    for (const path of [PREVIOUS_COVERAGE_FILE, RERANK_FILE, RERANK_PLAN_DOC, SELECTED_NEXT_PLAN_DOC]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ranks live target-output metric integrity above support loops, source rows, and catalog work", () => {
    const selected = CANDIDATES.filter((candidate) => candidate.selected);

    expect(selected).toEqual([
      expect.objectContaining({
        decision: "selected_runtime_metric_integrity_owner",
        estimatedRuntimeValuesMoved: 40,
        id: SELECTED_CANDIDATE_ID,
        routeFamily: "wall.user_material.double_leaf_framed.building_prediction.lab_companion_metric_integrity",
        sourceRowsRequiredForRuntimeSelection: false
      })
    ]);
    expect(CANDIDATES.find((candidate) => candidate.id === "wall.user_material_double_leaf_building_leaf_mass_boundary_owner")).toMatchObject({
      decision: "rejected_already_landed"
    });
    expect(CANDIDATES.find((candidate) => candidate.id === "impact_material_catalog_delta_lw_matcher_followup")).toMatchObject({
      decision: "rejected_catalog_or_impact_lane",
      sourceRowsRequiredForRuntimeSelection: true
    });
    expect(CANDIDATES.find((candidate) => candidate.id === "ui_report_or_docs_cleanup")).toMatchObject({
      decision: "rejected_support_only"
    });
  });

  it("keeps the selected owner bounded to owned direct-curve companions without formula retune", () => {
    const selected = CANDIDATES.find((candidate) => candidate.selected);

    expect(selected?.reason).toContain("Gate AR");
    expect(selected?.reason).toContain("Rw/STC/C/Ctr");
    expect(selected?.reason).toContain("owned direct curve");
    expect(selected?.reason).toContain("without widening supported outputs");
    expect(RERANK_COUNTERS.estimatedNextAccuracyPromotedRequestShapes).toBe(10);
    expect(RERANK_COUNTERS.estimatedNextRuntimeValuesMoved).toBe(40);
    expect(RERANK_COUNTERS.runtimeFormulaRetunes).toBe(0);
    expect(RERANK_COUNTERS.sourceRowsImported).toBe(0);
    expect(RERANK_COUNTERS.frontendImplementationFilesTouched).toBe(0);
  });

  it("keeps docs and current-gate runner aligned with the rerank and selected owner", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);

      expect(content, path).toContain(PREVIOUS_COVERAGE_ACTION);
      expect(content, path).toContain(PREVIOUS_COVERAGE_FILE);
      expect(content, path).toContain(PREVIOUS_COVERAGE_STATUS);
      expect(content, path).toContain(RERANK_ACTION);
      expect(content, path).toContain(RERANK_FILE);
      expect(content, path).toContain(RERANK_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_LABEL);
      expect(content, path).toContain("candidateCount: 7");
      expect(content, path).toContain("roiAnalysisIterations: 4");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("sourceRowsImported: 0");
    }

    const gateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(gateRunner).toContain(RERANK_FILE.replace("packages/engine/", ""));
    expect(gateRunner).toContain(SELECTED_NEXT_FILE.replace("packages/engine/", ""));
  });
});
