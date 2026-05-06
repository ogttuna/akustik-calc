import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  evaluateWallTripleLeafBlockedDiagnostics,
  WALL_TRIPLE_LEAF_BLOCKED_DIAGNOSTICS_GATE_G5
} from "./wall-triple-leaf-blocked-diagnostics";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G5_HANDOFF.md"
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

const SOURCE_LIKE_TOPOLOGY_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  studSpacingMm: 610,
  studType: "light_steel_stud",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 92.1,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 92.1,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "twin_frame",
    topologyMode: "grouped_triple_leaf"
  }
};

describe("wall triple-leaf blocked diagnostics Gate G5", () => {
  it("lands blocked diagnostics no-runtime and selects local source/effect-model acquisition Gate G6", () => {
    expect(WALL_TRIPLE_LEAF_BLOCKED_DIAGNOSTICS_GATE_G5).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_g6_local_source_acquisition_and_effect_model_requirements",
      selectedNextFile: "packages/engine/src/wall-triple-leaf-local-source-acquisition-gate-g6.test.ts",
      workbenchInputBehaviorChange: false
    });
  });

  it("turns Gate G4 material and topology blockers into exact user/developer diagnostics", () => {
    const evaluation = evaluateWallTripleLeafBlockedDiagnostics({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.diagnostics.map((diagnostic) => diagnostic.id)).toEqual([
      "triple_leaf_current_result_screening_only",
      "triple_leaf_generic_gypsum_board_not_type_c_owned",
      "triple_leaf_rockwool_not_glass_fiber_owned",
      "triple_leaf_mlv_absent_from_source_family",
      "triple_leaf_gypsum_plaster_absent_from_source_family",
      "triple_leaf_50mm_cavity_not_nrc_92mm_source_family",
      "triple_leaf_internal_leaf_generic_board_not_type_c",
      "triple_leaf_support_gauge_depth_not_owned",
      "triple_leaf_face_leaf_contains_out_of_family_mass",
      "triple_leaf_paired_visible_runtime_tests_missing"
    ]);
    expect(evaluation.diagnostics.every((diagnostic) => diagnostic.blockingRuntime)).toBe(true);
    expect(evaluation.userDiagnosticIds).toEqual(
      expect.arrayContaining([
        "triple_leaf_current_result_screening_only",
        "triple_leaf_rockwool_not_glass_fiber_owned",
        "triple_leaf_mlv_absent_from_source_family",
        "triple_leaf_gypsum_plaster_absent_from_source_family",
        "triple_leaf_50mm_cavity_not_nrc_92mm_source_family"
      ])
    );
    expect(evaluation.developerDiagnosticIds).toContain("triple_leaf_paired_visible_runtime_tests_missing");
    expect(
      evaluation.diagnostics.find((diagnostic) => diagnostic.id === "triple_leaf_generic_gypsum_board_not_type_c_owned")
        ?.requiredEvidence
    ).toContain("specific local board product or Type C equivalent mapping");
  });

  it("ranks the Gate G6 acquisition targets before any runtime promotion", () => {
    const evaluation = evaluateWallTripleLeafBlockedDiagnostics({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.sourceAcquisitionTargets.map((target) => `${target.priority}:${target.id}`)).toEqual([
      "1:local_type_c_board_product_mapping",
      "2:rockwool_absorber_equivalence_or_measured_row",
      "3:local_50mm_rockwool_cavity_source_row",
      "4:mlv_limp_mass_triple_leaf_effect_model",
      "5:gypsum_plaster_face_finish_effect_model",
      "6:support_gauge_depth_and_spacing_mapping"
    ]);
    expect(evaluation.sourceAcquisitionTargets.every((target) => target.requiredBeforeRuntime)).toBe(true);
    expect(evaluation.sourceAcquisitionTargets.every((target) => target.selectedForGateG6)).toBe(true);
    expect(evaluation.runtimeImportReadyNow).toBe(false);
    expect(evaluation.runtimeImportSelectedNow).toBe(false);
  });

  it("keeps diagnostics tied to the evaluated topology instead of emitting fixed warnings", () => {
    const evaluation = evaluateWallTripleLeafBlockedDiagnostics({
      airborneContext: SOURCE_LIKE_TOPOLOGY_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.localMappingEvaluation.groupedTopologyComplete).toBe(true);
    expect(evaluation.localMappingEvaluation.blockers).not.toContain(
      "local_cavity_depths_or_fill_do_not_match_nrc_92_1_mm_full_fill_source_family"
    );
    expect(evaluation.diagnostics.map((diagnostic) => diagnostic.id)).not.toContain(
      "triple_leaf_50mm_cavity_not_nrc_92mm_source_family"
    );
    expect(evaluation.diagnostics.map((diagnostic) => diagnostic.id)).toEqual(
      expect.arrayContaining([
        "triple_leaf_generic_gypsum_board_not_type_c_owned",
        "triple_leaf_rockwool_not_glass_fiber_owned",
        "triple_leaf_support_gauge_depth_not_owned"
      ])
    );
  });

  it("preserves the live split-rockwool result as caveated screening only", () => {
    const evaluation = evaluateWallTripleLeafBlockedDiagnostics({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const liveResult = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(evaluation.screeningCaveat.expectedLiveRwDb).toBe(41);
    expect(evaluation.screeningCaveat.expectedLiveStrategy).toBe("multileaf_screening_blend");
    expect(evaluation.screeningCaveat.message).toContain("screening only");
    expect(liveResult.metrics.estimatedRwDb).toBe(50);
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("triple_leaf_two_cavity_frequency_solver_family_physics_prediction");
    expect(liveResult.dynamicAirborneTrace?.confidenceClass).toBe("medium");
  });

  it("keeps active docs aligned with Gate G5 and the selected Gate G6 source/effect-model step", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_BLOCKED_DIAGNOSTICS_GATE_G5.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_BLOCKED_DIAGNOSTICS_GATE_G5.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate G5 - Blocked Diagnostics and Source Acquisition Decision");
    expect(plan).toContain("Gate G6 - Local Source Acquisition and Effect Model Requirements");
    expect(plan).toContain("Gate G5 keeps the current `Rw 41` answer visibly caveated as screening");
  });
});
