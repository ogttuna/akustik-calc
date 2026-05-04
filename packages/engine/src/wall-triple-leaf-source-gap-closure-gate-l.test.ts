import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  evaluateWallTripleLeafSourceGapClosure,
  WALL_TRIPLE_LEAF_SOURCE_GAP_CLOSURE_GATE_L
} from "./wall-triple-leaf-source-gap-closure";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_L_HANDOFF.md"
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

describe("wall triple-leaf source-gap closure Gate L", () => {
  it("lands source-gap closure no-runtime and selects Gate M source evidence acquisition", () => {
    expect(WALL_TRIPLE_LEAF_SOURCE_GAP_CLOSURE_GATE_L).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_m_source_evidence_acquisition_no_runtime",
      selectedNextFile: "packages/engine/src/wall-triple-leaf-source-evidence-acquisition-gate-m.test.ts",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });
  });

  it("keeps all six Gate K source-gap closure tracks open with explicit statuses", () => {
    const evaluation = evaluateWallTripleLeafSourceGapClosure({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.closedGapCount).toBe(0);
    expect(evaluation.openGapCount).toBe(6);
    expect(evaluation.sourceGapVerdicts.map((verdict) => `${verdict.requirementId}:${verdict.closureStatus}`)).toEqual([
      "local_type_c_board_product_mapping:open_missing_local_product_mapping",
      "rockwool_absorber_equivalence_or_measured_row:open_missing_direct_row_or_equivalence",
      "local_50mm_rockwool_cavity_source_row:open_adjacent_reference_only",
      "mlv_limp_mass_triple_leaf_effect_model:open_missing_bounded_effect_model",
      "gypsum_plaster_face_finish_effect_model:open_missing_bounded_effect_model",
      "support_gauge_depth_and_spacing_mapping:open_missing_topology_input_owner"
    ]);
    expect(evaluation.sourceGapVerdicts.every((verdict) => !verdict.canCloseNow)).toBe(true);
    expect(evaluation.sourceGapVerdicts.every((verdict) => verdict.runtimeBlocked && verdict.selectedForGateM)).toBe(true);
  });

  it("refuses to close adjacent NRC references as local runtime evidence", () => {
    const evaluation = evaluateWallTripleLeafSourceGapClosure({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const byRequirement = new Map(evaluation.sourceGapVerdicts.map((verdict) => [verdict.requirementId, verdict]));

    expect(byRequirement.get("local_type_c_board_product_mapping")).toMatchObject({
      availableEvidence: expect.arrayContaining(["NRC 2024 Type C board mass/thickness reference exists"]),
      missingEvidence: expect.arrayContaining(["specific local gypsum board product identity"])
    });
    expect(byRequirement.get("rockwool_absorber_equivalence_or_measured_row")).toMatchObject({
      availableEvidence: expect.arrayContaining(["NRC 2024 source family owns glass-fiber batt absorber behavior"]),
      missingEvidence: expect.arrayContaining([
        "direct rockwool/mineral-wool triple-leaf measured or digitized band curve",
        "flow-resistivity/density equivalence accepted against one-third-octave tolerance"
      ])
    });
    expect(byRequirement.get("local_50mm_rockwool_cavity_source_row")).toMatchObject({
      availableEvidence: expect.arrayContaining(["NRC 2024 source family owns 92.1 mm-class glass-fiber cavities"]),
      missingEvidence: expect.arrayContaining([
        "measured or reproducibly digitized 50 mm two-cavity rockwool triple-leaf TL curve"
      ])
    });
  });

  it("keeps effect-model and support-input gaps blocked before runtime", () => {
    const evaluation = evaluateWallTripleLeafSourceGapClosure({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const byRequirement = new Map(evaluation.sourceGapVerdicts.map((verdict) => [verdict.requirementId, verdict]));

    expect(byRequirement.get("mlv_limp_mass_triple_leaf_effect_model")).toMatchObject({
      closureStatus: "open_missing_bounded_effect_model",
      missingEvidence: expect.arrayContaining(["bounded limp-mass one-third-octave delta model"])
    });
    expect(byRequirement.get("gypsum_plaster_face_finish_effect_model")).toMatchObject({
      closureStatus: "open_missing_bounded_effect_model",
      missingEvidence: expect.arrayContaining([
        "measured triple-leaf source row with gypsum plaster in the same face-finish role"
      ])
    });
    expect(byRequirement.get("support_gauge_depth_and_spacing_mapping")).toMatchObject({
      closureStatus: "open_missing_topology_input_owner",
      missingEvidence: expect.arrayContaining([
        "explicit local support gauge, depth, spacing, and frame-independence inputs"
      ])
    });
  });

  it("carries Gate K runtime-promotion blockers forward instead of closing source gaps", () => {
    const evaluation = evaluateWallTripleLeafSourceGapClosure({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.sourceGapsClosed).toBe(false);
    expect(evaluation.sourceGapClosureReadyForRuntime).toBe(false);
    expect(evaluation.runtimePromotionReadyNow).toBe(false);
    expect(evaluation.runtimePromotionReadinessEvaluation.readinessDecision).toBe(
      "runtime_promotion_blocked_select_source_gap_closure"
    );
    expect(evaluation.runtimePromotionReadinessEvaluation.runtimePromotionBlockers.map((blocker) => blocker.id)).toEqual([
      "local_material_mapping_unowned",
      "usable_local_source_pack_missing",
      "source_gaps_open",
      "runtime_topology_guards_not_ready",
      "paired_runtime_tests_missing"
    ]);
  });

  it("keeps the live split-rockwool answer frozen as low-confidence multileaf screening", () => {
    const evaluation = evaluateWallTripleLeafSourceGapClosure({
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

  it("keeps active docs aligned with Gate L, Gate M, and the no-runtime closure decision", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_GAP_CLOSURE_GATE_L.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_GAP_CLOSURE_GATE_L.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate L - Source-Gap Closure");
    expect(plan).toContain("Gate M - Source Evidence Acquisition");
    expect(plan).toContain("open_missing_direct_row_or_equivalence");
    expect(plan).toContain("source gaps remain open");
  });
});
