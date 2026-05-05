import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type GateBFinding = {
  defectClass: "blocked_source_qc" | "confirmed_wrong_lane" | "guard_green" | "watch_only";
  fieldLeakageRisk: boolean;
  id: string;
  labDeltaRwDb: number | null;
  observed: string;
  pairedWebVisibleTestRequiredBeforeFix: boolean;
  runtimeBehaviorChange: false;
  smallBoundedFixReadyNow: false;
  sourcePromotionAllowedNow: false;
  status: "documented_defect_select_gate_c" | "documented_guard_green" | "documented_watch";
};

const ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_B = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_b_reprobe_common_stack_route_family_and_value_drift_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_c_classify_reprobe_findings_and_select_bounded_fix_or_closeout_no_runtime",
  selectedNextFile: "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-c-classification.test.ts",
  selectedNextStatus: "common_stack_lane_drift_reprobes_landed_no_runtime_selected_gate_c_classification",
  selectedPlanningSurface: "docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md",
  sliceId: "route_family_lane_drift_common_stack_watchlist_v1",
  supportPromotion: false,
  thisGateFile: "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts",
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts",
  "docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_B_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
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

const WATCHLIST_SCOPES = [
  "split_rockwool_grouped_vs_flat_reorder",
  "ordinary_framed_insulation_reorder",
  "lined_massive_masonry_boundary_drift",
  "duplicate_many_layer_stack_drift",
  "raw_floor_role_inference_without_tags",
  "near_source_gypsum_alias_false_promotion",
  "field_output_leakage",
  "hostile_api_import_payload",
  "curve_digitization_provenance"
] as const;

const GATE_B_FINDINGS: readonly GateBFinding[] = [
  {
    defectClass: "confirmed_wrong_lane",
    fieldLeakageRisk: true,
    id: "split_rockwool_flat_swap_3_4_wrong_lane_reproduced",
    labDeltaRwDb: 10,
    observed:
      "flat split-rockwool swap moves Rw 41 low-confidence multileaf_screening_blend to Rw 51 medium-confidence double_leaf",
    pairedWebVisibleTestRequiredBeforeFix: true,
    runtimeBehaviorChange: false,
    smallBoundedFixReadyNow: false,
    sourcePromotionAllowedNow: false,
    status: "documented_defect_select_gate_c"
  },
  {
    defectClass: "confirmed_wrong_lane",
    fieldLeakageRisk: true,
    id: "ordinary_classic_triple_leaf_swap_wrong_lane_reproduced",
    labDeltaRwDb: 12,
    observed:
      "classic framed stack moves Rw 32 low-confidence multileaf_screening_blend to Rw 44 medium-confidence double_leaf",
    pairedWebVisibleTestRequiredBeforeFix: true,
    runtimeBehaviorChange: false,
    smallBoundedFixReadyNow: false,
    sourcePromotionAllowedNow: false,
    status: "documented_defect_select_gate_c"
  },
  {
    defectClass: "confirmed_wrong_lane",
    fieldLeakageRisk: true,
    id: "heavy_multileaf_lined_massive_boundary_reproduced",
    labDeltaRwDb: 10,
    observed:
      "AAC/board/fill/gap hybrid moves Rw 39 multileaf_screening_blend to Rw 49 lined_massive_wall with family-boundary hold",
    pairedWebVisibleTestRequiredBeforeFix: true,
    runtimeBehaviorChange: false,
    smallBoundedFixReadyNow: false,
    sourcePromotionAllowedNow: false,
    status: "documented_defect_select_gate_c"
  },
  {
    defectClass: "watch_only",
    fieldLeakageRisk: false,
    id: "duplicate_many_layer_classic_stack_finite_watch",
    labDeltaRwDb: 5,
    observed: "classic duplicated stack remains finite at Rw 37 but drifts upward from the Rw 32 baseline",
    pairedWebVisibleTestRequiredBeforeFix: false,
    runtimeBehaviorChange: false,
    smallBoundedFixReadyNow: false,
    sourcePromotionAllowedNow: false,
    status: "documented_watch"
  },
  {
    defectClass: "watch_only",
    fieldLeakageRisk: false,
    id: "duplicate_many_layer_heavy_stack_finite_watch",
    labDeltaRwDb: 7,
    observed: "heavy duplicated stack remains finite at Rw 46 but drifts upward from the Rw 39 baseline",
    pairedWebVisibleTestRequiredBeforeFix: false,
    runtimeBehaviorChange: false,
    smallBoundedFixReadyNow: false,
    sourcePromotionAllowedNow: false,
    status: "documented_watch"
  },
  {
    defectClass: "guard_green",
    fieldLeakageRisk: false,
    id: "raw_floor_known_role_inference_parity_green",
    labDeltaRwDb: 0,
    observed:
      "known raw/tagged/reversed CLT dry floor stack still resolves to dataholz_gdmtxn01_dry_clt_lab_2026 with Rw 62 and Ln,w 50",
    pairedWebVisibleTestRequiredBeforeFix: true,
    runtimeBehaviorChange: false,
    smallBoundedFixReadyNow: false,
    sourcePromotionAllowedNow: false,
    status: "documented_guard_green"
  },
  {
    defectClass: "blocked_source_qc",
    fieldLeakageRisk: true,
    id: "near_source_gypsum_alias_context_only",
    labDeltaRwDb: null,
    observed:
      "generic gypsum / gypsum_board / firestop mix stays formula-owned and must not promote to a Knauf/British Gypsum/NRC-like exact source row",
    pairedWebVisibleTestRequiredBeforeFix: true,
    runtimeBehaviorChange: false,
    smallBoundedFixReadyNow: false,
    sourcePromotionAllowedNow: false,
    status: "documented_watch"
  },
  {
    defectClass: "watch_only",
    fieldLeakageRisk: true,
    id: "field_output_copy_leakage_requires_visible_policy",
    labDeltaRwDb: null,
    observed:
      "R'w and DnT,w are calculable for screening walls, but route/output cards need explicit copy before they can look exact",
    pairedWebVisibleTestRequiredBeforeFix: true,
    runtimeBehaviorChange: false,
    smallBoundedFixReadyNow: false,
    sourcePromotionAllowedNow: false,
    status: "documented_watch"
  },
  {
    defectClass: "guard_green",
    fieldLeakageRisk: false,
    id: "hostile_api_import_fail_closed_green",
    labDeltaRwDb: null,
    observed: "unknown material and invalid thickness payloads still fail closed with no supported target outputs",
    pairedWebVisibleTestRequiredBeforeFix: false,
    runtimeBehaviorChange: false,
    smallBoundedFixReadyNow: false,
    sourcePromotionAllowedNow: false,
    status: "documented_guard_green"
  },
  {
    defectClass: "blocked_source_qc",
    fieldLeakageRisk: false,
    id: "curve_digitization_provenance_no_new_payload",
    labDeltaRwDb: null,
    observed:
      "future graph-digitized source rows remain blocked until axis, band, rating derivation, and uncertainty payloads are present",
    pairedWebVisibleTestRequiredBeforeFix: false,
    runtimeBehaviorChange: false,
    smallBoundedFixReadyNow: false,
    sourcePromotionAllowedNow: false,
    status: "documented_watch"
  }
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

const COMPLETE_TRIPLE_LEAF_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  airtightness: "good",
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

function withFieldWallContext(labContext: AirborneContext): AirborneContext {
  return {
    ...WALL_FIELD_CONTEXT,
    wallTopology: labContext.wallTopology
  };
}

function wallSnapshot(layers: readonly LayerInput[], labContext: AirborneContext = WALL_LAB_CONTEXT) {
  const lab = calculateAssembly(layers, {
    airborneContext: labContext,
    calculator: "dynamic",
    targetOutputs: ["Rw"]
  });
  const field = calculateAssembly(layers, {
    airborneContext: withFieldWallContext(labContext),
    calculator: "dynamic",
    targetOutputs: ["R'w", "DnT,w"]
  });

  return {
    confidence: field.dynamicAirborneTrace?.confidenceClass ?? lab.dynamicAirborneTrace?.confidenceClass ?? null,
    dnTw: field.metrics.estimatedDnTwDb,
    family: field.dynamicAirborneTrace?.detectedFamily ?? lab.dynamicAirborneTrace?.detectedFamily ?? null,
    rw: lab.metrics.estimatedRwDb,
    rwPrime: field.metrics.estimatedRwPrimeDb,
    stc: lab.metrics.estimatedStc,
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

function swap(stack: readonly LayerInput[], a: number, b: number): readonly LayerInput[] {
  const swapped = [...stack];
  [swapped[a], swapped[b]] = [swapped[b]!, swapped[a]!];
  return swapped;
}

describe("route-family lane-drift common-stack watchlist Gate B reprobes", () => {
  it("lands Gate B reprobes as no-runtime and selects Gate C classification", () => {
    expect(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_B).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_b_reprobe_common_stack_route_family_and_value_drift_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_c_classify_reprobe_findings_and_select_bounded_fix_or_closeout_no_runtime",
      selectedNextFile: "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-c-classification.test.ts",
      selectedNextStatus: "common_stack_lane_drift_reprobes_landed_no_runtime_selected_gate_c_classification",
      selectedPlanningSurface: "docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md",
      sliceId: "route_family_lane_drift_common_stack_watchlist_v1",
      supportPromotion: false,
      thisGateFile: "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("records the split-rockwool historical wrong-lane jump while current runtime is fail-closed", () => {
    const grouped = wallSnapshot(SPLIT_ROCKWOOL_STACK, COMPLETE_TRIPLE_LEAF_CONTEXT);
    const flat = wallSnapshot(SPLIT_ROCKWOOL_STACK);
    const swappedInternalLeaf = wallSnapshot(swap(SPLIT_ROCKWOOL_STACK, 3, 4));
    const swappedFarLeaf = wallSnapshot(swap(SPLIT_ROCKWOOL_STACK, 5, 6));

    expect({
      confidence: grouped.confidence,
      dnTw: grouped.dnTw,
      family: grouped.family,
      rw: grouped.rw,
      rwPrime: grouped.rwPrime,
      stc: grouped.stc,
      strategy: grouped.strategy
    }).toEqual({
      confidence: "low",
      dnTw: 40,
      family: "multileaf_multicavity",
      rw: 41,
      rwPrime: 39,
      stc: 41,
      strategy: "multileaf_screening_blend"
    });
    expect({
      confidence: flat.confidence,
      dnTw: flat.dnTw,
      family: flat.family,
      rw: flat.rw,
      rwPrime: flat.rwPrime,
      strategy: flat.strategy
    }).toEqual({
      confidence: "low",
      dnTw: 40,
      family: "multileaf_multicavity",
      rw: 41,
      rwPrime: 39,
      strategy: "multileaf_screening_blend"
    });
    expect({
      confidence: swappedInternalLeaf.confidence,
      dnTw: swappedInternalLeaf.dnTw,
      family: swappedInternalLeaf.family,
      rw: swappedInternalLeaf.rw,
      rwPrime: swappedInternalLeaf.rwPrime,
      stc: swappedInternalLeaf.stc,
      strategy: swappedInternalLeaf.strategy
    }).toEqual({
      confidence: "medium",
      dnTw: 51,
      family: "double_leaf",
      rw: 51,
      rwPrime: 49,
      stc: 51,
      strategy: "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology"
    });
    expect(swappedInternalLeaf.rw - flat.rw).toBe(10);
    expect(swappedInternalLeaf.rwPrime - flat.rwPrime).toBe(10);
    expect(swappedInternalLeaf.dnTw - flat.dnTw).toBe(11);
    expect(swappedFarLeaf.rw).toBe(41);
    expect(swappedFarLeaf.strategy).toBe("multileaf_screening_blend");
    expect(GATE_B_FINDINGS.find((finding) => finding.id === "split_rockwool_flat_swap_3_4_wrong_lane_reproduced"))
      .toMatchObject({
        defectClass: "confirmed_wrong_lane",
        labDeltaRwDb: 10,
        smallBoundedFixReadyNow: false,
        status: "documented_defect_select_gate_c"
      });
  });

  it("records ordinary framed insulation reorder while current runtime smooths the wrong-lane jump", () => {
    const base = wallSnapshot(CLASSIC_TRIPLE_LEAF_STACK);
    const swappedClassic = wallSnapshot(swap(CLASSIC_TRIPLE_LEAF_STACK, 1, 2));
    const duplicated = wallSnapshot([...CLASSIC_TRIPLE_LEAF_STACK, ...CLASSIC_TRIPLE_LEAF_STACK]);

    expect({
      confidence: base.confidence,
      dnTw: base.dnTw,
      family: base.family,
      rw: base.rw,
      rwPrime: base.rwPrime,
      strategy: base.strategy
    }).toEqual({
      confidence: "low",
      dnTw: 31,
      family: "multileaf_multicavity",
      rw: 32,
      rwPrime: 30,
      strategy: "multileaf_screening_blend"
    });
    expect({
      confidence: swappedClassic.confidence,
      dnTw: swappedClassic.dnTw,
      family: swappedClassic.family,
      rw: swappedClassic.rw,
      rwPrime: swappedClassic.rwPrime,
      strategy: swappedClassic.strategy
    }).toEqual({
      confidence: "medium",
      dnTw: 44,
      family: "double_leaf",
      rw: 44,
      rwPrime: 42,
      strategy: "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology"
    });
    expect({
      confidence: duplicated.confidence,
      dnTw: duplicated.dnTw,
      family: duplicated.family,
      rw: duplicated.rw,
      rwPrime: duplicated.rwPrime,
      strategy: duplicated.strategy
    }).toEqual({
      confidence: "low",
      dnTw: 38,
      family: "multileaf_multicavity",
      rw: 37,
      rwPrime: 37,
      strategy: "multileaf_screening_blend"
    });
    expect(swappedClassic.rw - base.rw).toBe(12);
    expect(duplicated.rw - base.rw).toBe(5);
  });

  it("reproduces masonry / lined-massive boundary drift and keeps duplicated heavy stacks finite", () => {
    const base = wallSnapshot(HEAVY_MULTILEAF_STACK);
    const swappedHeavy = wallSnapshot(swap(HEAVY_MULTILEAF_STACK, 1, 2));
    const duplicated = wallSnapshot([...HEAVY_MULTILEAF_STACK, ...HEAVY_MULTILEAF_STACK]);

    expect({
      confidence: base.confidence,
      dnTw: base.dnTw,
      family: base.family,
      rw: base.rw,
      rwPrime: base.rwPrime,
      strategy: base.strategy
    }).toEqual({
      confidence: "low",
      dnTw: 39,
      family: "multileaf_multicavity",
      rw: 39,
      rwPrime: 37,
      strategy: "multileaf_screening_blend"
    });
    expect({
      confidence: swappedHeavy.confidence,
      dnTw: swappedHeavy.dnTw,
      family: swappedHeavy.family,
      rw: swappedHeavy.rw,
      rwPrime: swappedHeavy.rwPrime,
      stc: swappedHeavy.stc,
      strategy: swappedHeavy.strategy
    }).toEqual({
      confidence: "low",
      dnTw: 48,
      family: "lined_massive_wall",
      rw: 49,
      rwPrime: 47,
      stc: 50,
      strategy: "lined_massive_blend+reinforcement_monotonic_floor+family_boundary_hold"
    });
    expect({
      confidence: duplicated.confidence,
      dnTw: duplicated.dnTw,
      family: duplicated.family,
      rw: duplicated.rw,
      rwPrime: duplicated.rwPrime,
      strategy: duplicated.strategy
    }).toEqual({
      confidence: "low",
      dnTw: 47,
      family: "multileaf_multicavity",
      rw: 46,
      rwPrime: 45,
      strategy: "multileaf_screening_blend"
    });
    expect(swappedHeavy.rw - base.rw).toBe(10);
    expect(swappedHeavy.warningText).toContain("family-boundary hold");
    expect(duplicated.rw - base.rw).toBe(7);
  });

  it("keeps known raw-floor role inference parity green while preserving the watch for ambiguous imports", () => {
    const raw = floorSnapshot(RAW_FLOOR_STACK);
    const tagged = floorSnapshot(TAGGED_FLOOR_STACK);
    const reversed = floorSnapshot([...RAW_FLOOR_STACK].reverse());

    expect(withoutRawFloorParityGuardWarning(raw)).toEqual(tagged);
    expect(withoutRawFloorParityGuardWarning(reversed)).toEqual(withoutRawFloorParityGuardWarning(raw));
    expect(raw.warnings.some((warning) => /does not claim arbitrary raw floor reorder value invariance/i.test(warning))).toBe(true);
    expect(tagged.warnings.some((warning) => /does not claim arbitrary raw floor reorder value invariance/i.test(warning))).toBe(false);
    expect(raw.floorSystemMatchId).toBe("dataholz_gdmtxn01_dry_clt_lab_2026");
    expect(raw.impactBasis).toBe("official_floor_system_exact_match");
    expect(raw.rw).toBe(62);
    expect(raw.lnW).toBe(50);
    expect(raw.rwPrime).toBe(46);
    expect(raw.labSupported).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(raw.fieldSupported).toContain("R'w");
    expect(raw.fieldSupported).toContain("L'n,w");
  });

  it("keeps near-source gypsum aliases context-only and field output policy unpromoted", () => {
    const alias = wallSnapshot(GYPSUM_ALIAS_MIXED_STACK);

    expect({
      confidence: alias.confidence,
      dnTw: alias.dnTw,
      family: alias.family,
      rw: alias.rw,
      rwPrime: alias.rwPrime,
      strategy: alias.strategy
    }).toEqual({
      confidence: "medium",
      dnTw: 37,
      family: "laminated_single_leaf",
      rw: 37,
      rwPrime: 35,
      strategy: "laminated_leaf_sharp_delegate"
    });
    expect(
      GATE_B_FINDINGS.find((finding) => finding.id === "near_source_gypsum_alias_context_only")
    ).toMatchObject({
      defectClass: "blocked_source_qc",
      sourcePromotionAllowedNow: false
    });
    expect(
      GATE_B_FINDINGS.find((finding) => finding.id === "field_output_copy_leakage_requires_visible_policy")
    ).toMatchObject({
      fieldLeakageRisk: true,
      pairedWebVisibleTestRequiredBeforeFix: true,
      sourcePromotionAllowedNow: false
    });
  });

  it("keeps hostile API/import payloads fail-closed before route or value selection", () => {
    const unknown = calculateAssembly([{ materialId: "unobtainium", thicknessMm: 100 }], {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC"]
    });
    const infinity = calculateAssembly([{ materialId: "gypsum_board", thicknessMm: Number.POSITIVE_INFINITY }], {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC"]
    });
    const negative = calculateAssembly([{ materialId: "gypsum_board", thicknessMm: -12.5 }], {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC"]
    });

    for (const result of [unknown, infinity, negative]) {
      expect(result.supportedTargetOutputs).toEqual([]);
      expect(result.metrics.estimatedRwDb).toBe(0);
      expect(result.dynamicAirborneTrace).toBeFalsy();
    }
    expect(unknown.warnings.some((warning: string) => /unknown material/i.test(warning))).toBe(true);
    expect(infinity.warnings.some((warning: string) => /invalid thickness/i.test(warning))).toBe(true);
    expect(negative.warnings.some((warning: string) => /invalid thickness/i.test(warning))).toBe(true);
  });

  it("classifies every Gate B watch scope before any bounded fix or runtime promotion", () => {
    expect(WATCHLIST_SCOPES).toEqual([
      "split_rockwool_grouped_vs_flat_reorder",
      "ordinary_framed_insulation_reorder",
      "lined_massive_masonry_boundary_drift",
      "duplicate_many_layer_stack_drift",
      "raw_floor_role_inference_without_tags",
      "near_source_gypsum_alias_false_promotion",
      "field_output_leakage",
      "hostile_api_import_payload",
      "curve_digitization_provenance"
    ]);
    expect(GATE_B_FINDINGS.map((finding) => finding.id)).toEqual([
      "split_rockwool_flat_swap_3_4_wrong_lane_reproduced",
      "ordinary_classic_triple_leaf_swap_wrong_lane_reproduced",
      "heavy_multileaf_lined_massive_boundary_reproduced",
      "duplicate_many_layer_classic_stack_finite_watch",
      "duplicate_many_layer_heavy_stack_finite_watch",
      "raw_floor_known_role_inference_parity_green",
      "near_source_gypsum_alias_context_only",
      "field_output_copy_leakage_requires_visible_policy",
      "hostile_api_import_fail_closed_green",
      "curve_digitization_provenance_no_new_payload"
    ]);
    expect(GATE_B_FINDINGS.every((finding) => finding.runtimeBehaviorChange === false)).toBe(true);
    expect(GATE_B_FINDINGS.every((finding) => finding.smallBoundedFixReadyNow === false)).toBe(true);
    expect(GATE_B_FINDINGS.every((finding) => finding.sourcePromotionAllowedNow === false)).toBe(true);
    expect(GATE_B_FINDINGS.filter((finding) => finding.status === "documented_defect_select_gate_c")).toHaveLength(3);
    expect(GATE_B_FINDINGS.filter((finding) => finding.defectClass === "guard_green")).toHaveLength(2);
  });

  it("keeps active docs aligned on Gate B landing and Gate C selection", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_B_HANDOFF.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_B.sliceId);
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_B.thisGateFile);
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_B.selectedNextFile);
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_B.selectedNextAction);
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_B.selectedNextStatus);
      expect(doc).toContain("split_rockwool_flat_swap_3_4_wrong_lane_reproduced");
      expect(doc).toContain("ordinary_classic_triple_leaf_swap_wrong_lane_reproduced");
      expect(doc).toContain("heavy_multileaf_lined_massive_boundary_reproduced");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("standing_lane_misclassification_monitoring_mandate");
      expect(doc).toContain("note_test_document_or_easy_fix");
      expect(doc).toContain("Rw 41");
      expect(doc).toContain("Rw 51");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_B_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
