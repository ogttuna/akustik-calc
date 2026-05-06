import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  evaluateWallTripleLeafSourceAccessFollowup,
  WALL_TRIPLE_LEAF_SOURCE_ACCESS_FOLLOWUP_GATE_Q
} from "./wall-triple-leaf-source-access-followup";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_Q_HANDOFF.md"
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

describe("wall triple-leaf source access follow-up Gate Q", () => {
  it("lands source-access backlog and blocker revalidation no-runtime and selects Gate R", () => {
    expect(WALL_TRIPLE_LEAF_SOURCE_ACCESS_FOLLOWUP_GATE_Q).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_r_manual_source_packet_intake_contract_no_runtime",
      selectedNextFile: "packages/engine/src/wall-triple-leaf-manual-source-packet-gate-r.test.ts",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });
  });

  it("turns Gate P source access results into an ordered manual backlog", () => {
    const evaluation = evaluateWallTripleLeafSourceAccessFollowup({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.manualSourcePacketRequired).toBe(true);
    expect(evaluation.sourceBacklogReadyForRuntime).toBe(false);
    expect(evaluation.firstBacklogItem).toMatchObject({
      closesRuntimeGapNow: false,
      id: "uris_2006_authorized_curve_packet",
      kind: "source_access_packet",
      priority: 1,
      status: "manual_source_packet_required",
      target: "uris_2006_internal_gypsum_50mm_mineral_wool_double_frame"
    });
    expect(evaluation.accessBacklog.map((item) => `${item.priority}:${item.id}:${item.status}`)).toEqual([
      "1:uris_2006_authorized_curve_packet:manual_source_packet_required",
      "2:uris_2006_digitization_qc_packet:blocked_waiting_source_packet",
      "3:local_material_and_effect_mapping_packet:blocked_waiting_source_packet",
      "4:support_topology_mapping_packet:blocked_waiting_source_packet",
      "5:paired_visible_runtime_acceptance_packet:blocked_waiting_source_packet",
      "6:uris_2008_perforated_facing_separate_lane:negative_boundary_keep_out_of_runtime"
    ]);
  });

  it("requires source packet artifacts before any digitization or runtime mapping can proceed", () => {
    const evaluation = evaluateWallTripleLeafSourceAccessFollowup({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const sourcePacket = evaluation.accessBacklog.find((item) => item.id === "uris_2006_authorized_curve_packet");
    const digitizationPacket = evaluation.accessBacklog.find((item) => item.id === "uris_2006_digitization_qc_packet");

    expect(sourcePacket?.requiredArtifacts).toEqual(
      expect.arrayContaining([
        "rights-safe Uris 2006 source PDF, page image, or authorized TDM output",
        "page/figure/table locator for every curve used by the local two-cavity lane",
        "source-owned one-third-octave TL vectors or enough plot evidence for reproducible digitization",
        "reported or derived Rw/STC value and uncertainty owner from the same source packet"
      ])
    );
    expect(digitizationPacket?.requiredArtifacts).toEqual(
      expect.arrayContaining([
        "plot-axis lock or numeric table parser for Uris 2006",
        "band-grid mapping to the calculator one-third-octave bands",
        "Rw/STC re-derivation check against source-reported weighted values"
      ])
    );
  });

  it("revalidates every Gate P runtime blocker as still open and maps each one to backlog ownership", () => {
    const evaluation = evaluateWallTripleLeafSourceAccessFollowup({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.closedRuntimeBlockerCount).toBe(0);
    expect(evaluation.openRuntimeBlockerCount).toBe(7);
    expect(evaluation.runtimeBlockerRevalidations.map((blocker) => blocker.blockerId)).toEqual([
      "missing_source_owned_numeric_curves_or_table",
      "missing_uris_2006_authorized_pdf_or_page_image",
      "accessible_alternative_has_perforated_facing_topology",
      "alternative_rows_are_context_or_glazing_only",
      "near_source_promotion_rejected",
      "missing_local_material_support_mapping",
      "missing_paired_visible_runtime_tests"
    ]);
    expect(
      evaluation.runtimeBlockerRevalidations.every(
        (blocker) => blocker.revalidationStatus === "still_open_no_runtime" && !blocker.runtimePromotionAllowed
      )
    ).toBe(true);
    expect(
      evaluation.runtimeBlockerRevalidations.find(
        (blocker) => blocker.blockerId === "missing_local_material_support_mapping"
      )?.mappedBacklogItemIds
    ).toEqual(["local_material_and_effect_mapping_packet", "support_topology_mapping_packet"]);
  });

  it("keeps Uris 2008 and NRC 2024 as non-runtime boundaries while preserving Gate P evidence context", () => {
    const evaluation = evaluateWallTripleLeafSourceAccessFollowup({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const separateLane = evaluation.accessBacklog.find(
      (item) => item.id === "uris_2008_perforated_facing_separate_lane"
    );

    expect(separateLane).toMatchObject({
      closesRuntimeGapNow: false,
      kind: "separate_negative_boundary_lane",
      status: "negative_boundary_keep_out_of_runtime",
      target: "uris_2008_perforated_absorptive_facing_accessible_adjacent"
    });
    expect(evaluation.sourceAccessEvaluation.accessibleAdjacentAlternativeCount).toBe(1);
    expect(
      evaluation.sourceAccessEvaluation.alternativeMeasuredRows.find(
        (candidate) => candidate.id === "nrc_2024_internal_board_glass_fiber_comparator_only"
      )?.sourceUse
    ).toBe("existing_comparator_not_alternative_runtime_row");
  });

  it("keeps the live split-rockwool answer frozen as low-confidence multileaf screening", () => {
    const evaluation = evaluateWallTripleLeafSourceAccessFollowup({
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

  it("keeps active docs aligned with Gate Q, Gate R, and the manual source packet backlog", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_ACCESS_FOLLOWUP_GATE_Q.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_ACCESS_FOLLOWUP_GATE_Q.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate Q - Source Access Backlog and Runtime Blocker Revalidation");
    expect(plan).toContain("Gate R - Manual Source Packet Intake Contract");
    expect(plan).toContain("uris_2006_authorized_curve_packet");
    expect(plan).toContain("local_material_and_effect_mapping_packet");
  });
});
