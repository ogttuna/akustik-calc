import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_LANDED_GATE,
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTION_STATUS,
  POST_V1_GATE_EJ_COUNTERS,
  POST_V1_GATE_EJ_SURFACE_ID
} from "./post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej";
import {
  POST_V1_GATE_EK_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EK_PLAN_DOC_PATH,
  POST_V1_GATE_EK_ROI_ANALYSIS_ITERATIONS,
  POST_V1_GATE_EK_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_EK_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTION_STATUS,
  rankPostV1GateEKNumericCoverageCandidates,
  summarizePostV1GateEKNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-ek";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md",
  POST_V1_GATE_EK_PLAN_DOC_PATH
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate EK", () => {
  it("lands after Gate EJ and selects the wall visible-layer formula-route second pass", () => {
    const summary = summarizePostV1GateEKNumericCoverageGap();

    expect(POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTION_STATUS).toBe(
      "post_v1_floor_astm_iic_aiic_exact_band_input_surface_gate_ej_landed_surface_parity_selected_next_numeric_coverage_gap_gate_ek"
    );
    expect(POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_LANDED_GATE
    );
    expect(POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ek-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_EK_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_EK_PLAN_DOC_PATH,
      previousGateEJ: {
        counters: POST_V1_GATE_EJ_COUNTERS,
        landedGate: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_LANDED_GATE,
        selectedNextAction: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTION_STATUS,
        surfaceId: POST_V1_GATE_EJ_SURFACE_ID
      },
      roiAnalysisIterations: POST_V1_GATE_EK_ROI_ANALYSIS_ITERATIONS,
      selectedCandidateId: POST_V1_GATE_EK_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTION_STATUS
    });
  });

  it("runs two ROI iterations and ranks wall second-pass coverage above closed or unsafe repeats", () => {
    const candidates = rankPostV1GateEKNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_EK_NO_RUNTIME_COUNTERS.candidateCount);
    expect(POST_V1_GATE_EK_ROI_ANALYSIS_ITERATIONS).toHaveLength(2);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_EK_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: false,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_FILE,
      sliceKind: "wall_route_coverage_second_pass",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EK_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    });
    expect(selected?.score).toBeGreaterThan(byId.get("floor.astm_iic_aiic_closed_by_ej")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(
      byId.get("floor.closed_formula_route_repeats_after_ej")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.old_source_research_chain_blocked_or_superseded")?.score ?? 0
    );
    expect(byId.get("wall.supportless_topology_boundaries_are_needs_input")).toMatchObject({
      selected: false,
      sliceKind: "needs_input_boundary"
    });
    expect(byId.get("floor.dataholz_c11c_raw_source_reopens_fail_closed")).toMatchObject({
      selected: false,
      sliceKind: "blocked_source_or_tolerance"
    });
    expect(byId.get("broad_source_row_crawl_or_frontend_polish")).toMatchObject({
      passesCalculatorAdvancementTest: false,
      sliceKind: "blocked_non_goal"
    });
  });

  it("ties the selected candidate to current implementation evidence instead of stale wall-source closeouts", () => {
    const candidates = rankPostV1GateEKNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.id === POST_V1_GATE_EK_SELECTED_CANDIDATE_ID);

    expect(selected?.implementationEvidencePaths).toEqual([
      "docs/calculator/SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md",
      "packages/engine/src/post-wall-lined-massive-heavy-core-source-research-v1-next-slice-selection-contract.test.ts",
      "packages/engine/src/post-v1-wall-common-auto-topology-second-pass-gate-cs-contract.test.ts",
      "packages/engine/src/post-v1-wall-flat-layer-order-multicavity-gate-cu-contract.test.ts",
      "packages/engine/src/post-v1-wall-local-substitution-building-adapter-gate-cw-contract.test.ts",
      "packages/engine/src/post-v1-wall-timber-stud-bounded-runtime-basis-gate-dn-contract.test.ts",
      "packages/engine/src/post-v1-wall-clt-laminated-leaf-runtime-basis-gate-dp-contract.test.ts",
      "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts"
    ]);

    for (const candidate of candidates) {
      for (const path of candidate.implementationEvidencePaths) {
        expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      }
    }

    expect(selected?.expectedBeforeAfter).toEqual([
      "older wall coverage planning selected single-leaf, double-leaf, no-stud, timber, CLT, and lined-massive source/research gates before many post-V1 wall route gates landed",
      "post-V1 wall gates have since added common flat double-leaf, explicit flat-order, multicavity, local-substitution, exact-source, timber, CLT, and heavy-core bounded/runtime-basis coverage",
      "Gate EL must reconcile that current implementation and select only a fresh visible-layer wall route subset that can improve scope or accuracy without weakening needs_input or unsupported boundaries"
    ]);
  });

  it("keeps Gate EK no-runtime and blocks source crawl, wrong-metric derivation, and frontend-only work", () => {
    const candidates = rankPostV1GateEKNumericCoverageCandidates();
    const rejectedNonGoal = candidates.find(
      (candidate) => candidate.id === "broad_source_row_crawl_or_frontend_polish"
    );

    expect(POST_V1_GATE_EK_NO_RUNTIME_COUNTERS).toMatchObject({
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeBasisPromotions: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
    expect(candidates.some((candidate) => candidate.nextActionMovesRuntimeValues)).toBe(false);
    expect(rejectedNonGoal).toMatchObject({
      passesCalculatorAdvancementTest: false,
      sourceRowsRequiredForRuntimeSelection: true,
      touchesFrontendImplementationNow: false
    });
    expect(candidates.find((candidate) => candidate.id === "floor.lower_treatment_delta_lw_cross_family_derivation_rejected")).toBeUndefined();
  });

  it("keeps docs and the current-gate runner aligned with Gate EK and Gate EL selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_EK_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("Gate EL");
      expect(contents, path).toContain("wall visible-layer formula-route second pass");
      expect(contents, path).toContain("roiAnalysisIterations: 2");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const gateEkElPlan = readRepoFile(POST_V1_GATE_EK_PLAN_DOC_PATH);
    expect(gateEkElPlan).toContain("Gate EK Iteration 3 - Implementation Reconciliation");
    expect(gateEkElPlan).toContain("Current Implementation Ledger For Gate EL");
    expect(gateEkElPlan).toContain("Candidate Filter For Gate EL");
    expect(gateEkElPlan).toContain("Gate EL Candidate Order");
    expect(gateEkElPlan).toContain("Gate EL Work Order");
    expect(gateEkElPlan).toContain("wall.visible_advanced_wall_payload_surface_gap");
    expect(gateEkElPlan).toContain("wall.double_leaf_framed_visible_resolver_reachability_gap");
    expect(gateEkElPlan).toContain("No internet research is selected for this planning pass");

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-ei-contract.test.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts"
    );
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-ek-contract.test.ts");
  });
});
