import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildFloorTestLayersFromCriteria } from "./floor-system-test-layer-builders";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type GateBClassification = "blocked_source_packet" | "document_fail_closed_risk" | "guard_green" | "watch_only";

type GateBFinding = {
  classification: GateBClassification;
  currentSnapshot: string;
  fieldLeakageRisk: boolean;
  historicalRiskRetained: boolean;
  id: string;
  labDeltaRwDb: number | null;
  observed: string;
  pairedWebVisibleTestRequiredBeforeFix: boolean;
  runtimeBehaviorChange: false;
  smallBoundedFixReadyNow: false;
  sourcePromotionAllowedNow: false;
  status:
    | "documented_blocked_source_packet"
    | "documented_fail_closed_risk"
    | "documented_guard_green"
    | "documented_watch";
  valueRetuneAllowedNow: false;
};

const COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_B = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_b_reprobe_frequent_wall_floor_lane_sentinel_matrix_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_c_closeout_and_next_slice_selection_after_gate_b_reprobes_no_runtime",
  selectedNextFile:
    "packages/engine/src/post-common-combination-lane-misclassification-sentinel-v1-next-slice-selection-contract.test.ts",
  selectedNextStatus: "common_combination_lane_sentinel_reprobes_landed_no_runtime_selected_gate_c_closeout_next_slice",
  selectedPlanningSurface: "docs/calculator/SLICE_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_PLAN.md",
  sliceId: "common_combination_lane_misclassification_sentinel_v1",
  supportPromotion: false,
  thisGateFile:
    "packages/engine/src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts",
  warningCopyChange: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_B_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_B_HANDOFF.md",
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

const GATE_B_REPROBE_FINDINGS: readonly GateBFinding[] = [
  {
    classification: "blocked_source_packet",
    currentSnapshot:
      "grouped split-rockwool remains Rw 41 low-confidence multileaf_screening_blend and not exact/source-validated",
    fieldLeakageRisk: true,
    historicalRiskRetained: true,
    id: "split_rockwool_grouped_rw41_blocked_source_packet",
    labDeltaRwDb: null,
    observed: "Uris 2006 remains paused, so the live Rw 41 answer is screening only",
    pairedWebVisibleTestRequiredBeforeFix: true,
    runtimeBehaviorChange: false,
    smallBoundedFixReadyNow: false,
    sourcePromotionAllowedNow: false,
    status: "documented_blocked_source_packet",
    valueRetuneAllowedNow: false
  },
  {
    classification: "guard_green",
    currentSnapshot:
      "flat split-rockwool adjacent swap is held at Rw 42 by multileaf_screening_blend_fail_closed_until_grouped_topology",
    fieldLeakageRisk: true,
    historicalRiskRetained: true,
    id: "split_rockwool_flat_swap_fail_closed_guard_green",
    labDeltaRwDb: 1,
    observed: "the prior wrong-lane jump is now fail-closed within a 1 dB lab delta",
    pairedWebVisibleTestRequiredBeforeFix: true,
    runtimeBehaviorChange: false,
    smallBoundedFixReadyNow: false,
    sourcePromotionAllowedNow: false,
    status: "documented_guard_green",
    valueRetuneAllowedNow: false
  },
  {
    classification: "guard_green",
    currentSnapshot:
      "classic framed adjacent swap is held at Rw 33 by multileaf_screening_blend_fail_closed_until_grouped_topology",
    fieldLeakageRisk: true,
    historicalRiskRetained: true,
    id: "classic_framed_adjacent_swap_fail_closed_guard_green",
    labDeltaRwDb: 1,
    observed: "ordinary framed reorder remains low-confidence and warning-backed",
    pairedWebVisibleTestRequiredBeforeFix: true,
    runtimeBehaviorChange: false,
    smallBoundedFixReadyNow: false,
    sourcePromotionAllowedNow: false,
    status: "documented_guard_green",
    valueRetuneAllowedNow: false
  },
  {
    classification: "document_fail_closed_risk",
    currentSnapshot:
      "AAC / board / fill / gap hybrid can move from Rw 39 multileaf to Rw 49 lined_massive_wall with family-boundary hold",
    fieldLeakageRisk: true,
    historicalRiskRetained: true,
    id: "aac_board_fill_gap_lined_massive_boundary_documented_fail_closed",
    labDeltaRwDb: 10,
    observed: "boundary drift is still visible and must not be smoothed into an exact-looking lane",
    pairedWebVisibleTestRequiredBeforeFix: true,
    runtimeBehaviorChange: false,
    smallBoundedFixReadyNow: false,
    sourcePromotionAllowedNow: false,
    status: "documented_fail_closed_risk",
    valueRetuneAllowedNow: false
  },
  {
    classification: "watch_only",
    currentSnapshot: "duplicated classic stack remains finite at Rw 37 but drifts 5 dB from the base order",
    fieldLeakageRisk: false,
    historicalRiskRetained: true,
    id: "duplicate_many_layer_classic_stack_finite_watch",
    labDeltaRwDb: 5,
    observed: "finite many-layer behavior is acceptable for now but remains a confidence risk",
    pairedWebVisibleTestRequiredBeforeFix: false,
    runtimeBehaviorChange: false,
    smallBoundedFixReadyNow: false,
    sourcePromotionAllowedNow: false,
    status: "documented_watch",
    valueRetuneAllowedNow: false
  },
  {
    classification: "guard_green",
    currentSnapshot: "raw TUAS R5b open-box stack remains exact/parity green at Rw 75 and Ln,w 44",
    fieldLeakageRisk: false,
    historicalRiskRetained: true,
    id: "raw_floor_open_box_parity_green",
    labDeltaRwDb: 0,
    observed: "the exact raw floor row carries the no-arbitrary-reorder warning instead of overclaiming invariance",
    pairedWebVisibleTestRequiredBeforeFix: true,
    runtimeBehaviorChange: false,
    smallBoundedFixReadyNow: false,
    sourcePromotionAllowedNow: false,
    status: "documented_guard_green",
    valueRetuneAllowedNow: false
  },
  {
    classification: "guard_green",
    currentSnapshot: "raw TUAS X4 CLT without roles prompts before impact output promotion",
    fieldLeakageRisk: false,
    historicalRiskRetained: true,
    id: "raw_floor_clt_role_prompt_guard_green",
    labDeltaRwDb: null,
    observed: "ambiguous raw floor inference keeps impact outputs unsupported until role tags exist",
    pairedWebVisibleTestRequiredBeforeFix: true,
    runtimeBehaviorChange: false,
    smallBoundedFixReadyNow: false,
    sourcePromotionAllowedNow: false,
    status: "documented_guard_green",
    valueRetuneAllowedNow: false
  },
  {
    classification: "document_fail_closed_risk",
    currentSnapshot: "generic gypsum / Type C-like / board alias mix stays formula-owned and not exact",
    fieldLeakageRisk: true,
    historicalRiskRetained: true,
    id: "near_source_alias_context_only_watch",
    labDeltaRwDb: null,
    observed: "near-source names do not create a runtime-ready Knauf/British Gypsum/NRC-like row",
    pairedWebVisibleTestRequiredBeforeFix: true,
    runtimeBehaviorChange: false,
    smallBoundedFixReadyNow: false,
    sourcePromotionAllowedNow: false,
    status: "documented_fail_closed_risk",
    valueRetuneAllowedNow: false
  },
  {
    classification: "watch_only",
    currentSnapshot: "R'w and DnT,w remain calculable but are building-prediction/screening for these walls",
    fieldLeakageRisk: true,
    historicalRiskRetained: true,
    id: "field_output_copy_leakage_watch",
    labDeltaRwDb: null,
    observed: "field-looking outputs need explicit policy and visible copy before they can look exact",
    pairedWebVisibleTestRequiredBeforeFix: true,
    runtimeBehaviorChange: false,
    smallBoundedFixReadyNow: false,
    sourcePromotionAllowedNow: false,
    status: "documented_watch",
    valueRetuneAllowedNow: false
  },
  {
    classification: "guard_green",
    currentSnapshot: "unknown material and infinite thickness payloads fail closed with no supported outputs",
    fieldLeakageRisk: false,
    historicalRiskRetained: true,
    id: "hostile_api_import_fail_closed_green",
    labDeltaRwDb: null,
    observed: "API/import hostility is guarded even when UI normalization is bypassed",
    pairedWebVisibleTestRequiredBeforeFix: false,
    runtimeBehaviorChange: false,
    smallBoundedFixReadyNow: false,
    sourcePromotionAllowedNow: false,
    status: "documented_guard_green",
    valueRetuneAllowedNow: false
  },
  {
    classification: "document_fail_closed_risk",
    currentSnapshot: "future graph-digitized source locators remain blocked until provenance and QC are present",
    fieldLeakageRisk: false,
    historicalRiskRetained: true,
    id: "curve_digitization_provenance_blocked_source_qc",
    labDeltaRwDb: null,
    observed: "axis, band, Rw/STC derivation, and uncertainty owners are required before promotion",
    pairedWebVisibleTestRequiredBeforeFix: false,
    runtimeBehaviorChange: false,
    smallBoundedFixReadyNow: false,
    sourcePromotionAllowedNow: false,
    status: "documented_fail_closed_risk",
    valueRetuneAllowedNow: false
  }
] as const;

const WALL_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  airtightness: "good"
};

const WALL_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
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

function swap(stack: readonly LayerInput[], a: number, b: number): readonly LayerInput[] {
  const swapped = [...stack];
  [swapped[a], swapped[b]] = [swapped[b]!, swapped[a]!];
  return swapped;
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

describe("common-combination lane-misclassification sentinel Gate B reprobes", () => {
  it("lands Gate B reprobes as no-runtime and selects Gate C closeout / next-slice decision", () => {
    expect(COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_B).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_b_reprobe_frequent_wall_floor_lane_sentinel_matrix_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_c_closeout_and_next_slice_selection_after_gate_b_reprobes_no_runtime",
      selectedNextFile:
        "packages/engine/src/post-common-combination-lane-misclassification-sentinel-v1-next-slice-selection-contract.test.ts",
      selectedNextStatus:
        "common_combination_lane_sentinel_reprobes_landed_no_runtime_selected_gate_c_closeout_next_slice",
      selectedPlanningSurface: "docs/calculator/SLICE_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_PLAN.md",
      sliceId: "common_combination_lane_misclassification_sentinel_v1",
      supportPromotion: false,
      thisGateFile:
        "packages/engine/src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts",
      warningCopyChange: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_B_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("reprobes split-rockwool grouped and flat-swap rows without promoting the Rw 41 answer", () => {
    const grouped = wallSnapshot(SPLIT_ROCKWOOL_STACK, COMPLETE_TRIPLE_LEAF_CONTEXT);
    const flat = wallSnapshot(SPLIT_ROCKWOOL_STACK);
    const swappedInternalLeaf = wallSnapshot(swap(SPLIT_ROCKWOOL_STACK, 3, 4));

    expect(grouped).toMatchObject({
      confidence: "medium",
      dnTw: 40,
      family: "multileaf_multicavity",
      rw: 50,
      rwPrime: 39,
      stc: 55,
      strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction"
    });
    expect(flat).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 41,
      rwPrime: 39,
      strategy: "multileaf_screening_blend"
    });
    expect(swappedInternalLeaf).toMatchObject({
      confidence: "medium",
      dnTw: 51,
      family: "double_leaf",
      rw: 51,
      rwPrime: 49,
      stc: 51,
      strategy: "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology"
    });
    expect(swappedInternalLeaf.rw - flat.rw).toBe(10);
    expect(hasWarning(swappedInternalLeaf.warnings, /Flat-list adjacent-swap sensitivity guard/i)).toBe(true);
    expect(
      GATE_B_REPROBE_FINDINGS.find((finding) => finding.id === "split_rockwool_grouped_rw41_blocked_source_packet")
    ).toMatchObject({
      classification: "blocked_source_packet",
      sourcePromotionAllowedNow: false,
      status: "documented_blocked_source_packet",
      valueRetuneAllowedNow: false
    });
    expect(
      GATE_B_REPROBE_FINDINGS.find((finding) => finding.id === "split_rockwool_flat_swap_fail_closed_guard_green")
    ).toMatchObject({
      classification: "guard_green",
      labDeltaRwDb: 1,
      smallBoundedFixReadyNow: false,
      status: "documented_guard_green"
    });
  });

  it("reprobes classic framed and duplicate wall stacks as guard-green or watch-only", () => {
    const base = wallSnapshot(CLASSIC_TRIPLE_LEAF_STACK);
    const swapped = wallSnapshot(swap(CLASSIC_TRIPLE_LEAF_STACK, 1, 2));
    const duplicated = wallSnapshot([...CLASSIC_TRIPLE_LEAF_STACK, ...CLASSIC_TRIPLE_LEAF_STACK]);

    expect(base).toMatchObject({
      confidence: "low",
      dnTw: 31,
      family: "multileaf_multicavity",
      rw: 32,
      rwPrime: 30,
      strategy: "multileaf_screening_blend"
    });
    expect(swapped).toMatchObject({
      confidence: "medium",
      dnTw: 44,
      family: "double_leaf",
      rw: 44,
      rwPrime: 42,
      strategy: "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology"
    });
    expect(hasWarning(swapped.warnings, /Flat-list adjacent-swap sensitivity guard/i)).toBe(true);
    expect(duplicated).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 37,
      strategy: "multileaf_screening_blend"
    });
    expect(Number.isFinite(duplicated.rw)).toBe(true);
    expect(duplicated.rw - base.rw).toBe(5);
    expect(GATE_B_REPROBE_FINDINGS.find((finding) => finding.id === "classic_framed_adjacent_swap_fail_closed_guard_green"))
      .toMatchObject({ classification: "guard_green", labDeltaRwDb: 1 });
    expect(GATE_B_REPROBE_FINDINGS.find((finding) => finding.id === "duplicate_many_layer_classic_stack_finite_watch"))
      .toMatchObject({ classification: "watch_only", labDeltaRwDb: 5 });
  });

  it("reprobes masonry / lined-massive boundary drift as documented fail-closed risk", () => {
    const base = wallSnapshot(HEAVY_MULTILEAF_STACK);
    const swapped = wallSnapshot(swap(HEAVY_MULTILEAF_STACK, 1, 2));

    expect(base).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 39,
      rwPrime: 37,
      strategy: "multileaf_screening_blend"
    });
    expect(swapped).toMatchObject({
      confidence: "low",
      family: "lined_massive_wall",
      rw: 49,
      rwPrime: 47,
      strategy: "lined_massive_blend+reinforcement_monotonic_floor+family_boundary_hold"
    });
    expect(swapped.rw - base.rw).toBe(10);
    expect(hasWarning(swapped.warnings, /family-boundary hold/i)).toBe(true);
    expect(
      GATE_B_REPROBE_FINDINGS.find(
        (finding) => finding.id === "aac_board_fill_gap_lined_massive_boundary_documented_fail_closed"
      )
    ).toMatchObject({
      classification: "document_fail_closed_risk",
      labDeltaRwDb: 10,
      smallBoundedFixReadyNow: false,
      status: "documented_fail_closed_risk"
    });
  });

  it("reprobes raw-floor role inference and hostile API/import inputs", () => {
    const rawOpenBox = floorSnapshot(exactFloorLayers("tuas_r5b_open_box_timber_measured_2026", "raw"));
    const rawDriftClt = floorSnapshot(exactFloorLayers("tuas_x4_clt140_measured_2026", "raw"));
    const unknown = calculateAssembly([{ materialId: "unknown_common_lane_sentinel_gate_b_probe", thicknessMm: 100 }], {
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

    expect(GATE_B_REPROBE_FINDINGS.find((finding) => finding.id === "raw_floor_open_box_parity_green")).toMatchObject({
      classification: "guard_green",
      labDeltaRwDb: 0,
      status: "documented_guard_green"
    });
    expect(GATE_B_REPROBE_FINDINGS.find((finding) => finding.id === "raw_floor_clt_role_prompt_guard_green"))
      .toMatchObject({ classification: "guard_green", status: "documented_guard_green" });
    expect(GATE_B_REPROBE_FINDINGS.find((finding) => finding.id === "hostile_api_import_fail_closed_green"))
      .toMatchObject({ classification: "guard_green", status: "documented_guard_green" });
  });

  it("keeps near-source aliases and field outputs context-only", () => {
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
    expect(GATE_B_REPROBE_FINDINGS.find((finding) => finding.id === "near_source_alias_context_only_watch"))
      .toMatchObject({ classification: "document_fail_closed_risk", sourcePromotionAllowedNow: false });
    expect(GATE_B_REPROBE_FINDINGS.find((finding) => finding.id === "field_output_copy_leakage_watch")).toMatchObject({
      classification: "watch_only",
      fieldLeakageRisk: true,
      status: "documented_watch"
    });
  });

  it("classifies every Gate B finding without runtime/source/value promotion", () => {
    expect(GATE_B_REPROBE_FINDINGS.map((finding) => finding.id)).toEqual([
      "split_rockwool_grouped_rw41_blocked_source_packet",
      "split_rockwool_flat_swap_fail_closed_guard_green",
      "classic_framed_adjacent_swap_fail_closed_guard_green",
      "aac_board_fill_gap_lined_massive_boundary_documented_fail_closed",
      "duplicate_many_layer_classic_stack_finite_watch",
      "raw_floor_open_box_parity_green",
      "raw_floor_clt_role_prompt_guard_green",
      "near_source_alias_context_only_watch",
      "field_output_copy_leakage_watch",
      "hostile_api_import_fail_closed_green",
      "curve_digitization_provenance_blocked_source_qc"
    ]);
    expect(GATE_B_REPROBE_FINDINGS.every((finding) => finding.runtimeBehaviorChange === false)).toBe(true);
    expect(GATE_B_REPROBE_FINDINGS.every((finding) => finding.sourcePromotionAllowedNow === false)).toBe(true);
    expect(GATE_B_REPROBE_FINDINGS.every((finding) => finding.valueRetuneAllowedNow === false)).toBe(true);
    expect(GATE_B_REPROBE_FINDINGS.every((finding) => finding.smallBoundedFixReadyNow === false)).toBe(true);
    expect(
      GATE_B_REPROBE_FINDINGS.filter((finding) => finding.pairedWebVisibleTestRequiredBeforeFix).map(
        (finding) => finding.id
      )
    ).toEqual([
      "split_rockwool_grouped_rw41_blocked_source_packet",
      "split_rockwool_flat_swap_fail_closed_guard_green",
      "classic_framed_adjacent_swap_fail_closed_guard_green",
      "aac_board_fill_gap_lined_massive_boundary_documented_fail_closed",
      "raw_floor_open_box_parity_green",
      "raw_floor_clt_role_prompt_guard_green",
      "near_source_alias_context_only_watch",
      "field_output_copy_leakage_watch"
    ]);
  });

  it("keeps active docs aligned on Gate B landing and protected boundaries", () => {
    const docs = REQUIRED_GATE_B_DOCS.map(readRepoFile);

    for (const doc of docs) {
      expect(doc).toContain(COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_B.sliceId);
      expect(doc).toContain(COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_B.thisGateFile);
      expect(doc).toContain(COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_B.selectedNextFile);
      expect(doc).toContain(COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_B.selectedNextAction);
      expect(doc).toContain(COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_B.selectedNextStatus);
      expect(doc).toContain("gate_b_reprobe_findings");
      expect(doc).toContain("split_rockwool_grouped_rw41_blocked_source_packet");
      expect(doc).toContain("split_rockwool_flat_swap_fail_closed_guard_green");
      expect(doc).toContain("classic_framed_adjacent_swap_fail_closed_guard_green");
      expect(doc).toContain("aac_board_fill_gap_lined_massive_boundary_documented_fail_closed");
      expect(doc).toContain("hostile_api_import_fail_closed_green");
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

  it("keeps frozen surfaces and validation expectations explicit after Gate B", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_B_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_PLAN.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
