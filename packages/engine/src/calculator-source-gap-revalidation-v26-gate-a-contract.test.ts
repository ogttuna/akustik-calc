import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING } from "./rockwool-split-triple-leaf-numeric-source-closure";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type V26Candidate = {
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

const CALCULATOR_SOURCE_GAP_REVALIDATION_V26_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_revalidate_source_gap_order_after_rockwool_split_numeric_closure_closeout",
  latestClosedSlice: "rockwool_split_triple_leaf_numeric_source_closure_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "ubiq_open_web_weak_band_current_gate_guard_v1",
  selectedNextAction: "gate_a_promote_source_backed_ubiq_weak_band_exact_and_fail_closed_guards_into_current_gate",
  selectedPlanningSurface: "docs/calculator/SLICE_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_V1_PLAN.md",
  selectedRouteFamily: "ubiq_open_web_weak_band_source_backed_floor_coverage_guard",
  selectionStatus:
    "selected_ubiq_open_web_weak_band_current_gate_guard_after_v26_rerank_preserved_rockwool_blockers_and_found_source_backed_floor_exact_guard_gap",
  sliceId: "calculator_source_gap_revalidation_v26",
  sourceBackedGuardReadyNow: true,
  sourceReadyRuntimePackImportedNow: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const ROCKWOOL_SOURCE_BLOCKERS_CARRY_FORWARD = {
  adjacentRockwoolStillSupported: "Rw 51 / R'w 49 / DnT,w 51",
  artifact: "rockwool_source_blockers_carry_forward_after_v26",
  directExactRuntimeSelectedNow: false,
  firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
  flatListSplitOutputsWithheld: true,
  flatListSplitValue: "Rw 41 / R'w 39 / DnT,w 40",
  groupedRockwoolValue: "Rw 41",
  groupedStrategy: "multileaf_screening_blend",
  splitWithholdWarning: ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING
} as const;

const UBIQ_WEAK_BAND_GUARD_SELECTED = {
  artifact: "selected_ubiq_open_web_weak_band_current_gate_guard",
  exactRowsImported: 54,
  sourceUrl: UBIQ_SYSTEM_TABLE_URL,
  targetFile: "packages/engine/src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts",
  visibleGuard: "apps/web/features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts",
  engineExactGuard: "packages/engine/src/ubiq-open-web-weak-band-exact-source-mapping.test.ts",
  engineFailClosedGuard: "packages/engine/src/ubiq-open-web-weaker-band-posture-guard.test.ts",
  selectedReason:
    "FL-23/25/27 have source-owned exact rows and existing engine/web guards, but the current gate must explicitly carry both the exact lower-board lane and the upper-only impact fail-closed lane before more broad coverage claims"
} as const;

const V26_RERANK_CANDIDATES: readonly V26Candidate[] = [
  {
    firstMissingRequirement: "dedicated_current_gate_owner_for_existing_exact_and_fail_closed_guards",
    id: "ubiq_open_web_weak_band_current_gate_guard",
    rank: 1,
    reason:
      "this_is_the_highest_actionable_accuracy_step_after_rockwool_split_closeout_because_it_is_source_backed_now_exercises_real_floor_Rw_Lnw_field_outputs_and_prevents_upper_only_open_web_impact_outputs_from_borrowing_nearby_family_values",
    selectedNext: true,
    sourceBackedGuardReadyNow: true,
    targetFile: "packages/engine/src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts",
    validationScope: [
      "ubiq-open-web-weak-band-exact-source-mapping",
      "ubiq-open-web-weaker-band-posture-guard",
      "ubiq-open-web-weaker-band-card-posture",
      "pnpm_calculator_gate_current",
      "git_diff_check"
    ]
  },
  {
    firstMissingRequirement: "rights_safe_source_owned_curve_payload_absent",
    id: "direct_rockwool_split_internal_leaf_exact_runtime_fix",
    rank: 2,
    reason:
      "the_user_visible_rockwool_split_problem_remains_the_highest_known_wall_defect_but_exact_runtime_import_still_has_no_rights_safe_source_owned_curve_payload_topology_owner_material_mapping_metric_context_tolerance_owner_negative_boundaries_or_paired_visible_tests",
    selectedNext: false,
    sourceBackedGuardReadyNow: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    validationScope: ["wall_triple_leaf_uris2006_source_packet_acquisition_gate_u"]
  },
  {
    firstMissingRequirement: "new_authorized_or_rights_safe_uris_2006_numeric_packet",
    id: "repeat_uris_2006_acquisition_without_new_packet",
    rank: 3,
    reason:
      "repeating_the_same_uris_or_triple_panel_source_acquisition_without_a_new_authorized_numeric_packet_would_not_move_correctness_and_would_delay_source_backed_guard_coverage_that_is_ready_now",
    selectedNext: false,
    sourceBackedGuardReadyNow: false,
    targetFile: "docs/calculator/SLICE_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_PLAN.md",
    validationScope: ["rights_safe_source_packet_check"]
  },
  {
    firstMissingRequirement: "selected_accuracy_slice_closed_and_broad_validation_green",
    id: "company_internal_high_accuracy_opening",
    rank: 4,
    reason:
      "company_internal_opening_still_depends_on_closing_source_backed_guard_gaps_and_broad_validation_not_on_relabeling_the_current_screening_lanes_as_high_accuracy",
    selectedNext: false,
    sourceBackedGuardReadyNow: false,
    targetFile: "docs/calculator/CURRENT_STATE.md",
    validationScope: ["pnpm_check"]
  },
  {
    firstMissingRequirement: "remaining_numeric_correctness_and_source_backed_coverage_gaps_closed",
    id: "confidence_or_productization_cleanup",
    rank: 5,
    reason:
      "confidence_copy_and_productization_can_wait_because_the_current_user_priority_is_correct_numbers_and_common_combination_coverage_with_source_owned_test_guards",
    selectedNext: false,
    sourceBackedGuardReadyNow: false,
    targetFile: "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
    validationScope: ["none_selected"]
  }
] as const;

const REQUIRED_EXISTING_SURFACES = [
  "packages/engine/src/calculator-source-gap-revalidation-v26-gate-a-contract.test.ts",
  "packages/engine/src/post-rockwool-split-triple-leaf-numeric-source-closure-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/ubiq-open-web-weak-band-exact-source-mapping.test.ts",
  "packages/engine/src/ubiq-open-web-weaker-band-posture-guard.test.ts",
  "apps/web/features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V26_PLAN.md",
  "docs/calculator/SLICE_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V26_GATE_A_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_ALIGNED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V26_PLAN.md",
  "docs/calculator/SLICE_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V26_GATE_A_HANDOFF.md"
] as const;

const LAB_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

const FIELD_AIRBORNE_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const FIELD_IMPACT_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const UBIQ_FL23_UPPER_ONLY_STACK: readonly LayerInput[] = [
  {
    floorRole: "floor_covering",
    materialId: "engineered_timber_with_acoustic_underlay",
    thicknessMm: 20
  },
  {
    floorRole: "floating_screed",
    materialId: "inex_floor_panel",
    thicknessMm: 19
  },
  {
    floorRole: "base_structure",
    materialId: "open_web_steel_floor",
    thicknessMm: 300
  }
];

const UBIQ_FL23_EXACT_LOWER_BOARD_STACK: readonly LayerInput[] = [
  ...UBIQ_FL23_UPPER_ONLY_STACK,
  {
    floorRole: "ceiling_board",
    materialId: "firestop_board",
    thicknessMm: 13
  },
  {
    floorRole: "ceiling_board",
    materialId: "firestop_board",
    thicknessMm: 13
  }
];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function floorSnapshot(input: {
  layers: readonly LayerInput[];
  mode: "field" | "lab";
}) {
  const result = calculateAssembly(
    input.layers,
    input.mode === "lab"
      ? { targetOutputs: LAB_OUTPUTS }
      : {
          airborneContext: FIELD_AIRBORNE_CONTEXT,
          impactFieldContext: FIELD_IMPACT_CONTEXT,
          targetOutputs: FIELD_OUTPUTS
        }
  );

  return {
    dntw: result.metrics.estimatedDnTwDb ?? null,
    floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    lnW: result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? result.lowerBoundImpact?.LPrimeNTwUpperBound ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? result.lowerBoundImpact?.LPrimeNWUpperBound ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    rwPrime: result.metrics.estimatedRwPrimeDb ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs,
    warnings: result.warnings.join("\n")
  };
}

describe("calculator source-gap revalidation V26 Gate A", () => {
  it("lands V26 as a source-backed accuracy re-rank and selects the UBIQ weak-band guard", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V26_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_revalidate_source_gap_order_after_rockwool_split_numeric_closure_closeout",
      latestClosedSlice: "rockwool_split_triple_leaf_numeric_source_closure_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "ubiq_open_web_weak_band_current_gate_guard_v1",
      selectedNextAction:
        "gate_a_promote_source_backed_ubiq_weak_band_exact_and_fail_closed_guards_into_current_gate",
      selectedPlanningSurface: "docs/calculator/SLICE_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_V1_PLAN.md",
      selectedRouteFamily: "ubiq_open_web_weak_band_source_backed_floor_coverage_guard",
      selectionStatus:
        "selected_ubiq_open_web_weak_band_current_gate_guard_after_v26_rerank_preserved_rockwool_blockers_and_found_source_backed_floor_exact_guard_gap",
      sliceId: "calculator_source_gap_revalidation_v26",
      sourceBackedGuardReadyNow: true,
      sourceReadyRuntimePackImportedNow: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const relativePath of REQUIRED_EXISTING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, relativePath)), relativePath).toBe(true);
    }
  });

  it("keeps Rockwool exact runtime blocked while preserving the supported adjacent fix", () => {
    expect(ROCKWOOL_SOURCE_BLOCKERS_CARRY_FORWARD).toEqual({
      adjacentRockwoolStillSupported: "Rw 51 / R'w 49 / DnT,w 51",
      artifact: "rockwool_source_blockers_carry_forward_after_v26",
      directExactRuntimeSelectedNow: false,
      firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
      flatListSplitOutputsWithheld: true,
      flatListSplitValue: "Rw 41 / R'w 39 / DnT,w 40",
      groupedRockwoolValue: "Rw 41",
      groupedStrategy: "multileaf_screening_blend",
      splitWithholdWarning: ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING
    });
  });

  it("ranks UBIQ weak-band current-gate coverage above blocked Rockwool import and copy work", () => {
    expect(V26_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "ubiq_open_web_weak_band_current_gate_guard",
      "direct_rockwool_split_internal_leaf_exact_runtime_fix",
      "repeat_uris_2006_acquisition_without_new_packet",
      "company_internal_high_accuracy_opening",
      "confidence_or_productization_cleanup"
    ]);
    expect(V26_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        firstMissingRequirement: "dedicated_current_gate_owner_for_existing_exact_and_fail_closed_guards",
        id: "ubiq_open_web_weak_band_current_gate_guard",
        rank: 1,
        reason:
          "this_is_the_highest_actionable_accuracy_step_after_rockwool_split_closeout_because_it_is_source_backed_now_exercises_real_floor_Rw_Lnw_field_outputs_and_prevents_upper_only_open_web_impact_outputs_from_borrowing_nearby_family_values",
        selectedNext: true,
        sourceBackedGuardReadyNow: true,
        targetFile: "packages/engine/src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts",
        validationScope: [
          "ubiq-open-web-weak-band-exact-source-mapping",
          "ubiq-open-web-weaker-band-posture-guard",
          "ubiq-open-web-weaker-band-card-posture",
          "pnpm_calculator_gate_current",
          "git_diff_check"
        ]
      }
    ]);
    expect(V26_RERANK_CANDIDATES.find((candidate) => candidate.id.includes("rockwool"))?.firstMissingRequirement).toBe(
      "rights_safe_source_owned_curve_payload_absent"
    );
  });

  it("proves the selected UBIQ guard is source-backed and calculation-relevant", () => {
    const weakBandRows = EXACT_FLOOR_SYSTEMS.filter((system) => /^ubiq_fl(?:23|25|27)_open_web_steel_/u.test(system.id));
    const upperOnlyLab = floorSnapshot({ layers: UBIQ_FL23_UPPER_ONLY_STACK, mode: "lab" });
    const exactLab = floorSnapshot({ layers: UBIQ_FL23_EXACT_LOWER_BOARD_STACK, mode: "lab" });
    const exactField = floorSnapshot({ layers: UBIQ_FL23_EXACT_LOWER_BOARD_STACK, mode: "field" });

    expect(UBIQ_WEAK_BAND_GUARD_SELECTED).toEqual({
      artifact: "selected_ubiq_open_web_weak_band_current_gate_guard",
      exactRowsImported: 54,
      sourceUrl: UBIQ_SYSTEM_TABLE_URL,
      targetFile: "packages/engine/src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts",
      visibleGuard: "apps/web/features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts",
      engineExactGuard: "packages/engine/src/ubiq-open-web-weak-band-exact-source-mapping.test.ts",
      engineFailClosedGuard: "packages/engine/src/ubiq-open-web-weaker-band-posture-guard.test.ts",
      selectedReason:
        "FL-23/25/27 have source-owned exact rows and existing engine/web guards, but the current gate must explicitly carry both the exact lower-board lane and the upper-only impact fail-closed lane before more broad coverage claims"
    });
    expect(weakBandRows).toHaveLength(54);
    expect(new Set(weakBandRows.map((system) => system.sourceUrl))).toEqual(new Set([UBIQ_SYSTEM_TABLE_URL]));
    expect(new Set(weakBandRows.map((system) => system.familyEstimateEligible))).toEqual(new Set([false]));

    expect(upperOnlyLab).toMatchObject({
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      impactBasis: null,
      lnW: null,
      lnWPlusCI: null,
      rw: 73,
      supported: ["Rw"],
      unsupported: ["Ln,w", "Ln,w+CI", "DeltaLw"]
    });
    expect(upperOnlyLab.warnings).toMatch(/impact sound outputs are not available/i);

    expect(exactLab).toMatchObject({
      floorSystemEstimateKind: null,
      floorSystemMatchId: "ubiq_fl23_open_web_steel_300_19mm_timber_underlay_exact_lab_2026",
      impactBasis: "official_floor_system_exact_match",
      lnW: 71,
      lnWPlusCI: 70,
      rw: 51,
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: ["DeltaLw"]
    });
    expect(exactField).toMatchObject({
      dntw: 74,
      floorSystemEstimateKind: null,
      floorSystemMatchId: "ubiq_fl23_open_web_steel_300_19mm_timber_underlay_exact_lab_2026",
      impactBasis: "mixed_exact_plus_estimated_local_guide",
      lnW: 71,
      lPrimeNTw: 70.6,
      lPrimeNW: 73,
      rw: 51,
      rwPrime: 72,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    });
  });

  it("keeps active docs aligned with V26 and the selected UBIQ next slice", () => {
    for (const relativePath of REQUIRED_ALIGNED_DOCS) {
      const contents = readRepoFile(relativePath);
      expect(contents).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V26_GATE_A.selectionStatus);
      expect(contents).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V26_GATE_A.selectedImplementationSlice);
      expect(contents).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V26_GATE_A.selectedNextAction);
      expect(contents).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V26_GATE_A.targetFirstGateFile);
      expect(contents).toContain("remaining_accuracy_gap_order_after_rockwool_closeout");
      expect(contents).toContain("rockwool_source_blockers_carry_forward_after_v26");
      expect(contents).toContain("selected_ubiq_open_web_weak_band_current_gate_guard");
      expect(contents).toContain("FL-23/25/27");
    }
  });
});
