import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  evaluateWallTripleLeafLocalMaterialMapping,
  WALL_TRIPLE_LEAF_LOCAL_MATERIAL_MAPPING_GATE_G4,
  WALL_TRIPLE_LEAF_NRC_2024_SOURCE_FAMILY_ASSUMPTIONS
} from "./wall-triple-leaf-local-material-mapping";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G4_HANDOFF.md"
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

describe("wall triple-leaf local material mapping Gate G4", () => {
  it("lands the local mapping/runtime eligibility decision no-runtime and selects blocked diagnostics/source acquisition", () => {
    expect(WALL_TRIPLE_LEAF_LOCAL_MATERIAL_MAPPING_GATE_G4).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_g5_blocked_diagnostics_and_source_acquisition_decision",
      selectedNextFile: "packages/engine/src/wall-triple-leaf-blocked-diagnostics-gate-g5.test.ts",
      sourceFamilyCalibrationPass: true,
      workbenchInputBehaviorChange: false
    });
  });

  it("blocks the user stack because local materials do not map into the NRC 2024 source family", () => {
    const evaluation = evaluateWallTripleLeafLocalMaterialMapping({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.sourceFamilyCalibrationPass).toBe(true);
    expect(evaluation.localMappingOwned).toBe(false);
    expect(evaluation.runtimeEligibleNow).toBe(false);
    expect(evaluation.runtimeImportReadyNow).toBe(false);
    expect(evaluation.materialDecisions.map((decision) => `${decision.id}:${decision.status}`)).toEqual([
      "local_gypsum_board_to_nrc_type_c:blocked",
      "local_rockwool_to_nrc_glass_fiber_batt:blocked",
      "local_mlv_membrane:outside_source_family",
      "local_gypsum_plaster_finish:outside_source_family"
    ]);
    expect(evaluation.blockers).toEqual(
      expect.arrayContaining([
        "local_generic_gypsum_board_to_nrc_type_c_mapping_not_owned",
        "local_rockwool_to_nrc_glass_fiber_batt_mapping_not_owned",
        "local_mlv_absent_from_nrc_source_family",
        "local_gypsum_plaster_absent_from_nrc_source_family"
      ])
    );
    expect(evaluation.materialDecisions[0]?.notes.join(" ")).toContain("9.80 kg/m2");
    expect(WALL_TRIPLE_LEAF_NRC_2024_SOURCE_FAMILY_ASSUMPTIONS.absorber).toContain("glass-fiber batt");
  });

  it("keeps complete grouped topology blocked when the local cavity/support family is not source-owned", () => {
    const evaluation = evaluateWallTripleLeafLocalMaterialMapping({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.groupedTopologyComplete).toBe(true);
    expect(evaluation.topologyDecisions.map((decision) => `${decision.id}:${decision.status}`)).toEqual([
      "complete_grouped_triple_leaf_topology:owned",
      "source_family_cavity_depth_and_fill:blocked",
      "source_family_internal_leaf:blocked",
      "source_family_support_topology:blocked",
      "source_family_leaf_surface_buildups:blocked"
    ]);
    expect(evaluation.blockers).toEqual(
      expect.arrayContaining([
        "local_cavity_depths_or_fill_do_not_match_nrc_92_1_mm_full_fill_source_family",
        "local_internal_leaf_is_generic_gypsum_board_not_source_owned_type_c",
        "source_18_gauge_92_1_mm_steel_stud_support_not_owned_in_local_grouped_topology",
        "local_face_leaves_contain_mlv_or_gypsum_plaster_outside_nrc_source_family"
      ])
    );
    expect(evaluation.leafMasses.map((leaf) => `${leaf.id}:${leaf.surfaceMassKgM2}`)).toEqual([
      "side_a_leaf:28.8",
      "internal_leaf:10.6",
      "side_b_leaf:31.2"
    ]);
  });

  it("still blocks runtime for a source-like cavity depth until material/product and support-gauge ownership exists", () => {
    const evaluation = evaluateWallTripleLeafLocalMaterialMapping({
      airborneContext: SOURCE_LIKE_TOPOLOGY_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(
      evaluation.topologyDecisions.find((decision) => decision.id === "source_family_cavity_depth_and_fill")
    ).toMatchObject({
      blocker: null,
      status: "owned"
    });
    expect(evaluation.blockers).toEqual(
      expect.arrayContaining([
        "local_generic_gypsum_board_to_nrc_type_c_mapping_not_owned",
        "local_rockwool_to_nrc_glass_fiber_batt_mapping_not_owned",
        "source_18_gauge_92_1_mm_steel_stud_support_not_owned_in_local_grouped_topology"
      ])
    );
    expect(evaluation.runtimeBlockers).toContain("paired_engine_web_visible_runtime_tests_not_written");
    expect(evaluation.runtimeBlockers).toContain("gate_h_engine_integration_fail_closed_not_landed");
  });

  it("preserves negative boundaries and leaves the live split-rockwool result on screening", () => {
    const evaluation = evaluateWallTripleLeafLocalMaterialMapping({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const liveResult = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(evaluation.negativeBoundariesPreserved).toBe(true);
    expect(liveResult.metrics.estimatedRwDb).toBe(41);
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("multileaf_screening_blend");
    expect(liveResult.dynamicAirborneTrace?.confidenceClass).toBe("low");
  });

  it("keeps active docs aligned with Gate G4 and the selected blocked diagnostics/source acquisition gate", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_LOCAL_MATERIAL_MAPPING_GATE_G4.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_LOCAL_MATERIAL_MAPPING_GATE_G4.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate G4 - Local Material Mapping and Runtime Eligibility Decision");
    expect(plan).toContain("Gate G5 - Blocked Diagnostics and Source Acquisition Decision");
    expect(plan).toContain("local `rockwool`, `mlv`, and `gypsum_plaster` remain outside exact NRC-like runtime");
  });
});
