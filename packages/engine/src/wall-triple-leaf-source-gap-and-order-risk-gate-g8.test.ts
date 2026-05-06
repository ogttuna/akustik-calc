import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  evaluateWallTripleLeafSourceGapAndOrderRisk,
  WALL_TRIPLE_LEAF_GATE_G8_TEST_OWNERSHIP,
  WALL_TRIPLE_LEAF_SOURCE_GAP_AND_ORDER_RISK_GATE_G8
} from "./wall-triple-leaf-source-gap-and-order-risk";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G8_HANDOFF.md"
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

describe("wall triple-leaf source-gap and order-risk Gate G8", () => {
  it("lands the source-gap/order-risk register no-runtime and selects visible diagnostics/topology guard Gate G9", () => {
    expect(WALL_TRIPLE_LEAF_SOURCE_GAP_AND_ORDER_RISK_GATE_G8).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_g9_visible_diagnostics_and_grouped_topology_guard",
      selectedNextFile: "packages/engine/src/wall-triple-leaf-visible-diagnostics-and-topology-guard-gate-g9.test.ts",
      workbenchInputBehaviorChange: false
    });
  });

  it("classifies the remaining Gate G7 source gaps into acquisition, effect-model, and topology-owner buckets", () => {
    const evaluation = evaluateWallTripleLeafSourceGapAndOrderRisk({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.sourceGapDecisions.map((decision) => `${decision.requirementId}:${decision.bucket}`)).toEqual([
      "local_type_c_board_product_mapping:source_acquisition_required",
      "rockwool_absorber_equivalence_or_measured_row:source_acquisition_required",
      "local_50mm_rockwool_cavity_source_row:source_acquisition_required",
      "mlv_limp_mass_triple_leaf_effect_model:bounded_effect_model_required",
      "gypsum_plaster_face_finish_effect_model:bounded_effect_model_required",
      "support_gauge_depth_and_spacing_mapping:topology_input_owner_required"
    ]);
    expect(evaluation.openSourceGapCount).toBe(6);
    expect(evaluation.sourceGapsClosed).toBe(false);
    expect(evaluation.sourceGapDecisions.every((decision) => decision.runtimeBlocked)).toBe(true);
  });

  it("selects only the new wall route-flip risks for Gate G9 while preserving existing order-sensitive boundaries", () => {
    const evaluation = evaluateWallTripleLeafSourceGapAndOrderRisk({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.orderRiskDecisions.map((decision) => `${decision.id}:${decision.disposition}`)).toEqual([
      "triple_leaf_double_leaf_route_flip:selected_for_gate_g9_visible_topology_guard",
      "heavy_multileaf_lined_massive_boundary_flip:preserve_existing_order_sensitive_tests",
      "masonry_lined_massive_swap_flip:preserve_existing_order_sensitive_tests",
      "duplicate_stack_family_flip:selected_for_gate_g9_visible_topology_guard",
      "raw_floor_order_role_inference_sensitivity:preserve_existing_floor_role_tests"
    ]);
    expect(
      evaluation.orderRiskDecisions
        .filter((decision) => decision.disposition === "selected_for_gate_g9_visible_topology_guard")
        .map((decision) => decision.id)
    ).toEqual(["triple_leaf_double_leaf_route_flip", "duplicate_stack_family_flip"]);
    expect(evaluation.routeGuardReadyForRuntime).toBe(false);
  });

  it("requires paired engine and web-visible test ownership before route smoothing or runtime promotion", () => {
    const evaluation = evaluateWallTripleLeafSourceGapAndOrderRisk({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.testOwnership).toBe(WALL_TRIPLE_LEAF_GATE_G8_TEST_OWNERSHIP);
    expect(evaluation.testOwnership.engine.map((owner) => owner.path)).toContain(
      "packages/engine/src/dynamic-airborne-order-sensitivity.test.ts"
    );
    expect(evaluation.testOwnership.engine.map((owner) => owner.path)).toContain(
      "packages/engine/src/floor-layer-order-edit-stability-gate-a-matrix.test.ts"
    );
    expect(evaluation.testOwnership.webVisible.map((owner) => owner.path)).toContain(
      "apps/web/features/workbench/dynamic-route-order-sensitivity.test.ts"
    );
    expect(evaluation.testOwnership.webVisible.map((owner) => owner.path)).toContain(
      "apps/web/features/workbench/wall-reorder-invariance-matrix.test.ts"
    );
    expect(evaluation.testOwnership.futureGateG9WebTarget).toBe(
      "apps/web/features/workbench/wall-triple-leaf-visible-diagnostics-and-topology-guard.test.ts"
    );
    expect(evaluation.visibleDiagnosticsRequired).toBe(true);
  });

  it("keeps the live split-rockwool answer frozen as low-confidence multileaf screening", () => {
    const evaluation = evaluateWallTripleLeafSourceGapAndOrderRisk({
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
    expect(liveResult.metrics.estimatedRwDb).toBe(50);
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("triple_leaf_two_cavity_frequency_solver_family_physics_prediction");
    expect(liveResult.dynamicAirborneTrace?.confidenceClass).toBe("medium");
  });

  it("carries the Gate G7 source-pack intake forward as blocked, not mapping/tolerance ready", () => {
    const evaluation = evaluateWallTripleLeafSourceGapAndOrderRisk({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.localSourcePackEvaluation.sourcePackReadyForMappingTolerance).toBe(false);
    expect(evaluation.localSourcePackEvaluation.usableRuntimeCandidateCount).toBe(0);
    expect(
      evaluation.localSourcePackEvaluation.requirementIntakes
        .flatMap((intake) => intake.candidates)
        .every((candidate) => !candidate.usableForRuntime)
    ).toBe(true);
    expect(evaluation.sourceGapDecisions.map((decision) => decision.selectedFollowUp)).toEqual([
      "continue_local_source_acquisition",
      "continue_local_source_acquisition",
      "continue_local_source_acquisition",
      "bounded_local_effect_model_research",
      "bounded_local_effect_model_research",
      "grouped_topology_input_owner"
    ]);
  });

  it("keeps active docs aligned with Gate G8, Gate G9, and the route-flip risk ids", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_GAP_AND_ORDER_RISK_GATE_G8.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_GAP_AND_ORDER_RISK_GATE_G8.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate G8 - Source Gap and Order-Risk Register");
    expect(plan).toContain("Gate G9 - Visible Diagnostics and Grouped Topology Guard");
    expect(plan).toContain("triple_leaf_double_leaf_route_flip");
    expect(plan).toContain("duplicate_stack_family_flip");
  });
});
