import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  evaluateWallTripleLeafManualSourcePacket,
  WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_GATE_R
} from "./wall-triple-leaf-manual-source-packet";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/CHECKPOINT_2026-05-02_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_R_HANDOFF.md"
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

describe("wall triple-leaf manual source packet Gate R", () => {
  it("lands manual source packet intake no-runtime and selects Gate S", () => {
    expect(WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_GATE_R).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_s_source_packet_availability_check_no_runtime",
      selectedNextFile: "packages/engine/src/wall-triple-leaf-source-packet-availability-gate-s.test.ts",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });
  });

  it("formalizes all required Uris 2006 source packet artifacts before runtime", () => {
    const evaluation = evaluateWallTripleLeafManualSourcePacket({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.artifactRequirements.map((requirement) => requirement.id)).toEqual([
      "rights_safe_source_file",
      "source_locator_metadata",
      "page_figure_table_locator",
      "curve_identity_map",
      "band_vector_or_digitization_payload",
      "rating_derivation_and_uncertainty",
      "chain_of_custody_and_rights_note"
    ]);
    expect(evaluation.artifactRequirements.every((requirement) => requirement.runtimeRequired)).toBe(true);
  });

  it("blocks packet, digitization, and runtime when no manual source packet is present", () => {
    const evaluation = evaluateWallTripleLeafManualSourcePacket({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.sourcePacketProvidedNow).toBe(false);
    expect(evaluation.manualPacketIntakeReadyForRuntime).toBe(false);
    expect(evaluation.digitizationSelectedNow).toBe(false);
    expect(evaluation.runtimePromotionReadyNow).toBe(false);
    expect(evaluation.missingArtifactCount).toBe(7);
    expect(evaluation.packetValidation).toMatchObject({
      id: "uris_2006_manual_source_packet",
      packetProvidedNow: false,
      readyForDigitizationNow: false,
      readyForRuntimeNow: false,
      status: "blocked_no_source_packet",
      targetBacklogItemId: "uris_2006_authorized_curve_packet"
    });
    expect(evaluation.packetValidation.missingArtifactIds).toEqual([
      "rights_safe_source_file",
      "source_locator_metadata",
      "page_figure_table_locator",
      "curve_identity_map",
      "band_vector_or_digitization_payload",
      "rating_derivation_and_uncertainty",
      "chain_of_custody_and_rights_note"
    ]);
  });

  it("preserves Gate Q backlog context and keeps every Gate P blocker open", () => {
    const evaluation = evaluateWallTripleLeafManualSourcePacket({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const followup = evaluation.sourceAccessFollowupEvaluation;

    expect(followup.firstBacklogItem).toMatchObject({
      id: "uris_2006_authorized_curve_packet",
      priority: 1,
      status: "manual_source_packet_required",
      target: "uris_2006_internal_gypsum_50mm_mineral_wool_double_frame"
    });
    expect(followup.closedRuntimeBlockerCount).toBe(0);
    expect(followup.openRuntimeBlockerCount).toBe(7);
    expect(
      followup.runtimeBlockerRevalidations.every(
        (blocker) => blocker.revalidationStatus === "still_open_no_runtime" && !blocker.runtimePromotionAllowed
      )
    ).toBe(true);
  });

  it("requires rights, provenance, curve identity, digitization, and rating ownership before Gate S can move", () => {
    const evaluation = evaluateWallTripleLeafManualSourcePacket({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const byId = new Map(evaluation.artifactRequirements.map((requirement) => [requirement.id, requirement]));

    expect(byId.get("rights_safe_source_file")?.acceptanceCriteria).toEqual(
      expect.arrayContaining([
        "source file is rights-safe to store in the local calculator corpus",
        "source file identity can be traced back to Uris 2006 DOI 10.1016/j.apacoust.2005.11.006"
      ])
    );
    expect(byId.get("page_figure_table_locator")?.acceptanceCriteria).toEqual(
      expect.arrayContaining([
        "page, figure, or table locator identifies every curve used by the local lane",
        "locator distinguishes double-frame controls from internal-board triple-leaf variants"
      ])
    );
    expect(byId.get("curve_identity_map")?.acceptanceCriteria).toEqual(
      expect.arrayContaining([
        "curve identity maps source curves to local side A, cavity 1, internal leaf, cavity 2, and side B roles",
        "curve identity blocks generic near-source promotion when roles do not match"
      ])
    );
    expect(byId.get("band_vector_or_digitization_payload")?.acceptanceCriteria).toEqual(
      expect.arrayContaining([
        "one-third-octave TL vectors are source-owned or reproducibly digitized from a source page image",
        "digitization uncertainty is recorded before the values can enter a runtime candidate"
      ])
    );
    expect(byId.get("rating_derivation_and_uncertainty")?.acceptanceCriteria).toEqual(
      expect.arrayContaining([
        "Rw/STC is reported by the source or re-derived from the same band data",
        "uncertainty owner is available before comparing against Gate G tolerance"
      ])
    );
  });

  it("keeps the live split-rockwool answer frozen as low-confidence multileaf screening", () => {
    const evaluation = evaluateWallTripleLeafManualSourcePacket({
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

  it("keeps active docs aligned with Gate R, Gate S, and the manual packet artifact list", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_GATE_R.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_MANUAL_SOURCE_PACKET_GATE_R.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate R - Manual Source Packet Intake Contract");
    expect(plan).toContain("Gate S - Source Packet Availability Check");
    expect(plan).toContain("rights_safe_source_file");
    expect(plan).toContain("band_vector_or_digitization_payload");
  });
});
