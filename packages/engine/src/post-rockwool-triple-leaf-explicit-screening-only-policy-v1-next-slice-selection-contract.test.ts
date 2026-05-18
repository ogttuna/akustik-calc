import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type NextSliceCandidate = {
  firstMissingRequirement: string;
  id: string;
  reason: string;
  runtimeEligibleNow: false;
  selectedNext: boolean;
  targetFile: string;
};

const ROCKWOOL_POLICY_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "rockwool_triple_leaf_explicit_screening_only_policy_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  gateCNumericRuntimeBehaviorChange: false,
  latestLandedGate: "gate_b_pin_visible_rockwool_triple_leaf_screening_only_policy",
  latestLandedStatus:
    "gate_b_pinned_visible_rockwool_triple_leaf_screening_only_policy_no_runtime_selected_gate_c_closeout",
  nextExecutionAction: "gate_a_inventory_source_promotion_and_hostile_input_readiness_after_rockwool_policy_closeout",
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportValueChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "source_promotion_hostile_input_readiness_guard_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_V1_PLAN.md",
  selectedRouteFamily: "source_promotion_hostile_input_readiness_after_rockwool_policy_closeout",
  selectionStatus:
    "closed_rockwool_triple_leaf_explicit_screening_only_policy_no_runtime_and_selected_source_promotion_hostile_input_readiness_guard",
  sliceId: "post_rockwool_triple_leaf_explicit_screening_only_policy_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts",
  visibleCopyChange: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts",
  "apps/web/features/workbench/rockwool-triple-leaf-explicit-screening-only-policy-gate-b-visible.test.ts",
  "packages/engine/src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts",
  "apps/web/features/workbench/rockwool-triple-leaf-screening-policy-copy.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v23-gate-a-contract.test.ts",
  "packages/engine/src/company-internal-misclassification-readiness-blocker-contract.test.ts",
  "packages/engine/src/raw-wall-hostile-input-answer-matrix.test.ts",
  "packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_GATE_B_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_V1_PLAN.md",
  "docs/calculator/SLICE_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_V1_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_ALIGNED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_V1_PLAN.md",
  "docs/calculator/SLICE_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const ROCKWOOL_POLICY_GATE_C_CLOSEOUT_SUMMARY = {
  artifact: "rockwool_policy_gate_c_closeout_summary",
  gateAInventoryClosed: true,
  gateBVisibleCopyClosed: true,
  groupedRockwoolDesignGradeAllowedNow: false,
  groupedRockwoolExactSourceValidatedNow: false,
  rockwoolExplicitScreeningOnlyPolicyClosed: true,
  runtimeSourceEvidenceCreatedByPolicy: false,
  visibleRockwoolScreeningOnlyGuardActive: true
} as const;

const ROCKWOOL_EXACT_OR_SCREENING_COMPANY_CRITERION_CLOSED = {
  artifact: "rockwool_exact_or_screening_company_criterion_closed",
  exactRuntimeFixedNow: false,
  explicitScreeningOnlyCriterionClosed: true,
  fieldOutputsDesignGradeAllowedNow: false,
  groupedScreeningAnswer: "Rw 41",
  groupedStrategy: "multileaf_screening_blend",
  sourceLaneDisposition: "paused_waiting_rights_safe_source_packet"
} as const;

const SOURCE_PROMOTION_HOSTILE_INPUT_OPENING_BLOCKERS_CARRY_FORWARD = {
  artifact: "source_promotion_hostile_input_opening_blockers_carry_forward",
  companyInternalHighAccuracyOpeningAllowedNow: false,
  hostileApiImportMustFailClosed: true,
  nearSourceAliasesRemainContextOnly: true,
  remainingBlockingIds: [
    "source_promotion_topology_material_metric_tolerance_negative_boundary_visible_tests",
    "hostile_api_import_payloads_fail_closed",
    "pnpm_calculator_gate_current_and_pnpm_check_green_at_opening_handoff"
  ],
  sourcePromotionRequires: [
    "topology_owner",
    "material_mapping_owner",
    "metric_context_owner",
    "tolerance_owner",
    "negative_boundaries",
    "paired_engine_tests",
    "paired_visible_tests"
  ]
} as const;

const SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_SELECTED = {
  artifact: "source_promotion_hostile_input_readiness_guard_selected",
  firstGate: "gate_a_inventory_source_promotion_and_hostile_input_readiness_after_rockwool_policy_closeout",
  requiredArtifacts: [
    "rockwool_policy_gate_c_closeout_summary",
    "rockwool_exact_or_screening_company_criterion_closed",
    "source_promotion_hostile_input_opening_blockers_carry_forward",
    "source_promotion_hostile_input_readiness_guard_selected",
    "selected_gate_a_source_promotion_hostile_input_readiness_with_target_file"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_V1_PLAN.md",
  targetFirstGateFile: "packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts"
} as const;

const NEXT_SLICE_SELECTION_MATRIX: readonly NextSliceCandidate[] = [
  {
    firstMissingRequirement: "post_rockwool_policy_source_promotion_and_hostile_input_readiness_inventory",
    id: "source_promotion_hostile_input_readiness_guard_v1",
    reason:
      "rockwool_triple_leaf_is_now_explicitly_screening_only_but_company_internal_high_accuracy_opening_still_depends_on_proving_near_source_or_source_rows_cannot_promote_without_topology_material_metric_tolerance_negative_boundaries_and_paired_visible_tests_and_that_public_api_or_import_payloads_fail_closed",
    runtimeEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts"
  },
  {
    firstMissingRequirement: "rights_safe_source_owned_curve_payload_with_material_mapping_metric_context_and_tolerance_owner",
    id: "direct_rockwool_triple_leaf_exact_runtime_fix",
    reason:
      "explicit_screening_only_policy_reduces_misuse_risk_but_does_not_create_the_rights_safe_uris_or_equivalent_curve_packet_local_material_mapping_metric_context_tolerance_negative_boundaries_and_paired_visible_tests_needed_for_exact_runtime_promotion",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
  },
  {
    firstMissingRequirement: "new_rights_safe_packet_authorized_tdm_payload_page_image_or_numeric_band_vector",
    id: "repeat_uris_source_acquisition_without_new_packet",
    reason:
      "uris_2006_identity_has_been_confirmed_but_source_packet_acquisition_is_still_paused_until_a_new_rights_safe_runtime_payload_or_equivalent_source_owned_curve_packet_exists",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SLICE_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_PLAN.md"
  },
  {
    firstMissingRequirement: "source_promotion_and_hostile_input_opening_blockers",
    id: "company_internal_high_accuracy_opening",
    reason:
      "field_output_owner_and_rockwool_explicit_screening_only_criteria_are_closed_but_company_internal_high_accuracy_opening_still_requires_source_promotion_ownership_hostile_input_fail_closed_proof_and_final_current_gate_plus_broad_check_evidence",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/CURRENT_STATE.md"
  },
  {
    firstMissingRequirement: "correctness_blockers_close_before_trust_increasing_polish",
    id: "productization_or_report_polish",
    reason:
      "productization_and_report_polish_remain_secondary_because_the_next_highest_accuracy_risk_is_false_source_promotion_or_hostile_input_leakage_making_screening_values_look_more_defensible_than_they_are",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md"
  }
] as const;

const FROZEN_SURFACES = [
  "runtime values",
  "support",
  "confidence",
  "evidence",
  "API behavior",
  "route-card values",
  "output-card status",
  "proposal/report values",
  "workbench-input behavior"
] as const;

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
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

const GROUPED_SPLIT_ROCKWOOL_FIELD_CONTEXT: AirborneContext = {
  ...GROUPED_SPLIT_ROCKWOOL_CONTEXT,
  connectionType: "line_connection",
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function swap(stack: readonly LayerInput[], a: number, b: number): readonly LayerInput[] {
  const swapped = [...stack];
  [swapped[a], swapped[b]] = [swapped[b]!, swapped[a]!];
  return swapped;
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
    family: result.dynamicAirborneTrace?.detectedFamily,
    rw: result.metrics.estimatedRwDb ?? null,
    rwPrime: result.metrics.estimatedRwPrimeDb ?? null,
    stc: result.metrics.estimatedStc ?? null,
    strategy: result.dynamicAirborneTrace?.strategy,
    supported: result.supportedTargetOutputs,
    warnings: result.warnings.join("\n")
  };
}

describe("post Rockwool triple-leaf explicit screening-only policy Gate C next-slice selection contract", () => {
  it("closes the Rockwool screening-only policy no-runtime and selects source/hostile readiness", () => {
    expect(ROCKWOOL_POLICY_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "rockwool_triple_leaf_explicit_screening_only_policy_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      gateCNumericRuntimeBehaviorChange: false,
      latestLandedGate: "gate_b_pin_visible_rockwool_triple_leaf_screening_only_policy",
      latestLandedStatus:
        "gate_b_pinned_visible_rockwool_triple_leaf_screening_only_policy_no_runtime_selected_gate_c_closeout",
      nextExecutionAction:
        "gate_a_inventory_source_promotion_and_hostile_input_readiness_after_rockwool_policy_closeout",
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportValueChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "source_promotion_hostile_input_readiness_guard_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_V1_PLAN.md",
      selectedRouteFamily: "source_promotion_hostile_input_readiness_after_rockwool_policy_closeout",
      selectionStatus:
        "closed_rockwool_triple_leaf_explicit_screening_only_policy_no_runtime_and_selected_source_promotion_hostile_input_readiness_guard",
      sliceId: "post_rockwool_triple_leaf_explicit_screening_only_policy_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts",
      visibleCopyChange: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("carries explicit Rockwool screening-only policy without creating source evidence", () => {
    expect(ROCKWOOL_POLICY_GATE_C_CLOSEOUT_SUMMARY).toEqual({
      artifact: "rockwool_policy_gate_c_closeout_summary",
      gateAInventoryClosed: true,
      gateBVisibleCopyClosed: true,
      groupedRockwoolDesignGradeAllowedNow: false,
      groupedRockwoolExactSourceValidatedNow: false,
      rockwoolExplicitScreeningOnlyPolicyClosed: true,
      runtimeSourceEvidenceCreatedByPolicy: false,
      visibleRockwoolScreeningOnlyGuardActive: true
    });
    expect(ROCKWOOL_EXACT_OR_SCREENING_COMPANY_CRITERION_CLOSED).toEqual({
      artifact: "rockwool_exact_or_screening_company_criterion_closed",
      exactRuntimeFixedNow: false,
      explicitScreeningOnlyCriterionClosed: true,
      fieldOutputsDesignGradeAllowedNow: false,
      groupedScreeningAnswer: "Rw 41",
      groupedStrategy: "multileaf_screening_blend",
      sourceLaneDisposition: "paused_waiting_rights_safe_source_packet"
    });
  });

  it("freezes grouped Rw 41, flat-list Rw 51 numeric hold, and field continuation values", () => {
    const grouped = wallSnapshot({
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const flatSwap = wallSnapshot({
      airborneContext: WALL_LAB_CONTEXT,
      layers: swap(SPLIT_ROCKWOOL_STACK, 3, 4),
      outputs: WALL_LAB_OUTPUTS
    });
    const field = wallSnapshot({
      airborneContext: GROUPED_SPLIT_ROCKWOOL_FIELD_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK,
      outputs: WALL_FIELD_OUTPUTS
    });

    expect(grouped).toMatchObject({
      confidence: "medium",
      family: "multileaf_multicavity",
      rw: 53,
      stc: 64,
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor",
      supported: ["Rw", "STC", "C", "Ctr"]
    });
    expect(grouped.warnings).toContain("lab spectrum adapter is active");
    expect(grouped.warnings).toContain("keeps the parent not-measured budget");

    expect(flatSwap).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 51,
      stc: 51,
      strategy: "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology",
      supported: ["Rw", "STC", "C", "Ctr"]
    });
    expect(flatSwap.warnings).toContain("Flat-list adjacent-swap sensitivity guard");

    expect(field).toMatchObject({
      confidence: "medium",
      dnTw: 53,
      family: "multileaf_multicavity",
      rwPrime: 51,
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor",
      supported: ["R'w", "DnT,w"]
    });
  });

  it("selects source/hostile readiness before exact runtime, repeated acquisition, opening, or polish", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        firstMissingRequirement: "post_rockwool_policy_source_promotion_and_hostile_input_readiness_inventory",
        id: "source_promotion_hostile_input_readiness_guard_v1",
        reason:
          "rockwool_triple_leaf_is_now_explicitly_screening_only_but_company_internal_high_accuracy_opening_still_depends_on_proving_near_source_or_source_rows_cannot_promote_without_topology_material_metric_tolerance_negative_boundaries_and_paired_visible_tests_and_that_public_api_or_import_payloads_fail_closed",
        runtimeEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 120)).toBe(true);
  });

  it("keeps company-internal opening blocked only on source/hostile/final-validation criteria", () => {
    expect(SOURCE_PROMOTION_HOSTILE_INPUT_OPENING_BLOCKERS_CARRY_FORWARD).toEqual({
      artifact: "source_promotion_hostile_input_opening_blockers_carry_forward",
      companyInternalHighAccuracyOpeningAllowedNow: false,
      hostileApiImportMustFailClosed: true,
      nearSourceAliasesRemainContextOnly: true,
      remainingBlockingIds: [
        "source_promotion_topology_material_metric_tolerance_negative_boundary_visible_tests",
        "hostile_api_import_payloads_fail_closed",
        "pnpm_calculator_gate_current_and_pnpm_check_green_at_opening_handoff"
      ],
      sourcePromotionRequires: [
        "topology_owner",
        "material_mapping_owner",
        "metric_context_owner",
        "tolerance_owner",
        "negative_boundaries",
        "paired_engine_tests",
        "paired_visible_tests"
      ]
    });
    expect(SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_SELECTED).toEqual({
      artifact: "source_promotion_hostile_input_readiness_guard_selected",
      firstGate: "gate_a_inventory_source_promotion_and_hostile_input_readiness_after_rockwool_policy_closeout",
      requiredArtifacts: [
        "rockwool_policy_gate_c_closeout_summary",
        "rockwool_exact_or_screening_company_criterion_closed",
        "source_promotion_hostile_input_opening_blockers_carry_forward",
        "source_promotion_hostile_input_readiness_guard_selected",
        "selected_gate_a_source_promotion_hostile_input_readiness_with_target_file"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_V1_PLAN.md",
      targetFirstGateFile: "packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts"
    });
  });

  it("keeps docs and current-gate runner aligned with Gate C closeout and selected Gate A", () => {
    for (const relativePath of REQUIRED_ALIGNED_DOCS) {
      const contents = readRepoFile(relativePath);
      expect(contents).toContain(ROCKWOOL_POLICY_GATE_C_CLOSEOUT.selectionStatus);
      expect(contents).toContain(ROCKWOOL_POLICY_GATE_C_CLOSEOUT.selectedImplementationSlice);
      expect(contents).toContain(ROCKWOOL_POLICY_GATE_C_CLOSEOUT.targetFirstGateFile);
      expect(contents).toContain(ROCKWOOL_POLICY_GATE_C_CLOSEOUT.selectedPlanningSurface);
      expect(contents).toContain("rockwool_policy_gate_c_closeout_summary");
      expect(contents).toContain("rockwool_exact_or_screening_company_criterion_closed");
      expect(contents).toContain("source_promotion_hostile_input_opening_blockers_carry_forward");
      expect(contents).toContain("source_promotion_hostile_input_readiness_guard_selected");
      expect(contents).toContain("selected_gate_a_source_promotion_hostile_input_readiness_with_target_file");
    }

    const checkpoint = readRepoFile(
      "docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_GATE_C_CLOSEOUT_HANDOFF.md"
    );
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    for (const surface of FROZEN_SURFACES) {
      expect(checkpoint).toContain(surface);
    }

    expect(runner).toContain(
      "src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts"
    );
    expect(checkpoint).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts --maxWorkers=1"
    );
    expect(checkpoint).toContain("pnpm calculator:gate:current");
    expect(checkpoint).toContain("git diff --check");
  });
});
