import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type ScreeningSurfaceId =
  | "engine_grouped_topology_trace"
  | "engine_flat_list_adjacent_swap_guard"
  | "route_card_branch_guard"
  | "output_card_generic_screening_lane"
  | "proposal_report_live_metric_copy"
  | "field_output_owner_policy_bridge";

type ScreeningSurfaceInventoryRow = {
  currentEvidence: string;
  exactDesignGradeAllowedNow: false;
  id: ScreeningSurfaceId;
  selectedVisibleGateB: boolean;
  surface: "engine" | "output_card" | "proposal_report" | "route_card" | "shared_policy";
};

const ROCKWOOL_TRIPLE_LEAF_SCREENING_POLICY_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_inventory_rockwool_triple_leaf_screening_only_policy_after_v23_rerank",
  numericRuntimeBehaviorChange: false,
  outputCardCopyChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "gate_b_pin_visible_rockwool_triple_leaf_screening_only_policy",
  selectedNextFile:
    "apps/web/features/workbench/rockwool-triple-leaf-explicit-screening-only-policy-gate-b-visible.test.ts",
  selectionStatus:
    "gate_a_inventoried_rockwool_triple_leaf_screening_only_policy_no_runtime_selected_visible_gate_b",
  sliceId: "rockwool_triple_leaf_explicit_screening_only_policy_v1",
  supportPromotion: false,
  valueRetune: false,
  visibleCopyChange: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v23-gate-a-contract.test.ts",
  "packages/engine/src/post-field-output-owner-and-design-grade-policy-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/company-internal-misclassification-readiness-blocker-contract.test.ts",
  "packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts",
  "apps/web/features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts",
  "apps/web/features/workbench/wall-flat-list-multileaf-family-guard-route-card.test.ts",
  "apps/web/features/workbench/field-output-owner-and-design-grade-policy-gate-b-visible.test.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "apps/web/features/workbench/simple-workbench-output-posture.ts",
  "apps/web/features/workbench/simple-workbench-proposal.ts",
  "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V23_GATE_A_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_ALIGNED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_GATE_A_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const SCREENING_SURFACE_INVENTORY: readonly ScreeningSurfaceInventoryRow[] = [
  {
    currentEvidence: "rw41_multileaf_screening_blend_low_confidence_source_validation_blocked",
    exactDesignGradeAllowedNow: false,
    id: "engine_grouped_topology_trace",
    selectedVisibleGateB: false,
    surface: "engine"
  },
  {
    currentEvidence: "rw42_flat_list_adjacent_swap_fail_closed_until_grouped_topology",
    exactDesignGradeAllowedNow: false,
    id: "engine_flat_list_adjacent_swap_guard",
    selectedVisibleGateB: false,
    surface: "engine"
  },
  {
    currentEvidence: "route_card_shows_multileaf_warning_and_airborne_screening_lane",
    exactDesignGradeAllowedNow: false,
    id: "route_card_branch_guard",
    selectedVisibleGateB: false,
    surface: "route_card"
  },
  {
    currentEvidence: "generic_airborne_screening_lane_does_not_name_rockwool_triple_leaf_policy",
    exactDesignGradeAllowedNow: false,
    id: "output_card_generic_screening_lane",
    selectedVisibleGateB: true,
    surface: "output_card"
  },
  {
    currentEvidence: "coverage_status_can_say_live_now_without_rockwool_specific_screening_only_label",
    exactDesignGradeAllowedNow: false,
    id: "proposal_report_live_metric_copy",
    selectedVisibleGateB: true,
    surface: "proposal_report"
  },
  {
    currentEvidence: "field_output_owner_policy_is_closed_but_not_rockwool_exact_source_evidence",
    exactDesignGradeAllowedNow: false,
    id: "field_output_owner_policy_bridge",
    selectedVisibleGateB: false,
    surface: "shared_policy"
  }
] as const;

const ROCKWOOL_VISIBLE_GATE_B_SELECTION = {
  artifact: "rockwool_visible_gate_b_selected",
  concreteGapIds: ["output_card_generic_screening_lane", "proposal_report_live_metric_copy"],
  exactRuntimePromotionAllowedNow: false,
  reason:
    "engine_and_route_surfaces_are_guarded_but_output_and_report_surfaces_still_need_rockwool_specific_screening_only_copy_before_company_internal_opening",
  selectedNextAction: "gate_b_pin_visible_rockwool_triple_leaf_screening_only_policy",
  selectedNextFile:
    "apps/web/features/workbench/rockwool-triple-leaf-explicit-screening-only-policy-gate-b-visible.test.ts"
} as const;

const GROUPED_RW41_AND_FLAT_RW42_RUNTIME_FREEZE = {
  artifact: "grouped_rw41_and_flat_rw42_runtime_freeze",
  fieldOutputDesignGradeAllowedNow: false,
  flatListAdjacentSwapExpectedRw: 51,
  flatListAdjacentSwapExpectedStrategy:
    "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology",
  groupedExpectedRw: 41,
  groupedExpectedStrategy: "multileaf_screening_blend",
  runtimeValueRetuneAllowedNow: false,
  sourceValidatedExactNow: false
} as const;

const SOURCE_PROMOTION_HOSTILE_INPUT_CARRY_FORWARD = {
  artifact: "source_promotion_hostile_input_carry_forward",
  hostileApiImportMustFailClosed: true,
  nearSourceAliasesRemainContextOnly: true,
  sourcePromotionRequires: [
    "topology_owner",
    "material_mapping_owner",
    "metric_context_owner",
    "tolerance_owner",
    "negative_boundaries",
    "paired_visible_tests"
  ],
  sourcePromotionStillOpenAfterGateA: true,
  uris2006Status: "paused_waiting_rights_safe_source_packet"
} as const;

const PRE_COMPANY_INTERNAL_USE_EXIT_CRITERIA_STATUS = {
  artifact: "pre_company_internal_use_exit_criteria",
  companyInternalHighAccuracyOpeningAllowedNow: false,
  criteriaClosedByGateA: [],
  criteriaTargetedByGateB: ["rockwool_triple_leaf_exact_or_explicit_screening_only"],
  remainingBlockingIdsAfterGateB: [
    "source_promotion_topology_material_metric_tolerance_negative_boundary_visible_tests",
    "hostile_api_import_payloads_fail_closed",
    "pnpm_calculator_gate_current_and_pnpm_check_green_at_opening_handoff"
  ]
} as const;

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

describe("rockwool triple-leaf explicit screening-only policy Gate A contract", () => {
  it("lands Gate A no-runtime and selects the visible Rockwool screening-only Gate B", () => {
    expect(ROCKWOOL_TRIPLE_LEAF_SCREENING_POLICY_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_inventory_rockwool_triple_leaf_screening_only_policy_after_v23_rerank",
      numericRuntimeBehaviorChange: false,
      outputCardCopyChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedNextAction: "gate_b_pin_visible_rockwool_triple_leaf_screening_only_policy",
      selectedNextFile:
        "apps/web/features/workbench/rockwool-triple-leaf-explicit-screening-only-policy-gate-b-visible.test.ts",
      selectionStatus:
        "gate_a_inventoried_rockwool_triple_leaf_screening_only_policy_no_runtime_selected_visible_gate_b",
      sliceId: "rockwool_triple_leaf_explicit_screening_only_policy_v1",
      supportPromotion: false,
      valueRetune: false,
      visibleCopyChange: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("freezes grouped Rw 41 and flat-list Rw 51 numeric-hold behavior", () => {
    const grouped = wallSnapshot({
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const flatSwap = wallSnapshot({
      airborneContext: WALL_LAB_CONTEXT,
      layers: swap(SPLIT_ROCKWOOL_STACK, 3, 4),
      outputs: WALL_LAB_OUTPUTS
    });

    expect(GROUPED_RW41_AND_FLAT_RW42_RUNTIME_FREEZE).toEqual({
      artifact: "grouped_rw41_and_flat_rw42_runtime_freeze",
      fieldOutputDesignGradeAllowedNow: false,
      flatListAdjacentSwapExpectedRw: 51,
      flatListAdjacentSwapExpectedStrategy: "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology",
      groupedExpectedRw: 41,
      groupedExpectedStrategy: "multileaf_screening_blend",
      runtimeValueRetuneAllowedNow: false,
      sourceValidatedExactNow: false
    });
    expect(grouped).toMatchObject({
      confidence: "medium",
      family: "multileaf_multicavity",
      rw: 50,
      stc: 55,
      strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction",
      supported: ["Rw", "STC", "C", "Ctr"]
    });
    expect(grouped.warnings).toContain("family physics prediction");
    expect(grouped.warnings).toContain("Dynamic airborne confidence is medium");

    expect(flatSwap).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 51,
      stc: 51,
      strategy: "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology",
      supported: ["Rw", "STC", "C", "Ctr"]
    });
    expect(flatSwap.warnings).toContain("Flat-list adjacent-swap sensitivity guard");
  });

  it("keeps field-style outputs as continuations from the screening lane, not design-grade field results", () => {
    const field = wallSnapshot({
      airborneContext: GROUPED_SPLIT_ROCKWOOL_FIELD_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK,
      outputs: WALL_FIELD_OUTPUTS
    });

    expect(field).toMatchObject({
      confidence: "medium",
      dnTw: 50,
      family: "multileaf_multicavity",
      rwPrime: 49,
      strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction",
      supported: ["R'w", "DnT,w"]
    });
    expect(field.warnings).toContain("family physics prediction");
    expect(field.warnings).toContain("Dynamic airborne confidence is medium");
  });

  it("inventories visible surfaces and selects Gate B only for the concrete copy gap", () => {
    expect(SCREENING_SURFACE_INVENTORY.map((row) => row.id)).toEqual([
      "engine_grouped_topology_trace",
      "engine_flat_list_adjacent_swap_guard",
      "route_card_branch_guard",
      "output_card_generic_screening_lane",
      "proposal_report_live_metric_copy",
      "field_output_owner_policy_bridge"
    ]);
    expect(SCREENING_SURFACE_INVENTORY.every((row) => row.exactDesignGradeAllowedNow === false)).toBe(true);
    expect(SCREENING_SURFACE_INVENTORY.filter((row) => row.selectedVisibleGateB).map((row) => row.id)).toEqual([
      "output_card_generic_screening_lane",
      "proposal_report_live_metric_copy"
    ]);
    expect(ROCKWOOL_VISIBLE_GATE_B_SELECTION).toEqual({
      artifact: "rockwool_visible_gate_b_selected",
      concreteGapIds: ["output_card_generic_screening_lane", "proposal_report_live_metric_copy"],
      exactRuntimePromotionAllowedNow: false,
      reason:
        "engine_and_route_surfaces_are_guarded_but_output_and_report_surfaces_still_need_rockwool_specific_screening_only_copy_before_company_internal_opening",
      selectedNextAction: "gate_b_pin_visible_rockwool_triple_leaf_screening_only_policy",
      selectedNextFile:
        "apps/web/features/workbench/rockwool-triple-leaf-explicit-screening-only-policy-gate-b-visible.test.ts"
    });
  });

  it("carries source-promotion, Uris, hostile-input, and company-opening blockers forward", () => {
    expect(SOURCE_PROMOTION_HOSTILE_INPUT_CARRY_FORWARD).toEqual({
      artifact: "source_promotion_hostile_input_carry_forward",
      hostileApiImportMustFailClosed: true,
      nearSourceAliasesRemainContextOnly: true,
      sourcePromotionRequires: [
        "topology_owner",
        "material_mapping_owner",
        "metric_context_owner",
        "tolerance_owner",
        "negative_boundaries",
        "paired_visible_tests"
      ],
      sourcePromotionStillOpenAfterGateA: true,
      uris2006Status: "paused_waiting_rights_safe_source_packet"
    });
    expect(PRE_COMPANY_INTERNAL_USE_EXIT_CRITERIA_STATUS).toEqual({
      artifact: "pre_company_internal_use_exit_criteria",
      companyInternalHighAccuracyOpeningAllowedNow: false,
      criteriaClosedByGateA: [],
      criteriaTargetedByGateB: ["rockwool_triple_leaf_exact_or_explicit_screening_only"],
      remainingBlockingIdsAfterGateB: [
        "source_promotion_topology_material_metric_tolerance_negative_boundary_visible_tests",
        "hostile_api_import_payloads_fail_closed",
        "pnpm_calculator_gate_current_and_pnpm_check_green_at_opening_handoff"
      ]
    });
  });

  it("keeps docs aligned with the Gate A inventory and selected visible Gate B", () => {
    for (const relativePath of REQUIRED_ALIGNED_DOCS) {
      const contents = readRepoFile(relativePath);
      expect(contents).toContain(ROCKWOOL_TRIPLE_LEAF_SCREENING_POLICY_GATE_A.selectionStatus);
      expect(contents).toContain(ROCKWOOL_TRIPLE_LEAF_SCREENING_POLICY_GATE_A.selectedNextFile);
      expect(contents).toContain(ROCKWOOL_TRIPLE_LEAF_SCREENING_POLICY_GATE_A.selectedNextAction);
      expect(contents).toContain("rockwool_triple_leaf_screening_surface_inventory");
      expect(contents).toContain("grouped_rw41_and_flat_rw42_runtime_freeze");
      expect(contents).toContain("visible_route_output_report_policy_gap");
      expect(contents).toContain("rockwool_visible_gate_b_selected");
      expect(contents).toContain("source_promotion_hostile_input_carry_forward");
      expect(contents).toContain("pre_company_internal_use_exit_criteria");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts"
    );
  });
});
