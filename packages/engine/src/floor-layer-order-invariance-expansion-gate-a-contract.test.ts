import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type FloorOrderValues = {
  ctr: number | null;
  deltaLw: number | null;
  dnA: number | null;
  dnTA: number | null;
  dnTw: number | null;
  dnW: number | null;
  lPrimeNT50: number | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  lnW: number | null;
  lnWPlusCI: number | null;
  rw: number | null;
  rwDb: number | null;
  rwPrimeDb: number | null;
};

type FloorOrderSnapshot = {
  boundId: string | null;
  candidateIds: readonly string[] | null;
  estimateKind: string | null;
  impactBasis: string | null;
  lowerBoundBasis: string | null;
  matchId: string | null;
  ratingsBasis: string | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
  values: FloorOrderValues;
};

type ExactOrderCase = {
  expected: FloorOrderSnapshot;
  id: string;
  layers: readonly LayerInput[];
};

type OrderVariant = {
  id: string;
  layers: readonly LayerInput[];
};

const TARGET_OUTPUTS = [
  "Rw",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "Ln,w",
  "Ln,w+CI",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

const BUILDING_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const BUILDING_IMPACT_CONTEXT: ImpactFieldContext = {
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
};

const FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_GATE_A = {
  activeSlice: "floor_layer_order_invariance_expansion_v1",
  gateBRequired: false,
  landedGate: "gate_a_role_defined_vs_raw_order_invariance_inventory_no_runtime",
  numericRuntimeBehaviorChange: false,
  selectedNextAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
  selectedNextContract:
    "packages/engine/src/post-floor-layer-order-invariance-expansion-v1-next-slice-selection-contract.test.ts",
  selectedReason:
    "expanded_reorder_inventory_found_no_crash_non_finite_exact_precedence_drift_unsupported_leak_or_hidden_raw_support_change",
  visibleRouteCardMovement: false
} as const;

const WEB_ROUTE_CARD_REQUIREMENTS = [
  {
    id: "existing_representative_floor_order_card_matrix",
    requiredBeforeVisibleMovement: true,
    targetFile: "apps/web/features/workbench/floor-layer-order-edit-stability-gate-a-card-matrix.test.ts",
    trigger:
      "reuse_as_existing_visible_card_guard_for_representative_exact_raw_and_fail_closed_floor_order_postures"
  },
  {
    id: "expanded_floor_order_card_matrix",
    requiredBeforeVisibleMovement: true,
    targetFile: "apps/web/features/workbench/floor-layer-order-invariance-expansion-gate-a-card-matrix.test.ts",
    trigger:
      "add_before_any_gate_b_support_confidence_evidence_warning_or_value_movement_from_this_expanded_inventory"
  }
] as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "claim_broad_arbitrary_floor_layer_order_value_invariance",
    "normalize_raw_order_inferred_floor_stacks_as_if_all_orders_are_physical_equivalents",
    "change_runtime_values_support_confidence_evidence_or_warnings_in_gate_a",
    "reopen_source_blocked_floor_fallback_wall_holdouts_or_historical_closed_source_families_from_green_reorder_tests",
    "add_visible_route_card_movement_without_a_paired_web_route_card_matrix"
  ],
  allowedFindings: [
    "role_defined_exact_rows_must_keep_exact_precedence_under_common_ui_order_edits",
    "raw_order_inferred_rows_may_change_support_buckets_when_the_physical_terminal_helper_order_changes",
    "fail_closed_impact_rows_must_keep_unsupported_outputs_explicit_after_reorder",
    "many_layer_split_raw_rows_must_stay_finite_and_explicit_without_fabricating_exact_or_bound_matches"
  ]
} as const;

function moveLastToFirst<T>(items: readonly T[]): T[] {
  return [items[items.length - 1]!, ...items.slice(0, -1)];
}

function rotateLeft<T>(items: readonly T[]): T[] {
  return [...items.slice(1), items[0]!];
}

function groupedByFloorRole(layers: readonly LayerInput[]): LayerInput[] {
  const roleOrder = new Map<string, number>([
    ["base_structure", 0],
    ["floor_covering", 1],
    ["floating_screed", 2],
    ["upper_fill", 3],
    ["resilient_layer", 4],
    ["ceiling_cavity", 5],
    ["ceiling_fill", 6],
    ["ceiling_board", 7]
  ]);

  return [...layers].sort((left, right) => {
    const leftRank = roleOrder.get(left.floorRole ?? "") ?? Number.MAX_SAFE_INTEGER;
    const rightRank = roleOrder.get(right.floorRole ?? "") ?? Number.MAX_SAFE_INTEGER;

    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }

    const materialComparison = left.materialId.localeCompare(right.materialId);
    if (materialComparison !== 0) {
      return materialComparison;
    }

    return left.thicknessMm - right.thicknessMm;
  });
}

function interleavedOuterToInner<T>(items: readonly T[]): T[] {
  const result: T[] = [];
  let left = 0;
  let right = items.length - 1;

  while (left <= right) {
    result.push(items[right]!);
    right -= 1;

    if (left <= right) {
      result.push(items[left]!);
      left += 1;
    }
  }

  return result;
}

function roundOne(value: number | undefined): number | null {
  if (typeof value !== "number") {
    return null;
  }

  return Math.round(value * 10) / 10;
}

function supportedCtrValue(result: ReturnType<typeof calculateAssembly>): number | null {
  if (!result.supportedTargetOutputs.includes("Ctr")) {
    return null;
  }

  if (typeof result.floorSystemRatings?.RwCtr === "number" && typeof result.floorSystemRatings.Rw === "number") {
    return roundOne(result.floorSystemRatings.RwCtr - result.floorSystemRatings.Rw);
  }

  return roundOne(result.metrics.estimatedCtrDb);
}

function snapshot(layers: readonly LayerInput[]): FloorOrderSnapshot {
  const result = calculateAssembly(layers, {
    airborneContext: BUILDING_CONTEXT,
    impactFieldContext: BUILDING_IMPACT_CONTEXT,
    targetOutputs: TARGET_OUTPUTS
  });

  return {
    boundId: result.boundFloorSystemMatch?.system.id ?? null,
    candidateIds: result.impact?.estimateCandidateIds ?? result.floorSystemEstimate?.candidateIds ?? null,
    estimateKind: result.floorSystemEstimate?.kind ?? null,
    impactBasis: result.impact?.basis ?? null,
    lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
    matchId: result.floorSystemMatch?.system.id ?? null,
    ratingsBasis: result.floorSystemRatings?.basis ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs,
    values: {
      ctr: supportedCtrValue(result),
      deltaLw: result.impact?.DeltaLw ?? result.lowerBoundImpact?.DeltaLwLowerBound ?? null,
      dnA: result.metrics.estimatedDnADb ?? null,
      dnTA: result.metrics.estimatedDnTADb ?? null,
      dnTw: result.metrics.estimatedDnTwDb ?? null,
      dnW: result.metrics.estimatedDnWDb ?? null,
      lPrimeNT50: result.impact?.LPrimeNT50 ?? result.lowerBoundImpact?.LPrimeNT50UpperBound ?? null,
      lPrimeNTw: result.impact?.LPrimeNTw ?? result.lowerBoundImpact?.LPrimeNTwUpperBound ?? null,
      lPrimeNW: result.impact?.LPrimeNW ?? result.lowerBoundImpact?.LPrimeNWUpperBound ?? null,
      lnW: result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound ?? null,
      lnWPlusCI: result.impact?.LnWPlusCI ?? result.lowerBoundImpact?.LnWPlusCIUpperBound ?? null,
      rw: result.floorSystemRatings?.Rw ?? null,
      rwDb: result.metrics.estimatedRwDb ?? null,
      rwPrimeDb: result.metrics.estimatedRwPrimeDb ?? null
    }
  };
}

function expectSupportPartition(id: string, actual: FloorOrderSnapshot): void {
  const seen = [...actual.supported, ...actual.unsupported].sort();

  expect(seen, `${id}: supported + unsupported must partition target outputs`).toEqual([...TARGET_OUTPUTS].sort());
  expect(new Set(seen).size, `${id}: output buckets must not contain duplicates`).toBe(TARGET_OUTPUTS.length);
}

function expectFiniteLiveValues(id: string, actual: FloorOrderSnapshot): void {
  for (const [metric, value] of Object.entries(actual.values)) {
    expect(value === null || Number.isFinite(value), `${id}: ${metric} must be null or finite`).toBe(true);
  }
}

function makeUbiqExactLayers(): LayerInput[] {
  return [
    { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
    { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
    { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
    { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
    { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
    { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
    { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
    { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 200 }
  ];
}

function makeDataholzExactLayers(): LayerInput[] {
  return [
    { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
    { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: 60 },
    { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s40", thicknessMm: 30 },
    { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
  ];
}

function makeRawTerminalConcreteHelperLayers(): LayerInput[] {
  return [
    { materialId: "gypsum_board", thicknessMm: 13 },
    { materialId: "rockwool", thicknessMm: 90 },
    { materialId: "furring_channel", thicknessMm: 28 },
    { materialId: "concrete", thicknessMm: 150 }
  ];
}

function makeRawOpenWebImpactBlockedLayers(): LayerInput[] {
  return [
    { materialId: "gypsum_board", thicknessMm: 13 },
    { materialId: "rockwool", thicknessMm: 90 },
    { materialId: "furring_channel", thicknessMm: 28 },
    { materialId: "open_web_steel_floor", thicknessMm: 300 }
  ];
}

function makeManyLayerSplitRawConcreteLayers(): LayerInput[] {
  return [
    { materialId: "gypsum_board", thicknessMm: 13 },
    { materialId: "gypsum_board", thicknessMm: 13 },
    { materialId: "rockwool", thicknessMm: 45 },
    { materialId: "rockwool", thicknessMm: 45 },
    { materialId: "furring_channel", thicknessMm: 14 },
    { materialId: "furring_channel", thicknessMm: 14 },
    { materialId: "concrete", thicknessMm: 75 },
    { materialId: "concrete", thicknessMm: 75 }
  ];
}

const UBIQ_EXACT_EXPECTED: FloorOrderSnapshot = {
  boundId: null,
  candidateIds: null,
  estimateKind: null,
  impactBasis: "mixed_exact_plus_estimated_local_guide",
  lowerBoundBasis: null,
  matchId: "ubiq_fl28_open_web_steel_200_exact_lab_2026",
  ratingsBasis: "official_floor_system_exact_match",
  supported: [
    "Rw",
    "R'w",
    "Dn,w",
    "Dn,A",
    "DnT,w",
    "DnT,A",
    "Ln,w",
    "Ln,w+CI",
    "L'n,w",
    "L'nT,w",
    "L'nT,50",
    "Ctr"
  ],
  unsupported: ["DeltaLw"],
  values: {
    ctr: -6,
    deltaLw: null,
    dnA: 66,
    dnTA: 68.5,
    dnTw: 70,
    dnW: 67,
    lPrimeNT50: 52,
    lPrimeNTw: 52.2,
    lPrimeNW: 55,
    lnW: 52,
    lnWPlusCI: 51,
    rw: 63,
    rwDb: 68.7,
    rwPrimeDb: 68
  }
};

const DATAHOLZ_EXACT_EXPECTED: FloorOrderSnapshot = {
  boundId: null,
  candidateIds: null,
  estimateKind: null,
  impactBasis: "mixed_exact_plus_estimated_local_guide",
  lowerBoundBasis: null,
  matchId: "dataholz_gdmtxn01_dry_clt_lab_2026",
  ratingsBasis: "official_floor_system_exact_match",
  supported: [
    "Rw",
    "R'w",
    "Dn,w",
    "Dn,A",
    "DnT,w",
    "DnT,A",
    "Ln,w",
    "Ln,w+CI",
    "L'n,w",
    "L'nT,w",
    "L'nT,50"
  ],
  unsupported: ["DeltaLw", "Ctr"],
  values: {
    ctr: null,
    deltaLw: null,
    dnA: 43.7,
    dnTA: 46.2,
    dnTw: 47,
    dnW: 45,
    lPrimeNT50: 50,
    lPrimeNTw: 50.2,
    lPrimeNW: 53,
    lnW: 50,
    lnWPlusCI: 49,
    rw: 62,
    rwDb: 45.5,
    rwPrimeDb: 46
  }
};

const RAW_CONCRETE_BASELINE_EXPECTED: FloorOrderSnapshot = {
  boundId: null,
  candidateIds: null,
  estimateKind: null,
  impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
  lowerBoundBasis: null,
  matchId: null,
  ratingsBasis: "screening_mass_law_curve_seed_v3",
  supported: ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "L'n,w", "L'nT,w", "Ctr"],
  unsupported: ["Ln,w+CI", "DeltaLw", "L'nT,50"],
  values: {
    ctr: -5.9,
    deltaLw: null,
    dnA: 52.8,
    dnTA: 55.3,
    dnTw: 56,
    dnW: 54,
    lPrimeNT50: null,
    lPrimeNTw: 74.3,
    lPrimeNW: 77.1,
    lnW: 74.1,
    lnWPlusCI: null,
    rw: 55,
    rwDb: 55.4,
    rwPrimeDb: 55
  }
};

const RAW_CONCRETE_BASE_FIRST_EXPECTED: FloorOrderSnapshot = {
  ...RAW_CONCRETE_BASELINE_EXPECTED,
  supported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "L'n,w", "L'nT,w", "Ctr"],
  unsupported: ["Rw", "Ln,w+CI", "DeltaLw", "L'nT,50"],
  values: {
    ...RAW_CONCRETE_BASELINE_EXPECTED.values,
    lPrimeNTw: 74.7,
    lPrimeNW: 77.5,
    lnW: 74.5
  }
};

const RAW_OPEN_WEB_BLOCKED_EXPECTED: FloorOrderSnapshot = {
  boundId: null,
  candidateIds: null,
  estimateKind: null,
  impactBasis: null,
  lowerBoundBasis: null,
  matchId: null,
  ratingsBasis: "screening_mass_law_curve_seed_v3",
  supported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ctr"],
  unsupported: ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
  values: {
    ctr: -5.7,
    deltaLw: null,
    dnA: 69,
    dnTA: 71.5,
    dnTw: 73,
    dnW: 70,
    lPrimeNT50: null,
    lPrimeNTw: null,
    lPrimeNW: null,
    lnW: null,
    lnWPlusCI: null,
    rw: 71,
    rwDb: 71.6,
    rwPrimeDb: 71
  }
};

const EXACT_ORDER_CASES: readonly ExactOrderCase[] = [
  {
    id: "ubiq_fl28_open_web_role_defined_exact",
    layers: makeUbiqExactLayers(),
    expected: UBIQ_EXACT_EXPECTED
  },
  {
    id: "dataholz_gdmtxn01_dry_clt_role_defined_exact",
    layers: makeDataholzExactLayers(),
    expected: DATAHOLZ_EXACT_EXPECTED
  }
];

describe("floor layer-order invariance expansion Gate A contract", () => {
  it("lands the no-runtime Gate A inventory and selects Gate C closeout", () => {
    expect(FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_GATE_A).toEqual({
      activeSlice: "floor_layer_order_invariance_expansion_v1",
      gateBRequired: false,
      landedGate: "gate_a_role_defined_vs_raw_order_invariance_inventory_no_runtime",
      numericRuntimeBehaviorChange: false,
      selectedNextAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
      selectedNextContract:
        "packages/engine/src/post-floor-layer-order-invariance-expansion-v1-next-slice-selection-contract.test.ts",
      selectedReason:
        "expanded_reorder_inventory_found_no_crash_non_finite_exact_precedence_drift_unsupported_leak_or_hidden_raw_support_change",
      visibleRouteCardMovement: false
    });

    for (const path of [
      "docs/calculator/SLICE_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_PLAN.md",
      "docs/calculator/CHECKPOINT_2026-04-28_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_GATE_A_HANDOFF.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("preserves role-defined exact floor rows under expanded UI order edits", () => {
    for (const exactCase of EXACT_ORDER_CASES) {
      const variants: readonly OrderVariant[] = [
        { id: "baseline", layers: exactCase.layers },
        { id: "reverse", layers: [...exactCase.layers].reverse() },
        { id: "rotate_left", layers: rotateLeft(exactCase.layers) },
        { id: "base_first", layers: moveLastToFirst(exactCase.layers) },
        { id: "grouped_by_floor_role", layers: groupedByFloorRole(exactCase.layers) },
        { id: "interleaved_outer_to_inner", layers: interleavedOuterToInner(exactCase.layers) }
      ];

      for (const variant of variants) {
        const actual = snapshot(variant.layers);

        expect(actual, `${exactCase.id}/${variant.id}`).toEqual(exactCase.expected);
        expectSupportPartition(`${exactCase.id}/${variant.id}`, actual);
        expectFiniteLiveValues(`${exactCase.id}/${variant.id}`, actual);
      }
    }
  });

  it("keeps raw terminal/helper order sensitivity explicit instead of fabricating invariance", () => {
    const rawConcreteLayers = makeRawTerminalConcreteHelperLayers();
    const knownVariants: readonly OrderVariant[] = [
      { id: "baseline_terminal_concrete", layers: rawConcreteLayers },
      { id: "base_structure_moved_first", layers: moveLastToFirst(rawConcreteLayers) },
      { id: "reversed_order", layers: [...rawConcreteLayers].reverse() }
    ];

    expect(snapshot(knownVariants[0]!.layers)).toEqual(RAW_CONCRETE_BASELINE_EXPECTED);
    expect(snapshot(knownVariants[1]!.layers)).toEqual(RAW_CONCRETE_BASE_FIRST_EXPECTED);
    expect(snapshot(knownVariants[2]!.layers)).toEqual(RAW_CONCRETE_BASE_FIRST_EXPECTED);

    for (const variant of [
      ...knownVariants,
      { id: "rotated_raw_helper", layers: rotateLeft(rawConcreteLayers) }
    ] as const) {
      const actual = snapshot(variant.layers);

      expect(actual.matchId, variant.id).toBeNull();
      expect(actual.boundId, variant.id).toBeNull();
      expect(actual.ratingsBasis, variant.id).toBe("screening_mass_law_curve_seed_v3");
      expectSupportPartition(variant.id, actual);
      expectFiniteLiveValues(variant.id, actual);
    }

    expect(snapshot(moveLastToFirst(rawConcreteLayers)).supported).not.toEqual(snapshot(rawConcreteLayers).supported);
    expect(snapshot(moveLastToFirst(rawConcreteLayers)).unsupported).toContain("Rw");
  });

  it("keeps raw open-web impact representatives fail-closed after reorder", () => {
    const rawOpenWebLayers = makeRawOpenWebImpactBlockedLayers();
    const variants: readonly OrderVariant[] = [
      { id: "baseline", layers: rawOpenWebLayers },
      { id: "base_structure_moved_first", layers: moveLastToFirst(rawOpenWebLayers) },
      { id: "reversed_order", layers: [...rawOpenWebLayers].reverse() },
      { id: "rotated_order", layers: rotateLeft(rawOpenWebLayers) }
    ];

    for (const variant of variants) {
      const actual = snapshot(variant.layers);

      expect(actual, variant.id).toEqual(RAW_OPEN_WEB_BLOCKED_EXPECTED);
      expect(actual.unsupported).toEqual(
        expect.arrayContaining(["Rw", "Ln,w", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"])
      );
      expect(actual.values.lnW, variant.id).toBeNull();
      expect(actual.values.lPrimeNW, variant.id).toBeNull();
      expectSupportPartition(`raw_open_web/${variant.id}`, actual);
      expectFiniteLiveValues(`raw_open_web/${variant.id}`, actual);
    }
  });

  it("keeps many-layer split raw floor stacks finite without exact or bound promotion", () => {
    const manyLayerSplit = makeManyLayerSplitRawConcreteLayers();
    const variants: readonly OrderVariant[] = [
      { id: "baseline_split_terminal_concrete", layers: manyLayerSplit },
      { id: "reverse_split_order", layers: [...manyLayerSplit].reverse() },
      { id: "rotate_split_order", layers: rotateLeft(manyLayerSplit) },
      { id: "interleaved_split_order", layers: interleavedOuterToInner(manyLayerSplit) }
    ];

    for (const variant of variants) {
      const actual = snapshot(variant.layers);

      expect(actual.matchId, variant.id).toBeNull();
      expect(actual.boundId, variant.id).toBeNull();
      expect(actual.supported.length, variant.id).toBeGreaterThan(0);
      expectSupportPartition(`many_layer/${variant.id}`, actual);
      expectFiniteLiveValues(`many_layer/${variant.id}`, actual);
    }
  });

  it("records card-test requirements and keeps broad-order/source-family boundaries closed", () => {
    expect(WEB_ROUTE_CARD_REQUIREMENTS).toEqual([
      {
        id: "existing_representative_floor_order_card_matrix",
        requiredBeforeVisibleMovement: true,
        targetFile: "apps/web/features/workbench/floor-layer-order-edit-stability-gate-a-card-matrix.test.ts",
        trigger:
          "reuse_as_existing_visible_card_guard_for_representative_exact_raw_and_fail_closed_floor_order_postures"
      },
      {
        id: "expanded_floor_order_card_matrix",
        requiredBeforeVisibleMovement: true,
        targetFile: "apps/web/features/workbench/floor-layer-order-invariance-expansion-gate-a-card-matrix.test.ts",
        trigger:
          "add_before_any_gate_b_support_confidence_evidence_warning_or_value_movement_from_this_expanded_inventory"
      }
    ]);

    expect(existsSync(join(REPO_ROOT, WEB_ROUTE_CARD_REQUIREMENTS[0]!.targetFile))).toBe(true);
    expect(existsSync(join(REPO_ROOT, WEB_ROUTE_CARD_REQUIREMENTS[1]!.targetFile))).toBe(false);
    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "claim_broad_arbitrary_floor_layer_order_value_invariance",
      "normalize_raw_order_inferred_floor_stacks_as_if_all_orders_are_physical_equivalents",
      "change_runtime_values_support_confidence_evidence_or_warnings_in_gate_a",
      "reopen_source_blocked_floor_fallback_wall_holdouts_or_historical_closed_source_families_from_green_reorder_tests",
      "add_visible_route_card_movement_without_a_paired_web_route_card_matrix"
    ]);
    expect(ACTIVE_BOUNDARIES.allowedFindings).toEqual([
      "role_defined_exact_rows_must_keep_exact_precedence_under_common_ui_order_edits",
      "raw_order_inferred_rows_may_change_support_buckets_when_the_physical_terminal_helper_order_changes",
      "fail_closed_impact_rows_must_keep_unsupported_outputs_explicit_after_reorder",
      "many_layer_split_raw_rows_must_stay_finite_and_explicit_without_fabricating_exact_or_bound_matches"
    ]);
  });
});
