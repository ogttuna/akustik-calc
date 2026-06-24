import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_wall_user_material_formula_required_input_surface_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-wall-user-material-formula-required-input-surface-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_wall_user_material_formula_required_input_surface_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_wall_user_material_formula_required_input_surface_coverage_refresh";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_required_input_surface_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-required-input-surface-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_WALL_USER_MATERIAL_FORMULA_REQUIRED_INPUT_SURFACE_COVERAGE_REFRESH_PLAN_2026-06-24.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_required_input_surface_coverage_refresh_landed_no_runtime_selected_wall_user_material_double_leaf_building_leaf_mass_boundary_owner";

const SELECTED_CANDIDATE_ID =
  "wall.user_material_double_leaf_building_leaf_mass_boundary_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_wall_user_material_double_leaf_building_leaf_mass_boundary_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-user-material-double-leaf-building-leaf-mass-boundary-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_USER_MATERIAL_DOUBLE_LEAF_BUILDING_LEAF_MASS_BOUNDARY_OWNER_PLAN_2026-06-24.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall user-material double-leaf building leaf-mass boundary owner";

const RERANK_COUNTERS = {
  candidateCount: 7,
  estimatedNextCalculableRequestShapes: 0,
  estimatedNextCalculableTargetOutputs: 0,
  estimatedNextIncorrectRuntimeRequestShapesBlocked: 2,
  estimatedNextRequiredPhysicalInputsCaptured: 1,
  estimatedNextTargetOutputsParked: 10,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_already_live"
  | "rejected_broader_than_gap"
  | "rejected_closed_chain"
  | "rejected_frontend_or_source_first"
  | "selected_runtime_boundary_owner_ready";

type Candidate = {
  readonly decision: CandidateDecision;
  readonly expectedTargetOutputsParked: number;
  readonly id: string;
  readonly reason: string;
  readonly routeFamily: string;
  readonly runtimeOwnerAuthorizedNext: boolean;
  readonly targetOutputs: readonly RequestedOutputId[];
};

const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];
const LAB_COMPANION_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const CANDIDATES = [
  {
    decision: "selected_runtime_boundary_owner_ready",
    expectedTargetOutputsParked: 10,
    id: SELECTED_CANDIDATE_ID,
    reason:
      "The just-landed user-material input-surface owner parks missing leaf mass for source-absent user/project walls, but an explicit double-leaf/framed building_prediction request can still be promoted by Gate AR because the Gate S leaf-mass boundary does not recognize Gate AR or DnT,A,k. The next owner should block those false field/building and lab-companion outputs behind the existing side-leaf mass input.",
    routeFamily: "wall.double_leaf_framed.user_material.building_prediction.leaf_mass_boundary",
    runtimeOwnerAuthorizedNext: true,
    targetOutputs: [...FIELD_BUILDING_OUTPUTS, ...LAB_COMPANION_OUTPUTS]
  },
  {
    decision: "rejected_already_live",
    expectedTargetOutputsParked: 0,
    id: "wall.user_material_complete_building_dntak_owner",
    reason:
      "Complete user-material single-leaf and double-leaf/framed building requests already calculate DnT,A,k through Gate AR when physical inputs are positive.",
    routeFamily: "wall.user_material.complete_building_prediction",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: ["DnT,A,k"]
  },
  {
    decision: "rejected_broader_than_gap",
    expectedTargetOutputsParked: 0,
    id: "wall.user_material_needs_input_metric_scrub_owner",
    reason:
      "Metric-object cleanup is useful, but the higher ROI defect is an actually supported building_prediction output set from missing leaf mass; park the wrong support bucket first.",
    routeFamily: "wall.user_material.needs_input_visibility",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: [...FIELD_BUILDING_OUTPUTS, ...LAB_COMPANION_OUTPUTS]
  },
  {
    decision: "rejected_closed_chain",
    expectedTargetOutputsParked: 0,
    id: "project_user_measured_wall_frequency_chain",
    reason:
      "Exact measured-frequency bridge, compatible delta, field/building adapter, and lab-companion integrity chains already have owner and coverage-refresh contracts.",
    routeFamily: "wall.project_user_measured_frequency",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: [...FIELD_BUILDING_OUTPUTS, ...LAB_COMPANION_OUTPUTS]
  },
  {
    decision: "rejected_closed_chain",
    expectedTargetOutputsParked: 0,
    id: "floor_user_material_impact_dynamic_stiffness_chain",
    reason:
      "The floor impact dynamic-stiffness lane already has an owner, coverage refresh, and follow-on field-only adapter chain; reopening it here would not follow the current wall input-surface gap.",
    routeFamily: "floor.user_material.impact",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: ["Ln,w", "DeltaLw", "IIC", "AIIC"]
  },
  {
    decision: "rejected_frontend_or_source_first",
    expectedTargetOutputsParked: 0,
    id: "broad_source_crawl_or_manufacturer_rating_import",
    reason:
      "No exact row or same-family bounded delta is needed to fix this runtime boundary, and importing source rows would displace the calculator behavior defect.",
    routeFamily: "source_evidence",
    runtimeOwnerAuthorizedNext: false,
    targetOutputs: []
  },
  {
    decision: "rejected_frontend_or_source_first",
    expectedTargetOutputsParked: 0,
    id: "ui_report_confidence_or_process_cleanup",
    reason:
      "UI/report/process work does not improve formula-route ownership, required input capture, or metric/basis integrity for this slice.",
    routeFamily: "non_calculator",
    runtimeOwnerAuthorizedNext: false,
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
      landedGate: PREVIOUS_COVERAGE_ACTION,
      selectedNextFile: PREVIOUS_COVERAGE_FILE,
      selectionStatus: PREVIOUS_COVERAGE_STATUS
    },
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: RERANK_STATUS
  };
}

describe("post-V1 runtime-first route-family rerank after wall user-material formula required input surface coverage refresh", () => {
  it("lands the no-runtime rerank and selects the double-leaf building leaf-mass boundary owner", () => {
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

  it("selects a runtime boundary defect above closed chains and support-only work", () => {
    const selected = CANDIDATES.filter((candidate) => candidate.runtimeOwnerAuthorizedNext);

    expect(selected).toEqual([
      expect.objectContaining({
        decision: "selected_runtime_boundary_owner_ready",
        expectedTargetOutputsParked: 10,
        id: SELECTED_CANDIDATE_ID,
        routeFamily: "wall.double_leaf_framed.user_material.building_prediction.leaf_mass_boundary"
      })
    ]);
    expect(CANDIDATES.find((candidate) => candidate.id === "wall.user_material_complete_building_dntak_owner")).toMatchObject({
      decision: "rejected_already_live"
    });
    expect(CANDIDATES.find((candidate) => candidate.id === "project_user_measured_wall_frequency_chain")).toMatchObject({
      decision: "rejected_closed_chain"
    });
    expect(CANDIDATES.find((candidate) => candidate.id === "broad_source_crawl_or_manufacturer_rating_import")).toMatchObject({
      decision: "rejected_frontend_or_source_first"
    });
  });

  it("keeps the selected owner bounded to required-input capture without formula retune or source import", () => {
    const selected = CANDIDATES.find((candidate) => candidate.id === SELECTED_CANDIDATE_ID);

    expect(selected?.reason).toContain("Gate AR");
    expect(selected?.reason).toContain("DnT,A,k");
    expect(selected?.reason).toContain("side-leaf mass input");
    expect(RERANK_COUNTERS.estimatedNextCalculableRequestShapes).toBe(0);
    expect(RERANK_COUNTERS.estimatedNextIncorrectRuntimeRequestShapesBlocked).toBe(2);
    expect(RERANK_COUNTERS.runtimeFormulaRetunes).toBe(0);
    expect(RERANK_COUNTERS.runtimeValuesMoved).toBe(0);
    expect(RERANK_COUNTERS.sourceRowsImported).toBe(0);
    expect(RERANK_COUNTERS.frontendImplementationFilesTouched).toBe(0);
  });

  it("keeps docs and the current-gate runner aligned with the rerank and selected owner", () => {
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
    }

    const gateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(gateRunner).toContain(RERANK_FILE.replace("packages/engine/", ""));
    expect(gateRunner).toContain(SELECTED_NEXT_FILE.replace("packages/engine/", ""));
  });
});
