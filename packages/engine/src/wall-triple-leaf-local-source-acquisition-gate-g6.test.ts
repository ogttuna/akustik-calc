import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  evaluateWallTripleLeafLocalSourceAcquisition,
  WALL_TRIPLE_LEAF_LOCAL_SOURCE_ACQUISITION_GATE_G6
} from "./wall-triple-leaf-local-source-acquisition";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G6_HANDOFF.md"
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

describe("wall triple-leaf local source acquisition Gate G6", () => {
  it("lands source/effect-model requirements no-runtime and selects local source-pack acquisition Gate G7", () => {
    expect(WALL_TRIPLE_LEAF_LOCAL_SOURCE_ACQUISITION_GATE_G6).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_g7_local_source_pack_acquisition_intake",
      selectedNextFile: "packages/engine/src/wall-triple-leaf-local-source-pack-acquisition-gate-g7.test.ts",
      workbenchInputBehaviorChange: false
    });
  });

  it("keeps every local blocker as a pre-runtime requirement with explicit evidence class", () => {
    const evaluation = evaluateWallTripleLeafLocalSourceAcquisition({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.requirements.map((requirement) => `${requirement.priority}:${requirement.id}:${requirement.status}`)).toEqual([
      "1:local_type_c_board_product_mapping:blocked_needs_local_product_mapping",
      "2:rockwool_absorber_equivalence_or_measured_row:blocked_needs_measured_or_digitized_source_row",
      "3:local_50mm_rockwool_cavity_source_row:blocked_needs_measured_or_digitized_source_row",
      "4:mlv_limp_mass_triple_leaf_effect_model:blocked_needs_bounded_effect_model",
      "5:gypsum_plaster_face_finish_effect_model:blocked_needs_bounded_effect_model",
      "6:support_gauge_depth_and_spacing_mapping:blocked_needs_exact_input_mapping"
    ]);
    expect(evaluation.requirements.every((requirement) => requirement.blocksRuntime)).toBe(true);
    expect(evaluation.requirements.every((requirement) => requirement.selectedForGateG7)).toBe(true);
    expect(evaluation.sourceAcquisitionPackReady).toBe(false);
  });

  it("requires direct measured or digitized rows for rockwool absorber and local 50 mm cavity substitution", () => {
    const evaluation = evaluateWallTripleLeafLocalSourceAcquisition({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const directRowRequirements = evaluation.requirements.filter(
      (requirement) => requirement.evidenceClass === "direct_measured_row"
    );

    expect(evaluation.minimumNewSourceRowsRequired).toBe(2);
    expect(directRowRequirements.map((requirement) => requirement.id)).toEqual([
      "rockwool_absorber_equivalence_or_measured_row",
      "local_50mm_rockwool_cavity_source_row"
    ]);
    expect(directRowRequirements[0]?.acceptanceCriteria.join(" ")).toContain("flow-resistivity");
    expect(directRowRequirements[1]?.acceptanceCriteria.join(" ")).toContain("one-third-octave curve");
  });

  it("keeps MLV and gypsum plaster as bounded-effect-model blockers rather than source-family shortcuts", () => {
    const evaluation = evaluateWallTripleLeafLocalSourceAcquisition({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const effectModelRequirements = evaluation.requirements.filter(
      (requirement) => requirement.evidenceClass === "bounded_effect_model"
    );

    expect(effectModelRequirements.map((requirement) => requirement.id)).toEqual([
      "mlv_limp_mass_triple_leaf_effect_model",
      "gypsum_plaster_face_finish_effect_model"
    ]);
    expect(effectModelRequirements[0]?.acceptanceCriteria.join(" ")).toContain("one-third-octave tolerance");
    expect(effectModelRequirements[1]?.acceptanceCriteria.join(" ")).toContain("plaster mass and damping");
    expect(evaluation.runtimeImportReadyNow).toBe(false);
    expect(evaluation.runtimeImportSelectedNow).toBe(false);
  });

  it("preserves the live split-rockwool result while the source acquisition pack is incomplete", () => {
    const evaluation = evaluateWallTripleLeafLocalSourceAcquisition({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const liveResult = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(evaluation.sourceAcquisitionPackReady).toBe(false);
    expect(liveResult.metrics.estimatedRwDb).toBe(50);
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("triple_leaf_two_cavity_frequency_solver_family_physics_prediction");
    expect(liveResult.dynamicAirborneTrace?.confidenceClass).toBe("medium");
  });

  it("keeps active docs aligned with Gate G6 and the selected Gate G7 source-pack acquisition intake", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_LOCAL_SOURCE_ACQUISITION_GATE_G6.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_LOCAL_SOURCE_ACQUISITION_GATE_G6.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate G6 - Local Source Acquisition and Effect Model Requirements");
    expect(plan).toContain("Gate G7 - Local Source-Pack Acquisition Intake");
    expect(plan).toContain("Gate G6 keeps every requirement blocked before runtime");
  });
});
