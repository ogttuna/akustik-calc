import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  evaluateWallTripleLeafEngineIntegrationFailClosed,
  WALL_TRIPLE_LEAF_ENGINE_INTEGRATION_FAIL_CLOSED_GATE_H
} from "./wall-triple-leaf-engine-integration-fail-closed";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_H_HANDOFF.md"
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

describe("wall triple-leaf engine integration fail-closed Gate H", () => {
  it("lands fail-closed prerequisite checking no-runtime and selects Gate I web-visible grouped topology inputs", () => {
    expect(WALL_TRIPLE_LEAF_ENGINE_INTEGRATION_FAIL_CLOSED_GATE_H).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_i_web_visible_grouped_topology_inputs_no_runtime",
      selectedNextFile: "apps/web/features/workbench/wall-triple-leaf-grouped-topology-route-card.test.ts",
      workbenchInputBehaviorChange: false
    });
  });

  it("passes source-family prerequisites but blocks local material, source-pack, guard, and paired-test prerequisites", () => {
    const evaluation = evaluateWallTripleLeafEngineIntegrationFailClosed({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.passedPrerequisiteIds).toEqual([
      "gate_g2b_executable_source_curves",
      "gate_g3_calibration_holdout_negative_boundaries",
      "complete_grouped_wall_topology"
    ]);
    expect(evaluation.blockedPrerequisiteIds).toEqual([
      "gate_g4_local_material_mapping",
      "gate_g7_usable_local_source_pack",
      "gate_g8_source_gaps_closed",
      "gate_g9_route_topology_guards_runtime_ready",
      "paired_engine_web_visible_runtime_tests"
    ]);
    expect(evaluation.canIntegrateRuntime).toBe(false);
    expect(evaluation.integrationDecision).toBe("fail_closed_screening_runtime_remains_active");
  });

  it("proves complete grouped topology is necessary but not sufficient for runtime integration", () => {
    const evaluation = evaluateWallTripleLeafEngineIntegrationFailClosed({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const byId = new Map(evaluation.prerequisites.map((prerequisite) => [prerequisite.id, prerequisite]));

    expect(byId.get("complete_grouped_wall_topology")).toMatchObject({ status: "passed" });
    expect(byId.get("gate_g4_local_material_mapping")).toMatchObject({ gateOwner: "G4", status: "blocked" });
    expect(byId.get("gate_g7_usable_local_source_pack")).toMatchObject({ gateOwner: "G7", status: "blocked" });
    expect(byId.get("gate_g8_source_gaps_closed")).toMatchObject({ gateOwner: "G8", status: "blocked" });
    expect(byId.get("gate_g9_route_topology_guards_runtime_ready")).toMatchObject({ gateOwner: "G9", status: "blocked" });
  });

  it("keeps every blocked prerequisite tied to visible diagnostics or topology guards", () => {
    const evaluation = evaluateWallTripleLeafEngineIntegrationFailClosed({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const blockedPrerequisites = evaluation.prerequisites.filter((prerequisite) => prerequisite.status === "blocked");

    expect(blockedPrerequisites.every((prerequisite) => prerequisite.diagnosticIds.length > 0)).toBe(true);
    expect(blockedPrerequisites.flatMap((prerequisite) => prerequisite.diagnosticIds)).toEqual(
      expect.arrayContaining([
        "triple_leaf_visible_rockwool_equivalence_source_gap",
        "triple_leaf_visible_50mm_cavity_source_gap",
        "triple_leaf_visible_route_flip_grouped_topology_guard",
        "triple_leaf_visible_duplicate_stack_grouped_topology_guard",
        "triple_leaf_visible_runtime_promotion_missing_paired_tests"
      ])
    );
    expect(
      evaluation.visibleDiagnosticsAndTopologyGuardEvaluation.groupedTopologyGuards.every(
        (guard) => !guard.readyForRuntimePromotion
      )
    ).toBe(true);
  });

  it("preserves source-family calibration and negative-boundary proof while refusing local runtime import", () => {
    const evaluation = evaluateWallTripleLeafEngineIntegrationFailClosed({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const localMapping =
      evaluation.visibleDiagnosticsAndTopologyGuardEvaluation.sourceGapAndOrderRiskEvaluation.localSourcePackEvaluation
        .localSourceAcquisitionEvaluation.blockedDiagnosticsEvaluation.localMappingEvaluation;

    expect(localMapping.calibrationFit.qcPassed).toBe(true);
    expect(localMapping.sourceFamilyCalibrationPass).toBe(true);
    expect(localMapping.negativeBoundariesPreserved).toBe(true);
    expect(localMapping.localMappingOwned).toBe(false);
    expect(localMapping.runtimeEligibleNow).toBe(false);
    expect(evaluation.runtimeImportReadyNow).toBe(false);
  });

  it("keeps the live split-rockwool answer frozen as low-confidence multileaf screening", () => {
    const evaluation = evaluateWallTripleLeafEngineIntegrationFailClosed({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const liveResult = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(evaluation.failClosedStrategy).toBe("multileaf_screening_blend");
    expect(evaluation.numericRuntimeBehaviorChange).toBe(false);
    expect(evaluation.routeCardValueChange).toBe(false);
    expect(evaluation.outputCardStatusChange).toBe(false);
    expect(liveResult.metrics.estimatedRwDb).toBe(41);
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("multileaf_screening_blend");
    expect(liveResult.dynamicAirborneTrace?.confidenceClass).toBe("low");
  });

  it("keeps active docs aligned with Gate H, Gate I, and fail-closed prerequisite ids", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_ENGINE_INTEGRATION_FAIL_CLOSED_GATE_H.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_ENGINE_INTEGRATION_FAIL_CLOSED_GATE_H.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate H - Engine Integration Fail-Closed");
    expect(plan).toContain("Gate I - Web-Visible Grouped Topology Inputs");
    expect(plan).toContain("gate_g4_local_material_mapping");
    expect(plan).toContain("paired_engine_web_visible_runtime_tests");
  });
});
