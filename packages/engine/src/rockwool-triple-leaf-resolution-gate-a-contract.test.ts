import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { FLAT_LIST_MULTILEAF_GUARD_STRATEGY } from "./dynamic-airborne-flat-list-multileaf-guard";
import {
  ROCKWOOL_TRIPLE_LEAF_SOURCE_REQUIRED_RUNTIME_BLOCKERS,
  ROCKWOOL_TRIPLE_LEAF_SOURCE_REQUIRED_RUNTIME_WARNING
} from "./rockwool-triple-leaf-source-required-boundary";
import { evaluateWallTripleLeafSourcePacketAvailability } from "./wall-triple-leaf-source-packet-availability";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type ResolutionPathId =
  | "direct_exact_source_runtime"
  | "source_required_screening_boundary"
  | "generic_guard_chain"
  | "repeat_uris_acquisition_without_new_packet";

type ResolutionPathDecision = {
  firstBlockingRequirement: string;
  id: ResolutionPathId;
  reason: string;
  selectedNext: boolean;
  targetFile: string;
};

const ROCKWOOL_TRIPLE_LEAF_RESOLUTION_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  diagnosticWarningChange: true,
  evidencePromotion: false,
  landedGate: "gate_a_decided_rockwool_triple_leaf_source_absent_source_required_boundary",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "rockwool_triple_leaf_support_posture_v1",
  selectedNextAction: "gate_a_decide_supported_vs_unsupported_output_posture_for_source_required_rockwool",
  selectedNextFile: "packages/engine/src/rockwool-triple-leaf-support-posture-gate-a-contract.test.ts",
  selectedPlanningSurface: "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_V1_PLAN.md",
  selectionStatus:
    "gate_a_confirmed_rockwool_triple_leaf_source_packet_absent_runtime_diagnostic_selected_support_posture",
  sliceId: "rockwool_triple_leaf_resolution_v1",
  sourceBackedExactRuntimeSelectedNow: false,
  sourceRequiredBoundarySelectedNow: true,
  supportPromotion: false,
  visibleCopyChange: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts",
  "packages/engine/src/rockwool-triple-leaf-source-required-boundary.ts",
  "packages/engine/src/source-promotion-owner-set-readiness-guard-gate-a-contract.test.ts",
  "packages/engine/src/wall-triple-leaf-source-packet-availability.ts",
  "packages/engine/src/wall-triple-leaf-manual-source-packet.ts",
  "packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts",
  "apps/web/features/workbench/rockwool-triple-leaf-screening-policy-copy.ts",
  "apps/web/features/workbench/rockwool-triple-leaf-explicit-screening-only-policy-gate-b-visible.test.ts",
  "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_RESOLUTION_V1_PLAN.md",
  "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_RESOLUTION_GATE_A_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_ALIGNED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_RESOLUTION_V1_PLAN.md",
  "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_RESOLUTION_GATE_A_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const ROCKWOOL_EXACT_SOURCE_PACKET_DECISION = {
  artifact: "rockwool_exact_source_packet_decision",
  completeOwnerSetAvailableNow: false,
  exactRuntimeSelectedNow: false,
  firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
  repeatUrisAcquisitionAllowedWithoutNewPacket: false,
  rightsSafePacketAvailableNow: false,
  sourceLaneDisposition: "paused_waiting_rights_safe_source_packet",
  sourceOwnedBandVectorAvailableNow: false
} as const;

const ROCKWOOL_SOURCE_REQUIRED_SCREENING_BOUNDARY = {
  artifact: "rockwool_source_required_screening_boundary",
  fieldContinuationRetainedAsScreening: "R'w 34 / DnT,w 36",
  groupedValueRetainedAsScreening: "Rw 41",
  notDesignGrade: true,
  notExact: true,
  supportPostureChangeNow: false,
  runtimeWarningIncludesSourceRequiredPayload: true
} as const;

const ROCKWOOL_FLAT_LIST_REORDER_BOUNDARY = {
  artifact: "rockwool_flat_list_reorder_boundary",
  flatListAdjacentSwapExpectedRw: 51,
  flatListAdjacentSwapStrategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
  groupedTopologyRequiredBeforeExactPromotion: true,
  sourceRequiredBoundaryAppliesToGroupedTopologyOnly: true
} as const;

const ROCKWOOL_SUPPORT_POSTURE_SELECTED = {
  artifact: "rockwool_support_posture_selected",
  reason:
    "source_packet_absence_is_confirmed_and_runtime_warning_is_now_source_required_so_the_next_bounded_rockwool_step_is_to_decide_whether_supported_outputs_should_remain_screening_supported_or_become_unsupported_for_exact_requests",
  selectedNextSlice: "rockwool_triple_leaf_support_posture_v1",
  selectedNextFile: "packages/engine/src/rockwool-triple-leaf-support-posture-gate-a-contract.test.ts"
} as const;

const RESOLUTION_PATH_DECISIONS: readonly ResolutionPathDecision[] = [
  {
    firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
    id: "direct_exact_source_runtime",
    reason:
      "not_selected_because_local_uris_2006_or_equivalent_source_owned_curve_payload_and_complete_owner_set_are_absent",
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
  },
  {
    firstBlockingRequirement: "support_posture_decision_for_source_required_screening_outputs",
    id: "source_required_screening_boundary",
    reason:
      "selected_because_exact_runtime_is_not_defensible_but_the_calculator_must_now_make_the_remaining_rw41_screening_support_semantic_unambiguous",
    selectedNext: true,
    targetFile: "packages/engine/src/rockwool-triple-leaf-support-posture-gate-a-contract.test.ts"
  },
  {
    firstBlockingRequirement: "new_generic_source_promotion_surface",
    id: "generic_guard_chain",
    reason: "not_selected_because_the_owner_set_guard_is_closed_and_the_current_user_blocker_is_rockwool",
    selectedNext: false,
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
  },
  {
    firstBlockingRequirement: "new_rights_safe_uris_packet_or_authorized_payload",
    id: "repeat_uris_acquisition_without_new_packet",
    reason: "not_selected_because_repeating_acquisition_without_a_new_packet_would_not_change_the_runtime_decision",
    selectedNext: false,
    targetFile: "docs/calculator/SLICE_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_PLAN.md"
  }
] as const;

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const GROUPED_SPLIT_ROCKWOOL_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
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

const GROUPED_SPLIT_ROCKWOOL_FIELD_CONTEXT: AirborneContext = {
  ...GROUPED_SPLIT_ROCKWOOL_CONTEXT,
  connectionType: "line_connection",
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

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
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function swap(stack: readonly LayerInput[], a: number, b: number): readonly LayerInput[] {
  const swapped = [...stack];
  [swapped[a], swapped[b]] = [swapped[b]!, swapped[a]!];
  return swapped;
}

function wallSnapshot(input: {
  airborneContext: AirborneContext;
  layers: readonly LayerInput[];
  outputs: readonly RequestedOutputId[];
}) {
  const result = calculateAssembly(input.layers, {
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    targetOutputs: input.outputs
  });

  return {
    confidence: result.dynamicAirborneTrace?.confidenceClass,
    dnTw: result.metrics.estimatedDnTwDb ?? null,
    family: result.dynamicAirborneTrace?.detectedFamily,
    rw: result.metrics.estimatedRwDb ?? null,
    rwPrime: result.metrics.estimatedRwPrimeDb ?? null,
    stc: result.metrics.estimatedStc ?? null,
    strategy: result.dynamicAirborneTrace?.strategy,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs,
    warnings: result.warnings.join("\n")
  };
}

describe("Rockwool triple-leaf resolution Gate A contract", () => {
  it("lands Gate A with exact runtime blocked and support-posture follow-up selected", () => {
    expect(ROCKWOOL_TRIPLE_LEAF_RESOLUTION_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      diagnosticWarningChange: true,
      evidencePromotion: false,
      landedGate: "gate_a_decided_rockwool_triple_leaf_source_absent_source_required_boundary",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "rockwool_triple_leaf_support_posture_v1",
      selectedNextAction: "gate_a_decide_supported_vs_unsupported_output_posture_for_source_required_rockwool",
      selectedNextFile: "packages/engine/src/rockwool-triple-leaf-support-posture-gate-a-contract.test.ts",
      selectedPlanningSurface: "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_V1_PLAN.md",
      selectionStatus:
        "gate_a_confirmed_rockwool_triple_leaf_source_packet_absent_runtime_diagnostic_selected_support_posture",
      sliceId: "rockwool_triple_leaf_resolution_v1",
      sourceBackedExactRuntimeSelectedNow: false,
      sourceRequiredBoundarySelectedNow: true,
      supportPromotion: false,
      visibleCopyChange: false,
      workbenchInputBehaviorChange: false
    });

    for (const relativePath of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, relativePath)), relativePath).toBe(true);
    }
  });

  it("confirms the Uris or equivalent rights-safe source packet is absent", () => {
    const availability = evaluateWallTripleLeafSourcePacketAvailability({
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(availability).toMatchObject({
      failClosedStrategy: "multileaf_screening_blend",
      rightsSafePacketAvailableNow: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimePromotionReadyNow: false,
      sourceOwnedBandVectorAvailableNow: false,
      sourcePacketAvailabilityReadyForRuntime: false,
      sourcePacketProvidedNow: false
    });
    expect(availability.blockedReasonIds).toEqual(
      expect.arrayContaining([
        "rights_safe_packet_absent",
        "no_uris_2006_page_image_or_pdf",
        "no_source_owned_band_vectors",
        "metadata_only_not_rights_safe_packet"
      ])
    );
    expect(availability.missingArtifactIds).toEqual(
      expect.arrayContaining([
        "rights_safe_source_file",
        "page_figure_table_locator",
        "curve_identity_map",
        "band_vector_or_digitization_payload",
        "rating_derivation_and_uncertainty"
      ])
    );
    expect(ROCKWOOL_EXACT_SOURCE_PACKET_DECISION).toEqual({
      artifact: "rockwool_exact_source_packet_decision",
      completeOwnerSetAvailableNow: false,
      exactRuntimeSelectedNow: false,
      firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
      repeatUrisAcquisitionAllowedWithoutNewPacket: false,
      rightsSafePacketAvailableNow: false,
      sourceLaneDisposition: "paused_waiting_rights_safe_source_packet",
      sourceOwnedBandVectorAvailableNow: false
    });
  });

  it("keeps grouped values frozen but upgrades the runtime diagnostic to source-required", () => {
    const grouped = wallSnapshot({
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK,
      outputs: WALL_LAB_OUTPUTS
    });

    expect(ROCKWOOL_SOURCE_REQUIRED_SCREENING_BOUNDARY).toEqual({
      artifact: "rockwool_source_required_screening_boundary",
      fieldContinuationRetainedAsScreening: "R'w 34 / DnT,w 36",
      groupedValueRetainedAsScreening: "Rw 41",
      notDesignGrade: true,
      notExact: true,
      supportPostureChangeNow: false,
      runtimeWarningIncludesSourceRequiredPayload: true
    });
    expect(ROCKWOOL_TRIPLE_LEAF_SOURCE_REQUIRED_RUNTIME_BLOCKERS).toEqual([
      "rights_safe_source_owned_curve_payload",
      "source_provenance",
      "topology_owner",
      "local_rockwool_material_mapping",
      "metric_context_owner",
      "tolerance_owner",
      "negative_boundaries",
      "paired_engine_tests",
      "paired_visible_tests"
    ]);
    expect(grouped).toMatchObject({
      confidence: "medium",
      family: "multileaf_multicavity",
      rw: 53,
      stc: 64,
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor",
      supported: ["Rw", "STC", "C", "Ctr"],
      unsupported: []
    });
    expect(grouped.warnings).toContain("lab spectrum adapter is active");
    expect(grouped.warnings).toContain("not-measured budget");
  });

  it("keeps flat-list reorder and field continuations inside the same source-required boundary", () => {
    const flatSwap = wallSnapshot({
      airborneContext: WALL_LAB_CONTEXT,
      layers: swap(SPLIT_ROCKWOOL_STACK, 3, 4),
      outputs: WALL_LAB_OUTPUTS
    });
    const field = wallSnapshot({
      airborneContext: GROUPED_SPLIT_ROCKWOOL_FIELD_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK,
      outputs: WALL_FIELD_OUTPUTS
    });

    expect(ROCKWOOL_FLAT_LIST_REORDER_BOUNDARY).toEqual({
      artifact: "rockwool_flat_list_reorder_boundary",
      flatListAdjacentSwapExpectedRw: 51,
      flatListAdjacentSwapStrategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
      groupedTopologyRequiredBeforeExactPromotion: true,
      sourceRequiredBoundaryAppliesToGroupedTopologyOnly: true
    });
    expect(flatSwap).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 51,
      stc: 51,
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
      supported: ["Rw", "STC", "C", "Ctr"],
      unsupported: []
    });
    expect(flatSwap.warnings).toContain("Flat-list adjacent-swap sensitivity guard");
    expect(field).toMatchObject({
      confidence: "medium",
      dnTw: 53,
      family: "multileaf_multicavity",
      rwPrime: 51,
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor",
      supported: ["R'w", "DnT,w"],
      unsupported: []
    });
    expect(field.warnings).toContain("Airborne field-side overlay active");
  });

  it("selects support-posture work and avoids exact runtime or another generic guard chain", () => {
    expect(RESOLUTION_PATH_DECISIONS.filter((decision) => decision.selectedNext)).toEqual([
      {
        firstBlockingRequirement: "support_posture_decision_for_source_required_screening_outputs",
        id: "source_required_screening_boundary",
        reason:
          "selected_because_exact_runtime_is_not_defensible_but_the_calculator_must_now_make_the_remaining_rw41_screening_support_semantic_unambiguous",
        selectedNext: true,
        targetFile: "packages/engine/src/rockwool-triple-leaf-support-posture-gate-a-contract.test.ts"
      }
    ]);
    expect(ROCKWOOL_SUPPORT_POSTURE_SELECTED).toEqual({
      artifact: "rockwool_support_posture_selected",
      reason:
        "source_packet_absence_is_confirmed_and_runtime_warning_is_now_source_required_so_the_next_bounded_rockwool_step_is_to_decide_whether_supported_outputs_should_remain_screening_supported_or_become_unsupported_for_exact_requests",
      selectedNextSlice: "rockwool_triple_leaf_support_posture_v1",
      selectedNextFile: "packages/engine/src/rockwool-triple-leaf-support-posture-gate-a-contract.test.ts"
    });
  });

  it("keeps docs and current-gate runner aligned with the resolution decision", () => {
    const docs = REQUIRED_ALIGNED_DOCS.map((relativePath) => readRepoFile(relativePath)).join("\n\n");

    for (const token of [
      ROCKWOOL_TRIPLE_LEAF_RESOLUTION_GATE_A.selectionStatus,
      ROCKWOOL_TRIPLE_LEAF_RESOLUTION_GATE_A.selectedImplementationSlice,
      ROCKWOOL_TRIPLE_LEAF_RESOLUTION_GATE_A.selectedNextAction,
      ROCKWOOL_TRIPLE_LEAF_RESOLUTION_GATE_A.selectedNextFile,
      ROCKWOOL_TRIPLE_LEAF_RESOLUTION_GATE_A.selectedPlanningSurface,
      ROCKWOOL_EXACT_SOURCE_PACKET_DECISION.artifact,
      ROCKWOOL_SOURCE_REQUIRED_SCREENING_BOUNDARY.artifact,
      ROCKWOOL_FLAT_LIST_REORDER_BOUNDARY.artifact,
      ROCKWOOL_SUPPORT_POSTURE_SELECTED.artifact,
      ROCKWOOL_TRIPLE_LEAF_SOURCE_REQUIRED_RUNTIME_WARNING
    ]) {
      expect(docs, token).toContain(token);
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts");
  });
});
