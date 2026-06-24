import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_wall_user_material_double_leaf_building_lab_companion_target_output_independence_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-wall-user-material-double-leaf-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_wall_user_material_double_leaf_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_wall_user_material_double_leaf_building_lab_companion_target_output_independence_coverage_refresh";

const RERANK_ACTION =
  "post_v1_runtime_first_rerank_after_wall_user_material_double_leaf_building_lab_companion_target_output_independence_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-rerank-after-wall-user-material-double-leaf-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_WALL_USER_MATERIAL_DOUBLE_LEAF_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-24.md";
const RERANK_STATUS =
  "post_v1_runtime_first_rerank_after_wall_user_material_double_leaf_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_wall_gate_ar_direct_curve_building_lab_companion_target_output_independence_owner";

const SELECTED_CANDIDATE_ID =
  "wall.gate_ar_direct_curve_building_lab_companion_target_output_independence_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_wall_gate_ar_direct_curve_building_lab_companion_target_output_independence_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-gate-ar-direct-curve-building-lab-companion-target-output-independence-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_GATE_AR_DIRECT_CURVE_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-24.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall Gate AR direct-curve building lab-companion target-output independence owner";

const RERANK_COUNTERS = {
  candidateCount: 6,
  estimatedNextAccuracyPromotedRequestShapes: 10,
  estimatedNextCalculableRequestShapes: 3,
  estimatedNextCalculableTargetOutputs: 3,
  estimatedNextRequiredPhysicalInputsCaptured: 0,
  estimatedNextRuntimeBasisPromotions: 3,
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
  | "rejected_catalog_or_parallel_lane"
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
      "The user-material owner proved the target-output independence bug class on Gate AR building requests. A live probe of the built-in gypsum/rockwool/gypsum double-leaf route shows element-lab Rw/STC 44 from the owned direct curve, while building Rw/STC publish 38 when the request is Rw-only, field-only, or mixed. The next owner should reuse the existing Gate AR direct curve and rating adapters, keep R'w/Dn* field/building values unchanged, and avoid any source-row import or formula retune.",
    routeFamily: "wall.gate_ar_direct_curve.building_prediction.lab_companion_metric_integrity",
    selected: true,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: [...LAB_COMPANION_OUTPUTS, ...FIELD_BUILDING_OUTPUTS]
  },
  {
    decision: "rejected_already_landed",
    estimatedRuntimeValuesMoved: 0,
    id: "wall.user_material_double_leaf_building_lab_companion_target_output_independence_owner",
    reason:
      "The immediately previous runtime owner and coverage refresh already closed this same issue for custom/user-material double-leaf building stacks.",
    routeFamily: "wall.user_material.double_leaf_framed.building_prediction.lab_companion_metric_integrity",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: [...LAB_COMPANION_OUTPUTS, ...FIELD_BUILDING_OUTPUTS]
  },
  {
    decision: "rejected_lower_local_roi",
    estimatedRuntimeValuesMoved: 0,
    id: "wall.gate_ar_formula_retune",
    reason:
      "A numeric retune may improve accuracy later, but the selected owner fixes a basis/metric bug with existing owned direct-curve values and smaller blast radius.",
    routeFamily: "wall.gate_ar_direct_curve.formula_accuracy",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: LAB_COMPANION_OUTPUTS
  },
  {
    decision: "rejected_already_landed",
    estimatedRuntimeValuesMoved: 0,
    id: "project_user_measured_frequency_target_output_independence",
    reason:
      "Project/user measured frequency target-output independence already has owner and coverage contracts, and does not outrank the live built-in Gate AR defect.",
    routeFamily: "wall.project_user_measured_frequency.field_building_lab_companion_target_output_independence",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: [...LAB_COMPANION_OUTPUTS, ...FIELD_BUILDING_OUTPUTS]
  },
  {
    decision: "rejected_catalog_or_parallel_lane",
    estimatedRuntimeValuesMoved: 0,
    id: "impact_product_catalog_delta_lw_matcher_followup",
    reason:
      "Impact product catalog stack-boundary safety is valid but belongs to the parallel impact/material lane; this rerank keeps the main wall engine runtime path moving.",
    routeFamily: "floor.impact.catalog_matcher",
    selected: false,
    sourceRowsRequiredForRuntimeSelection: true,
    targetOutputs: ["Ln,w", "DeltaLw", "IIC", "AIIC"]
  },
  {
    decision: "rejected_support_only",
    estimatedRuntimeValuesMoved: 0,
    id: "docs_or_ui_cleanup",
    reason:
      "Docs-only cleanup, UI wording, and report presentation do not move calculator route ownership or numeric basis integrity for this slice.",
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

describe("post-V1 runtime-first rerank after wall user-material double-leaf building lab-companion target-output independence coverage refresh", () => {
  it("lands the no-runtime rerank and selects the Gate AR direct-curve lab-companion owner", () => {
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

  it("ranks the live built-in Gate AR metric-integrity defect above support and catalog work", () => {
    const selected = CANDIDATES.filter((candidate) => candidate.selected);

    expect(selected).toEqual([
      expect.objectContaining({
        decision: "selected_runtime_metric_integrity_owner",
        estimatedRuntimeValuesMoved: 40,
        id: SELECTED_CANDIDATE_ID,
        routeFamily: "wall.gate_ar_direct_curve.building_prediction.lab_companion_metric_integrity",
        sourceRowsRequiredForRuntimeSelection: false
      })
    ]);
    expect(CANDIDATES.find((candidate) => candidate.id === "wall.user_material_double_leaf_building_lab_companion_target_output_independence_owner")).toMatchObject({
      decision: "rejected_already_landed"
    });
    expect(CANDIDATES.find((candidate) => candidate.id === "impact_product_catalog_delta_lw_matcher_followup")).toMatchObject({
      decision: "rejected_catalog_or_parallel_lane",
      sourceRowsRequiredForRuntimeSelection: true
    });
    expect(CANDIDATES.find((candidate) => candidate.id === "docs_or_ui_cleanup")).toMatchObject({
      decision: "rejected_support_only"
    });
  });

  it("keeps the selected owner bounded to existing Gate AR values without formula retune", () => {
    const selected = CANDIDATES.find((candidate) => candidate.selected);

    expect(selected?.reason).toContain("element-lab Rw/STC 44");
    expect(selected?.reason).toContain("building Rw/STC publish 38");
    expect(selected?.reason).toContain("keep R'w/Dn* field/building values unchanged");
    expect(RERANK_COUNTERS.estimatedNextCalculableRequestShapes).toBe(3);
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
      expect(content, path).toContain("candidateCount: 6");
      expect(content, path).toContain("roiAnalysisIterations: 4");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("sourceRowsImported: 0");
    }

    const gateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(gateRunner).toContain(RERANK_FILE.replace("packages/engine/", ""));
    expect(gateRunner).toContain(SELECTED_NEXT_FILE.replace("packages/engine/", ""));
  });
});
