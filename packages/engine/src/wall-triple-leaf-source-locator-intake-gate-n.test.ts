import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  evaluateWallTripleLeafSourceLocatorIntake,
  WALL_TRIPLE_LEAF_SOURCE_LOCATOR_INTAKE_GATE_N
} from "./wall-triple-leaf-source-locator-intake";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_N_HANDOFF.md"
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

describe("wall triple-leaf source locator intake Gate N", () => {
  it("lands rockwool two-cavity source locator intake no-runtime and selects Gate O provenance QC", () => {
    expect(WALL_TRIPLE_LEAF_SOURCE_LOCATOR_INTAKE_GATE_N).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_o_full_curve_retrieval_and_provenance_qc_no_runtime",
      selectedNextFile: "packages/engine/src/wall-triple-leaf-source-locator-provenance-gate-o.test.ts",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });
  });

  it("selects Uris 2006 as the primary direct measured locator but keeps it blocked without full curves", () => {
    const evaluation = evaluateWallTripleLeafSourceLocatorIntake({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.selectedPrimaryLocator).toMatchObject({
      classification: "direct_measured_row_locator_full_curve_needed",
      coversGateMGapIds: ["rockwool_absorber_equivalence_or_measured_row", "local_50mm_rockwool_cavity_source_row"],
      evidenceUse: "selected_primary_for_gate_o_full_curve_retrieval",
      has50MmClassMineralWoolCavity: true,
      hasAccessibleFullBandCurveNow: false,
      hasInternalLeaf: true,
      hasMeasuredSoundReductionData: true,
      hasRockwoolOrMineralWool: true,
      id: "uris_2006_internal_gypsum_50mm_mineral_wool_double_frame",
      runtimeImportReadyNow: false
    });
    expect(evaluation.selectedPrimaryLocator.topologyContext).toEqual(
      expect.arrayContaining([
        "each frame fitted with 50 mm mineral wool",
        "frames separated by a 100 mm air gap",
        "internal gypsum board layer creates a triple-leaf partition"
      ])
    );
    expect(evaluation.selectedPrimaryLocator.missingForRuntime).toEqual(
      expect.arrayContaining([
        "full one-third-octave sound-reduction curves for the tested double-frame and internal-board specimens",
        "Rw/STC derivation and uncertainty owner from the same band data"
      ])
    );
  });

  it("keeps NRC 2024 as a comparator because its graph curves are owned but its material/cavity mapping is adjacent", () => {
    const evaluation = evaluateWallTripleLeafSourceLocatorIntake({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const comparator = evaluation.selectedComparatorLocators[0];

    expect(comparator).toMatchObject({
      classification: "reproducible_graph_digitized_adjacent_source_family",
      evidenceUse: "comparator_for_negative_boundary",
      has50MmClassMineralWoolCavity: false,
      hasAccessibleFullBandCurveNow: true,
      hasInternalLeaf: true,
      hasRockwoolOrMineralWool: false,
      id: "nrc_2024_internal_board_glass_fiber_92mm_source_family",
      runtimeImportReadyNow: false
    });
    expect(comparator?.missingForRuntime).toEqual(
      expect.arrayContaining([
        "local rockwool/mineral-wool equivalence against the NRC glass-fiber batt absorber",
        "50 mm cavity substitution tolerance against the NRC 92.1 mm cavity source family"
      ])
    );
  });

  it("keeps rockwool density and stone/glass wool double-leaf sources as equivalence context only", () => {
    const evaluation = evaluateWallTripleLeafSourceLocatorIntake({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(
      evaluation.selectedEquivalenceContextLocators.map((locator) => `${locator.id}:${locator.classification}`)
    ).toEqual([
      "uris_1999_rockwool_bulk_density_double_wall:flow_resistivity_density_equivalence_pack_context_only",
      "wang_2022_lightweight_double_leaf_stone_wool_glass_wool:adjacent_context_only"
    ]);
    expect(
      evaluation.selectedEquivalenceContextLocators.every(
        (locator) => !locator.hasInternalLeaf && !locator.runtimeImportReadyNow
      )
    ).toBe(true);
  });

  it("rejects parser-ready NRC 1998 numeric rows from this rockwool two-cavity lane", () => {
    const evaluation = evaluateWallTripleLeafSourceLocatorIntake({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const rejected = evaluation.candidateLocators.find(
      (locator) => locator.id === "nrc_1998_gypsum_board_walls_baseline_numeric_rows"
    );

    expect(rejected).toMatchObject({
      classification: "rejected_context",
      evidenceUse: "rejected_for_gate_o",
      hasAccessibleFullBandCurveNow: true,
      hasInternalLeaf: false,
      runtimeImportReadyNow: false
    });
    expect(rejected?.coversGateMGapIds).toEqual([]);
  });

  it("keeps the live split-rockwool answer frozen as low-confidence multileaf screening", () => {
    const evaluation = evaluateWallTripleLeafSourceLocatorIntake({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const liveResult = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(evaluation.fullCurveReadyForLocalRuntimeCount).toBe(0);
    expect(evaluation.sourceLocatorPackReadyForRuntime).toBe(false);
    expect(evaluation.runtimePromotionReadyNow).toBe(false);
    expect(evaluation.failClosedStrategy).toBe("multileaf_screening_blend");
    expect(evaluation.numericRuntimeBehaviorChange).toBe(false);
    expect(liveResult.metrics.estimatedRwDb).toBe(53);
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor");
    expect(liveResult.dynamicAirborneTrace?.confidenceClass).toBe("medium");
  });

  it("keeps active docs aligned with Gate N, Gate O, and the no-runtime source locator decision", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_LOCATOR_INTAKE_GATE_N.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_LOCATOR_INTAKE_GATE_N.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate N - Rockwool Two-Cavity Source Locator Intake");
    expect(plan).toContain("Gate O - Full Curve Retrieval and Provenance QC");
    expect(plan).toContain("uris_2006_internal_gypsum_50mm_mineral_wool_double_frame");
    expect(plan).toContain("gate_o_full_curve_retrieval_and_provenance_qc_no_runtime");
  });
});
