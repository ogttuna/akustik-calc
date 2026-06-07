import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  POST_V1_GATE_EK_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-ek";
import {
  POST_V1_GATE_EL_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EL_PLAN_DOC_PATH,
  POST_V1_GATE_EL_RUNTIME_EXPECTATIONS,
  POST_V1_GATE_EL_SELECTED_OUTCOME_ID,
  POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_LANDED_GATE,
  POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_ACTION,
  POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_FILE,
  POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_LABEL,
  POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTION_STATUS,
  buildPostV1GateELVisibleWallRouteProbes,
  summarizePostV1WallVisibleLayerFormulaRouteSecondPassGateEL
} from "./post-v1-wall-visible-layer-formula-route-second-pass-gate-el";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md",
  POST_V1_GATE_EL_PLAN_DOC_PATH
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall visible-layer formula-route second pass Gate EL", () => {
  it("lands after Gate EK and returns to numeric rerank because no fresh wall runtime candidate passed", () => {
    const summary = summarizePostV1WallVisibleLayerFormulaRouteSecondPassGateEL();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ek_landed_no_runtime_selected_wall_visible_layer_formula_route_second_pass_gate_el"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_ACTION).toBe(
      POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-wall-visible-layer-formula-route-second-pass-gate-el-contract.test.ts"
    );

    expect(summary).toMatchObject({
      noRuntimeCounters: POST_V1_GATE_EL_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_EL_PLAN_DOC_PATH,
      previousGateEK: {
        landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_LANDED_GATE,
        selectedCandidateId: POST_V1_GATE_EK_SELECTED_CANDIDATE_ID,
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EK_SELECTION_STATUS
      },
      selectedNextAction: POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_LABEL,
      selectedOutcomeId: POST_V1_GATE_EL_SELECTED_OUTCOME_ID,
      selectionStatus: POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTION_STATUS
    });
    expect(summary.probes).toHaveLength(POST_V1_GATE_EL_NO_RUNTIME_COUNTERS.probeCount);
    expect(summary.probes.filter((probe) => probe.classification === "fresh_candidate")).toHaveLength(0);
    expect(summary.probes.some((probe) => probe.selectedForNextRuntimeGate)).toBe(false);
  }, 30000);

  it("classifies the current visible wall route probes without reopening closed wall gates", () => {
    const probes = buildPostV1GateELVisibleWallRouteProbes();
    const byId = new Map(probes.map((probe) => [probe.id, probe]));

    expect(probes.filter((probe) => probe.classification === "already_live")).toHaveLength(
      POST_V1_GATE_EL_NO_RUNTIME_COUNTERS.alreadyLiveProbeCount
    );
    expect(probes.filter((probe) => probe.classification === "closed_repeat")).toHaveLength(
      POST_V1_GATE_EL_NO_RUNTIME_COUNTERS.closedRepeatProbeCount
    );
    expect(probes.filter((probe) => probe.classification === "needs_input_boundary")).toHaveLength(
      POST_V1_GATE_EL_NO_RUNTIME_COUNTERS.needsInputBoundaryProbeCount
    );
    expect(probes.filter((probe) => probe.classification === "unsupported_boundary")).toHaveLength(
      POST_V1_GATE_EL_NO_RUNTIME_COUNTERS.unsupportedBoundaryProbeCount
    );

    expect(byId.get("wall.visible_advanced_wall_payload_surface_gap")).toMatchObject({
      classification: "already_live",
      candidateFilterPasses: false,
      routeOwnedEnoughForRuntime: true
    });
    expect(byId.get("wall.double_leaf_framed_visible_resolver_reachability_gap")).toMatchObject({
      classification: "already_live",
      candidateFilterPasses: false,
      routeOwnedEnoughForRuntime: true
    });
    expect(byId.get("wall.common_flat_order_double_leaf_building_repeat_gate_cs")).toMatchObject({
      classification: "closed_repeat"
    });
    expect(byId.get("wall.flat_layer_order_multicavity_repeat_gate_cu")).toMatchObject({
      classification: "closed_repeat"
    });
    expect(byId.get("wall.supportless_or_no_stud_flat_entry_gap")).toMatchObject({
      classification: "needs_input_boundary",
      routeOwnedEnoughForRuntime: false
    });
    expect(byId.get("wall.direct_fixed_double_leaf_bridge_owner_gap")).toMatchObject({
      classification: "unsupported_boundary",
      routeOwnedEnoughForRuntime: false
    });
    expect(byId.get("wall.source_row_or_holdout_tightening")).toMatchObject({
      classification: "unsupported_boundary",
      routeOwnedEnoughForRuntime: false
    });

    for (const probe of probes) {
      for (const path of probe.evidencePaths) {
        expect(existsSync(join(REPO_ROOT, path)), `${probe.id}:${path}`).toBe(true);
      }
    }
  });

  it("proves the two highest-ranked probes are already live through current Dynamic Calculator routes", () => {
    const summary = summarizePostV1WallVisibleLayerFormulaRouteSecondPassGateEL();
    const evidence = summary.runtimeProbeEvidence;

    expect(evidence.advancedWall).toMatchObject({
      activeCandidateId: POST_V1_GATE_EL_RUNTIME_EXPECTATIONS.advancedWallActiveCandidateId,
      activeMethod: POST_V1_GATE_EL_RUNTIME_EXPECTATIONS.advancedWallActiveMethod,
      activeOrigin: "family_physics_prediction",
      activeSupportedOutputs: ["Rw", "STC", "C", "Ctr"],
      fieldBoundaryOrigin: "unsupported",
      fieldBoundaryUnsupportedOutputs: ["R'w", "DnT,w"],
      missingInputOrigin: "needs_input"
    });
    expect(evidence.advancedWall.missingInputFields).toEqual(
      expect.arrayContaining(["panelLossFactor", "panelCriticalFrequencyHz"])
    );

    expect(evidence.doubleLeafResolver).toMatchObject({
      candidateId: POST_V1_GATE_EL_RUNTIME_EXPECTATIONS.doubleLeafResolverCandidateId,
      method: POST_V1_GATE_EL_RUNTIME_EXPECTATIONS.doubleLeafResolverMethod,
      origin: "family_physics_prediction",
      resolverCandidateId: POST_V1_GATE_EL_RUNTIME_EXPECTATIONS.doubleLeafResolverCandidateId,
      resolverRuntimeBasisId: POST_V1_GATE_EL_RUNTIME_EXPECTATIONS.doubleLeafResolverMethod,
      supportedOutputs: ["Rw", "STC", "C", "Ctr"]
    });
    expect(evidence.doubleLeafResolver.valuePins).toEqual(
      expect.arrayContaining([
        { metric: "Rw", value: 45 },
        { metric: "STC", value: 45 },
        { metric: "C", value: -1 },
        { metric: "Ctr", value: -6.1 }
      ])
    );
  }, 30000);

  it("keeps Gate EL no-runtime and blocks source crawl, frontend work, and unsafe metric aliases", () => {
    const summary = summarizePostV1WallVisibleLayerFormulaRouteSecondPassGateEL();

    expect(summary.noRuntimeCounters).toMatchObject({
      freshCandidateCount: 0,
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeBasisPromotions: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
    expect(summary.probes.every((probe) => probe.touchesFrontendImplementationNow === false)).toBe(true);
    expect(summary.probes.find((probe) => probe.id === "wall.source_row_or_holdout_tightening")).toMatchObject({
      classification: "unsupported_boundary",
      selectedForNextRuntimeGate: false
    });
    expect(summary.probes.find((probe) => probe.id === "wall.direct_fixed_double_leaf_bridge_owner_gap")).toMatchObject({
      classification: "unsupported_boundary",
      selectedForNextRuntimeGate: false
    });
  }, 30000);

  it("keeps docs and current-gate runner aligned with Gate EL and Gate EM selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_WALL_VISIBLE_LAYER_FORMULA_ROUTE_SECOND_PASS_GATE_EL_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_EL_SELECTED_OUTCOME_ID);
      expect(contents, path).toContain("freshCandidateCount 0");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const gateEkElPlan = readRepoFile(POST_V1_GATE_EL_PLAN_DOC_PATH);
    expect(gateEkElPlan).toContain("Gate EL Runtime Probe Result");
    expect(gateEkElPlan).toContain("wall.visible_advanced_wall_payload_surface_gap");
    expect(gateEkElPlan).toContain("wall.double_leaf_framed_visible_resolver_reachability_gap");
    expect(gateEkElPlan).toContain("post_v1_next_numeric_coverage_gap_gate_em_plan");

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-ek-contract.test.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-visible-layer-formula-route-second-pass-gate-el-contract.test.ts"
    );
  });
});
