import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING } from "./rockwool-split-triple-leaf-numeric-source-closure";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type V27Candidate = {
  firstMissingRequirement: string;
  id: string;
  rank: number;
  reason: string;
  selectedNext: boolean;
  sourceBackedGuardReadyNow: boolean;
  targetFile: string;
  validationScope: readonly string[];
};

const UBIQ_SYSTEM_TABLE_URL = "https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf";

const CALCULATOR_SOURCE_GAP_REVALIDATION_V27_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_revalidate_source_gap_order_after_ubiq_supported_band_current_gate_closeout",
  latestClosedSlice: "ubiq_open_web_supported_band_current_gate_guard_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "ubiq_open_web_packaged_finish_current_gate_guard_v1",
  selectedNextAction: "gate_a_promote_ubiq_open_web_packaged_finish_engine_visible_guards_into_current_gate",
  selectedPlanningSurface: "docs/calculator/SLICE_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_V1_PLAN.md",
  selectedRouteFamily: "ubiq_open_web_packaged_finish_source_backed_floor_coverage_guard",
  selectionStatus:
    "selected_ubiq_open_web_packaged_finish_current_gate_guard_after_v27_rerank_preserved_rockwool_and_raw_open_web_blockers",
  sliceId: "calculator_source_gap_revalidation_v27",
  sourceBackedGuardReadyNow: true,
  sourceReadyRuntimePackImportedNow: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const UBIQ_PACKAGED_FINISH_READY_SURFACES = {
  artifact: "ubiq_packaged_finish_ready_surfaces_after_v27",
  boundOpenWebRowsGuardedByExistingTests: 21,
  engineFamilyDesignGuard: "packages/engine/src/ubiq-open-web-packaged-finish-family-design.test.ts",
  engineLaneTraceGuard: "packages/engine/src/ubiq-open-web-packaged-lane-trace-matrix.test.ts",
  engineNearMissGuard: "packages/engine/src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts",
  exactOpenWebRowsGuardedByExistingTests: 90,
  sourceUrl: UBIQ_SYSTEM_TABLE_URL,
  visibleFamilyCardGuard: "apps/web/features/workbench/ubiq-open-web-packaged-finish-family-card-design.test.ts",
  visibleHistoryReplayGuard: "apps/web/features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts",
  visibleLaneCardGuard: "apps/web/features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts",
  visibleNearMissCardGuard: "apps/web/features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts"
} as const;

const ROCKWOOL_SOURCE_BLOCKERS_CARRY_FORWARD = {
  adjacentRockwoolStillSupported: "Rw 51 / R'w 49 / DnT,w 51",
  artifact: "rockwool_source_blockers_carry_forward_after_v27",
  directExactRuntimeSelectedNow: false,
  firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
  flatListSplitOutputsWithheld: true,
  flatListSplitValue: "Rw 41 / R'w 39 / DnT,w 40",
  groupedRockwoolValue: "Rw 41",
  groupedStrategy: "multileaf_screening_blend",
  splitWithholdWarning: ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING
} as const;

const PACKAGED_FINISH_CURRENT_GATE_GUARD_SELECTED = {
  artifact: "packaged_finish_current_gate_guard_selected_after_v27",
  currentGateGap:
    "existing_source_backed_packaged_finish_family_near_miss_history_and_visible_guards_are_not_yet_owned_as_one_current_gate_pack",
  selectedReason:
    "the_next_best_correctness_step_is_to_current_gate_the_full_UBIQ_packaged_open_web_finish_surface_before_any_raw_open_web_widening_or_Rockwool_exact_runtime_promotion",
  targetFile: "packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts"
} as const;

const V27_RERANK_CANDIDATES: readonly V27Candidate[] = [
  {
    firstMissingRequirement: "dedicated_current_gate_owner_for_packaged_finish_engine_visible_guard_pack",
    id: "ubiq_open_web_packaged_finish_current_gate_guard",
    rank: 1,
    reason:
      "this_is_the_highest_actionable_accuracy_step_because_the_90_exact_and_21_bound_UBIQ_open_web_rows_already_have_source_backed_engine_and_visible_tests_but_need_one_current_gate_owner_before_broader_open_web_claims",
    selectedNext: true,
    sourceBackedGuardReadyNow: true,
    targetFile: "packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts",
    validationScope: [
      "ubiq-open-web-packaged-finish-family-design",
      "ubiq-open-web-packaged-finish-near-miss-matrix",
      "ubiq-open-web-packaged-lane-trace-matrix",
      "ubiq-open-web-packaged-finish-family-card-design",
      "ubiq-open-web-packaged-finish-near-miss-card-matrix",
      "ubiq-open-web-packaged-finish-history-replay-matrix",
      "ubiq-open-web-packaged-lane-card-matrix",
      "pnpm_calculator_gate_current",
      "git_diff_check"
    ]
  },
  {
    firstMissingRequirement: "rights_safe_source_owned_curve_payload_absent",
    id: "direct_rockwool_split_internal_leaf_exact_runtime_fix",
    rank: 2,
    reason:
      "rockwool_remains_user_visible_and_high_priority_but_exact_runtime_import_still_lacks_rights_safe_source_owned_curves_topology_material_metric_tolerance_negative_boundaries_calibration_holdout_and_paired_visible_tests",
    selectedNext: false,
    sourceBackedGuardReadyNow: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    validationScope: ["wall_triple_leaf_uris2006_source_packet_acquisition_gate_u"]
  },
  {
    firstMissingRequirement: "source_owned_raw_carrier_negative_boundary_absent",
    id: "generic_or_raw_open_web_family_widening",
    rank: 3,
    reason:
      "generic_raw_open_web_widening_could_move_coverage_but_must_wait_until_packaged_finish_current_gate_ownership_is_closed_and_raw_bare_carriers_have_named_source_owned_topology_metric_tolerance_and_negative_boundaries",
    selectedNext: false,
    sourceBackedGuardReadyNow: false,
    targetFile: "docs/calculator/SOURCE_GAP_LEDGER.md",
    validationScope: ["raw_bare_open_web_open_box_source_evidence_re_rank_v1"]
  },
  {
    firstMissingRequirement: "remaining_numeric_correctness_and_source_blockers_not_closed",
    id: "company_internal_high_accuracy_opening",
    rank: 4,
    reason:
      "company_internal_opening_still_depends_on_closing_or_explicitly_bounding_remaining_numeric_source_gaps_not_on_relabeling_current_guard_coverage",
    selectedNext: false,
    sourceBackedGuardReadyNow: false,
    targetFile: "docs/calculator/CURRENT_STATE.md",
    validationScope: ["pnpm_check"]
  },
  {
    firstMissingRequirement: "correctness_first_source_revalidation_still_pending",
    id: "confidence_or_productization_cleanup",
    rank: 5,
    reason:
      "confidence_copy_and_productization_are_lower_priority_than_correct_numbers_source_owned_runtime_or_guard_coverage_and_hostile_input_boundaries",
    selectedNext: false,
    sourceBackedGuardReadyNow: false,
    targetFile: "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
    validationScope: ["none_selected"]
  }
] as const;

const REQUIRED_EXISTING_SURFACES = [
  "packages/engine/src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts",
  "packages/engine/src/post-ubiq-open-web-supported-band-current-gate-guard-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/ubiq-open-web-packaged-finish-family-design.test.ts",
  "packages/engine/src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts",
  "packages/engine/src/ubiq-open-web-packaged-lane-trace-matrix.test.ts",
  "apps/web/features/workbench/ubiq-open-web-packaged-finish-family-card-design.test.ts",
  "apps/web/features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts",
  "apps/web/features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts",
  "apps/web/features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V27_PLAN.md",
  "docs/calculator/SLICE_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V27_GATE_A_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_ALIGNED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V27_PLAN.md",
  "docs/calculator/SLICE_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V27_GATE_A_HANDOFF.md"
] as const;

const LAB_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"] as const satisfies readonly RequestedOutputId[];

const UBIQ_WEAK_CARPET_EXACT_STACK: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: 15 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 400 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 }
];

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

function assemblySnapshot(layers: readonly LayerInput[]) {
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

describe("calculator source-gap revalidation V27 Gate A", () => {
  it("lands V27 no-runtime and selects the UBIQ packaged-finish current-gate guard", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V27_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_revalidate_source_gap_order_after_ubiq_supported_band_current_gate_closeout",
      latestClosedSlice: "ubiq_open_web_supported_band_current_gate_guard_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "ubiq_open_web_packaged_finish_current_gate_guard_v1",
      selectedNextAction: "gate_a_promote_ubiq_open_web_packaged_finish_engine_visible_guards_into_current_gate",
      selectedPlanningSurface: "docs/calculator/SLICE_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_V1_PLAN.md",
      selectedRouteFamily: "ubiq_open_web_packaged_finish_source_backed_floor_coverage_guard",
      selectionStatus:
        "selected_ubiq_open_web_packaged_finish_current_gate_guard_after_v27_rerank_preserved_rockwool_and_raw_open_web_blockers",
      sliceId: "calculator_source_gap_revalidation_v27",
      sourceBackedGuardReadyNow: true,
      sourceReadyRuntimePackImportedNow: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const relativePath of REQUIRED_EXISTING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, relativePath)), relativePath).toBe(true);
    }
  });

  it("ranks packaged-finish current-gate ownership above blocked Rockwool and raw open-web widening", () => {
    expect(V27_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "ubiq_open_web_packaged_finish_current_gate_guard",
      "direct_rockwool_split_internal_leaf_exact_runtime_fix",
      "generic_or_raw_open_web_family_widening",
      "company_internal_high_accuracy_opening",
      "confidence_or_productization_cleanup"
    ]);
    expect(V27_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        firstMissingRequirement: "dedicated_current_gate_owner_for_packaged_finish_engine_visible_guard_pack",
        id: "ubiq_open_web_packaged_finish_current_gate_guard",
        rank: 1,
        reason:
          "this_is_the_highest_actionable_accuracy_step_because_the_90_exact_and_21_bound_UBIQ_open_web_rows_already_have_source_backed_engine_and_visible_tests_but_need_one_current_gate_owner_before_broader_open_web_claims",
        selectedNext: true,
        sourceBackedGuardReadyNow: true,
        targetFile: "packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts",
        validationScope: [
          "ubiq-open-web-packaged-finish-family-design",
          "ubiq-open-web-packaged-finish-near-miss-matrix",
          "ubiq-open-web-packaged-lane-trace-matrix",
          "ubiq-open-web-packaged-finish-family-card-design",
          "ubiq-open-web-packaged-finish-near-miss-card-matrix",
          "ubiq-open-web-packaged-finish-history-replay-matrix",
          "ubiq-open-web-packaged-lane-card-matrix",
          "pnpm_calculator_gate_current",
          "git_diff_check"
        ]
      }
    ]);
    expect(V27_RERANK_CANDIDATES.find((candidate) => candidate.id.includes("rockwool"))?.firstMissingRequirement).toBe(
      "rights_safe_source_owned_curve_payload_absent"
    );
    expect(
      V27_RERANK_CANDIDATES.find((candidate) => candidate.id === "generic_or_raw_open_web_family_widening")
        ?.firstMissingRequirement
    ).toBe("source_owned_raw_carrier_negative_boundary_absent");
  });

  it("proves the selected UBIQ packaged-finish guard is source-backed and numeric-output relevant", () => {
    const exactRows = openWebExactRows();
    const boundRows = openWebBoundRows();

    expect(UBIQ_PACKAGED_FINISH_READY_SURFACES).toEqual({
      artifact: "ubiq_packaged_finish_ready_surfaces_after_v27",
      boundOpenWebRowsGuardedByExistingTests: 21,
      engineFamilyDesignGuard: "packages/engine/src/ubiq-open-web-packaged-finish-family-design.test.ts",
      engineLaneTraceGuard: "packages/engine/src/ubiq-open-web-packaged-lane-trace-matrix.test.ts",
      engineNearMissGuard: "packages/engine/src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts",
      exactOpenWebRowsGuardedByExistingTests: 90,
      sourceUrl: UBIQ_SYSTEM_TABLE_URL,
      visibleFamilyCardGuard: "apps/web/features/workbench/ubiq-open-web-packaged-finish-family-card-design.test.ts",
      visibleHistoryReplayGuard: "apps/web/features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts",
      visibleLaneCardGuard: "apps/web/features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts",
      visibleNearMissCardGuard: "apps/web/features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts"
    });
    expect(PACKAGED_FINISH_CURRENT_GATE_GUARD_SELECTED).toEqual({
      artifact: "packaged_finish_current_gate_guard_selected_after_v27",
      currentGateGap:
        "existing_source_backed_packaged_finish_family_near_miss_history_and_visible_guards_are_not_yet_owned_as_one_current_gate_pack",
      selectedReason:
        "the_next_best_correctness_step_is_to_current_gate_the_full_UBIQ_packaged_open_web_finish_surface_before_any_raw_open_web_widening_or_Rockwool_exact_runtime_promotion",
      targetFile: "packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts"
    });

    expect(exactRows).toHaveLength(90);
    expect(boundRows).toHaveLength(21);
    expect(new Set([...exactRows, ...boundRows].map((system) => system.sourceUrl ?? ""))).toEqual(
      new Set([UBIQ_SYSTEM_TABLE_URL])
    );

    expect(assemblySnapshot(UBIQ_WEAK_CARPET_EXACT_STACK)).toEqual({
      boundMatchId: null,
      exactMatchId: "ubiq_fl27_open_web_steel_400_19mm_carpet_underlay_exact_lab_2026",
      impactBasis: "official_floor_system_exact_match",
      lnW: 63,
      lnWPlusCI: 62,
      lowerBoundBasis: null,
      rw: 55,
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: ["DeltaLw"]
    });
    expect(assemblySnapshot(UBIQ_SUPPORTED_TIMBER_EXACT_STACK)).toEqual({
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
    expect(assemblySnapshot(UBIQ_SUPPORTED_CARPET_BOUND_STACK)).toEqual({
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

  it("keeps Rockwool exact runtime blocked while preserving the supported adjacent fix", () => {
    expect(ROCKWOOL_SOURCE_BLOCKERS_CARRY_FORWARD).toEqual({
      adjacentRockwoolStillSupported: "Rw 51 / R'w 49 / DnT,w 51",
      artifact: "rockwool_source_blockers_carry_forward_after_v27",
      directExactRuntimeSelectedNow: false,
      firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
      flatListSplitOutputsWithheld: true,
      flatListSplitValue: "Rw 41 / R'w 39 / DnT,w 40",
      groupedRockwoolValue: "Rw 41",
      groupedStrategy: "multileaf_screening_blend",
      splitWithholdWarning: ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING
    });
  });

  it("keeps active docs and the current-gate runner aligned with V27", () => {
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain("src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts");

    for (const relativePath of REQUIRED_ALIGNED_DOCS) {
      const contents = readRepoFile(relativePath);
      expect(contents).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V27_GATE_A.selectionStatus);
      expect(contents).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V27_GATE_A.selectedImplementationSlice);
      expect(contents).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V27_GATE_A.selectedNextAction);
      expect(contents).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V27_GATE_A.targetFirstGateFile);
      expect(contents).toContain("remaining_accuracy_gap_order_after_ubiq_supported_band_closeout");
      expect(contents).toContain("ubiq_packaged_finish_ready_surfaces_after_v27");
      expect(contents).toContain("packaged_finish_current_gate_guard_selected_after_v27");
      expect(contents).toContain("rockwool_source_blockers_carry_forward_after_v27");
      expect(contents).toContain("90 exact");
      expect(contents).toContain("21 bound");
    }
  });
});
