import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  evaluateWallTripleLeafManualSourcePacketHandoff,
  WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_HANDOFF_GATE_T
} from "./wall-triple-leaf-manual-source-packet-handoff";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/CHECKPOINT_2026-05-02_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_T_HANDOFF.md"
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

describe("wall triple-leaf manual source packet acquisition handoff Gate T", () => {
  it("lands manual source-packet handoff no-runtime and selects source-gap revalidation v8", () => {
    expect(WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_HANDOFF_GATE_T).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "calculator_source_gap_revalidation_v8_no_runtime",
      selectedNextFile: "packages/engine/src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });
  });

  it("formalizes the manual acquisition checklist before digitization or runtime", () => {
    const evaluation = evaluateWallTripleLeafManualSourcePacketHandoff({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.acquisitionChecklist.map((item) => item.id)).toEqual([
      "authorized_source_file_or_tdm_payload",
      "rights_and_storage_note",
      "source_identity_metadata",
      "page_figure_table_locator",
      "curve_identity_map",
      "band_vector_or_digitization_payload",
      "rating_derivation_and_uncertainty",
      "chain_of_custody_review"
    ]);
    expect(evaluation.acquisitionChecklist.every((item) => item.owner === "manual_source_packet_acquisition")).toBe(true);
    expect(new Set(evaluation.acquisitionChecklist.map((item) => item.status))).toEqual(
      new Set(["manual_external_dependency_required", "required_before_digitization", "required_before_runtime"])
    );
  });

  it("pauses the Uris 2006 source lane and recommends re-ranking now", () => {
    const evaluation = evaluateWallTripleLeafManualSourcePacketHandoff({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.manualAcquisitionRequired).toBe(true);
    expect(evaluation.sourceLaneDisposition).toBe("paused_waiting_rights_safe_source_packet");
    expect(evaluation.reRankRecommendedNow).toBe(true);
    expect(evaluation.manualPacketHandoffReadyForRuntime).toBe(false);
    expect(evaluation.sourcePacketProvidedNow).toBe(false);
    expect(evaluation.runtimePromotionReadyNow).toBe(false);
    expect(evaluation.digitizationSelectedNow).toBe(false);
  });

  it("preserves Gate S source-packet absence blockers", () => {
    const evaluation = evaluateWallTripleLeafManualSourcePacketHandoff({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const gateS = evaluation.sourcePacketAvailabilityEvaluation;

    expect(gateS.rightsSafePacketAvailableNow).toBe(false);
    expect(gateS.sourcePacketAvailabilityReadyForRuntime).toBe(false);
    expect(gateS.availabilityItems[0]?.status).toBe("absent_expected_packet_path");
    expect(gateS.blockedReasonIds).toEqual(
      expect.arrayContaining([
        "rights_safe_packet_absent",
        "no_source_owned_band_vectors",
        "metadata_only_not_rights_safe_packet"
      ])
    );
  });

  it("blocks metadata-only, copied-source, and partial-packet promotion paths", () => {
    const evaluation = evaluateWallTripleLeafManualSourcePacketHandoff({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const criteria = evaluation.acquisitionChecklist.flatMap((item) => item.acceptanceCriteria);

    expect(criteria).toContain("metadata or public summaries alone do not satisfy this item");
    expect(criteria).toContain("do not embed copied source text or source images into runtime code");
    expect(criteria).toContain(
      "do not reopen runtime until source-packet, mapping, topology, and paired visible tests all pass"
    );
  });

  it("keeps the live split-rockwool answer frozen as low-confidence multileaf screening", () => {
    const evaluation = evaluateWallTripleLeafManualSourcePacketHandoff({
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

  it("keeps active docs aligned with Gate T, source-lane pause, and v8 revalidation", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_HANDOFF_GATE_T.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_HANDOFF_GATE_T.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate T - Manual Source Packet Acquisition Handoff");
    expect(plan).toContain("calculator_source_gap_revalidation_v8_no_runtime");
    expect(plan).toContain("authorized_source_file_or_tdm_payload");
    expect(plan).toContain("paused_waiting_rights_safe_source_packet");
  });
});
