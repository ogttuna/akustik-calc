import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  evaluateWallTripleLeafSourceEvidenceAcquisition,
  WALL_TRIPLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_GATE_M
} from "./wall-triple-leaf-source-evidence-acquisition";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_M_HANDOFF.md"
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

describe("wall triple-leaf source evidence acquisition Gate M", () => {
  it("lands source-evidence acquisition no-runtime and selects Gate N source locator intake", () => {
    expect(WALL_TRIPLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_GATE_M).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_n_rockwool_two_cavity_source_locator_intake_no_runtime",
      selectedNextFile: "packages/engine/src/wall-triple-leaf-source-locator-intake-gate-n.test.ts",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });
  });

  it("selects the rockwool two-cavity band-curve pack as the first evidence path", () => {
    const evaluation = evaluateWallTripleLeafSourceEvidenceAcquisition({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.selectedFirstTrack).toMatchObject({
      acquisitionMode: "source_locator_intake",
      acquisitionStatus: "selected_first_no_runtime",
      closesRuntimeGapNow: false,
      gapIds: ["rockwool_absorber_equivalence_or_measured_row", "local_50mm_rockwool_cavity_source_row"],
      id: "rockwool_two_cavity_band_curve_source_pack",
      priority: 1,
      runtimeBlocked: true,
      selectedForGateN: true
    });
    expect(evaluation.selectedFirstTrack.neededEvidence).toEqual(
      expect.arrayContaining([
        "measured or reproducibly graph-digitized one-third-octave TL curve for a triple-leaf two-cavity wall with rockwool/mineral-wool fill",
        "50 mm-class cavity depth, two-cavity topology, and full-fill placement/coverage",
        "flow-resistivity/density equivalence when a direct rockwool row is unavailable"
      ])
    );
    expect(evaluation.selectedFirstTrack.acceptanceCriteria).toEqual(
      expect.arrayContaining([
        "the same source row or accepted equivalence pack addresses rockwool absorber behavior and 50 mm two-cavity behavior",
        "runtime remains frozen until later mapping/tolerance and paired visible runtime tests pass"
      ])
    );
  });

  it("keeps Type C board, support topology, MLV, and plaster as follow-on blockers", () => {
    const evaluation = evaluateWallTripleLeafSourceEvidenceAcquisition({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.acquisitionTracks.map((track) => `${track.id}:${track.acquisitionMode}:${track.selectedForGateN}`)).toEqual([
      "rockwool_two_cavity_band_curve_source_pack:source_locator_intake:true",
      "local_type_c_board_product_mapping_pack:local_product_mapping_intake:false",
      "support_topology_input_owner_pack:topology_input_owner:false",
      "mlv_limp_mass_effect_model_pack:effect_model_research:false",
      "gypsum_plaster_face_finish_delta_pack:effect_model_research:false"
    ]);
    expect(evaluation.followOnTrackCount).toBe(4);
    expect(evaluation.acquisitionTracks.every((track) => track.runtimeBlocked && !track.closesRuntimeGapNow)).toBe(true);
  });

  it("carries Gate L open source gaps forward without claiming runtime evidence readiness", () => {
    const evaluation = evaluateWallTripleLeafSourceEvidenceAcquisition({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.openGapCount).toBe(6);
    expect(evaluation.sourceGapsClosed).toBe(false);
    expect(evaluation.sourceEvidencePackReady).toBe(false);
    expect(evaluation.evidenceAcquisitionReadyForRuntime).toBe(false);
    expect(evaluation.runtimePromotionReadyNow).toBe(false);
    expect(evaluation.sourceGapClosureEvaluation.sourceGapVerdicts.map((verdict) => verdict.closureStatus)).toEqual([
      "open_missing_local_product_mapping",
      "open_missing_direct_row_or_equivalence",
      "open_adjacent_reference_only",
      "open_missing_bounded_effect_model",
      "open_missing_bounded_effect_model",
      "open_missing_topology_input_owner"
    ]);
  });

  it("keeps the live split-rockwool answer frozen as low-confidence multileaf screening", () => {
    const evaluation = evaluateWallTripleLeafSourceEvidenceAcquisition({
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
    expect(liveResult.metrics.estimatedRwDb).toBe(53);
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor");
    expect(liveResult.dynamicAirborneTrace?.confidenceClass).toBe("medium");
  });

  it("keeps active docs aligned with Gate M, Gate N, and the selected rockwool evidence path", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_GATE_M.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_GATE_M.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate M - Source Evidence Acquisition");
    expect(plan).toContain("Gate N - Rockwool Two-Cavity Source Locator Intake");
    expect(plan).toContain("rockwool_two_cavity_band_curve_source_pack");
    expect(plan).toContain("gate_n_rockwool_two_cavity_source_locator_intake_no_runtime");
  });

  it("keeps the adjacent route/source risk register explicit before Gate N runtime movement", () => {
    const riskRegister = readFileSync(
      join(REPO_ROOT, "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"),
      "utf8"
    );

    expect(riskRegister).toContain("Flat-list route-family flip");
    expect(riskRegister).toContain("Duplicate / many-layer stack drift");
    expect(riskRegister).toContain("Masonry / lined-massive boundary drift");
    expect(riskRegister).toContain("Raw floor role inference");
    expect(riskRegister).toContain("Near-source false promotion");
    expect(riskRegister).toContain("Field-output leakage");
    expect(riskRegister).toContain("Material alias / coalescing");
    expect(riskRegister).toContain("Hostile API input");
    expect(riskRegister).toContain("Curve digitization / provenance");
    expect(riskRegister).toMatch(/The `Rw 41` screening answer must not be described\s+as fixed/);
  });
});
