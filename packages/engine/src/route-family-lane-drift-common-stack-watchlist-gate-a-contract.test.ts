import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type WatchlistDomain = "floor" | "input_guard" | "output_policy" | "source_lane" | "wall";

type CommonStackWatchlistItem = {
  commonUsage: string;
  currentKnownPosture: string;
  domain: WatchlistDomain;
  gateAProbe: string;
  gateBProbeId: string;
  id: string;
  protectedBoundaries: readonly string[];
  requiresEngineProbe: boolean;
  requiresWebVisibleProbe: boolean;
  riskFamilies: readonly string[];
  runtimeBehaviorChange: false;
  sourceLanePosture: string;
};

const ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_inventory_common_wall_floor_lane_drift_watchlist_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_b_reprobe_common_stack_route_family_and_value_drift_no_runtime",
  selectedNextFile: "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts",
  selectedNextStatus: "common_stack_lane_drift_inventory_landed_no_runtime_selected_gate_b_reprobes",
  selectedPlanningSurface: "docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md",
  sliceId: "route_family_lane_drift_common_stack_watchlist_v1",
  supportPromotion: false,
  thisGateFile: "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts",
  "packages/engine/src/calculator-route-source-risk-register-contract.test.ts",
  "docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_GATE_A_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const STANDING_LANE_MISCLASSIFICATION_MONITORING_MANDATE = {
  actionWhenSuspicious: "note_test_document_or_easy_fix",
  requiredEveryCalculatorSlice: true,
  token: "standing_lane_misclassification_monitoring_mandate",
  watchlistFamilies: [
    "flat_list_route_family_flip",
    "duplicate_or_many_layer_stack_drift",
    "masonry_lined_massive_boundary_drift",
    "raw_floor_role_inference",
    "near_source_false_promotion",
    "field_output_leakage",
    "material_alias_coalescing",
    "hostile_api_input",
    "curve_digitization_provenance"
  ]
} as const;

const COMMON_STACK_WATCHLIST: readonly CommonStackWatchlistItem[] = [
  {
    commonUsage: "user inserts rockwool between board leaves, then drags the rockwool/internal board order",
    currentKnownPosture:
      "live grouped input still returns low-confidence multileaf_screening_blend Rw 41 and must not be called fixed",
    domain: "wall",
    gateAProbe: "pin_grouped_split_rockwool_rw_41_low_confidence_snapshot",
    gateBProbeId: "gate_b_split_rockwool_grouped_vs_flat_reorder_reprobe",
    id: "split_rockwool_grouped_triple_leaf",
    protectedBoundaries: [
      "paused_uris_2006_source_packet_lane_stays_blocked_until_rights_safe_payload_exists",
      "rw_41_multileaf_screening_blend_must_not_be_presented_as_fixed_or_source_validated"
    ],
    requiresEngineProbe: true,
    requiresWebVisibleProbe: true,
    riskFamilies: ["flat_list_route_family_flip", "material_alias_coalescing", "curve_digitization_provenance"],
    runtimeBehaviorChange: false,
    sourceLanePosture: "paused_waiting_rights_safe_source_packet"
  },
  {
    commonUsage: "ordinary framed wall where insulation is placed beside or between gypsum boards",
    currentKnownPosture: "small flat-list swap can move between multileaf and double_leaf lanes with a double-digit Rw jump",
    domain: "wall",
    gateAProbe: "pin_classic_triple_leaf_vs_swapped_double_leaf_snapshot",
    gateBProbeId: "gate_b_ordinary_framed_wall_insulation_reorder_reprobe",
    id: "ordinary_double_leaf_framed_insulation_reorder",
    protectedBoundaries: [
      "wrong_lane_suspicion_requires_repro_test_before_documented_defect_or_easy_fix",
      "frequently_used_combinations_must_keep_route_family_source_lane_support_confidence_and_output_copy_honest"
    ],
    requiresEngineProbe: true,
    requiresWebVisibleProbe: true,
    riskFamilies: ["flat_list_route_family_flip", "near_source_false_promotion"],
    runtimeBehaviorChange: false,
    sourceLanePosture: "formula_owned_double_leaf_or_multileaf_not_exact_source_row"
  },
  {
    commonUsage: "AAC, pumice, concrete, board, fill, and air-gap hybrids near lined-massive boundary conditions",
    currentKnownPosture:
      "heavy multileaf swap can land on lined_massive_wall with family_boundary_hold rather than the original multileaf lane",
    domain: "wall",
    gateAProbe: "pin_heavy_multileaf_vs_lined_massive_boundary_snapshot",
    gateBProbeId: "gate_b_masonry_lined_massive_boundary_reprobe",
    id: "lined_massive_masonry_boundary_hybrid",
    protectedBoundaries: [
      "masonry_lined_massive_boundary_hold_must_stay_visible",
      "near_source_rows_do_not_override_existing_exact_anchors_or_fix_uris_2006"
    ],
    requiresEngineProbe: true,
    requiresWebVisibleProbe: true,
    riskFamilies: ["masonry_lined_massive_boundary_drift", "flat_list_route_family_flip"],
    runtimeBehaviorChange: false,
    sourceLanePosture: "formula_owned_lined_massive_boundary_hold"
  },
  {
    commonUsage: "user duplicates a wall stack to compare options or accidentally pastes the same layers twice",
    currentKnownPosture:
      "duplicate stacks remain finite but can change value/family confidence enough to need a watchlist before any smoothing",
    domain: "wall",
    gateAProbe: "inventory_duplicate_and_many_layer_stack_drift",
    gateBProbeId: "gate_b_duplicate_many_layer_wall_stack_reprobe",
    id: "duplicated_many_layer_framed_wall",
    protectedBoundaries: [
      "common_stack_watchlist_is_not_runtime_import_or_value_retune",
      "duplicate_stack_drift_must_be_reproduced_before_fix"
    ],
    requiresEngineProbe: true,
    requiresWebVisibleProbe: false,
    riskFamilies: ["duplicate_or_many_layer_stack_drift", "hostile_api_input"],
    runtimeBehaviorChange: false,
    sourceLanePosture: "formula_owned_many_layer_guard"
  },
  {
    commonUsage: "raw floor rows imported without floorRole tags",
    currentKnownPosture: "raw inference has parity tests for known rows but remains a deliberate risk for ambiguous order",
    domain: "floor",
    gateAProbe: "pin_known_raw_floor_vs_tagged_parity_snapshot",
    gateBProbeId: "gate_b_raw_floor_role_inference_reprobe",
    id: "raw_floor_without_role_tags",
    protectedBoundaries: [
      "raw_floor_role_inference_needs_exact_or_tagged_context_before_value_promotion",
      "floor_order_edits_must_not_silently_change_floor_system_match"
    ],
    requiresEngineProbe: true,
    requiresWebVisibleProbe: true,
    riskFamilies: ["raw_floor_role_inference", "duplicate_or_many_layer_stack_drift"],
    runtimeBehaviorChange: false,
    sourceLanePosture: "exact_or_preset_floor_inference_guard"
  },
  {
    commonUsage: "user selects generic gypsum / Type X / Type C / SoundBloc / Wallboard / QuietRock / SilentFX-like boards",
    currentKnownPosture: "source-near board names are context only unless exact row, metric, alias, and tolerance owners exist",
    domain: "source_lane",
    gateAProbe: "inventory_source_near_gypsum_alias_false_promotion",
    gateBProbeId: "gate_b_source_near_gypsum_alias_negative_boundary_reprobe",
    id: "source_near_gypsum_alias_stack",
    protectedBoundaries: [
      "material_aliases_do_not_coalesce_without_source_tolerance_owner",
      "near_source_rows_do_not_override_existing_exact_anchors_or_fix_uris_2006"
    ],
    requiresEngineProbe: true,
    requiresWebVisibleProbe: true,
    riskFamilies: ["near_source_false_promotion", "material_alias_coalescing"],
    runtimeBehaviorChange: false,
    sourceLanePosture: "closed_manufacturer_context_only"
  },
  {
    commonUsage: "field R'w / DnT,w outputs shown beside lab or screening values",
    currentKnownPosture: "field outputs need explicit copy/support policy before they can look exact",
    domain: "output_policy",
    gateAProbe: "inventory_field_output_lab_metric_leakage",
    gateBProbeId: "gate_b_field_output_copy_and_support_leakage_reprobe",
    id: "field_output_lab_metric_leakage",
    protectedBoundaries: [
      "field_metrics_do_not_promote_lab_rw_dntw_or_output_cards_without_policy",
      "output_cards_must_keep_screening_lab_and_field_posture_honest"
    ],
    requiresEngineProbe: true,
    requiresWebVisibleProbe: true,
    riskFamilies: ["field_output_leakage"],
    runtimeBehaviorChange: false,
    sourceLanePosture: "field_policy_not_runtime_source_row"
  },
  {
    commonUsage: "API/import path sends NaN, Infinity, negative thickness, unknown material, empty stack, or excessive layers",
    currentKnownPosture: "hostile inputs must fail closed before any route family or value can be trusted",
    domain: "input_guard",
    gateAProbe: "pin_unknown_material_and_invalid_thickness_fail_closed_posture",
    gateBProbeId: "gate_b_hostile_api_import_payload_reprobe",
    id: "hostile_api_import_payload",
    protectedBoundaries: [
      "hostile_api_input_must_fail_closed_before_route_or_value_selection",
      "ui_normalization_does_not_replace_api_import_guardrails"
    ],
    requiresEngineProbe: true,
    requiresWebVisibleProbe: false,
    riskFamilies: ["hostile_api_input"],
    runtimeBehaviorChange: false,
    sourceLanePosture: "guardrail_before_route_selection"
  },
  {
    commonUsage: "new graph-digitized curve or source-locator row is added during a future source gate",
    currentKnownPosture: "axis, band, STC/Rw derivation, and provenance can make a near-source row look runtime-ready",
    domain: "source_lane",
    gateAProbe: "inventory_curve_digitization_and_provenance_regression_guard",
    gateBProbeId: "gate_b_curve_digitization_provenance_negative_boundary_reprobe",
    id: "curve_digitization_provenance_row",
    protectedBoundaries: [
      "curve_digitization_needs_axis_band_rating_derivation_and_uncertainty_payload",
      "new_source_locator_does_not_skip_route_family_lane_drift_screening"
    ],
    requiresEngineProbe: true,
    requiresWebVisibleProbe: false,
    riskFamilies: ["curve_digitization_provenance", "near_source_false_promotion"],
    runtimeBehaviorChange: false,
    sourceLanePosture: "source_qc_before_runtime_import"
  }
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

const WALL_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  airtightness: "good"
};

const WALL_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  airtightness: "good",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const FLOOR_LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI"];
const FLOOR_FIELD_OUTPUTS: readonly RequestedOutputId[] = [
  "Rw",
  "R'w",
  "DnT,w",
  "DnT,A",
  "Dn,w",
  "Dn,A",
  "Ln,w",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w"
];

const FLOOR_FIELD_CONTEXT = {
  contextMode: "field_between_rooms" as const,
  partitionHeightM: 4,
  partitionWidthM: 4.5,
  receivingRoomVolumeM3: 55,
  separatingAreaM2: 18
};

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

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

const RAW_FLOOR_STACK: readonly LayerInput[] = [
  { materialId: "clt_panel", thicknessMm: 140 },
  { materialId: "mw_t_40_impact_layer", thicknessMm: 30 },
  { materialId: "elastic_bonded_fill", thicknessMm: 60 },
  { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 }
];

const TAGGED_FLOOR_STACK: readonly LayerInput[] = [
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 },
  { floorRole: "resilient_layer", materialId: "mw_t_40_impact_layer", thicknessMm: 30 },
  { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: 60 },
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 }
];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function wallSnapshot(layers: readonly LayerInput[]) {
  const lab = calculateAssembly(layers, {
    airborneContext: WALL_LAB_CONTEXT,
    calculator: "dynamic",
    targetOutputs: ["Rw"]
  });
  const field = calculateAssembly(layers, {
    airborneContext: WALL_FIELD_CONTEXT,
    calculator: "dynamic",
    targetOutputs: ["R'w", "DnT,w"]
  });

  return {
    confidence: field.dynamicAirborneTrace?.confidenceClass ?? lab.dynamicAirborneTrace?.confidenceClass ?? null,
    dnTw: field.metrics.estimatedDnTwDb,
    family: field.dynamicAirborneTrace?.detectedFamily ?? lab.dynamicAirborneTrace?.detectedFamily ?? null,
    rw: lab.metrics.estimatedRwDb,
    rwPrime: field.metrics.estimatedRwPrimeDb,
    strategy: field.dynamicAirborneTrace?.strategy ?? lab.dynamicAirborneTrace?.strategy ?? null,
    warningText: [...lab.warnings, ...field.warnings].join(" | ")
  };
}

function floorSnapshot(layers: readonly LayerInput[]) {
  const lab = calculateAssembly(layers, { targetOutputs: FLOOR_LAB_OUTPUTS });
  const field = calculateAssembly(layers, {
    airborneContext: FLOOR_FIELD_CONTEXT,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    targetOutputs: FLOOR_FIELD_OUTPUTS
  });

  return {
    fieldSupported: field.supportedTargetOutputs,
    floorSystemMatchId: lab.floorSystemMatch?.system.id ?? null,
    impactBasis: lab.impact?.basis ?? null,
    labSupported: lab.supportedTargetOutputs,
    lnW: lab.impact?.LnW ?? null,
    rw: lab.floorSystemRatings?.Rw ?? null,
    rwPrime: field.metrics.estimatedRwPrimeDb ?? null,
    warnings: [...lab.warnings, ...field.warnings]
  };
}

function withoutRawFloorParityGuardWarning(snapshot: ReturnType<typeof floorSnapshot>) {
  return {
    ...snapshot,
    warnings: snapshot.warnings.filter(
      (warning) => !/does not claim arbitrary raw floor reorder value invariance/i.test(warning)
    )
  };
}

function swapInnerLeaf(stack: readonly LayerInput[]) {
  const swapped = [...stack];
  [swapped[1], swapped[2]] = [swapped[2]!, swapped[1]!];
  return swapped;
}

describe("route-family lane-drift common-stack watchlist Gate A contract", () => {
  it("lands Gate A as a no-runtime inventory and selects Gate B reprobes", () => {
    expect(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_inventory_common_wall_floor_lane_drift_watchlist_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_b_reprobe_common_stack_route_family_and_value_drift_no_runtime",
      selectedNextFile: "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts",
      selectedNextStatus: "common_stack_lane_drift_inventory_landed_no_runtime_selected_gate_b_reprobes",
      selectedPlanningSurface: "docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md",
      sliceId: "route_family_lane_drift_common_stack_watchlist_v1",
      supportPromotion: false,
      thisGateFile: "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("inventories frequent wall/floor/input cases without selecting runtime movement", () => {
    expect(COMMON_STACK_WATCHLIST.map((item) => item.id)).toEqual([
      "split_rockwool_grouped_triple_leaf",
      "ordinary_double_leaf_framed_insulation_reorder",
      "lined_massive_masonry_boundary_hybrid",
      "duplicated_many_layer_framed_wall",
      "raw_floor_without_role_tags",
      "source_near_gypsum_alias_stack",
      "field_output_lab_metric_leakage",
      "hostile_api_import_payload",
      "curve_digitization_provenance_row"
    ]);
    expect(new Set(COMMON_STACK_WATCHLIST.map((item) => item.id)).size).toBe(COMMON_STACK_WATCHLIST.length);
    expect(COMMON_STACK_WATCHLIST.every((item) => item.runtimeBehaviorChange === false)).toBe(true);
    expect(COMMON_STACK_WATCHLIST.every((item) => item.requiresEngineProbe)).toBe(true);
    expect(COMMON_STACK_WATCHLIST.filter((item) => item.requiresWebVisibleProbe).map((item) => item.id)).toEqual([
      "split_rockwool_grouped_triple_leaf",
      "ordinary_double_leaf_framed_insulation_reorder",
      "lined_massive_masonry_boundary_hybrid",
      "raw_floor_without_role_tags",
      "source_near_gypsum_alias_stack",
      "field_output_lab_metric_leakage"
    ]);

    const coveredRiskFamilies = new Set(COMMON_STACK_WATCHLIST.flatMap((item) => item.riskFamilies));
    for (const riskFamily of STANDING_LANE_MISCLASSIFICATION_MONITORING_MANDATE.watchlistFamilies) {
      expect(coveredRiskFamilies.has(riskFamily), riskFamily).toBe(true);
    }
  });

  it("keeps the original grouped split-rockwool defect fail-closed and not fixed", () => {
    const liveResult = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(liveResult.metrics.estimatedRwDb).toBe(41);
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("multileaf_screening_blend");
    expect(liveResult.dynamicAirborneTrace?.confidenceClass).toBe("low");
    expect(COMMON_STACK_WATCHLIST[0]).toMatchObject({
      currentKnownPosture:
        "live grouped input still returns low-confidence multileaf_screening_blend Rw 41 and must not be called fixed",
      id: "split_rockwool_grouped_triple_leaf",
      sourceLanePosture: "paused_waiting_rights_safe_source_packet"
    });
  });

  it("pins flat-list route-family flip snapshots for common lightweight and heavy wall stacks", () => {
    const classicBase = wallSnapshot(CLASSIC_TRIPLE_LEAF_STACK);
    const classicSwapped = wallSnapshot(swapInnerLeaf(CLASSIC_TRIPLE_LEAF_STACK));
    const heavyBase = wallSnapshot(HEAVY_MULTILEAF_STACK);
    const heavySwapped = wallSnapshot(swapInnerLeaf(HEAVY_MULTILEAF_STACK));

    expect({
      confidence: classicBase.confidence,
      dnTw: classicBase.dnTw,
      family: classicBase.family,
      rw: classicBase.rw,
      rwPrime: classicBase.rwPrime,
      strategy: classicBase.strategy
    }).toEqual({
      confidence: "low",
      dnTw: 31,
      family: "multileaf_multicavity",
      rw: 32,
      rwPrime: 30,
      strategy: "multileaf_screening_blend"
    });
    expect({
      confidence: classicSwapped.confidence,
      dnTw: classicSwapped.dnTw,
      family: classicSwapped.family,
      rw: classicSwapped.rw,
      rwPrime: classicSwapped.rwPrime,
      strategy: classicSwapped.strategy
    }).toEqual({
      confidence: "low",
      dnTw: 33,
      family: "multileaf_multicavity",
      rw: 33,
      rwPrime: 31,
      strategy: "multileaf_screening_blend_fail_closed_until_grouped_topology"
    });
    expect(classicSwapped.rw - classicBase.rw).toBeLessThanOrEqual(1);
    expect(classicSwapped.warningText).toContain("Flat-list adjacent-swap sensitivity guard");

    expect({
      confidence: heavyBase.confidence,
      dnTw: heavyBase.dnTw,
      family: heavyBase.family,
      rw: heavyBase.rw,
      rwPrime: heavyBase.rwPrime,
      strategy: heavyBase.strategy
    }).toEqual({
      confidence: "low",
      dnTw: 39,
      family: "multileaf_multicavity",
      rw: 39,
      rwPrime: 37,
      strategy: "multileaf_screening_blend"
    });
    expect({
      confidence: heavySwapped.confidence,
      dnTw: heavySwapped.dnTw,
      family: heavySwapped.family,
      rw: heavySwapped.rw,
      rwPrime: heavySwapped.rwPrime,
      strategy: heavySwapped.strategy
    }).toEqual({
      confidence: "low",
      dnTw: 48,
      family: "lined_massive_wall",
      rw: 49,
      rwPrime: 47,
      strategy: "lined_massive_blend+reinforcement_monotonic_floor+family_boundary_hold"
    });
    expect(heavySwapped.warningText).toContain("family-boundary hold");
  });

  it("pins known raw-floor inference parity while keeping ambiguous raw role order on the watchlist", () => {
    const raw = floorSnapshot(RAW_FLOOR_STACK);
    const tagged = floorSnapshot(TAGGED_FLOOR_STACK);

    expect(withoutRawFloorParityGuardWarning(raw)).toEqual(tagged);
    expect(raw.warnings.some((warning) => /does not claim arbitrary raw floor reorder value invariance/i.test(warning))).toBe(true);
    expect(tagged.warnings.some((warning) => /does not claim arbitrary raw floor reorder value invariance/i.test(warning))).toBe(false);
    expect(raw.floorSystemMatchId).toBe("dataholz_gdmtxn01_dry_clt_lab_2026");
    expect(raw.impactBasis).toBe("official_floor_system_exact_match");
    expect(raw.lnW).toBe(50);
    expect(raw.rw).toBe(62);
    expect(COMMON_STACK_WATCHLIST.find((item) => item.id === "raw_floor_without_role_tags")).toMatchObject({
      currentKnownPosture: "raw inference has parity tests for known rows but remains a deliberate risk for ambiguous order",
      runtimeBehaviorChange: false
    });
  });

  it("keeps hostile API/import input guarded before route or value selection", () => {
    const unknown = calculateAssembly([{ materialId: "unobtainium", thicknessMm: 100 }], {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC"]
    });
    const invalid = calculateAssembly([{ materialId: "gypsum_board", thicknessMm: Number.POSITIVE_INFINITY }], {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC"]
    });

    expect(unknown.supportedTargetOutputs).toEqual([]);
    expect(unknown.warnings.some((warning: string) => /unknown material/i.test(warning))).toBe(true);
    expect(invalid.supportedTargetOutputs).toEqual([]);
    expect(invalid.warnings.some((warning: string) => /invalid thickness/i.test(warning))).toBe(true);
  });

  it("requires note/test/document/easy-fix triage before any future runtime or visible movement", () => {
    expect(STANDING_LANE_MISCLASSIFICATION_MONITORING_MANDATE).toEqual({
      actionWhenSuspicious: "note_test_document_or_easy_fix",
      requiredEveryCalculatorSlice: true,
      token: "standing_lane_misclassification_monitoring_mandate",
      watchlistFamilies: [
        "flat_list_route_family_flip",
        "duplicate_or_many_layer_stack_drift",
        "masonry_lined_massive_boundary_drift",
        "raw_floor_role_inference",
        "near_source_false_promotion",
        "field_output_leakage",
        "material_alias_coalescing",
        "hostile_api_input",
        "curve_digitization_provenance"
      ]
    });
    expect(COMMON_STACK_WATCHLIST.every((item) => item.protectedBoundaries.length >= 2)).toBe(true);
    expect(COMMON_STACK_WATCHLIST.every((item) => item.gateBProbeId.startsWith("gate_b_"))).toBe(true);
  });

  it("keeps active docs aligned on Gate A landing and Gate B selection", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_A.sliceId);
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_A.thisGateFile);
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_A.selectedNextFile);
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_A.selectedNextStatus);
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_A.selectedNextAction);
      expect(doc).toContain("standing_lane_misclassification_monitoring_mandate");
      expect(doc).toContain("note_test_document_or_easy_fix");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("multileaf_screening_blend");
      expect(doc).toContain("Rw 41");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
