import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type NextSliceCandidate = {
  firstMissingRequirement: string;
  id: string;
  rank: number;
  reason: string;
  selectedNext: boolean;
  targetFile: string;
  validationScope: readonly string[];
};

const UBIQ_SYSTEM_TABLE_URL = "https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf";
const SUPPORTED_BAND_PATTERN = /^ubiq_fl(?:24|26|28)_open_web_steel_/u;

const UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "ubiq_open_web_supported_band_current_gate_guard_v1",
  confidencePromotion: false,
  currentGateRunnerChangedAtGateC: true,
  evidencePromotion: false,
  gateCNumericRuntimeBehaviorChange: false,
  latestLandedGate: "gate_a_promoted_source_backed_ubiq_supported_band_exact_and_bound_guards_into_current_gate",
  latestLandedStatus: "gate_a_promoted_ubiq_supported_band_exact_and_bound_guards_into_current_gate_selected_closeout",
  nextExecutionAction: "gate_a_revalidate_source_gap_order_after_ubiq_supported_band_current_gate_closeout",
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v27",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V27_PLAN.md",
  selectedRouteFamily: "calculator_source_gap_revalidation_after_ubiq_supported_band_current_gate_guard",
  selectionStatus:
    "closed_ubiq_open_web_supported_band_current_gate_guard_selected_source_gap_revalidation_v27",
  sliceId: "post_ubiq_open_web_supported_band_current_gate_guard_v1_next_slice_selection",
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const CLOSED_UBIQ_SUPPORTED_BAND_CURRENT_GATE_GUARD_SUMMARY = {
  artifact: "closed_ubiq_supported_band_current_gate_guard_summary",
  boundCarpetRowsGuarded: 18,
  exactBareAndTimberRowsGuarded: 36,
  sourceUrl: UBIQ_SYSTEM_TABLE_URL,
  supportedBandRowsRemainSourceOwned: true
} as const;

const SUPPORTED_BAND_CURRENT_GATE_PACK_CARRY_FORWARD = {
  artifact: "supported_band_current_gate_pack_carry_forward",
  engineBoundHistoryGuard: "src/ubiq-lnw-plus-ci-bound-history-guard.test.ts",
  engineCloseoutGuard: "src/post-ubiq-open-web-supported-band-current-gate-guard-v1-next-slice-selection-contract.test.ts",
  engineGateA: "src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts",
  engineNearMissGuard: "src/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts",
  engineSupportedBandGuard: "src/ubiq-open-web-supported-band-finish-completion.test.ts",
  visibleBoundHistoryGuard: "features/workbench/ubiq-lnw-plus-ci-bound-history-guard.test.ts",
  visibleNearMissGuard: "features/workbench/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts"
} as const;

const SOURCE_GAP_REVALIDATION_V27_SELECTED = {
  artifact: "source_gap_revalidation_v27_selected_after_ubiq_supported_band_closeout",
  selectedNextSlice: "calculator_source_gap_revalidation_v27",
  targetFile: "packages/engine/src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts",
  nextExecutionAction: "gate_a_revalidate_source_gap_order_after_ubiq_supported_band_current_gate_closeout",
  selectedReason:
    "UBIQ_FL_23_28_exact_and_bound_surfaces_are_now_current_gate_owned_so_the_next_correctness_step_is_a_source_gap_re_rank_before_any_generic_open_web_or_rockwool_runtime_promotion"
} as const;

const ROCKWOOL_BLOCKERS_STILL_CARRY_FORWARD = {
  artifact: "rockwool_blockers_still_carry_forward_after_ubiq_supported_band_closeout",
  adjacentStillSupported: "Rw 51 / R'w 49 / DnT,w 51",
  directExactRuntimeStillBlocked: true,
  firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
  flatListSplitStillWithheld: "Rw 41 / R'w 39 / DnT,w 40",
  groupedStillScreeningOnly: "Rw 41"
} as const;

const NEXT_SLICE_SELECTION_MATRIX: readonly NextSliceCandidate[] = [
  {
    firstMissingRequirement: "post_ubiq_supported_band_source_gap_re_rank_needed_before_new_runtime_widening",
    id: "calculator_source_gap_revalidation_v27",
    rank: 1,
    reason:
      "supported_band_current_gate_ownership_is_now_closed_so_the_next_best_accuracy_step_is_to_re_rank_remaining_source_ready_runtime_or_guard_work_instead_of_guessing_generic_open_web_or_rockwool_exact_runtime_promotion",
    selectedNext: true,
    targetFile: "packages/engine/src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts",
    validationScope: [
      "supported_band_current_gate_pack",
      "rockwool_blocker_carry_forward",
      "generic_open_web_widening_boundary",
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
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    validationScope: ["wall_triple_leaf_uris2006_source_packet_acquisition_gate_u"]
  },
  {
    firstMissingRequirement: "v27_must_confirm_source_owned_negative_boundaries_after_supported_band_closeout",
    id: "generic_open_web_family_widening",
    rank: 3,
    reason:
      "UBIQ_open_web_exact_and_bound_guards_are_now_owned_but_generic_or_raw_open_web_widening_still_needs_a_fresh_source_gap_re_rank_to_keep_raw_bare_carriers_and near_misses_fail_closed",
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_GAP_LEDGER.md",
    validationScope: ["raw_bare_open_web_open_box_source_evidence_re_rank_v1"]
  },
  {
    firstMissingRequirement: "remaining_numeric_correctness_and_source_blockers_not_closed",
    id: "company_internal_high_accuracy_opening",
    rank: 4,
    reason:
      "company_internal_high_accuracy_opening_still_depends_on_closing_or_explicitly_bounding_remaining_numeric_source_gaps_not_on_this_closeout_alone",
    selectedNext: false,
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
    targetFile: "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
    validationScope: ["none_selected"]
  }
] as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/post-ubiq-open-web-supported-band-current-gate-guard-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts",
  "packages/engine/src/ubiq-open-web-supported-band-finish-completion.test.ts",
  "packages/engine/src/ubiq-lnw-plus-ci-bound-history-guard.test.ts",
  "packages/engine/src/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts",
  "apps/web/features/workbench/ubiq-lnw-plus-ci-bound-history-guard.test.ts",
  "apps/web/features/workbench/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_V1_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V27_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_ALIGNED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_V1_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V27_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_GATE_C_CLOSEOUT_HANDOFF.md"
] as const;

const FL28_BARE_STACK: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 400 }
];

const FL28_CARPET_BOUND_STACK: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: 12 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
];

const FL28_CARPET_BOUND_NEAR_MISS: readonly LayerInput[] = [
  ...FL28_CARPET_BOUND_STACK.slice(0, 7),
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 305 }
];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function assemblySnapshot(layers: readonly LayerInput[]) {
  const result = calculateAssembly(layers, {
    targetOutputs: ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"] satisfies RequestedOutputId[]
  });

  return {
    boundMatchId: result.boundFloorSystemMatch?.system.id ?? null,
    exactMatchId: result.floorSystemMatch?.system.id ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? result.lowerBoundImpact?.LnWPlusCIUpperBound ?? null,
    lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

function impactOnlyNearMissSnapshot(layers: readonly LayerInput[]) {
  const result = calculateImpactOnly(layers, {
    targetOutputs: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"] satisfies RequestedOutputId[]
  });

  return {
    boundMatchId: result.boundFloorSystemMatch?.system.id ?? null,
    exactMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

describe("post UBIQ open-web supported-band current-gate guard next-slice selection", () => {
  it("closes the supported-band current-gate guard and selects source-gap revalidation V27", () => {
    expect(UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "ubiq_open_web_supported_band_current_gate_guard_v1",
      confidencePromotion: false,
      currentGateRunnerChangedAtGateC: true,
      evidencePromotion: false,
      gateCNumericRuntimeBehaviorChange: false,
      latestLandedGate: "gate_a_promoted_source_backed_ubiq_supported_band_exact_and_bound_guards_into_current_gate",
      latestLandedStatus: "gate_a_promoted_ubiq_supported_band_exact_and_bound_guards_into_current_gate_selected_closeout",
      nextExecutionAction: "gate_a_revalidate_source_gap_order_after_ubiq_supported_band_current_gate_closeout",
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_source_gap_revalidation_v27",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V27_PLAN.md",
      selectedRouteFamily: "calculator_source_gap_revalidation_after_ubiq_supported_band_current_gate_guard",
      selectionStatus:
        "closed_ubiq_open_web_supported_band_current_gate_guard_selected_source_gap_revalidation_v27",
      sliceId: "post_ubiq_open_web_supported_band_current_gate_guard_v1_next_slice_selection",
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const relativePath of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, relativePath)), relativePath).toBe(true);
    }
  });

  it("preserves the supported-band current-gate exact and bound pack", () => {
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(CLOSED_UBIQ_SUPPORTED_BAND_CURRENT_GATE_GUARD_SUMMARY).toEqual({
      artifact: "closed_ubiq_supported_band_current_gate_guard_summary",
      boundCarpetRowsGuarded: 18,
      exactBareAndTimberRowsGuarded: 36,
      sourceUrl: UBIQ_SYSTEM_TABLE_URL,
      supportedBandRowsRemainSourceOwned: true
    });
    expect(SUPPORTED_BAND_CURRENT_GATE_PACK_CARRY_FORWARD).toEqual({
      artifact: "supported_band_current_gate_pack_carry_forward",
      engineBoundHistoryGuard: "src/ubiq-lnw-plus-ci-bound-history-guard.test.ts",
      engineCloseoutGuard: "src/post-ubiq-open-web-supported-band-current-gate-guard-v1-next-slice-selection-contract.test.ts",
      engineGateA: "src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts",
      engineNearMissGuard: "src/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts",
      engineSupportedBandGuard: "src/ubiq-open-web-supported-band-finish-completion.test.ts",
      visibleBoundHistoryGuard: "features/workbench/ubiq-lnw-plus-ci-bound-history-guard.test.ts",
      visibleNearMissGuard: "features/workbench/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts"
    });
    for (const gateFile of Object.values(SUPPORTED_BAND_CURRENT_GATE_PACK_CARRY_FORWARD)) {
      if (gateFile === "supported_band_current_gate_pack_carry_forward") {
        continue;
      }
      expect(runner).toContain(gateFile);
    }
  });

  it("keeps supported-band exact, bound-only, and near-miss boundaries pinned", () => {
    const exactSupportedRows = EXACT_FLOOR_SYSTEMS.filter((system) => SUPPORTED_BAND_PATTERN.test(system.id));
    const boundSupportedRows = BOUND_FLOOR_SYSTEMS.filter((system) => SUPPORTED_BAND_PATTERN.test(system.id));

    expect(exactSupportedRows).toHaveLength(36);
    expect(boundSupportedRows.filter((system) => system.label.toLowerCase().includes("carpet"))).toHaveLength(18);
    expect(new Set(exactSupportedRows.map((system) => system.sourceUrl))).toEqual(new Set([UBIQ_SYSTEM_TABLE_URL]));

    expect(assemblySnapshot(FL28_BARE_STACK)).toEqual({
      boundMatchId: null,
      exactMatchId: "ubiq_fl28_open_web_steel_400_19mm_bare_exact_lab_2026",
      lnW: 58,
      lnWPlusCI: 56,
      lowerBoundBasis: null,
      rw: 64,
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: ["DeltaLw"]
    });
    expect(assemblySnapshot(FL28_CARPET_BOUND_STACK)).toEqual({
      boundMatchId: "ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026",
      exactMatchId: null,
      lnW: null,
      lnWPlusCI: 45,
      lowerBoundBasis: "official_floor_system_bound_support",
      rw: 64,
      supported: ["Rw", "Ln,w+CI"],
      unsupported: ["Ln,w", "DeltaLw"]
    });
    expect(impactOnlyNearMissSnapshot(FL28_CARPET_BOUND_NEAR_MISS)).toEqual({
      boundMatchId: null,
      exactMatchId: null,
      impactBasis: null,
      lnW: null,
      lnWPlusCI: null,
      lowerBoundBasis: null,
      supported: [],
      unsupported: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]
    });
  });

  it("selects V27 revalidation before Rockwool exact promotion or generic open-web widening", () => {
    expect(SOURCE_GAP_REVALIDATION_V27_SELECTED).toEqual({
      artifact: "source_gap_revalidation_v27_selected_after_ubiq_supported_band_closeout",
      selectedNextSlice: "calculator_source_gap_revalidation_v27",
      targetFile: "packages/engine/src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts",
      nextExecutionAction: "gate_a_revalidate_source_gap_order_after_ubiq_supported_band_current_gate_closeout",
      selectedReason:
        "UBIQ_FL_23_28_exact_and_bound_surfaces_are_now_current_gate_owned_so_the_next_correctness_step_is_a_source_gap_re_rank_before_any_generic_open_web_or_rockwool_runtime_promotion"
    });
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        firstMissingRequirement: "post_ubiq_supported_band_source_gap_re_rank_needed_before_new_runtime_widening",
        id: "calculator_source_gap_revalidation_v27",
        rank: 1,
        reason:
          "supported_band_current_gate_ownership_is_now_closed_so_the_next_best_accuracy_step_is_to_re_rank_remaining_source_ready_runtime_or_guard_work_instead_of_guessing_generic_open_web_or_rockwool_exact_runtime_promotion",
        selectedNext: true,
        targetFile: "packages/engine/src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts",
        validationScope: [
          "supported_band_current_gate_pack",
          "rockwool_blocker_carry_forward",
          "generic_open_web_widening_boundary",
          "pnpm_calculator_gate_current",
          "git_diff_check"
        ]
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.find((candidate) => candidate.id.includes("rockwool"))?.firstMissingRequirement).toBe(
      "rights_safe_source_owned_curve_payload_absent"
    );
  });

  it("keeps Rockwool blockers and active docs aligned after supported-band closeout", () => {
    expect(ROCKWOOL_BLOCKERS_STILL_CARRY_FORWARD).toEqual({
      artifact: "rockwool_blockers_still_carry_forward_after_ubiq_supported_band_closeout",
      adjacentStillSupported: "Rw 51 / R'w 49 / DnT,w 51",
      directExactRuntimeStillBlocked: true,
      firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
      flatListSplitStillWithheld: "Rw 41 / R'w 39 / DnT,w 40",
      groupedStillScreeningOnly: "Rw 41"
    });

    for (const relativePath of REQUIRED_ALIGNED_DOCS) {
      const contents = readRepoFile(relativePath);
      expect(contents).toContain(UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_CLOSEOUT.selectionStatus);
      expect(contents).toContain(UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_CLOSEOUT.selectedImplementationSlice);
      expect(contents).toContain(UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_CLOSEOUT.targetFirstGateFile);
      expect(contents).toContain(UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_CLOSEOUT.nextExecutionAction);
      expect(contents).toContain("closed_ubiq_supported_band_current_gate_guard_summary");
      expect(contents).toContain("supported_band_current_gate_pack_carry_forward");
      expect(contents).toContain("source_gap_revalidation_v27_selected_after_ubiq_supported_band_closeout");
      expect(contents).toContain("rockwool_blockers_still_carry_forward_after_ubiq_supported_band_closeout");
    }
  });
});
