import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { FLAT_LIST_MULTILEAF_GUARD_STRATEGY } from "./dynamic-airborne-flat-list-multileaf-guard";
import { ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING } from "./rockwool-split-triple-leaf-numeric-source-closure";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type V28Candidate = {
  acquisitionOrGuardReadyNow: boolean;
  firstMissingRequirement: string;
  id: string;
  rank: number;
  reason: string;
  runtimeImportReadyNow: boolean;
  selectedNext: boolean;
  targetFile: string;
  validationScope: readonly string[];
};

const UBIQ_SYSTEM_TABLE_URL =
  "https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf";

const CALCULATOR_SOURCE_GAP_REVALIDATION_V28_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate:
    "gate_a_revalidate_source_gap_order_after_ubiq_packaged_finish_current_gate_closeout",
  latestClosedSlice: "ubiq_open_web_packaged_finish_current_gate_guard_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice:
    "rockwool_split_triple_leaf_rights_safe_source_packet_refresh_v2",
  selectedNextAction:
    "gate_a_refresh_rights_safe_rockwool_triple_leaf_source_packet_search_without_runtime",
  selectedPlanningSurface:
    "docs/calculator/SLICE_ROCKWOOL_SPLIT_TRIPLE_LEAF_RIGHTS_SAFE_SOURCE_PACKET_REFRESH_V2_PLAN.md",
  selectedRouteFamily:
    "rockwool_split_triple_leaf_source_packet_unblocker_for_exact_numeric_closure",
  selectionStatus:
    "selected_rockwool_split_triple_leaf_rights_safe_source_packet_refresh_after_v28_rerank_no_runtime_candidates_after_ubiq_packaged_finish",
  sliceId: "calculator_source_gap_revalidation_v28",
  sourceAcquisitionSelectedNow: true,
  sourceReadyRuntimePackImportedNow: false,
  supportPromotion: false,
  targetFirstGateFile:
    "packages/engine/src/rockwool-split-triple-leaf-rights-safe-source-packet-refresh-v2-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const UBIQ_PACKAGED_FINISH_CURRENT_GATE_PRESERVED_AFTER_V28 = {
  artifact: "ubiq_packaged_finish_current_gate_pack_preserved_after_v28",
  boundOpenWebRowsProtected: 21,
  closeoutGuard:
    "packages/engine/src/post-ubiq-open-web-packaged-finish-current-gate-guard-v1-next-slice-selection-contract.test.ts",
  exactOpenWebRowsProtected: 90,
  sourceUrl: UBIQ_SYSTEM_TABLE_URL
} as const;

const ROCKWOOL_NUMERIC_BOUNDARIES_AFTER_V28 = {
  adjacentRockwoolStillSupported: "Rw 51 / R'w 49 / DnT,w 51",
  artifact: "rockwool_numeric_boundaries_after_v28",
  directExactRuntimeStillBlocked: true,
  firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
  flatListSplitOutputsStillWithheld: true,
  flatListSplitValue: "Rw 41 / R'w 39 / DnT,w 40",
  groupedRockwoolStillScreeningOnly: "Rw 41",
  splitWithholdWarning: ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING
} as const;

const ROCKWOOL_SOURCE_PACKET_REFRESH_SELECTED_AFTER_V28 = {
  artifact: "rockwool_rights_safe_source_packet_refresh_selected_after_v28",
  selectedReason:
    "after_source_backed_UBIQ_open_web_current_gate_closure_the_highest_user_visible_numeric_correctness_blocker_is_still_Rockwool_split_triple_leaf_but_exact_runtime_requires_a_rights_safe_source_owned_curve_payload_first",
  targetFile:
    "packages/engine/src/rockwool-split-triple-leaf-rights-safe-source-packet-refresh-v2-gate-a-contract.test.ts",
  targetPlan:
    "docs/calculator/SLICE_ROCKWOOL_SPLIT_TRIPLE_LEAF_RIGHTS_SAFE_SOURCE_PACKET_REFRESH_V2_PLAN.md"
} as const;

const RAW_OPEN_WEB_AND_COMPANY_BLOCKERS_CARRY_FORWARD_AFTER_V28 = {
  artifact: "raw_open_web_and_company_internal_blockers_carry_forward_after_v28",
  companyInternalHighAccuracyOpening:
    "blocked_until_remaining_numeric_correctness_source_ownership_exit_criteria_close",
  genericOrRawOpenWeb:
    "blocked_by_source_owned_raw_carrier_negative_boundary_absent",
  status: "no_raw_open_web_or_company_internal_opening_selected_at_v28"
} as const;

const V28_RERANK_CANDIDATES: readonly V28Candidate[] = [
  {
    acquisitionOrGuardReadyNow: true,
    firstMissingRequirement: "rights_safe_source_owned_curve_payload_absent",
    id: "rockwool_split_triple_leaf_rights_safe_source_packet_refresh",
    rank: 1,
    reason:
      "Rockwool_is_now_the_highest_user_visible_correctness_blocker_after_UBIQ_current_gate_closure;_the_safe_next_step_is_a_bounded_source_packet_refresh_or_explicit_stop_not_a_runtime_guess",
    runtimeImportReadyNow: false,
    selectedNext: true,
    targetFile:
      "packages/engine/src/rockwool-split-triple-leaf-rights-safe-source-packet-refresh-v2-gate-a-contract.test.ts",
    validationScope: [
      "wall-triple-leaf-uris2006-source-packet-acquisition-gate-u",
      "rockwool-split-triple-leaf-numeric-source-closure-gate-a-contract",
      "rockwool-split-triple-leaf-numeric-source-closure-gate-b-runtime",
      "post-rockwool-split-triple-leaf-numeric-source-closure-v1-next-slice-selection-contract",
      "pnpm_calculator_gate_current",
      "git_diff_check"
    ]
  },
  {
    acquisitionOrGuardReadyNow: false,
    firstMissingRequirement: "rights_safe_source_owned_curve_payload_absent",
    id: "direct_rockwool_split_internal_leaf_exact_runtime_fix",
    rank: 2,
    reason:
      "direct_exact_runtime_remains_blocked_until_the_packet_refresh_names_source_owned_curves_topology_material_metric_tolerance_negative_boundaries_calibration_holdout_and_visible_tests",
    runtimeImportReadyNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    validationScope: ["rockwool_exact_runtime_blocker_check"]
  },
  {
    acquisitionOrGuardReadyNow: false,
    firstMissingRequirement: "source_owned_raw_carrier_negative_boundary_absent",
    id: "generic_or_raw_open_web_family_widening",
    rank: 3,
    reason:
      "packaged_UBIQ_rows_are_now_guarded_but_they_still_do_not_supply_true_raw_bare_open_web_carrier_impact_evidence_or_negative_boundaries",
    runtimeImportReadyNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_GAP_LEDGER.md",
    validationScope: ["raw_bare_open_web_open_box_source_evidence_re_rank_v1"]
  },
  {
    acquisitionOrGuardReadyNow: false,
    firstMissingRequirement:
      "remaining_numeric_correctness_source_ownership_exit_criteria_open",
    id: "company_internal_high_accuracy_opening",
    rank: 4,
    reason:
      "company_internal_opening_must_wait_until_Rockwool_or_other_remaining_numeric_source_gaps_are_closed_or_explicitly_bounded",
    runtimeImportReadyNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/CURRENT_STATE.md",
    validationScope: ["pnpm_check"]
  },
  {
    acquisitionOrGuardReadyNow: false,
    firstMissingRequirement: "correctness_first_source_unblocker_selected",
    id: "confidence_or_productization_cleanup",
    rank: 5,
    reason:
      "confidence_copy_and_productization_are_lower_priority_than_correct_numbers_and_source_owned_runtime_unblockers",
    runtimeImportReadyNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
    validationScope: ["none_selected"]
  }
] as const;

const REQUIRED_EXISTING_SURFACES = [
  "packages/engine/src/calculator-source-gap-revalidation-v28-gate-a-contract.test.ts",
  "packages/engine/src/post-ubiq-open-web-packaged-finish-current-gate-guard-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts",
  "packages/engine/src/ubiq-open-web-packaged-finish-family-design.test.ts",
  "packages/engine/src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts",
  "packages/engine/src/ubiq-open-web-packaged-lane-trace-matrix.test.ts",
  "packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts",
  "packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-a-contract.test.ts",
  "packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-b-runtime.test.ts",
  "packages/engine/src/post-rockwool-split-triple-leaf-numeric-source-closure-v1-next-slice-selection-contract.test.ts",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V28_PLAN.md",
  "docs/calculator/SLICE_ROCKWOOL_SPLIT_TRIPLE_LEAF_RIGHTS_SAFE_SOURCE_PACKET_REFRESH_V2_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V28_GATE_A_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_ALIGNED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V28_PLAN.md",
  "docs/calculator/SLICE_ROCKWOOL_SPLIT_TRIPLE_LEAF_RIGHTS_SAFE_SOURCE_PACKET_REFRESH_V2_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V28_GATE_A_HANDOFF.md"
] as const;

const LAB_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"] as const satisfies readonly RequestedOutputId[];

const WALL_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

const WALL_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const UBIQ_SUPPORTED_TIMBER_EXACT_STACK: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 12 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
];

const UBIQ_SUPPORTED_CARPET_BOUND_STACK: readonly LayerInput[] = [
  ...UBIQ_SUPPORTED_TIMBER_EXACT_STACK.slice(0, 5),
  { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: 12 },
  ...UBIQ_SUPPORTED_TIMBER_EXACT_STACK.slice(6)
];

const PDF_LIKE_ADJACENT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const PDF_LIKE_SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function openWebExactRows() {
  return EXACT_FLOOR_SYSTEMS.filter(
    (system) =>
      system.id.startsWith("ubiq_") &&
      system.id.includes("_open_web_steel_") &&
      system.match.baseStructure?.materialIds?.includes("open_web_steel_floor") === true
  );
}

function openWebBoundRows() {
  return BOUND_FLOOR_SYSTEMS.filter(
    (system) =>
      system.id.startsWith("ubiq_") &&
      system.id.includes("_open_web_steel_") &&
      system.match.baseStructure?.materialIds?.includes("open_web_steel_floor") === true
  );
}

function floorSnapshot(layers: readonly LayerInput[]) {
  const result = calculateAssembly(layers, { targetOutputs: LAB_OUTPUTS });

  return {
    boundMatchId: result.boundFloorSystemMatch?.system.id ?? null,
    exactMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? result.lowerBoundImpact?.LnWPlusCIUpperBound ?? null,
    lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
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
    family: result.dynamicAirborneTrace?.detectedFamily ?? null,
    rw: result.metrics.estimatedRwDb ?? null,
    rwPrime: result.metrics.estimatedRwPrimeDb ?? null,
    stc: result.metrics.estimatedStc ?? null,
    strategy: result.dynamicAirborneTrace?.strategy ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs,
    warnings: result.warnings.join("\n")
  };
}

describe("calculator source-gap revalidation V28 Gate A", () => {
  it("lands V28 as no-runtime source-gap revalidation and selects Rockwool source-packet refresh", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V28_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate:
        "gate_a_revalidate_source_gap_order_after_ubiq_packaged_finish_current_gate_closeout",
      latestClosedSlice: "ubiq_open_web_packaged_finish_current_gate_guard_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice:
        "rockwool_split_triple_leaf_rights_safe_source_packet_refresh_v2",
      selectedNextAction:
        "gate_a_refresh_rights_safe_rockwool_triple_leaf_source_packet_search_without_runtime",
      selectedPlanningSurface:
        "docs/calculator/SLICE_ROCKWOOL_SPLIT_TRIPLE_LEAF_RIGHTS_SAFE_SOURCE_PACKET_REFRESH_V2_PLAN.md",
      selectedRouteFamily:
        "rockwool_split_triple_leaf_source_packet_unblocker_for_exact_numeric_closure",
      selectionStatus:
        "selected_rockwool_split_triple_leaf_rights_safe_source_packet_refresh_after_v28_rerank_no_runtime_candidates_after_ubiq_packaged_finish",
      sliceId: "calculator_source_gap_revalidation_v28",
      sourceAcquisitionSelectedNow: true,
      sourceReadyRuntimePackImportedNow: false,
      supportPromotion: false,
      targetFirstGateFile:
        "packages/engine/src/rockwool-split-triple-leaf-rights-safe-source-packet-refresh-v2-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const relativePath of REQUIRED_EXISTING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, relativePath)), relativePath).toBe(true);
    }
  });

  it("ranks the source-packet unblocker above blocked runtime fixes and lower-priority cleanup", () => {
    expect(V28_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "rockwool_split_triple_leaf_rights_safe_source_packet_refresh",
      "direct_rockwool_split_internal_leaf_exact_runtime_fix",
      "generic_or_raw_open_web_family_widening",
      "company_internal_high_accuracy_opening",
      "confidence_or_productization_cleanup"
    ]);
    expect(V28_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        acquisitionOrGuardReadyNow: true,
        firstMissingRequirement: "rights_safe_source_owned_curve_payload_absent",
        id: "rockwool_split_triple_leaf_rights_safe_source_packet_refresh",
        rank: 1,
        reason:
          "Rockwool_is_now_the_highest_user_visible_correctness_blocker_after_UBIQ_current_gate_closure;_the_safe_next_step_is_a_bounded_source_packet_refresh_or_explicit_stop_not_a_runtime_guess",
        runtimeImportReadyNow: false,
        selectedNext: true,
        targetFile:
          "packages/engine/src/rockwool-split-triple-leaf-rights-safe-source-packet-refresh-v2-gate-a-contract.test.ts",
        validationScope: [
          "wall-triple-leaf-uris2006-source-packet-acquisition-gate-u",
          "rockwool-split-triple-leaf-numeric-source-closure-gate-a-contract",
          "rockwool-split-triple-leaf-numeric-source-closure-gate-b-runtime",
          "post-rockwool-split-triple-leaf-numeric-source-closure-v1-next-slice-selection-contract",
          "pnpm_calculator_gate_current",
          "git_diff_check"
        ]
      }
    ]);
    expect(
      V28_RERANK_CANDIDATES.find(
        (candidate) => candidate.id === "direct_rockwool_split_internal_leaf_exact_runtime_fix"
      )?.firstMissingRequirement
    ).toBe("rights_safe_source_owned_curve_payload_absent");
    expect(
      V28_RERANK_CANDIDATES.find((candidate) => candidate.id === "generic_or_raw_open_web_family_widening")
        ?.firstMissingRequirement
    ).toBe("source_owned_raw_carrier_negative_boundary_absent");
  });

  it("preserves UBIQ packaged-finish current-gate exact and bound outputs", () => {
    expect(UBIQ_PACKAGED_FINISH_CURRENT_GATE_PRESERVED_AFTER_V28).toEqual({
      artifact: "ubiq_packaged_finish_current_gate_pack_preserved_after_v28",
      boundOpenWebRowsProtected: 21,
      closeoutGuard:
        "packages/engine/src/post-ubiq-open-web-packaged-finish-current-gate-guard-v1-next-slice-selection-contract.test.ts",
      exactOpenWebRowsProtected: 90,
      sourceUrl: UBIQ_SYSTEM_TABLE_URL
    });
    expect(openWebExactRows()).toHaveLength(90);
    expect(openWebBoundRows()).toHaveLength(21);
    expect(new Set([...openWebExactRows(), ...openWebBoundRows()].map((system) => system.sourceUrl ?? ""))).toEqual(
      new Set([UBIQ_SYSTEM_TABLE_URL])
    );

    expect(floorSnapshot(UBIQ_SUPPORTED_TIMBER_EXACT_STACK)).toEqual({
      boundMatchId: null,
      exactMatchId: "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      impactBasis: "official_floor_system_exact_match",
      lnW: 51,
      lnWPlusCI: 49,
      lowerBoundBasis: null,
      rw: 64,
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: ["DeltaLw"]
    });
    expect(floorSnapshot(UBIQ_SUPPORTED_CARPET_BOUND_STACK)).toEqual({
      boundMatchId: "ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026",
      exactMatchId: null,
      impactBasis: null,
      lnW: null,
      lnWPlusCI: 45,
      lowerBoundBasis: "official_floor_system_bound_support",
      rw: 64,
      supported: ["Rw", "Ln,w+CI"],
      unsupported: ["Ln,w", "DeltaLw"]
    });
  });

  it("preserves Rockwool numeric boundaries while selecting source acquisition, not runtime guessing", () => {
    const adjacentLab = wallSnapshot({
      airborneContext: WALL_LAB_CONTEXT,
      layers: PDF_LIKE_ADJACENT_ROCKWOOL_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const adjacentField = wallSnapshot({
      airborneContext: WALL_FIELD_CONTEXT,
      layers: PDF_LIKE_ADJACENT_ROCKWOOL_STACK,
      outputs: WALL_FIELD_OUTPUTS
    });
    const splitLab = wallSnapshot({
      airborneContext: WALL_LAB_CONTEXT,
      layers: PDF_LIKE_SPLIT_ROCKWOOL_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const splitField = wallSnapshot({
      airborneContext: WALL_FIELD_CONTEXT,
      layers: PDF_LIKE_SPLIT_ROCKWOOL_STACK,
      outputs: WALL_FIELD_OUTPUTS
    });

    expect(ROCKWOOL_NUMERIC_BOUNDARIES_AFTER_V28).toEqual({
      adjacentRockwoolStillSupported: "Rw 51 / R'w 49 / DnT,w 51",
      artifact: "rockwool_numeric_boundaries_after_v28",
      directExactRuntimeStillBlocked: true,
      firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
      flatListSplitOutputsStillWithheld: true,
      flatListSplitValue: "Rw 41 / R'w 39 / DnT,w 40",
      groupedRockwoolStillScreeningOnly: "Rw 41",
      splitWithholdWarning: ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING
    });
    expect(adjacentLab).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 51,
      stc: 51,
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
      supported: ["Rw", "STC", "C", "Ctr"],
      unsupported: []
    });
    expect(adjacentField).toMatchObject({
      confidence: "medium",
      dnTw: 51,
      family: "double_leaf",
      rwPrime: 49,
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
      supported: ["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"],
      unsupported: []
    });
    expect(splitLab).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 41,
      stc: 41,
      strategy: "multileaf_screening_blend",
      supported: [],
      unsupported: ["Rw", "STC", "C", "Ctr"]
    });
    expect(splitField).toMatchObject({
      confidence: "low",
      dnTw: 40,
      family: "multileaf_multicavity",
      rwPrime: 39,
      strategy: "multileaf_screening_blend",
      supported: [],
      unsupported: ["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"]
    });
    expect(splitLab.warnings).toContain(ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING);
    expect(splitField.warnings).toContain(ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING);
  });

  it("keeps active docs and the current-gate runner aligned with V28 selection", () => {
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain("src/calculator-source-gap-revalidation-v28-gate-a-contract.test.ts");
    expect(ROCKWOOL_SOURCE_PACKET_REFRESH_SELECTED_AFTER_V28).toEqual({
      artifact: "rockwool_rights_safe_source_packet_refresh_selected_after_v28",
      selectedReason:
        "after_source_backed_UBIQ_open_web_current_gate_closure_the_highest_user_visible_numeric_correctness_blocker_is_still_Rockwool_split_triple_leaf_but_exact_runtime_requires_a_rights_safe_source_owned_curve_payload_first",
      targetFile:
        "packages/engine/src/rockwool-split-triple-leaf-rights-safe-source-packet-refresh-v2-gate-a-contract.test.ts",
      targetPlan:
        "docs/calculator/SLICE_ROCKWOOL_SPLIT_TRIPLE_LEAF_RIGHTS_SAFE_SOURCE_PACKET_REFRESH_V2_PLAN.md"
    });
    expect(RAW_OPEN_WEB_AND_COMPANY_BLOCKERS_CARRY_FORWARD_AFTER_V28).toEqual({
      artifact: "raw_open_web_and_company_internal_blockers_carry_forward_after_v28",
      companyInternalHighAccuracyOpening:
        "blocked_until_remaining_numeric_correctness_source_ownership_exit_criteria_close",
      genericOrRawOpenWeb: "blocked_by_source_owned_raw_carrier_negative_boundary_absent",
      status: "no_raw_open_web_or_company_internal_opening_selected_at_v28"
    });

    for (const relativePath of REQUIRED_ALIGNED_DOCS) {
      const doc = readRepoFile(relativePath);

      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V28_GATE_A.selectionStatus);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V28_GATE_A.selectedNextAction);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V28_GATE_A.targetFirstGateFile);
      expect(doc).toContain("rockwool_rights_safe_source_packet_refresh_selected_after_v28");
      expect(doc).toContain("rockwool_numeric_boundaries_after_v28");
      expect(doc).toContain("ubiq_packaged_finish_current_gate_pack_preserved_after_v28");
      expect(doc).toContain("source_owned_raw_carrier_negative_boundary_absent");
    }
  });
});
