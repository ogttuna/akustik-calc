import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { FLAT_LIST_MULTILEAF_GUARD_STRATEGY } from "./dynamic-airborne-flat-list-multileaf-guard";
import { buildFloorTestLayersFromCriteria } from "./floor-system-test-layer-builders";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_pin_company_internal_frequent_combination_lane_snapshot_matrix_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_b_add_company_internal_visible_route_output_snapshot_guard_no_runtime",
  selectedNextFile: "apps/web/features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts",
  selectedNextStatus: "company_internal_frequent_combination_snapshot_matrix_landed_no_runtime_selected_visible_gate_b",
  selectedPlanningSurface: "docs/calculator/SLICE_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_PLAN.md",
  sliceId: "company_internal_frequent_combination_lane_snapshot_guard_v1",
  supportPromotion: false,
  thisGateFile:
    "packages/engine/src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts",
  warningCopyChange: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_A_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V21_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_A_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
] as const;

const REQUIRED_GATE_A_DOC_TOKENS = [
  COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_A.selectedNextAction,
  COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_A.selectedNextFile,
  COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_A.selectedNextStatus,
  "company_internal_frequent_combination_snapshot_matrix",
  "rockwool_triple_leaf_screening_and_flat_swap_negative_rows",
  "near_source_alias_and_hostile_input_negative_rows",
  "field_outputs_never_design_grade_without_owner",
  "multileaf_screening_blend_fail_closed_until_grouped_topology",
  "note_test_document_or_easy_fix",
  "paused_waiting_rights_safe_source_packet",
  "standing_lane_misclassification_monitoring_mandate"
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

const SIMPLE_STUD_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
  connectionType: "line_connection",
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
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
] as const;

const CLASSIC_TRIPLE_LEAF_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const HEAVY_MULTILEAF_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 25 },
  { materialId: "ytong_aac_d700", thicknessMm: 100 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "diamond_board", thicknessMm: 12.5 }
] as const;

const ORDINARY_DOUBLE_LEAF_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const SIMPLE_STUD_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const NEAR_SOURCE_ALIAS_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum", thicknessMm: 12.5 },
  { materialId: "firestop_board", thicknessMm: 15 }
] as const;

const COMPANY_INTERNAL_FREQUENT_COMBINATION_SNAPSHOT_MATRIX = [
  {
    action: "keep_screening_until_source_packet_grouped_topology_material_mapping_tolerance_and_visible_tests_exist",
    confidence: "low",
    family: "multileaf_multicavity",
    id: "rockwool_grouped_triple_leaf_screening",
    sourceOrOrigin: "Uris 2006 paused_waiting_rights_safe_source_packet; NRC-like rows are not local-runtime ready",
    strategy: "multileaf_screening_blend",
    support: ["Rw", "STC", "R'w", "DnT,w"],
    visiblePosture: "must say screening, exact değil",
    warnings: ["rockwool Rw 41 remains not fixed"]
  },
  {
    action: "pin_flat_list_adjacent_swap_guard_and_do_not_reclassify_as_exact",
    confidence: "low",
    family: "multileaf_multicavity",
    id: "rockwool_flat_adjacent_swap_fail_closed",
    sourceOrOrigin: "flat-list topology ambiguity",
    strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
    support: ["Rw", "STC", "R'w", "DnT,w"],
    visiblePosture: "route card must expose fail-closed grouped-topology need",
    warnings: ["Flat-list adjacent-swap sensitivity guard"]
  },
  {
    action: "protect_double_leaf_negative_boundary",
    confidence: "medium",
    family: "double_leaf",
    id: "ordinary_double_leaf_negative_boundary",
    sourceOrOrigin: "formula-owned ordinary double-leaf route",
    strategy: "double_leaf_porous_fill_delegate",
    support: ["Rw", "STC"],
    visiblePosture: "not a triple-leaf fix",
    warnings: []
  },
  {
    action: "protect_simple_stud_negative_boundary",
    confidence: "low",
    family: "stud_wall_system",
    id: "simple_stud_negative_boundary",
    sourceOrOrigin: "formula-owned steel-stud surrogate",
    strategy: "stud_surrogate_blend+framed_wall_calibration",
    support: ["Rw", "STC"],
    visiblePosture: "not a triple-leaf fix",
    warnings: []
  },
  {
    action: "keep_classic_triple_leaf_swap_low_confidence_and_warning_backed",
    confidence: "low",
    family: "multileaf_multicavity",
    id: "classic_framed_swap_fail_closed",
    sourceOrOrigin: "flat-list topology ambiguity",
    strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
    support: ["Rw", "STC", "R'w", "DnT,w"],
    visiblePosture: "route card must expose fail-closed grouped-topology need",
    warnings: ["Flat-list adjacent-swap sensitivity guard"]
  },
  {
    action: "document_boundary_hold_before_any_retune",
    confidence: "low",
    family: "lined_massive_wall",
    id: "masonry_lined_massive_boundary_hold",
    sourceOrOrigin: "AAC / board / fill / gap family-boundary risk",
    strategy: "lined_massive_blend+reinforcement_monotonic_floor+family_boundary_hold",
    support: ["Rw", "STC", "R'w", "DnT,w"],
    visiblePosture: "must not look exact just because finite",
    warnings: ["family-boundary hold"]
  },
  {
    action: "watch_many_layer_finite_drift_without_value_promotion",
    confidence: "low",
    family: "multileaf_multicavity",
    id: "duplicate_many_layer_stack_watch",
    sourceOrOrigin: "user can duplicate layers; finite is not enough for trust",
    strategy: "multileaf_screening_blend",
    support: ["Rw", "STC"],
    visiblePosture: "document if drift becomes implausible; fix if bounded",
    warnings: []
  },
  {
    action: "keep_exact_floor_row_but_retain_no_arbitrary_reorder_warning",
    confidence: "exact_floor_catalog",
    family: "floor_exact_open_box",
    id: "raw_floor_open_box_exact_with_reorder_warning",
    sourceOrOrigin: "tuas_r5b_open_box_timber_measured_2026",
    strategy: "open_measured_floor_system_exact_match",
    support: ["Rw", "Ln,w", "Ln,w+CI"],
    visiblePosture: "exact row only inside owned role/match envelope",
    warnings: ["does not claim arbitrary raw floor reorder value invariance"]
  },
  {
    action: "prompt_for_floor_roles_before_impact_outputs",
    confidence: "role_prompt",
    family: "raw_floor_ambiguous",
    id: "raw_floor_clt_role_prompt",
    sourceOrOrigin: "tuas_x4_clt140_measured_2026 raw layer order without roles",
    strategy: "floor_roles_needed_before_impact_output_promotion",
    support: ["Rw"],
    visiblePosture: "must ask for roles instead of estimating impact exactly",
    warnings: ["Floor roles needed before impact output promotion"]
  },
  {
    action: "keep_near_source_names_context_only_until_mapping_tolerance_owner_exists",
    confidence: "medium",
    family: "laminated_single_leaf",
    id: "near_source_alias_context_only",
    sourceOrOrigin: "generic gypsum / Type C-like / MLV-plaster alias risk",
    strategy: "laminated_leaf_sharp_delegate",
    support: ["Rw", "STC"],
    visiblePosture: "near-source must not promote to Knauf/BG/NRC exact",
    warnings: ["near-source context only"]
  },
  {
    action: "fail_closed_with_no_supported_outputs",
    confidence: "not_supported",
    family: "invalid_input",
    id: "hostile_unknown_material_fail_closed",
    sourceOrOrigin: "API/import can bypass UI normalization",
    strategy: "input_validation_guard",
    support: [],
    visiblePosture: "show missing/invalid input, not a numeric estimate",
    warnings: ["unknown material"]
  },
  {
    action: "fail_closed_with_no_supported_outputs",
    confidence: "not_supported",
    family: "invalid_input",
    id: "hostile_infinite_thickness_fail_closed",
    sourceOrOrigin: "API/import can bypass UI normalization",
    strategy: "input_validation_guard",
    support: [],
    visiblePosture: "show missing/invalid input, not a numeric estimate",
    warnings: ["invalid thickness"]
  },
  {
    action: "keep_field_outputs_as_building_prediction_screening_without_design_grade_owner",
    confidence: "low",
    family: "multileaf_multicavity",
    id: "field_output_screening_continuation",
    sourceOrOrigin: "lab/screening base with field-side overlay only",
    strategy: "multileaf_screening_blend",
    support: ["R'w", "DnT,w"],
    visiblePosture: "field_outputs_never_design_grade_without_owner",
    warnings: ["building prediction", "confidence is low"]
  }
] as const;

function readRepoFile(relativePath: string): string {
  return readFileSync(join(REPO_ROOT, relativePath), "utf8");
}

function swapAdjacent(layers: readonly LayerInput[], firstIndex: number): LayerInput[] {
  const copy = layers.map((layer) => ({ ...layer }));
  [copy[firstIndex], copy[firstIndex + 1]] = [copy[firstIndex + 1], copy[firstIndex]];
  return copy;
}

function repeatedStack(layers: readonly LayerInput[], count: number): LayerInput[] {
  return Array.from({ length: count }, () => layers.map((layer) => ({ ...layer }))).flat();
}

function exactFloorSystem(id: string): (typeof EXACT_FLOOR_SYSTEMS)[number] {
  const system = EXACT_FLOOR_SYSTEMS.find((candidate) => candidate.id === id);
  if (!system) {
    throw new Error(`Missing exact floor fixture ${id}`);
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

describe("company internal frequent-combination lane snapshot guard Gate A", () => {
  it("lands a no-runtime Gate A contract and keeps every visible/runtime surface frozen", () => {
    expect(COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_A).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_pin_company_internal_frequent_combination_lane_snapshot_matrix_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      supportPromotion: false,
      warningCopyChange: false,
      workbenchInputBehaviorChange: false
    });

    for (const relativePath of REQUIRED_GATE_A_DOCS) {
      expect(existsSync(join(REPO_ROOT, relativePath)), relativePath).toBe(true);
    }
  });

  it("pins rockwool triple-leaf grouped and flat-list swap rows as screening/fail-closed, not fixed", () => {
    const grouped = wallSnapshot(SPLIT_ROCKWOOL_STACK, GROUPED_SPLIT_ROCKWOOL_CONTEXT);
    const flat = wallSnapshot(SPLIT_ROCKWOOL_STACK);
    const flatSwap = wallSnapshot(swapAdjacent(SPLIT_ROCKWOOL_STACK, 3));

    expect(grouped).toMatchObject({
      confidence: "low",
      dnTw: 40,
      family: "multileaf_multicavity",
      rw: 41,
      rwPrime: 39,
      stc: 41,
      strategy: "multileaf_screening_blend"
    });
    expect(flat).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 41,
      rwPrime: 39,
      strategy: "multileaf_screening_blend"
    });
    expect(flatSwap).toMatchObject({
      confidence: "low",
      dnTw: 41,
      family: "multileaf_multicavity",
      rw: 42,
      rwPrime: 40,
      stc: 42,
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY
    });
    expect(flatSwap.rw - flat.rw).toBe(1);
    expect(flatSwap.warnings.join("\n")).toMatch(/Flat-list adjacent-swap sensitivity guard/i);
    expect(COMPANY_INTERNAL_FREQUENT_COMBINATION_SNAPSHOT_MATRIX).toContainEqual(
      expect.objectContaining({
        action: expect.stringContaining("keep_screening"),
        id: "rockwool_grouped_triple_leaf_screening",
        strategy: "multileaf_screening_blend"
      })
    );
  });

  it("pins ordinary double-leaf, simple stud, framed swap, and duplicate stack rows as negative boundaries", () => {
    const ordinaryDoubleLeaf = wallSnapshot(ORDINARY_DOUBLE_LEAF_STACK);
    const simpleStud = wallSnapshot(SIMPLE_STUD_STACK, SIMPLE_STUD_CONTEXT);
    const classicBase = wallSnapshot(CLASSIC_TRIPLE_LEAF_STACK);
    const classicSwap = wallSnapshot(swapAdjacent(CLASSIC_TRIPLE_LEAF_STACK, 1));
    const duplicateClassic = wallSnapshot(repeatedStack(CLASSIC_TRIPLE_LEAF_STACK, 2));

    expect(ordinaryDoubleLeaf).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 41,
      strategy: "double_leaf_porous_fill_delegate"
    });
    expect(simpleStud).toMatchObject({
      confidence: "low",
      family: "stud_wall_system",
      rw: 43,
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    });
    expect(classicBase).toMatchObject({
      confidence: "low",
      dnTw: 31,
      family: "multileaf_multicavity",
      rw: 32,
      rwPrime: 30,
      strategy: "multileaf_screening_blend"
    });
    expect(classicSwap).toMatchObject({
      confidence: "low",
      dnTw: 33,
      family: "multileaf_multicavity",
      rw: 33,
      rwPrime: 31,
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY
    });
    expect(classicSwap.rw - classicBase.rw).toBe(1);
    expect(classicSwap.warnings.join("\n")).toMatch(/Flat-list adjacent-swap sensitivity guard/i);
    expect(duplicateClassic).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 37,
      strategy: "multileaf_screening_blend"
    });
    expect(duplicateClassic.rw - classicBase.rw).toBe(5);
  });

  it("pins masonry / lined-massive boundary drift without smoothing it into exact-looking behavior", () => {
    const heavyBase = wallSnapshot(HEAVY_MULTILEAF_STACK);
    const heavySwap = wallSnapshot(swapAdjacent(HEAVY_MULTILEAF_STACK, 1));

    expect(heavyBase).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 39,
      rwPrime: 37,
      strategy: "multileaf_screening_blend"
    });
    expect(heavySwap).toMatchObject({
      confidence: "low",
      family: "lined_massive_wall",
      rw: 49,
      rwPrime: 47,
      strategy: "lined_massive_blend+reinforcement_monotonic_floor+family_boundary_hold"
    });
    expect(heavySwap.rw - heavyBase.rw).toBe(10);
    expect(heavySwap.warnings.join("\n")).toMatch(/family-boundary hold/i);
  });

  it("pins raw floor role inference, near-source alias, and hostile API/import fail-closed rows", () => {
    const exactOpenBox = floorSnapshot(exactFloorLayers("tuas_r5b_open_box_timber_measured_2026", "raw"));
    const ambiguousClt = floorSnapshot(exactFloorLayers("tuas_x4_clt140_measured_2026", "raw"));
    const nearSourceAlias = wallSnapshot(NEAR_SOURCE_ALIAS_STACK);
    const unknownMaterial = calculateAssembly([{ materialId: "__company_unknown_import", thicknessMm: 12.5 }], {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const infiniteThickness = calculateAssembly([{ materialId: "gypsum_board", thicknessMm: Infinity }], {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(exactOpenBox).toMatchObject({
      floorSystemMatchId: "tuas_r5b_open_box_timber_measured_2026",
      impactBasis: "open_measured_floor_system_exact_match",
      lnW: 44,
      rw: 75,
      supported: ["Rw", "Ln,w", "Ln,w+CI"]
    });
    expect(exactOpenBox.warnings.join("\n")).toMatch(/does not claim arbitrary raw floor reorder value invariance/i);

    expect(ambiguousClt).toMatchObject({
      floorSystemMatchId: null,
      impactBasis: null,
      supported: ["Rw"],
      unsupported: ["R'w", "DnT,w", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w"]
    });
    expect(ambiguousClt.warnings.join("\n")).toMatch(/Floor roles needed before impact output promotion/i);

    expect(nearSourceAlias).toMatchObject({
      confidence: "medium",
      family: "laminated_single_leaf",
      rw: 37,
      strategy: "laminated_leaf_sharp_delegate"
    });
    expect(unknownMaterial.supportedTargetOutputs).toEqual([]);
    expect(unknownMaterial.unsupportedTargetOutputs).toEqual(WALL_LAB_OUTPUTS);
    expect(unknownMaterial.warnings.join("\n")).toMatch(/unknown material/i);
    expect(infiniteThickness.supportedTargetOutputs).toEqual([]);
    expect(infiniteThickness.unsupportedTargetOutputs).toEqual(WALL_LAB_OUTPUTS);
    expect(infiniteThickness.warnings.join("\n")).toMatch(/invalid thickness/i);
  });

  it("pins field outputs as low-confidence building prediction continuations, not design-grade owners", () => {
    const field = calculateAssembly(CLASSIC_TRIPLE_LEAF_STACK, {
      airborneContext: WALL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });

    expect(field.supportedTargetOutputs).toEqual(WALL_FIELD_OUTPUTS);
    expect(field.dynamicAirborneTrace?.confidenceClass).toBe("low");
    expect(field.metrics.estimatedRwPrimeDb).toBe(30);
    expect(field.metrics.estimatedDnTwDb).toBe(31);
    expect(field.warnings.join("\n")).toMatch(/building prediction|field-side overlay|confidence is low/i);
  });

  it("defines the company-internal snapshot matrix and selects visible Gate B before any internal opening", () => {
    expect(COMPANY_INTERNAL_FREQUENT_COMBINATION_SNAPSHOT_MATRIX).toHaveLength(13);
    expect(new Set(COMPANY_INTERNAL_FREQUENT_COMBINATION_SNAPSHOT_MATRIX.map((row) => row.id)).size).toBe(
      COMPANY_INTERNAL_FREQUENT_COMBINATION_SNAPSHOT_MATRIX.length
    );
    expect(COMPANY_INTERNAL_FREQUENT_COMBINATION_SNAPSHOT_MATRIX).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "rockwool_grouped_triple_leaf_screening" }),
        expect.objectContaining({ id: "rockwool_flat_adjacent_swap_fail_closed" }),
        expect.objectContaining({ id: "ordinary_double_leaf_negative_boundary" }),
        expect.objectContaining({ id: "simple_stud_negative_boundary" }),
        expect.objectContaining({ id: "classic_framed_swap_fail_closed" }),
        expect.objectContaining({ id: "masonry_lined_massive_boundary_hold" }),
        expect.objectContaining({ id: "duplicate_many_layer_stack_watch" }),
        expect.objectContaining({ id: "raw_floor_open_box_exact_with_reorder_warning" }),
        expect.objectContaining({ id: "raw_floor_clt_role_prompt" }),
        expect.objectContaining({ id: "near_source_alias_context_only" }),
        expect.objectContaining({ id: "hostile_unknown_material_fail_closed" }),
        expect.objectContaining({ id: "hostile_infinite_thickness_fail_closed" }),
        expect.objectContaining({ id: "field_output_screening_continuation" })
      ])
    );

    for (const row of COMPANY_INTERNAL_FREQUENT_COMBINATION_SNAPSHOT_MATRIX) {
      expect(row.action, row.id).toBeTruthy();
      expect(row.confidence, row.id).toBeTruthy();
      expect(row.family, row.id).toBeTruthy();
      expect(row.sourceOrOrigin, row.id).toBeTruthy();
      expect(row.strategy, row.id).toBeTruthy();
      expect(row.visiblePosture, row.id).toBeTruthy();
      expect(Array.isArray(row.support), row.id).toBe(true);
      expect(Array.isArray(row.warnings), row.id).toBe(true);
    }

    expect(COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_A.selectedNextFile).toBe(
      "apps/web/features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts"
    );
    expect(COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_A.selectedNextAction).toBe(
      "gate_b_add_company_internal_visible_route_output_snapshot_guard_no_runtime"
    );
  });

  it("keeps the docs aligned with Gate A no-runtime posture and the next visible guard", () => {
    const docs = REQUIRED_GATE_A_DOCS.map((relativePath) => readRepoFile(relativePath)).join("\n\n");

    for (const token of REQUIRED_GATE_A_DOC_TOKENS) {
      expect(docs, token).toContain(token);
    }

    expect(docs).toContain("Rockwool triple-leaf remains not fixed");
    expect(docs).toContain("Rw 41");
    expect(docs).toContain("screening");
    expect(docs).toContain("no-runtime");
  });
});
