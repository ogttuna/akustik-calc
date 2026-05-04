import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  evaluateWallTripleLeafSourceAccess,
  WALL_TRIPLE_LEAF_SOURCE_ACCESS_GATE_P
} from "./wall-triple-leaf-source-access";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_P_HANDOFF.md"
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

describe("wall triple-leaf source access Gate P", () => {
  it("lands source access or alternative measured-row acquisition no-runtime and selects Gate Q", () => {
    expect(WALL_TRIPLE_LEAF_SOURCE_ACCESS_GATE_P).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_q_source_access_backlog_and_runtime_blocker_revalidation_no_runtime",
      selectedNextFile: "packages/engine/src/wall-triple-leaf-source-access-followup-gate-q.test.ts",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });
  });

  it("keeps Uris 2006 as the primary access target but blocks every current access path from runtime", () => {
    const evaluation = evaluateWallTripleLeafSourceAccess({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.primaryLocatorAccessStillBlocked).toBe(true);
    expect(evaluation.sourceOwnedNumericCurvePackCount).toBe(0);
    expect(evaluation.accessPaths.map((path) => `${path.id}:${path.acquisitionStatus}`)).toEqual([
      "authorized_elsevier_full_text_or_tdm:blocked_requires_authorized_access",
      "manual_author_or_library_source_packet:blocked_requires_local_source_packet",
      "local_pdf_or_page_image_upload:blocked_requires_local_source_packet",
      "public_summary_and_metadata_recheck:blocked_metadata_or_summary_only"
    ]);
    expect(
      evaluation.accessPaths.every(
        (path) =>
          !path.fullOneThirdOctaveCurvesAvailableNow &&
          !path.pageImageOrPlotBoxAvailableNow &&
          !path.runtimeImportReadyNow
      )
    ).toBe(true);
    expect(evaluation.provenanceEvaluation.primaryLocator.id).toBe(
      "uris_2006_internal_gypsum_50mm_mineral_wool_double_frame"
    );
  });

  it("classifies Uris 2008 as accessible measured context but rejects it as a runtime-equivalent row", () => {
    const evaluation = evaluateWallTripleLeafSourceAccess({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const uris2008 = evaluation.alternativeMeasuredRows.find(
      (candidate) => candidate.id === "uris_2008_perforated_absorptive_facing_accessible_adjacent"
    );

    expect(evaluation.accessibleAdjacentAlternativeCount).toBe(1);
    expect(uris2008).toMatchObject({
      accessiblePublicPageOrPdfNow: true,
      candidateRuntimeReadyNow: false,
      has50MmClassMineralWoolCavity: true,
      hasInternalBoardLeafContext: true,
      hasPerforatedFacingOrNonLocalTopology: true,
      hasSourceOwnedNumericBandVectorsNow: false,
      sourceUse: "accessible_adjacent_negative_boundary"
    });
    expect(uris2008?.missingForRuntime).toEqual(
      expect.arrayContaining([
        "perforated gypsum board / absorptive-facing topology is not the local internal gypsum-board defect topology",
        "perforation ratio and Helmholtz-facing behavior need a separate lane before reuse"
      ])
    );
  });

  it("keeps method papers, glazing papers, and the NRC comparator out of runtime promotion", () => {
    const evaluation = evaluateWallTripleLeafSourceAccess({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.alternativeMeasuredRows.map((candidate) => `${candidate.id}:${candidate.sourceUse}`)).toEqual([
      "uris_2008_perforated_absorptive_facing_accessible_adjacent:accessible_adjacent_negative_boundary",
      "utley_1968_double_and_triple_walls_context:method_or_physics_context_only",
      "brekke_1981_calculation_methods_context:method_or_physics_context_only",
      "vinokur_1990_low_frequency_triple_partitions_context:method_or_physics_context_only",
      "quirt_1983_triple_glazing_rejected:glazing_rejected",
      "tadeu_2001_triple_glazing_rejected:glazing_rejected",
      "nrc_2024_internal_board_glass_fiber_comparator_only:existing_comparator_not_alternative_runtime_row"
    ]);
    expect(evaluation.noRuntimeAlternativeCandidateCount).toBe(7);
    expect(evaluation.alternativeMeasuredRows.every((candidate) => !candidate.candidateRuntimeReadyNow)).toBe(true);
  });

  it("keeps runtime blocked on source-owned curves, Uris 2006 page images, mapping, and paired visible tests", () => {
    const evaluation = evaluateWallTripleLeafSourceAccess({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.sourceAccessReadyForRuntime).toBe(false);
    expect(evaluation.sourceAccessBacklogReadyForManualWork).toBe(true);
    expect(evaluation.runtimePromotionReadyNow).toBe(false);
    expect(evaluation.missingForRuntime.map((blocker) => blocker.id)).toEqual([
      "missing_source_owned_numeric_curves_or_table",
      "missing_uris_2006_authorized_pdf_or_page_image",
      "accessible_alternative_has_perforated_facing_topology",
      "alternative_rows_are_context_or_glazing_only",
      "near_source_promotion_rejected",
      "missing_local_material_support_mapping",
      "missing_paired_visible_runtime_tests"
    ]);
  });

  it("keeps the live split-rockwool answer frozen as low-confidence multileaf screening", () => {
    const evaluation = evaluateWallTripleLeafSourceAccess({
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

  it("keeps active docs aligned with Gate P, Gate Q, and the no-runtime source-access decision", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_ACCESS_GATE_P.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_ACCESS_GATE_P.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate P - Source Access or Alternative Measured Row Acquisition");
    expect(plan).toContain("Gate Q - Source Access Backlog and Runtime Blocker Revalidation");
    expect(plan).toContain("uris_2008_perforated_absorptive_facing_accessible_adjacent");
    expect(plan).toContain("accessible_alternative_has_perforated_facing_topology");
  });
});
