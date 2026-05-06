import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  evaluateWallTripleLeafRuntimePromotionReadiness,
  WALL_TRIPLE_LEAF_RUNTIME_PROMOTION_READINESS_GATE_K
} from "./wall-triple-leaf-runtime-promotion-readiness";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_K_HANDOFF.md"
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

describe("wall triple-leaf runtime promotion readiness Gate K", () => {
  it("lands runtime-promotion readiness no-runtime and selects Gate L source-gap closure", () => {
    expect(WALL_TRIPLE_LEAF_RUNTIME_PROMOTION_READINESS_GATE_K).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_l_source_gap_closure_no_runtime",
      selectedNextFile: "packages/engine/src/wall-triple-leaf-source-gap-closure-gate-l.test.ts",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });
  });

  it("passes source-family, complete-topology, and Gate J acceptance proof but keeps runtime promotion blocked", () => {
    const evaluation = evaluateWallTripleLeafRuntimePromotionReadiness({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.passedPrerequisiteIds).toEqual([
      "gate_g2b_executable_source_curves",
      "gate_g3_calibration_holdout_negative_boundaries",
      "complete_grouped_wall_topology",
      "gate_j_company_internal_acceptance_rehearsal"
    ]);
    expect(evaluation.blockedPrerequisiteIds).toEqual([
      "gate_g4_local_material_mapping",
      "gate_g7_usable_local_source_pack",
      "gate_g8_source_gaps_closed",
      "gate_g9_route_topology_guards_runtime_ready",
      "paired_engine_web_visible_runtime_tests"
    ]);
    expect(evaluation.readinessDecision).toBe("runtime_promotion_blocked_select_source_gap_closure");
    expect(evaluation.canPromoteRuntime).toBe(false);
    expect(evaluation.runtimePromotionReadyNow).toBe(false);
  });

  it("keeps every promotion blocker mapped to visible diagnostics and concrete missing evidence", () => {
    const evaluation = evaluateWallTripleLeafRuntimePromotionReadiness({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.runtimePromotionBlockers.map((blocker) => blocker.id)).toEqual([
      "local_material_mapping_unowned",
      "usable_local_source_pack_missing",
      "source_gaps_open",
      "runtime_topology_guards_not_ready",
      "paired_runtime_tests_missing"
    ]);
    expect(evaluation.runtimePromotionBlockers.every((blocker) => blocker.blocksRuntimePromotion)).toBe(true);
    expect(evaluation.runtimePromotionBlockers.every((blocker) => blocker.visibleDiagnosticIds.length > 0)).toBe(true);
    expect(evaluation.runtimePromotionBlockers.flatMap((blocker) => blocker.visibleDiagnosticIds)).toEqual(
      expect.arrayContaining([
        "triple_leaf_visible_local_type_c_board_source_gap",
        "triple_leaf_visible_rockwool_equivalence_source_gap",
        "triple_leaf_visible_mlv_effect_model_gap",
        "triple_leaf_visible_gypsum_plaster_effect_model_gap",
        "triple_leaf_visible_route_flip_grouped_topology_guard",
        "triple_leaf_visible_duplicate_stack_grouped_topology_guard",
        "triple_leaf_visible_runtime_promotion_missing_paired_tests"
      ])
    );

    const localMappingBlocker = evaluation.runtimePromotionBlockers.find(
      (blocker) => blocker.id === "local_material_mapping_unowned"
    );
    expect(localMappingBlocker?.requiredBeforePromotion).toEqual(
      expect.arrayContaining([
        "local gypsum_board Type C product mapping",
        "rockwool/mineral-wool measured row or accepted absorber equivalence",
        "MLV triple-leaf measured row or bounded limp-mass effect model",
        "gypsum plaster face-finish source row or bounded effect model",
        "local support gauge/depth/spacing mapping"
      ])
    );
  });

  it("turns the open Gate G8 source gaps into the selected Gate L closure plan", () => {
    const evaluation = evaluateWallTripleLeafRuntimePromotionReadiness({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.sourceGapClosurePlan.map((item) => `${item.requirementId}:${item.selectedFollowUp}`)).toEqual([
      "local_type_c_board_product_mapping:continue_local_source_acquisition",
      "rockwool_absorber_equivalence_or_measured_row:continue_local_source_acquisition",
      "local_50mm_rockwool_cavity_source_row:continue_local_source_acquisition",
      "mlv_limp_mass_triple_leaf_effect_model:bounded_local_effect_model_research",
      "gypsum_plaster_face_finish_effect_model:bounded_local_effect_model_research",
      "support_gauge_depth_and_spacing_mapping:grouped_topology_input_owner"
    ]);
    expect(evaluation.sourceGapClosurePlan.every((item) => item.requiredBeforeRuntime && item.selectedForGateL)).toBe(
      true
    );
    expect(evaluation.sourceGapClosurePlan.map((item) => item.bucket)).toEqual([
      "source_acquisition_required",
      "source_acquisition_required",
      "source_acquisition_required",
      "bounded_effect_model_required",
      "bounded_effect_model_required",
      "topology_input_owner_required"
    ]);
  });

  it("preserves the calibrated source-family proof while refusing local runtime promotion", () => {
    const evaluation = evaluateWallTripleLeafRuntimePromotionReadiness({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const localMapping =
      evaluation.engineIntegrationEvaluation.visibleDiagnosticsAndTopologyGuardEvaluation.sourceGapAndOrderRiskEvaluation
        .localSourcePackEvaluation.localSourceAcquisitionEvaluation.blockedDiagnosticsEvaluation.localMappingEvaluation;

    expect(localMapping.calibrationFit.qcPassed).toBe(true);
    expect(localMapping.sourceFamilyCalibrationPass).toBe(true);
    expect(localMapping.negativeBoundariesPreserved).toBe(true);
    expect(localMapping.groupedTopologyComplete).toBe(true);
    expect(localMapping.localMappingOwned).toBe(false);
    expect(evaluation.engineIntegrationEvaluation.canIntegrateRuntime).toBe(false);
  });

  it("keeps the live split-rockwool answer frozen as low-confidence multileaf screening", () => {
    const evaluation = evaluateWallTripleLeafRuntimePromotionReadiness({
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
    expect(liveResult.metrics.estimatedRwDb).toBe(50);
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("triple_leaf_two_cavity_frequency_solver_family_physics_prediction");
    expect(liveResult.dynamicAirborneTrace?.confidenceClass).toBe("medium");
  });

  it("keeps active docs aligned with Gate K, Gate L, and the no-runtime promotion decision", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_RUNTIME_PROMOTION_READINESS_GATE_K.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_RUNTIME_PROMOTION_READINESS_GATE_K.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate K - Runtime Promotion Readiness and Source-Gap Closure");
    expect(plan).toContain("Gate L - Source-Gap Closure");
    expect(plan).toContain("runtime_promotion_blocked_select_source_gap_closure");
    expect(plan).toContain("local_type_c_board_product_mapping");
    expect(plan).toContain("rockwool_absorber_equivalence_or_measured_row");
  });
});
