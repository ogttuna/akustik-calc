import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_wall_gate_ar_direct_curve_building_lab_companion_target_output_independence_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-wall-gate-ar-direct-curve-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_wall_gate_ar_direct_curve_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_wall_gate_ar_direct_curve_building_lab_companion_target_output_independence_coverage_refresh";

const RERANK_ACTION =
  "post_v1_runtime_first_rerank_after_wall_gate_ar_direct_curve_building_lab_companion_target_output_independence_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-rerank-after-wall-gate-ar-direct-curve-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_WALL_GATE_AR_DIRECT_CURVE_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-24.md";
const RERANK_STATUS =
  "post_v1_runtime_first_rerank_after_wall_gate_ar_direct_curve_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner";

const SELECTED_CANDIDATE_ID =
  "wall.advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall advanced-wall source-absent field/building lab-companion target-output independence owner";

const RERANK_COUNTERS = {
  candidateCount: 7,
  estimatedNextCalculableRequestShapes: 2,
  estimatedNextCalculableTargetOutputs: 8,
  estimatedNextRequiredPhysicalInputsCaptured: 0,
  estimatedNextRuntimeBasisPromotions: 2,
  estimatedNextRuntimeValuesMoved: 8,
  estimatedNextUnsupportedBoundariesProtected: 7,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_parallel_catalog_lane"
  | "rejected_previous_chain"
  | "rejected_requires_new_research"
  | "rejected_support_only"
  | "rejected_weaker_formula_scope"
  | "selected_runtime_formula_scope_owner";

type Candidate = {
  readonly decision: CandidateDecision;
  readonly estimatedRuntimeValuesMoved: number;
  readonly id: string;
  readonly reason: string;
  readonly routeFamily: string;
  readonly runtimeOwnerAuthorizedNext: boolean;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetOutputs: readonly RequestedOutputId[];
};

const LAB_COMPANION_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

// This is intentionally a no-runtime rerank. It records why the next
// calculator slice stays in owned physics instead of drifting into catalog,
// UI, or broad source-import work while multiple agents are active.
const CANDIDATES = [
  {
    decision: "selected_runtime_formula_scope_owner",
    estimatedRuntimeValuesMoved: RERANK_COUNTERS.estimatedNextRuntimeValuesMoved,
    id: SELECTED_CANDIDATE_ID,
    reason:
      "The Gate AR owner closed target-output dependent lab companions for a built-in double-leaf route. The next highest-ROI extension is the source-absent advanced-wall route: it serves arbitrary user-entered wall assemblies through owned Gate AY physics, complete field/building context, and the existing Gate I / Gate AR adapters. The selected owner should publish lab-only Rw 65, STC 65, C -1.1, and Ctr -6.4 for complete field/building contexts without retuning formulas, importing source rows, or copying field values into lab companions.",
    routeFamily: "wall.advanced_wall_source_absent.field_building_lab_companion_target_output_independence",
    runtimeOwnerAuthorizedNext: true,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: [...LAB_COMPANION_OUTPUTS, ...FIELD_BUILDING_OUTPUTS]
  },
  {
    decision: "rejected_previous_chain",
    estimatedRuntimeValuesMoved: 0,
    id: "wall.gate_ar_direct_curve_building_lab_companion_target_output_independence_owner",
    reason:
      "The immediately previous owner and coverage refresh already protected built-in Gate AR direct-curve lab companions at Rw 44, STC 44, C -1.3, and Ctr -6.4.",
    routeFamily: "wall.gate_ar_direct_curve.building_prediction.lab_companion_target_output_independence",
    runtimeOwnerAuthorizedNext: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: [...LAB_COMPANION_OUTPUTS, ...FIELD_BUILDING_OUTPUTS]
  },
  {
    decision: "rejected_weaker_formula_scope",
    estimatedRuntimeValuesMoved: 0,
    id: "project_user_measured_wall_airborne_frequency_lab_companion_followup",
    reason:
      "Measured-frequency adapters remain valid evidence work, but this rerank prefers the broader source-absent formula route because it calculates arbitrary advanced-wall stacks without requiring a project/user measurement first.",
    routeFamily: "wall.project_user_measured_frequency.field_building_lab_companion",
    runtimeOwnerAuthorizedNext: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: [...LAB_COMPANION_OUTPUTS, ...FIELD_BUILDING_OUTPUTS]
  },
  {
    decision: "rejected_weaker_formula_scope",
    estimatedRuntimeValuesMoved: 0,
    id: "wall.context_owned_porous_cavity_lab_companion_basis_integrity",
    reason:
      "Context-owned porous-cavity basis integrity is strategically strong, but it depends on a narrower explicitly parameterized cavity context. The selected source-absent advanced-wall owner opens a simpler next target-output-independence defect already exposed by the current Gate AR chain.",
    routeFamily: "wall.context_owned_porous_cavity.field_building_lab_companion_basis_integrity",
    runtimeOwnerAuthorizedNext: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: [...LAB_COMPANION_OUTPUTS, ...FIELD_BUILDING_OUTPUTS]
  },
  {
    decision: "rejected_parallel_catalog_lane",
    estimatedRuntimeValuesMoved: 0,
    id: "impact_product_catalog_delta_lw_stack_boundary_followup",
    reason:
      "Impact product DeltaLw stack-boundary hardening is valid, but the user has assigned that catalog/impact seed lane elsewhere. This rerank keeps the main engine formula-scope chain moving.",
    routeFamily: "floor.impact.product_delta_lw_stack_boundary",
    runtimeOwnerAuthorizedNext: false,
    sourceRowsRequiredForRuntimeSelection: true,
    targetOutputs: IMPACT_OUTPUTS
  },
  {
    decision: "rejected_requires_new_research",
    estimatedRuntimeValuesMoved: 0,
    id: "new_formula_family_research_before_owner",
    reason:
      "A new formula family can be high ROI later, but this slice already has an owned route with complete inputs and bounded expected movement, so no external research is needed before selection.",
    routeFamily: "new_formula_family",
    runtimeOwnerAuthorizedNext: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: []
  },
  {
    decision: "rejected_support_only",
    estimatedRuntimeValuesMoved: 0,
    id: "docs_ui_or_confidence_cleanup",
    reason:
      "Docs-only cleanup, UI polish, confidence copy, and broad process work do not move calculator route ownership or metric/basis integrity for this selected slice.",
    routeFamily: "non_calculator",
    runtimeOwnerAuthorizedNext: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: []
  }
] as const satisfies readonly Candidate[];

const REQUIRED_CURRENT_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  RERANK_PLAN_DOC
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

describe("post-V1 runtime-first rerank after wall Gate AR direct-curve building lab-companion target-output independence coverage refresh", () => {
  it("lands the no-runtime rerank and selects the advanced-wall source-absent runtime owner", () => {
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
      PREVIOUS_COVERAGE_FILE,
      RERANK_FILE,
      RERANK_PLAN_DOC,
      SELECTED_NEXT_FILE,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ranks the owned advanced-wall formula scope above catalog, support, and weaker local options", () => {
    const selected = CANDIDATES.filter((candidate) => candidate.runtimeOwnerAuthorizedNext);

    expect(selected).toEqual([
      expect.objectContaining({
        decision: "selected_runtime_formula_scope_owner",
        estimatedRuntimeValuesMoved: 8,
        id: SELECTED_CANDIDATE_ID,
        routeFamily: "wall.advanced_wall_source_absent.field_building_lab_companion_target_output_independence",
        sourceRowsRequiredForRuntimeSelection: false
      })
    ]);
    expect(CANDIDATES.find((candidate) => candidate.id === "wall.gate_ar_direct_curve_building_lab_companion_target_output_independence_owner")).toMatchObject({
      decision: "rejected_previous_chain"
    });
    expect(CANDIDATES.find((candidate) => candidate.id === "impact_product_catalog_delta_lw_stack_boundary_followup")).toMatchObject({
      decision: "rejected_parallel_catalog_lane",
      sourceRowsRequiredForRuntimeSelection: true
    });
    expect(CANDIDATES.find((candidate) => candidate.id === "docs_ui_or_confidence_cleanup")).toMatchObject({
      decision: "rejected_support_only"
    });
  });

  it("keeps the selected owner bounded to existing Gate AY/Gate AR values without formula retune", () => {
    const selected = CANDIDATES.find((candidate) => candidate.runtimeOwnerAuthorizedNext);

    expect(selected?.reason).toContain("Rw 65");
    expect(selected?.reason).toContain("STC 65");
    expect(selected?.reason).toContain("C -1.1");
    expect(selected?.reason).toContain("Ctr -6.4");
    expect(selected?.reason).toContain("without retuning formulas");
    expect(RERANK_COUNTERS.estimatedNextCalculableRequestShapes).toBe(2);
    expect(RERANK_COUNTERS.estimatedNextCalculableTargetOutputs).toBe(8);
    expect(RERANK_COUNTERS.estimatedNextRuntimeValuesMoved).toBe(8);
    expect(RERANK_COUNTERS.runtimeFormulaRetunes).toBe(0);
    expect(RERANK_COUNTERS.sourceRowsImported).toBe(0);
    expect(RERANK_COUNTERS.frontendImplementationFilesTouched).toBe(0);
  });

  it("keeps docs and current-gate runner aligned with the rerank and selected owner", () => {
    for (const path of REQUIRED_CURRENT_DOCS) {
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

    const selectedNextPlan = readRepoFile(SELECTED_NEXT_PLAN_DOC);
    expect(selectedNextPlan).toContain(SELECTED_CANDIDATE_ID);
    expect(selectedNextPlan).toContain(SELECTED_NEXT_ACTION);
    expect(selectedNextPlan).toContain(SELECTED_NEXT_FILE);
    expect(selectedNextPlan).toContain(SELECTED_NEXT_LABEL);

    const gateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(gateRunner).toContain(RERANK_FILE.replace("packages/engine/", ""));
    expect(gateRunner).toContain(SELECTED_NEXT_FILE.replace("packages/engine/", ""));
  });
});
