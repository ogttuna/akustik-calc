import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  evaluateWallTripleLeafVisibleDiagnosticsAndTopologyGuard,
  WALL_TRIPLE_LEAF_VISIBLE_DIAGNOSTICS_AND_TOPOLOGY_GUARD_GATE_G9
} from "./wall-triple-leaf-visible-diagnostics-and-topology-guard";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G9_HANDOFF.md"
] as const;

const SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const COMPLETE_TRIPLE_LEAF_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

describe("wall triple-leaf visible diagnostics and topology guard Gate G9", () => {
  it("lands visible diagnostics/topology guard no-runtime and selects Gate H fail-closed prerequisite check", () => {
    expect(WALL_TRIPLE_LEAF_VISIBLE_DIAGNOSTICS_AND_TOPOLOGY_GUARD_GATE_G9).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_h_engine_integration_fail_closed_prerequisite_check",
      selectedNextFile: "packages/engine/src/wall-triple-leaf-engine-integration-fail-closed-gate-h.test.ts",
      workbenchInputBehaviorChange: false
    });
  });

  it("converts Gate G8 source gaps into user/developer visible blocked diagnostics", () => {
    const evaluation = evaluateWallTripleLeafVisibleDiagnosticsAndTopologyGuard({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.visibleDiagnostics.map((diagnostic) => diagnostic.id)).toEqual([
      "triple_leaf_visible_screening_result_not_validated",
      "triple_leaf_visible_local_type_c_board_source_gap",
      "triple_leaf_visible_rockwool_equivalence_source_gap",
      "triple_leaf_visible_50mm_cavity_source_gap",
      "triple_leaf_visible_mlv_effect_model_gap",
      "triple_leaf_visible_gypsum_plaster_effect_model_gap",
      "triple_leaf_visible_support_topology_owner_gap",
      "triple_leaf_visible_route_flip_grouped_topology_guard",
      "triple_leaf_visible_duplicate_stack_grouped_topology_guard",
      "triple_leaf_visible_runtime_promotion_missing_paired_tests"
    ]);
    expect(evaluation.visibleDiagnostics.every((diagnostic) => diagnostic.blocksRuntime)).toBe(true);
    expect(evaluation.visibleDiagnostics.every((diagnostic) => diagnostic.surfaces.includes("developer_trace"))).toBe(true);
    expect(
      evaluation.visibleDiagnostics.find((diagnostic) => diagnostic.id === "triple_leaf_visible_rockwool_equivalence_source_gap")
        ?.requiredBeforeRuntime
    ).toContain("rockwool/mineral-wool flow-resistivity/density equivalence or direct measured band curve");
  });

  it("keeps rockwool reorder and duplicate-stack risks visible as grouped topology guards", () => {
    const evaluation = evaluateWallTripleLeafVisibleDiagnosticsAndTopologyGuard({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.groupedTopologyGuards.map((guard) => `${guard.id}:${guard.coveredRiskIds.join("+")}`)).toEqual([
      "grouped_triple_leaf_roles_required:triple_leaf_double_leaf_route_flip",
      "flat_list_route_flip_guard_required:triple_leaf_double_leaf_route_flip",
      "duplicate_stack_guard_required:duplicate_stack_family_flip",
      "source_gap_runtime_block_guard:triple_leaf_double_leaf_route_flip+duplicate_stack_family_flip",
      "paired_visible_tests_runtime_block_guard:triple_leaf_double_leaf_route_flip+duplicate_stack_family_flip"
    ]);
    expect(evaluation.groupedTopologyGuards.every((guard) => guard.ownedByGateG9)).toBe(true);
    expect(evaluation.groupedTopologyGuards.every((guard) => !guard.readyForRuntimePromotion)).toBe(true);
    expect(
      evaluation.visibleDiagnostics.find(
        (diagnostic) => diagnostic.id === "triple_leaf_visible_route_flip_grouped_topology_guard"
      )?.surfaces
    ).toEqual(["workbench_input", "route_card", "output_card", "proposal_report", "developer_trace"]);
  });

  it("names paired engine/web visible test ownership while keeping web-visible runtime tests not ready", () => {
    const evaluation = evaluateWallTripleLeafVisibleDiagnosticsAndTopologyGuard({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const pairedGuard = evaluation.groupedTopologyGuards.find(
      (guard) => guard.id === "paired_visible_tests_runtime_block_guard"
    );

    expect(pairedGuard?.requiredBeforeRuntime).toEqual([
      "packages/engine/src/wall-triple-leaf-visible-diagnostics-and-topology-guard-gate-g9.test.ts",
      "apps/web/features/workbench/wall-triple-leaf-visible-diagnostics-and-topology-guard.test.ts"
    ]);
    expect(evaluation.visibleDiagnosticContractOwned).toBe(true);
    expect(evaluation.webVisibleRuntimeTestsReady).toBe(false);
    expect(evaluation.visibleDiagnosticsBlockRuntime).toBe(true);
  });

  it("preserves the previous blocked diagnostics chain and keeps all source gaps open", () => {
    const evaluation = evaluateWallTripleLeafVisibleDiagnosticsAndTopologyGuard({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const blockedDiagnostics =
      evaluation.sourceGapAndOrderRiskEvaluation.localSourcePackEvaluation.localSourceAcquisitionEvaluation
        .blockedDiagnosticsEvaluation;

    expect(blockedDiagnostics.diagnostics.map((diagnostic) => diagnostic.id)).toContain(
      "triple_leaf_current_result_screening_only"
    );
    expect(blockedDiagnostics.diagnostics.map((diagnostic) => diagnostic.id)).toContain(
      "triple_leaf_paired_visible_runtime_tests_missing"
    );
    expect(evaluation.sourceGapAndOrderRiskEvaluation.openSourceGapCount).toBe(6);
    expect(evaluation.sourceGapAndOrderRiskEvaluation.sourceGapsClosed).toBe(false);
  });

  it("keeps the live split-rockwool answer frozen as low-confidence multileaf screening", () => {
    const evaluation = evaluateWallTripleLeafVisibleDiagnosticsAndTopologyGuard({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const liveResult = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(evaluation.runtimeImportReadyNow).toBe(false);
    expect(evaluation.runtimeImportSelectedNow).toBe(false);
    expect(evaluation.routeCardValueChange).toBe(false);
    expect(evaluation.outputCardStatusChange).toBe(false);
    expect(liveResult.metrics.estimatedRwDb).toBe(50);
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("triple_leaf_two_cavity_frequency_solver_family_physics_prediction");
    expect(liveResult.dynamicAirborneTrace?.confidenceClass).toBe("medium");
  });

  it("keeps active docs aligned with Gate G9, Gate H, and the visible diagnostic ids", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_VISIBLE_DIAGNOSTICS_AND_TOPOLOGY_GUARD_GATE_G9.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_VISIBLE_DIAGNOSTICS_AND_TOPOLOGY_GUARD_GATE_G9.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate G9 - Visible Diagnostics and Grouped Topology Guard");
    expect(plan).toContain("Gate H - Engine Integration Fail-Closed");
    expect(plan).toContain("triple_leaf_visible_route_flip_grouped_topology_guard");
    expect(plan).toContain("triple_leaf_visible_duplicate_stack_grouped_topology_guard");
  });
});
