import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  evaluateWallTripleLeafSourcePacketAvailability,
  WALL_TRIPLE_LEAF_SOURCE_PACKET_AVAILABILITY_GATE_S
} from "./wall-triple-leaf-source-packet-availability";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/CHECKPOINT_2026-05-02_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_S_HANDOFF.md"
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

describe("wall triple-leaf source packet availability Gate S", () => {
  it("lands source packet availability no-runtime and selects Gate T manual acquisition handoff", () => {
    expect(WALL_TRIPLE_LEAF_SOURCE_PACKET_AVAILABILITY_GATE_S).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_t_manual_source_packet_acquisition_handoff_no_runtime",
      selectedNextFile: "packages/engine/src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });
  });

  it("confirms no rights-safe Uris 2006 source packet is currently available", () => {
    const evaluation = evaluateWallTripleLeafSourcePacketAvailability({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.rightsSafePacketAvailableNow).toBe(false);
    expect(evaluation.sourcePacketProvidedNow).toBe(false);
    expect(evaluation.sourcePacketAvailabilityReadyForDigitization).toBe(false);
    expect(evaluation.sourcePacketAvailabilityReadyForRuntime).toBe(false);
    expect(evaluation.sourceOwnedBandVectorAvailableNow).toBe(false);
    expect(evaluation.missingArtifactIds).toEqual([
      "rights_safe_source_file",
      "source_locator_metadata",
      "page_figure_table_locator",
      "curve_identity_map",
      "band_vector_or_digitization_payload",
      "rating_derivation_and_uncertainty",
      "chain_of_custody_and_rights_note"
    ]);
  });

  it("separates local corpus hits from a runtime-usable Uris 2006 packet", () => {
    const evaluation = evaluateWallTripleLeafSourcePacketAvailability({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.sourcePacketCandidateCount).toBe(5);
    expect(evaluation.availabilityItems.map((item) => `${item.id}:${item.status}`)).toEqual([
      "expected_uris_2006_manual_packet_path:absent_expected_packet_path",
      "docs_and_engine_typed_uris_2006_metadata:metadata_only_not_packet_artifact",
      "tmp_nrc_2024_graph_digitization_packet:adjacent_source_packet_not_primary_locator",
      "root_user_repro_pdf_artifacts:user_repro_pdfs_not_source_evidence",
      "root_miscellaneous_pdf_artifacts:unrelated_pdf_artifacts_not_source_packet"
    ]);
    expect(evaluation.availabilityItems.every((item) => !item.runtimeUsable)).toBe(true);
    expect(evaluation.availabilityItems.every((item) => item.packetArtifactIdsSatisfied.length === 0)).toBe(true);
  });

  it("keeps metadata, NRC graph data, user repro PDFs, and unrelated PDFs out of packet promotion", () => {
    const evaluation = evaluateWallTripleLeafSourcePacketAvailability({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.blockedReasonIds).toEqual([
      "rights_safe_packet_absent",
      "no_uris_2006_page_image_or_pdf",
      "no_source_owned_band_vectors",
      "metadata_only_not_rights_safe_packet",
      "adjacent_nrc_packet_not_primary_uris_2006_packet",
      "local_user_repro_pdfs_not_source_evidence",
      "unrelated_local_pdfs_not_source_packet"
    ]);
    expect(
      evaluation.availabilityItems.find((item) => item.id === "docs_and_engine_typed_uris_2006_metadata")?.rationale
    ).toContain("metadata alone is not a rights-safe source packet");
    expect(
      evaluation.availabilityItems.find((item) => item.id === "tmp_nrc_2024_graph_digitization_packet")?.rationale
    ).toContain("not the primary Uris 2006 50 mm mineral-wool internal-board packet");
  });

  it("preserves Gate R manual packet validation and Gate Q backlog blockers", () => {
    const evaluation = evaluateWallTripleLeafSourcePacketAvailability({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const gateR = evaluation.manualSourcePacketEvaluation;
    const gateQ = gateR.sourceAccessFollowupEvaluation;

    expect(gateR.packetValidation.status).toBe("blocked_no_source_packet");
    expect(gateR.missingArtifactCount).toBe(7);
    expect(gateQ.firstBacklogItem.id).toBe("uris_2006_authorized_curve_packet");
    expect(gateQ.openRuntimeBlockerCount).toBe(7);
    expect(gateQ.closedRuntimeBlockerCount).toBe(0);
  });

  it("keeps the live split-rockwool answer frozen as low-confidence multileaf screening", () => {
    const evaluation = evaluateWallTripleLeafSourcePacketAvailability({
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

  it("keeps active docs aligned with Gate S, Gate T, and source-packet absence blockers", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_PACKET_AVAILABILITY_GATE_S.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_PACKET_AVAILABILITY_GATE_S.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate S - Source Packet Availability Check");
    expect(plan).toContain("Gate T - Manual Source Packet Acquisition Handoff");
    expect(plan).toContain("rights_safe_packet_absent");
    expect(plan).toContain("tmp_nrc_2024_graph_digitization_packet");
  });
});
