import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildFloorTestLayersFromCriteria } from "./floor-system-test-layer-builders";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type SentinelDomain = "floor" | "input_guard" | "output_policy" | "source_lane" | "wall";

type FrequentCombinationInventoryItem = {
  commonUse: string;
  currentPosture: string;
  domain: SentinelDomain;
  id: string;
  protectedBoundaries: readonly string[];
  requiresEngineSnapshot: true;
  requiresWebVisibleTestBeforeMovement: boolean;
  riskFamilies: readonly string[];
  runtimeBehaviorChange: false;
  sourceLanePosture: string;
};

type SentinelSnapshotRow = {
  decision: "easy_fix_candidate_for_gate_b" | "guard_green" | "document_fail_closed_risk" | "watch_only";
  id: string;
  requiredSnapshotFields: readonly string[];
  sourceLanePosture: string;
  variantCoverage: readonly string[];
};

const COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_inventory_frequent_wall_floor_lane_sentinel_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_b_reprobe_frequent_wall_floor_lane_sentinel_matrix_no_runtime",
  selectedNextFile:
    "packages/engine/src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts",
  selectedNextStatus: "common_combination_lane_sentinel_inventory_landed_no_runtime_selected_gate_b_reprobes",
  selectedPlanningSurface: "docs/calculator/SLICE_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_PLAN.md",
  sliceId: "common_combination_lane_misclassification_sentinel_v1",
  supportPromotion: false,
  thisGateFile:
    "packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts",
  warningCopyChange: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_A_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_A_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
] as const;

const FROZEN_SURFACES = [
  "runtime",
  "support",
  "confidence",
  "evidence",
  "API",
  "route-card",
  "output-card",
  "proposal/report",
  "workbench-input"
] as const;

const FREQUENT_WALL_FLOOR_COMBINATION_INVENTORY: readonly FrequentCombinationInventoryItem[] = [
  {
    commonUse: "user builds a board / MLV / rockwool / internal board triple-leaf wall and then drags layers",
    currentPosture:
      "grouped rockwool result is still Rw 41 low-confidence multileaf_screening_blend and not source validated",
    domain: "wall",
    id: "rockwool_like_triple_leaf_and_double_leaf_wall_stacks",
    protectedBoundaries: [
      "paused_waiting_rights_safe_source_packet",
      "multileaf_screening_blend_fail_closed_until_grouped_topology",
      "rw_41_screening_result_must_not_be_presented_as_fixed_or_source_validated"
    ],
    requiresEngineSnapshot: true,
    requiresWebVisibleTestBeforeMovement: true,
    riskFamilies: ["flat_list_route_family_flip", "material_alias_coalescing", "curve_digitization_provenance"],
    runtimeBehaviorChange: false,
    sourceLanePosture: "paused_waiting_rights_safe_source_packet"
  },
  {
    commonUse: "ordinary steel or timber framed double-board walls with insulation and small layer swaps",
    currentPosture:
      "flat-list guard now holds obvious adjacent-swap multi-leaf flips fail-closed, but grouped/source exactness is still absent",
    domain: "wall",
    id: "lsf_and_timber_stud_double_board_wall_stacks",
    protectedBoundaries: [
      "frequent_combination_wrong_lane_suspicion_requires_repro_or_documented_fail_closed_risk",
      "easy_fix_requires_small_bounded_change_with_engine_and_web_visible_regression_tests"
    ],
    requiresEngineSnapshot: true,
    requiresWebVisibleTestBeforeMovement: true,
    riskFamilies: ["flat_list_route_family_flip", "near_source_false_promotion"],
    runtimeBehaviorChange: false,
    sourceLanePosture: "formula_owned_double_leaf_or_multileaf_not_exact_source_row"
  },
  {
    commonUse: "AAC, pumice, concrete, board, fill, and gap hybrids near lined-massive boundaries",
    currentPosture:
      "family-boundary hold exists for ambiguous lined-massive reads, but boundary drift remains a documented watch item",
    domain: "wall",
    id: "lined_masonry_and_masonry_boundary_wall_stacks",
    protectedBoundaries: [
      "masonry_lined_massive_boundary_hold_must_stay_visible",
      "near_source_rows_do_not_override_existing_exact_anchors_or_fix_uris_2006"
    ],
    requiresEngineSnapshot: true,
    requiresWebVisibleTestBeforeMovement: true,
    riskFamilies: ["masonry_lined_massive_boundary_drift", "flat_list_route_family_flip"],
    runtimeBehaviorChange: false,
    sourceLanePosture: "formula_owned_lined_massive_boundary_hold"
  },
  {
    commonUse: "duplicate or many-layer pasted wall stacks during option comparison",
    currentPosture: "duplicates stay finite, but value drift must stay visible before any smoothing or source promotion",
    domain: "wall",
    id: "duplicate_and_many_layer_stack_drift",
    protectedBoundaries: [
      "duplicate_or_many_layer_stack_drift",
      "note_test_document_or_easy_fix"
    ],
    requiresEngineSnapshot: true,
    requiresWebVisibleTestBeforeMovement: false,
    riskFamilies: ["duplicate_or_many_layer_stack_drift", "hostile_api_input"],
    runtimeBehaviorChange: false,
    sourceLanePosture: "formula_owned_many_layer_guard"
  },
  {
    commonUse: "raw CLT / open-box / open-web floor imports without floorRole tags",
    currentPosture:
      "known raw parity rows remain live with a no-arbitrary-reorder warning; ambiguous raw rows prompt for floor roles",
    domain: "floor",
    id: "clt_open_box_open_web_and_raw_floor_role_stacks",
    protectedBoundaries: [
      "raw_floor_role_inference",
      "arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed"
    ],
    requiresEngineSnapshot: true,
    requiresWebVisibleTestBeforeMovement: true,
    riskFamilies: ["raw_floor_role_inference", "duplicate_or_many_layer_stack_drift"],
    runtimeBehaviorChange: false,
    sourceLanePosture: "exact_or_prompt_guard_floor_inference"
  },
  {
    commonUse: "manufacturer-near board names like Type C, SoundBloc, QuietRock, SilentFX, Wallboard, and generic gypsum",
    currentPosture: "near-source names are context only until exact material mapping, metric, tolerance, and tests exist",
    domain: "source_lane",
    id: "near_source_manufacturer_rows_and_material_aliases",
    protectedBoundaries: [
      "near_source_false_promotion",
      "material_aliases_do_not_coalesce_without_source_tolerance_owner"
    ],
    requiresEngineSnapshot: true,
    requiresWebVisibleTestBeforeMovement: true,
    riskFamilies: ["near_source_false_promotion", "material_alias_coalescing"],
    runtimeBehaviorChange: false,
    sourceLanePosture: "closed_manufacturer_context_only"
  },
  {
    commonUse: "R'w / DnT,w / field-copy appears beside lab or screening results",
    currentPosture: "field values stay screening/building-prediction unless an explicit field-output policy owns the copy",
    domain: "output_policy",
    id: "field_output_lab_screening_leakage",
    protectedBoundaries: [
      "field_output_leakage",
      "output_cards_must_keep_screening_lab_and_field_posture_honest"
    ],
    requiresEngineSnapshot: true,
    requiresWebVisibleTestBeforeMovement: true,
    riskFamilies: ["field_output_leakage"],
    runtimeBehaviorChange: false,
    sourceLanePosture: "field_policy_not_runtime_source_row"
  },
  {
    commonUse: "API or import payload sends unknown material, NaN, Infinity, negative thickness, or excessive layers",
    currentPosture: "hostile payloads must fail closed before any route family or output value can be trusted",
    domain: "input_guard",
    id: "hostile_api_or_import_layer_payloads",
    protectedBoundaries: [
      "hostile_api_input",
      "ui_normalization_does_not_replace_api_import_guardrails"
    ],
    requiresEngineSnapshot: true,
    requiresWebVisibleTestBeforeMovement: false,
    riskFamilies: ["hostile_api_input"],
    runtimeBehaviorChange: false,
    sourceLanePosture: "guardrail_before_route_selection"
  }
] as const;

const ROUTE_FAMILY_SOURCE_LANE_SUPPORT_CONFIDENCE_OUTPUT_WARNING_SNAPSHOT_MATRIX: readonly SentinelSnapshotRow[] = [
  {
    decision: "document_fail_closed_risk",
    id: "split_rockwool_grouped_rw41_screening_snapshot",
    requiredSnapshotFields: ["family", "strategy", "confidence", "Rw", "warnings", "source_lane"],
    sourceLanePosture: "paused_waiting_rights_safe_source_packet",
    variantCoverage: ["grouped_topology_present", "flat_list_current", "small_layer_swap"]
  },
  {
    decision: "guard_green",
    id: "classic_framed_adjacent_swap_guard_snapshot",
    requiredSnapshotFields: ["family", "strategy", "confidence", "Rw", "R'w", "DnT,w", "warnings"],
    sourceLanePosture: "formula_owned_double_leaf_or_multileaf_not_exact_source_row",
    variantCoverage: ["base_order", "adjacent_rockwool_board_swap"]
  },
  {
    decision: "document_fail_closed_risk",
    id: "aac_board_fill_gap_lined_massive_boundary_snapshot",
    requiredSnapshotFields: ["family", "strategy", "confidence", "Rw", "R'w", "DnT,w", "warnings"],
    sourceLanePosture: "formula_owned_lined_massive_boundary_hold",
    variantCoverage: ["multileaf_order", "lined_massive_boundary_swap"]
  },
  {
    decision: "watch_only",
    id: "duplicate_many_layer_wall_stack_snapshot",
    requiredSnapshotFields: ["finite_Rw", "family", "strategy", "confidence", "warnings"],
    sourceLanePosture: "formula_owned_many_layer_guard",
    variantCoverage: ["base_order", "duplicated_stack"]
  },
  {
    decision: "guard_green",
    id: "raw_floor_role_prompt_and_parity_snapshot",
    requiredSnapshotFields: ["floorSystemMatch", "supportedTargetOutputs", "unsupportedTargetOutputs", "impactBasis", "warnings"],
    sourceLanePosture: "exact_or_prompt_guard_floor_inference",
    variantCoverage: ["raw_parity_green", "raw_tagged_drift_prompt"]
  },
  {
    decision: "document_fail_closed_risk",
    id: "near_source_alias_and_field_output_snapshot",
    requiredSnapshotFields: ["source_lane", "metric_policy", "confidence", "field_outputs", "warnings"],
    sourceLanePosture: "closed_manufacturer_context_only",
    variantCoverage: ["generic_gypsum_alias", "field_Rw_DnTw_request"]
  },
  {
    decision: "guard_green",
    id: "hostile_api_import_payload_snapshot",
    requiredSnapshotFields: ["supportedTargetOutputs", "unsupportedTargetOutputs", "warnings"],
    sourceLanePosture: "guardrail_before_route_selection",
    variantCoverage: ["unknown_material", "infinite_thickness"]
  }
] as const;

const NOTE_TEST_DOCUMENT_OR_EASY_FIX_DECISION_LOG = [
  {
    action: "document_fail_closed_risk",
    id: "split_rockwool_grouped_rw41_screening_snapshot",
    reason:
      "live value is finite but not source-validated; Gate B must reprobe grouped/flat/source-lane boundaries before any runtime copy or value movement"
  },
  {
    action: "note_test_document_or_easy_fix",
    id: "classic_framed_adjacent_swap_guard_snapshot",
    reason:
      "existing flat-list guard is green; future regressions become an easy-fix candidate only with paired engine and web-visible tests"
  },
  {
    action: "document_fail_closed_risk",
    id: "aac_board_fill_gap_lined_massive_boundary_snapshot",
    reason:
      "family-boundary hold is intentional and must remain visible instead of being smoothed into a precise-looking source lane"
  },
  {
    action: "watch_only",
    id: "duplicate_many_layer_wall_stack_snapshot",
    reason: "duplicate stack remains finite but needs a reprobe matrix before any damping or smoothing behavior is changed"
  },
  {
    action: "note_test_document_or_easy_fix",
    id: "raw_floor_role_prompt_and_parity_snapshot",
    reason:
      "raw floor prompt guard is green; future raw reorder promotions require role-tagged repro tests and visible prompt coverage"
  },
  {
    action: "document_fail_closed_risk",
    id: "near_source_alias_and_field_output_snapshot",
    reason:
      "near-source manufacturer rows and field outputs must not look exact without metric, material-alias, tolerance, and visible-copy owners"
  },
  {
    action: "guard_green",
    id: "hostile_api_import_payload_snapshot",
    reason: "API/import invalid payloads already fail closed and stay in the sentinel matrix as a regression boundary"
  }
] as const;

const SMALL_LAYER_REORDER_DUPLICATE_MANY_LAYER_BOUNDARY_AND_HOSTILE_INPUT_VARIANTS = [
  "split_rockwool_swap_3_4",
  "classic_framed_swap_1_2",
  "heavy_aac_lined_massive_swap_1_2",
  "duplicated_classic_wall_stack",
  "raw_tuas_r5b_open_box_parity_green",
  "raw_tuas_x4_clt_role_prompt",
  "unknown_material_payload",
  "infinite_thickness_payload"
] as const;

const PAIRED_ENGINE_AND_WEB_VISIBLE_TESTS_BEFORE_ANY_ROUTE_OR_OUTPUT_COPY_MOVEMENT = [
  "route_family_source_lane_support_confidence_output_warning_snapshot_matrix",
  "apps_web_route_card_or_output_card_test_required_before_copy_or_status_movement",
  "easy_fix_requires_small_bounded_change_with_engine_and_web_visible_regression_tests"
] as const;

const WALL_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  airtightness: "good"
};

const WALL_FIELD_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const COMPLETE_TRIPLE_LEAF_CONTEXT: AirborneContext = {
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

const WALL_LAB_OUTPUTS = ["Rw", "STC"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const FLOOR_OUTPUTS = [
  "Rw",
  "R'w",
  "DnT,w",
  "Ln,w",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w"
] as const satisfies readonly RequestedOutputId[];

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

const CLASSIC_TRIPLE_LEAF_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const HEAVY_MULTILEAF_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 25 },
  { materialId: "ytong_aac_d700", thicknessMm: 100 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "diamond_board", thicknessMm: 12.5 }
];

const GYPSUM_ALIAS_MIXED_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum", thicknessMm: 12.5 },
  { materialId: "firestop_board", thicknessMm: 15 }
];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function swap(stack: readonly LayerInput[], a: number, b: number): readonly LayerInput[] {
  const swapped = [...stack];
  [swapped[a], swapped[b]] = [swapped[b]!, swapped[a]!];
  return swapped;
}

function exactFloorSystem(id: string): (typeof EXACT_FLOOR_SYSTEMS)[number] {
  const system = EXACT_FLOOR_SYSTEMS.find((entry) => entry.id === id);
  if (!system) {
    throw new Error(`Missing exact floor system ${id}`);
  }

  return system;
}

function exactFloorLayers(id: string, mode: "raw" | "tagged"): LayerInput[] {
  return buildFloorTestLayersFromCriteria(exactFloorSystem(id).match, mode);
}

function wallSnapshot(layers: readonly LayerInput[], context: AirborneContext = WALL_LAB_CONTEXT) {
  const lab = calculateAssembly(layers, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs: WALL_LAB_OUTPUTS
  });
  const field = calculateAssembly(layers, {
    airborneContext: WALL_FIELD_CONTEXT,
    calculator: "dynamic",
    targetOutputs: WALL_FIELD_OUTPUTS
  });

  return {
    confidence: lab.dynamicAirborneTrace?.confidenceClass ?? null,
    dnTw: field.metrics.estimatedDnTwDb,
    family: lab.dynamicAirborneTrace?.detectedFamily ?? null,
    rw: lab.metrics.estimatedRwDb,
    rwPrime: field.metrics.estimatedRwPrimeDb,
    stc: lab.metrics.estimatedStc,
    strategy: lab.dynamicAirborneTrace?.strategy ?? null,
    supported: lab.supportedTargetOutputs,
    warnings: [...lab.warnings, ...field.warnings]
  };
}

function floorSnapshot(layers: readonly LayerInput[]) {
  const result = calculateAssembly(layers, { targetOutputs: FLOOR_OUTPUTS });

  return {
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    lnW: result.impact?.LnW ?? null,
    rw: result.floorSystemRatings?.Rw ?? result.metrics.estimatedRwDb,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs,
    warnings: result.warnings
  };
}

function hasWarning(warnings: readonly string[], pattern: RegExp): boolean {
  return warnings.some((warning) => pattern.test(warning));
}

describe("common-combination lane-misclassification sentinel Gate A contract", () => {
  it("lands Gate A as no-runtime sentinel inventory and selects Gate B reprobes", () => {
    expect(COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_inventory_frequent_wall_floor_lane_sentinel_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_b_reprobe_frequent_wall_floor_lane_sentinel_matrix_no_runtime",
      selectedNextFile:
        "packages/engine/src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts",
      selectedNextStatus: "common_combination_lane_sentinel_inventory_landed_no_runtime_selected_gate_b_reprobes",
      selectedPlanningSurface: "docs/calculator/SLICE_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_PLAN.md",
      sliceId: "common_combination_lane_misclassification_sentinel_v1",
      supportPromotion: false,
      thisGateFile:
        "packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts",
      warningCopyChange: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_A_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("creates the frequent wall/floor combination inventory without selecting source or runtime movement", () => {
    expect(FREQUENT_WALL_FLOOR_COMBINATION_INVENTORY.map((item) => item.id)).toEqual([
      "rockwool_like_triple_leaf_and_double_leaf_wall_stacks",
      "lsf_and_timber_stud_double_board_wall_stacks",
      "lined_masonry_and_masonry_boundary_wall_stacks",
      "duplicate_and_many_layer_stack_drift",
      "clt_open_box_open_web_and_raw_floor_role_stacks",
      "near_source_manufacturer_rows_and_material_aliases",
      "field_output_lab_screening_leakage",
      "hostile_api_or_import_layer_payloads"
    ]);
    expect(new Set(FREQUENT_WALL_FLOOR_COMBINATION_INVENTORY.map((item) => item.id)).size).toBe(
      FREQUENT_WALL_FLOOR_COMBINATION_INVENTORY.length
    );
    expect(FREQUENT_WALL_FLOOR_COMBINATION_INVENTORY.every((item) => item.runtimeBehaviorChange === false)).toBe(true);
    expect(FREQUENT_WALL_FLOOR_COMBINATION_INVENTORY.every((item) => item.requiresEngineSnapshot)).toBe(true);
    expect(
      FREQUENT_WALL_FLOOR_COMBINATION_INVENTORY.filter((item) => item.requiresWebVisibleTestBeforeMovement).map(
        (item) => item.id
      )
    ).toEqual([
      "rockwool_like_triple_leaf_and_double_leaf_wall_stacks",
      "lsf_and_timber_stud_double_board_wall_stacks",
      "lined_masonry_and_masonry_boundary_wall_stacks",
      "clt_open_box_open_web_and_raw_floor_role_stacks",
      "near_source_manufacturer_rows_and_material_aliases",
      "field_output_lab_screening_leakage"
    ]);

    const coveredRiskFamilies = new Set(FREQUENT_WALL_FLOOR_COMBINATION_INVENTORY.flatMap((item) => item.riskFamilies));
    for (const riskFamily of [
      "flat_list_route_family_flip",
      "duplicate_or_many_layer_stack_drift",
      "masonry_lined_massive_boundary_drift",
      "raw_floor_role_inference",
      "near_source_false_promotion",
      "field_output_leakage",
      "material_alias_coalescing",
      "hostile_api_input",
      "curve_digitization_provenance"
    ]) {
      expect(coveredRiskFamilies.has(riskFamily), riskFamily).toBe(true);
    }
  });

  it("pins route/source/support/confidence/output/warning snapshots for common wall variants", () => {
    const splitGrouped = wallSnapshot(SPLIT_ROCKWOOL_STACK, COMPLETE_TRIPLE_LEAF_CONTEXT);
    const splitSwapped = wallSnapshot(swap(SPLIT_ROCKWOOL_STACK, 3, 4));
    const classicBase = wallSnapshot(CLASSIC_TRIPLE_LEAF_STACK);
    const classicSwapped = wallSnapshot(swap(CLASSIC_TRIPLE_LEAF_STACK, 1, 2));
    const heavyBase = wallSnapshot(HEAVY_MULTILEAF_STACK);
    const heavySwapped = wallSnapshot(swap(HEAVY_MULTILEAF_STACK, 1, 2));
    const duplicatedClassic = wallSnapshot([...CLASSIC_TRIPLE_LEAF_STACK, ...CLASSIC_TRIPLE_LEAF_STACK]);

    expect(splitGrouped).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 41,
      rwPrime: 39,
      strategy: "multileaf_screening_blend"
    });
    expect(splitSwapped).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 51,
      rwPrime: 49,
      strategy: "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology"
    });
    expect(hasWarning(splitSwapped.warnings, /Flat-list adjacent-swap sensitivity guard/i)).toBe(true);

    expect(classicBase).toMatchObject({
      confidence: "low",
      dnTw: 31,
      family: "multileaf_multicavity",
      rw: 32,
      rwPrime: 30,
      strategy: "multileaf_screening_blend"
    });
    expect(classicSwapped).toMatchObject({
      confidence: "medium",
      dnTw: 44,
      family: "double_leaf",
      rw: 44,
      rwPrime: 42,
      strategy: "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology"
    });
    expect(hasWarning(classicSwapped.warnings, /Flat-list adjacent-swap sensitivity guard/i)).toBe(true);

    expect(heavyBase).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 39,
      rwPrime: 37,
      strategy: "multileaf_screening_blend"
    });
    expect(heavySwapped).toMatchObject({
      confidence: "low",
      family: "lined_massive_wall",
      rw: 49,
      rwPrime: 47,
      strategy: "lined_massive_blend+reinforcement_monotonic_floor+family_boundary_hold"
    });
    expect(hasWarning(heavySwapped.warnings, /family-boundary hold/i)).toBe(true);

    expect(Number.isFinite(duplicatedClassic.rw)).toBe(true);
    expect(duplicatedClassic).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 37,
      strategy: "multileaf_screening_blend"
    });
  });

  it("pins raw-floor prompt/parity and hostile API fail-closed snapshots", () => {
    const rawOpenBox = floorSnapshot(exactFloorLayers("tuas_r5b_open_box_timber_measured_2026", "raw"));
    const rawDriftClt = floorSnapshot(exactFloorLayers("tuas_x4_clt140_measured_2026", "raw"));
    const unknown = calculateAssembly([{ materialId: "unknown_common_lane_sentinel_probe", thicknessMm: 100 }], {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const invalid = calculateAssembly([{ materialId: "gypsum_board", thicknessMm: Number.POSITIVE_INFINITY }], {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(rawOpenBox).toMatchObject({
      floorSystemMatchId: "tuas_r5b_open_box_timber_measured_2026",
      impactBasis: "open_measured_floor_system_exact_match",
      lnW: 44,
      rw: 75,
      supported: ["Rw", "Ln,w", "Ln,w+CI"]
    });
    expect(hasWarning(rawOpenBox.warnings, /does not claim arbitrary raw floor reorder value invariance/i)).toBe(true);

    expect(rawDriftClt).toMatchObject({
      floorSystemMatchId: null,
      impactBasis: null,
      supported: ["Rw"],
      unsupported: ["R'w", "DnT,w", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w"]
    });
    expect(hasWarning(rawDriftClt.warnings, /Floor roles needed before impact output promotion/i)).toBe(true);

    expect(unknown.supportedTargetOutputs).toEqual([]);
    expect(unknown.unsupportedTargetOutputs).toEqual(WALL_LAB_OUTPUTS);
    expect(hasWarning(unknown.warnings, /unknown material/i)).toBe(true);
    expect(invalid.supportedTargetOutputs).toEqual([]);
    expect(invalid.unsupportedTargetOutputs).toEqual(WALL_LAB_OUTPUTS);
    expect(hasWarning(invalid.warnings, /invalid thickness/i)).toBe(true);
  });

  it("keeps near-source alias and field output leakage as context-only sentinel rows", () => {
    const alias = wallSnapshot(GYPSUM_ALIAS_MIXED_STACK);
    const fieldRequest = calculateAssembly(CLASSIC_TRIPLE_LEAF_STACK, {
      airborneContext: WALL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });

    expect(alias.supported).toEqual(WALL_LAB_OUTPUTS);
    expect(alias.confidence).not.toBe("exact");
    expect(alias.family).not.toBeNull();
    expect(fieldRequest.supportedTargetOutputs).toEqual(WALL_FIELD_OUTPUTS);
    expect(fieldRequest.dynamicAirborneTrace?.confidenceClass).toBe("low");
    expect(hasWarning(fieldRequest.warnings, /building prediction|field-side overlay|confidence is low/i)).toBe(true);

    expect(
      FREQUENT_WALL_FLOOR_COMBINATION_INVENTORY.find(
        (item) => item.id === "near_source_manufacturer_rows_and_material_aliases"
      )?.sourceLanePosture
    ).toBe("closed_manufacturer_context_only");
  });

  it("classifies every suspicious row through note/test/document/easy-fix before Gate B", () => {
    expect(ROUTE_FAMILY_SOURCE_LANE_SUPPORT_CONFIDENCE_OUTPUT_WARNING_SNAPSHOT_MATRIX.map((row) => row.id)).toEqual([
      "split_rockwool_grouped_rw41_screening_snapshot",
      "classic_framed_adjacent_swap_guard_snapshot",
      "aac_board_fill_gap_lined_massive_boundary_snapshot",
      "duplicate_many_layer_wall_stack_snapshot",
      "raw_floor_role_prompt_and_parity_snapshot",
      "near_source_alias_and_field_output_snapshot",
      "hostile_api_import_payload_snapshot"
    ]);
    expect(
      ROUTE_FAMILY_SOURCE_LANE_SUPPORT_CONFIDENCE_OUTPUT_WARNING_SNAPSHOT_MATRIX.every(
        (row) => row.requiredSnapshotFields.length >= 3 && row.variantCoverage.length >= 1
      )
    ).toBe(true);
    expect(SMALL_LAYER_REORDER_DUPLICATE_MANY_LAYER_BOUNDARY_AND_HOSTILE_INPUT_VARIANTS).toContain(
      "split_rockwool_swap_3_4"
    );
    expect(SMALL_LAYER_REORDER_DUPLICATE_MANY_LAYER_BOUNDARY_AND_HOSTILE_INPUT_VARIANTS).toContain(
      "raw_tuas_x4_clt_role_prompt"
    );
    expect(SMALL_LAYER_REORDER_DUPLICATE_MANY_LAYER_BOUNDARY_AND_HOSTILE_INPUT_VARIANTS).toContain(
      "infinite_thickness_payload"
    );

    const decisionIds = NOTE_TEST_DOCUMENT_OR_EASY_FIX_DECISION_LOG.map((entry) => entry.id);
    expect(decisionIds).toEqual(
      ROUTE_FAMILY_SOURCE_LANE_SUPPORT_CONFIDENCE_OUTPUT_WARNING_SNAPSHOT_MATRIX.map((row) => row.id)
    );
    expect(NOTE_TEST_DOCUMENT_OR_EASY_FIX_DECISION_LOG.some((entry) => entry.action === "note_test_document_or_easy_fix"))
      .toBe(true);
    expect(PAIRED_ENGINE_AND_WEB_VISIBLE_TESTS_BEFORE_ANY_ROUTE_OR_OUTPUT_COPY_MOVEMENT).toContain(
      "easy_fix_requires_small_bounded_change_with_engine_and_web_visible_regression_tests"
    );
  });

  it("keeps active docs aligned on Gate A landing, Gate B selection, and protected boundaries", () => {
    const docs = REQUIRED_GATE_A_DOCS.map(readRepoFile);

    for (const doc of docs) {
      expect(doc).toContain(COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_A.sliceId);
      expect(doc).toContain(COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_A.thisGateFile);
      expect(doc).toContain(COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_A.selectedNextFile);
      expect(doc).toContain(COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_A.selectedNextAction);
      expect(doc).toContain(COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_A.selectedNextStatus);
      expect(doc).toContain("frequent_wall_floor_combination_inventory");
      expect(doc).toContain("route_family_source_lane_support_confidence_output_warning_snapshot_matrix");
      expect(doc).toContain("small_layer_reorder_duplicate_many_layer_boundary_and_hostile_input_variants");
      expect(doc).toContain("note_test_document_or_easy_fix_decision_log");
      expect(doc).toContain("paired_engine_and_web_visible_tests_before_any_route_or_output_copy_movement");
      expect(doc).toContain("next_closeout_or_bounded_easy_fix_decision");
      expect(doc).toContain("standing_lane_misclassification_monitoring_mandate");
      expect(doc).toContain("note_test_document_or_easy_fix");
      expect(doc).toContain("frequent_combination_wrong_lane_suspicion_requires_repro_or_documented_fail_closed_risk");
      expect(doc).toContain("easy_fix_requires_small_bounded_change_with_engine_and_web_visible_regression_tests");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("multileaf_screening_blend_fail_closed_until_grouped_topology");
      expect(doc).toContain("arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed");
      expect(doc).toContain("raw_floor_role_inference");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_PLAN.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
