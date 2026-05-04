import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { FloorRole, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { THICKNESS_TOLERANCE_MM } from "./floor-system-evaluation";
import { buildFloorTestLayersFromCriteria } from "./floor-system-test-layer-builders";
import { resolveBoundFloorSystemById } from "./bound-floor-system-match";
import { resolveExactFloorSystemById } from "./floor-system-match";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const TARGET_OUTPUTS = [
  "Rw",
  "R'w",
  "DnT,w",
  "Ln,w",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w"
] as const satisfies readonly RequestedOutputId[];

const POST_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_B_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "floor_tolerance_edge_promotion_guard_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  gateBNumericRuntimeBehaviorChange: false,
  latestLandedGate: "gate_a_inventory_exact_floor_tolerance_edges_no_runtime",
  latestLandedStatus: "floor_tolerance_edge_inventory_landed_no_runtime_selected_closeout_next_slice_selection",
  nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_floor_tolerance_edge_closeout",
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v19",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V19_PLAN.md",
  selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_floor_tolerance_edge_closeout",
  selectionStatus:
    "closed_floor_tolerance_edge_promotion_guard_no_runtime_and_selected_source_gap_revalidation_v19",
  sliceId: "post_floor_tolerance_edge_promotion_guard_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts",
  warningCopyChange: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts",
  "packages/engine/src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts",
  "packages/engine/src/calculator-route-source-risk-register-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-04_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-04_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_B_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V19_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const FLOOR_TOLERANCE_GATE_B_FINDINGS = [
  {
    id: "exact_floor_plus_2mm_inside_plus_2p1mm_outside",
    protectedBoundary: "gate_b_exact_bound_edges_remained_protected_no_support_promotion",
    runtimeImportReadyNow: false,
    selectedFixNow: false,
    supportPromotionReadyNow: false
  },
  {
    id: "bound_floor_plus_2mm_inside_plus_2p1mm_outside",
    protectedBoundary: "gate_b_exact_bound_edges_remained_protected_no_support_promotion",
    runtimeImportReadyNow: false,
    selectedFixNow: false,
    supportPromotionReadyNow: false
  },
  {
    id: "raw_role_and_duplicate_schedule_negatives",
    protectedBoundary: "raw_floor_role_inference",
    runtimeImportReadyNow: false,
    selectedFixNow: false,
    supportPromotionReadyNow: false
  },
  {
    id: "official_floor_system_id_bypass_not_layer_match_proof",
    protectedBoundary: "official_floor_system_id_bypass_must_not_seed_layer_match_proof",
    runtimeImportReadyNow: false,
    selectedFixNow: false,
    supportPromotionReadyNow: false
  }
] as const;

const NEXT_SLICE_SELECTION_MATRIX = [
  {
    id: "calculator_source_gap_revalidation_v19",
    reason:
      "floor_tolerance_edge_gate_b_rechecked_exact_and_bound_plus_2mm_inside_plus_2p1mm_outside_edges_raw_role_and_duplicate_negatives_visible_wording_boundaries_and_direct_id_bypass_without_finding_a_source_ready_runtime_candidate_or_bounded_support_copy_fix_so_the_next_honest_accuracy_step_is_to_rerank_the_source_gap_after_the_floor_tolerance_closeout",
    runtimeEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts"
  },
  {
    id: "direct_floor_tolerance_support_promotion",
    reason:
      "gate_b_found_the_exact_and_bound_tolerance_edges_already_protected_and_visible_copy_distinct_so promoting support confidence evidence field output cards or report wording would add certainty without a new source or tolerance owner",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SLICE_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_PLAN.md"
  },
  {
    id: "wall_triple_leaf_uris_2006_runtime_reopen",
    reason:
      "the_original_split_rockwool_triple_leaf_issue_stays_high_priority_but still waits for a rights_safe_uris_2006_source_packet_or_equivalent_source_owned_curve_payload_before exact runtime movement",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
  },
  {
    id: "external_source_research_now",
    reason:
      "gate_b_is_a_closeout_and_rerank decision not a source acquisition gate; internet or source packet research starts only if v19 selects it or a rights safe packet arrives",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
  }
] as const;

const SELECTED_V19_SCOPE = {
  firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_floor_tolerance_edge_closeout",
  requiredArtifacts: [
    "floor_tolerance_edge_gate_b_closeout_summary",
    "exact_bound_tolerance_edge_and_visible_wording_carry_forward",
    "post_floor_tolerance_source_ready_runtime_candidate_rerank",
    "rockwool_uris_2006_source_packet_status",
    "field_output_alias_hostile_input_curve_provenance_status",
    "selected_next_slice_with_target_gate_file_and_validation_scope"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V19_PLAN.md",
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts"
} as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function exactSystem(id: string): (typeof EXACT_FLOOR_SYSTEMS)[number] {
  const system = EXACT_FLOOR_SYSTEMS.find((entry) => entry.id === id);
  if (!system) {
    throw new Error(`Missing exact floor system ${id}`);
  }

  return system;
}

function boundSystem(id: string): (typeof BOUND_FLOOR_SYSTEMS)[number] {
  const system = BOUND_FLOOR_SYSTEMS.find((entry) => entry.id === id);
  if (!system) {
    throw new Error(`Missing bound floor system ${id}`);
  }

  return system;
}

function buildExactLayers(id: string, mode: "raw" | "tagged" = "tagged"): LayerInput[] {
  return buildFloorTestLayersFromCriteria(exactSystem(id).match, mode);
}

function buildBoundLayers(id: string): LayerInput[] {
  return buildFloorTestLayersFromCriteria(boundSystem(id).match, "tagged");
}

function mutateFirstRoleThickness(layers: readonly LayerInput[], role: FloorRole, deltaMm: number): LayerInput[] {
  let mutated = false;

  return layers.map((layer) => {
    if (!mutated && layer.floorRole === role) {
      mutated = true;
      return { ...layer, thicknessMm: layer.thicknessMm + deltaMm };
    }

    return { ...layer };
  });
}

function snapshot(layers: readonly LayerInput[]) {
  const result = calculateAssembly(layers, { targetOutputs: TARGET_OUTPUTS });

  return {
    boundId: result.boundFloorSystemMatch?.system.id ?? null,
    estimateKind: result.floorSystemEstimate?.kind ?? result.boundFloorSystemEstimate?.kind ?? null,
    floorRw: result.floorSystemRatings?.Rw ?? result.floorCarrier?.Rw ?? null,
    impactBasis: result.impact?.basis ?? null,
    lnW: result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound ?? null,
    lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
    matchId: result.floorSystemMatch?.system.id ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs,
    warnings: result.warnings.join("\n")
  };
}

describe("post floor tolerance-edge promotion guard Gate B next-slice selection contract", () => {
  it("closes the floor tolerance-edge slice no-runtime and selects source-gap revalidation v19", () => {
    expect(POST_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_B_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "floor_tolerance_edge_promotion_guard_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      gateBNumericRuntimeBehaviorChange: false,
      latestLandedGate: "gate_a_inventory_exact_floor_tolerance_edges_no_runtime",
      latestLandedStatus: "floor_tolerance_edge_inventory_landed_no_runtime_selected_closeout_next_slice_selection",
      nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_floor_tolerance_edge_closeout",
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_source_gap_revalidation_v19",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V19_PLAN.md",
      selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_floor_tolerance_edge_closeout",
      selectionStatus:
        "closed_floor_tolerance_edge_promotion_guard_no_runtime_and_selected_source_gap_revalidation_v19",
      sliceId: "post_floor_tolerance_edge_promotion_guard_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts",
      warningCopyChange: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("rechecks exact and bound tolerance edges without promoting just-outside values", () => {
    const exactLayers = buildExactLayers("tuas_x3_clt140_measured_2026");
    const exactInside = snapshot(mutateFirstRoleThickness(exactLayers, "base_structure", THICKNESS_TOLERANCE_MM));
    const exactOutside = snapshot(mutateFirstRoleThickness(exactLayers, "base_structure", THICKNESS_TOLERANCE_MM + 0.1));
    const boundLayers = buildBoundLayers("ubiq_fl33_open_web_steel_300_lab_2026");
    const boundInside = snapshot(mutateFirstRoleThickness(boundLayers, "base_structure", THICKNESS_TOLERANCE_MM));
    const boundOutside = snapshot(mutateFirstRoleThickness(boundLayers, "base_structure", THICKNESS_TOLERANCE_MM + 0.1));

    expect(exactInside).toMatchObject({
      estimateKind: null,
      floorRw: 49,
      impactBasis: "open_measured_floor_system_exact_match",
      lnW: 52,
      matchId: "tuas_x3_clt140_measured_2026"
    });
    expect(exactOutside).toMatchObject({
      boundId: null,
      estimateKind: "family_general",
      impactBasis: "predictor_floor_system_family_general_estimate",
      matchId: null
    });
    expect(boundInside).toMatchObject({
      boundId: "ubiq_fl33_open_web_steel_300_lab_2026",
      estimateKind: null,
      floorRw: 63,
      lnW: 51,
      lowerBoundBasis: "official_floor_system_bound_support",
      matchId: null
    });
    expect(boundOutside).toMatchObject({
      boundId: null,
      estimateKind: "bound_interpolation",
      floorRw: 63,
      lnW: 51,
      lowerBoundBasis: "predictor_lightweight_steel_bound_interpolation_estimate",
      matchId: null
    });
  });

  it("keeps raw role, duplicate role, and direct-id bypass boundaries separate", () => {
    const rawClt = snapshot(buildExactLayers("tuas_x4_clt140_measured_2026", "raw"));
    const duplicateOpenBox = snapshot(buildExactLayers("tuas_r7b_open_box_timber_measured_2026", "raw"));
    const directExact = resolveExactFloorSystemById("tuas_x3_clt140_measured_2026");
    const directBound = resolveBoundFloorSystemById("ubiq_fl33_open_web_steel_300_lab_2026");

    expect(rawClt).toMatchObject({
      impactBasis: null,
      matchId: null,
      supported: ["Rw"],
      unsupported: ["R'w", "DnT,w", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w"]
    });
    expect(rawClt.warnings).toContain("Floor roles needed before impact output promotion");
    expect(duplicateOpenBox).toMatchObject({
      estimateKind: "family_general",
      matchId: null
    });
    expect(duplicateOpenBox.warnings).toContain("single-entry floor roles are duplicated");
    expect(directExact?.score).toBe(0);
    expect(directExact?.notes.join("\n")).toContain("Layer scoring was bypassed");
    expect(directBound?.score).toBe(0);
    expect(directBound?.notes.join("\n")).toContain("Layer scoring was bypassed");
  });

  it("selects v19 revalidation before direct support promotion, Uris reopen, or source research", () => {
    expect(FLOOR_TOLERANCE_GATE_B_FINDINGS.every((finding) => finding.runtimeImportReadyNow === false)).toBe(true);
    expect(FLOOR_TOLERANCE_GATE_B_FINDINGS.every((finding) => finding.selectedFixNow === false)).toBe(true);
    expect(FLOOR_TOLERANCE_GATE_B_FINDINGS.every((finding) => finding.supportPromotionReadyNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "calculator_source_gap_revalidation_v19",
        reason:
          "floor_tolerance_edge_gate_b_rechecked_exact_and_bound_plus_2mm_inside_plus_2p1mm_outside_edges_raw_role_and_duplicate_negatives_visible_wording_boundaries_and_direct_id_bypass_without_finding_a_source_ready_runtime_candidate_or_bounded_support_copy_fix_so_the_next_honest_accuracy_step_is_to_rerank_the_source_gap_after_the_floor_tolerance_closeout",
        runtimeEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
  });

  it("defines the selected v19 Gate A scope and current-gate inclusion", () => {
    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(SELECTED_V19_SCOPE).toEqual({
      firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_floor_tolerance_edge_closeout",
      requiredArtifacts: [
        "floor_tolerance_edge_gate_b_closeout_summary",
        "exact_bound_tolerance_edge_and_visible_wording_carry_forward",
        "post_floor_tolerance_source_ready_runtime_candidate_rerank",
        "rockwool_uris_2006_source_packet_status",
        "field_output_alias_hostile_input_curve_provenance_status",
        "selected_next_slice_with_target_gate_file_and_validation_scope"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V19_PLAN.md",
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts"
    });
    expect(currentGateRunner).toContain(
      "src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts"
    );
  });

  it("keeps active docs aligned on Gate B closeout, v19 selection, and frozen surfaces", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V19_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-04_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_B_CLOSEOUT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(POST_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_B_CLOSEOUT.closedImplementationSlice);
      expect(doc).toContain(POST_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_B_CLOSEOUT.selectedImplementationSlice);
      expect(doc).toContain(POST_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_B_CLOSEOUT.targetFirstGateFile);
      expect(doc).toContain(POST_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_B_CLOSEOUT.selectionStatus);
      expect(doc).toContain("floor_tolerance_edge_gate_b_closeout_summary");
      expect(doc).toContain("gate_b_exact_bound_edges_remained_protected_no_support_promotion");
      expect(doc).toContain("official_floor_system_id_bypass_must_not_seed_layer_match_proof");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("multileaf_screening_blend_fail_closed_until_grouped_topology");
      expect(doc).toContain("raw_floor_role_inference");
    }
  });
});
