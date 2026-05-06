import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  EstimateRequestSchema,
  ImpactOnlyRequestSchema,
  type AirborneContext,
  type LayerInput,
  type RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { FLAT_LIST_MULTILEAF_GUARD_STRATEGY } from "./dynamic-airborne-flat-list-multileaf-guard";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type NextSliceCandidate = {
  firstMissingRequirement: string;
  id: string;
  reason: string;
  runtimeEligibleNow: false;
  selectedNext: boolean;
  targetFile: string;
};

const SOURCE_PROMOTION_HOSTILE_INPUT_GATE_C_CLOSEOUT = {
  apiRouteContractChangeByCloseout: false,
  closedImplementationSlice: "source_promotion_hostile_input_readiness_guard_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  gateCNumericRuntimeBehaviorChange: false,
  latestLandedGate: "gate_a_inventory_source_promotion_and_hostile_input_readiness_after_rockwool_policy_closeout",
  latestLandedStatus:
    "gate_a_inventoried_source_promotion_hostile_input_readiness_landed_finite_schema_tightening_selected_closeout",
  nextExecutionAction: "gate_a_rehearse_company_internal_high_accuracy_opening_evidence_no_runtime",
  openingHandoffAllowedByThisCloseout: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportValueChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  schemaValidationTighteningConsumed: true,
  selectedImplementationSlice: "company_internal_high_accuracy_opening_rehearsal_v1",
  selectedPlanningSurface:
    "docs/calculator/SLICE_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_V1_PLAN.md",
  selectedRouteFamily: "company_internal_high_accuracy_opening_rehearsal_after_source_hostile_closeout",
  selectionStatus:
    "closed_source_promotion_hostile_input_readiness_guard_no_runtime_and_selected_company_internal_high_accuracy_opening_rehearsal",
  sliceId: "post_source_promotion_hostile_input_readiness_guard_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile:
    "packages/engine/src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts",
  "packages/engine/src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts",
  "packages/shared/src/domain/layer.ts",
  "apps/web/lib/calculator-api-validation.test.ts",
  "apps/web/app/api/estimate/route.ts",
  "apps/web/app/api/impact-only/route.ts",
  "apps/web/app/api/projects/import-local/route.ts",
  "packages/engine/src/raw-wall-hostile-input-answer-matrix.test.ts",
  "packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts",
  "packages/engine/src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts",
  "packages/engine/src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-05_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-05_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_V1_PLAN.md",
  "docs/calculator/SLICE_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_V1_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_DOC_TOKENS = [
  SOURCE_PROMOTION_HOSTILE_INPUT_GATE_C_CLOSEOUT.selectionStatus,
  SOURCE_PROMOTION_HOSTILE_INPUT_GATE_C_CLOSEOUT.selectedImplementationSlice,
  SOURCE_PROMOTION_HOSTILE_INPUT_GATE_C_CLOSEOUT.targetFirstGateFile,
  SOURCE_PROMOTION_HOSTILE_INPUT_GATE_C_CLOSEOUT.selectedPlanningSurface,
  "source_promotion_surface_inventory",
  "hostile_api_import_fail_closed_surface_inventory",
  "estimate_json_1e309_rejected_by_finite_layer_schema",
  "server_import_snapshot_not_runtime_promotion_surface",
  "near_source_rows_context_only_until_owner_set_exists",
  "rockwool_gate_c_policy_freeze_carry_forward",
  "selected_source_promotion_hostile_closeout_with_target_file",
  "company_internal_high_accuracy_opening_rehearsal_selected"
] as const;

const CONSUMED_GATE_A_ARTIFACTS = {
  artifacts: [
    "source_promotion_surface_inventory",
    "hostile_api_import_fail_closed_surface_inventory",
    "estimate_json_1e309_rejected_by_finite_layer_schema",
    "server_import_snapshot_not_runtime_promotion_surface",
    "near_source_rows_context_only_until_owner_set_exists",
    "rockwool_gate_c_policy_freeze_carry_forward",
    "selected_source_promotion_hostile_closeout_with_target_file"
  ],
  hostileApiGapClosedByFiniteLayerSchema: true,
  importSnapshotPromotionPathOpen: false,
  nearSourcePromotionReadyNow: false,
  sourceRuntimePromotionReadyNow: false
} as const;

const COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_SELECTED = {
  artifact: "company_internal_high_accuracy_opening_rehearsal_selected",
  firstGate: "gate_a_rehearse_company_internal_high_accuracy_opening_evidence_no_runtime",
  highAccuracyOpeningAllowedBySelectionAlone: false,
  requiredArtifacts: [
    "company_internal_opening_acceptance_matrix",
    "final_validation_evidence_map",
    "rockwool_screening_and_source_blocker_registry",
    "source_promotion_no_runtime_boundary_register",
    "hostile_api_import_fail_closed_evidence",
    "operator_caveat_and_usage_handoff_pack"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface:
    "docs/calculator/SLICE_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_V1_PLAN.md",
  targetFirstGateFile:
    "packages/engine/src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts"
} as const;

const ROCKWOOL_FREEZE_CARRY_FORWARD = {
  artifact: "rockwool_gate_c_policy_freeze_carry_forward",
  exactRuntimeFixedNow: false,
  fieldDnTwDb: 36,
  fieldRwPrimeDb: 34,
  flatListRwDb: 51,
  flatListStrategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
  groupedRwDb: 41,
  groupedStrategy: "multileaf_screening_blend",
  sourceLaneDisposition: "paused_waiting_rights_safe_source_packet"
} as const;

const NEXT_SLICE_SELECTION_MATRIX: readonly NextSliceCandidate[] = [
  {
    firstMissingRequirement: "final_opening_evidence_matrix_and_command_log_for_current_posture",
    id: "company_internal_high_accuracy_opening_rehearsal_v1",
    reason:
      "field_output_owner_policy_rockwool_screening_only_policy_and_source_hostile_input_inventory_are_closed_but_the_calculator_still_needs_a_fresh_no_runtime_opening_rehearsal_that_maps_supported_caveated_blocked_lanes_to_current_gate_and_broad_check_evidence_before_any_company_internal_high_accuracy_handoff_label_is_allowed",
    runtimeEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts"
  },
  {
    firstMissingRequirement: "rights_safe_source_owned_curve_payload_with_material_mapping_metric_context_and_tolerance_owner",
    id: "direct_rockwool_triple_leaf_exact_runtime_fix",
    reason:
      "rockwool_triple_leaf_remains_the_highest_visible_accuracy_defect_but_exact_runtime_promotion_is_still_blocked_until_a_rights_safe_uris_or_equivalent_curve_packet_local_material_mapping_metric_context_tolerance_negative_boundaries_and_paired_visible_tests_exist",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
  },
  {
    firstMissingRequirement: "new_rights_safe_packet_authorized_tdm_payload_page_image_or_numeric_band_vector",
    id: "repeat_uris_source_acquisition_without_new_packet",
    reason:
      "uris_2006_identity_is_known_but_repeating_acquisition_without_a_new_rights_safe_runtime_payload_or_equivalent_source_owned_curve_packet_would_not_improve_calculator_accuracy",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SLICE_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_PLAN.md"
  },
  {
    firstMissingRequirement: "full_source_promotion_owner_set_for_exact_or_near_source_runtime_import",
    id: "source_promotion_runtime_import",
    reason:
      "gate_a_confirmed_near_source_rows_are_context_only_and_exact_source_controls_remain_separate_so_runtime_import_must_stay_blocked_until topology_material_metric_tolerance_negative_boundary_and_paired_visible_test_ownership_exists",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
  },
  {
    firstMissingRequirement: "company_internal_opening_rehearsal_and_final_validation_evidence",
    id: "company_internal_high_accuracy_opening_label",
    reason:
      "closeout_consumes_source_and_hostile_readiness_but_does_not_itself_run_the_opening_rehearsal_or_create_final_handoff_evidence_so_the_high_accuracy_label_must_remain_blocked_until_the_selected_rehearsal_gate_passes",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/CURRENT_STATE.md"
  },
  {
    firstMissingRequirement: "correctness_opening_handoff_before_trust_increasing_polish",
    id: "productization_or_report_polish",
    reason:
      "productization_and_report_polish_remain_secondary_until_the_current_accuracy_posture_is_rehearsed_with_explicit_ready_caveated_blocked_lanes_and_validation_evidence",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md"
  }
] as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

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
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
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
    confidence: result.dynamicAirborneTrace?.confidenceClass ?? null,
    dnTw: result.metrics.estimatedDnTwDb ?? null,
    family: result.dynamicAirborneTrace?.detectedFamily ?? null,
    rw: result.metrics.estimatedRwDb ?? null,
    rwPrime: result.metrics.estimatedRwPrimeDb ?? null,
    stc: result.metrics.estimatedStc ?? null,
    strategy: result.dynamicAirborneTrace?.strategy ?? null,
    supported: result.supportedTargetOutputs,
    warnings: result.warnings.join("\n")
  };
}

function issuePaths(parseResult: { success: false; error: { issues: Array<{ path: Array<number | string> }> } }) {
  return parseResult.error.issues.map((issue) => issue.path.map(String).join("."));
}

describe("post source-promotion hostile-input readiness Gate C next-slice selection contract", () => {
  it("closes source/hostile readiness no-runtime and selects high-accuracy opening rehearsal", () => {
    expect(SOURCE_PROMOTION_HOSTILE_INPUT_GATE_C_CLOSEOUT).toEqual({
      apiRouteContractChangeByCloseout: false,
      closedImplementationSlice: "source_promotion_hostile_input_readiness_guard_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      gateCNumericRuntimeBehaviorChange: false,
      latestLandedGate: "gate_a_inventory_source_promotion_and_hostile_input_readiness_after_rockwool_policy_closeout",
      latestLandedStatus:
        "gate_a_inventoried_source_promotion_hostile_input_readiness_landed_finite_schema_tightening_selected_closeout",
      nextExecutionAction: "gate_a_rehearse_company_internal_high_accuracy_opening_evidence_no_runtime",
      openingHandoffAllowedByThisCloseout: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportValueChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      schemaValidationTighteningConsumed: true,
      selectedImplementationSlice: "company_internal_high_accuracy_opening_rehearsal_v1",
      selectedPlanningSurface:
        "docs/calculator/SLICE_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_V1_PLAN.md",
      selectedRouteFamily: "company_internal_high_accuracy_opening_rehearsal_after_source_hostile_closeout",
      selectionStatus:
        "closed_source_promotion_hostile_input_readiness_guard_no_runtime_and_selected_company_internal_high_accuracy_opening_rehearsal",
      sliceId: "post_source_promotion_hostile_input_readiness_guard_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile:
        "packages/engine/src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const relativePath of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, relativePath)), relativePath).toBe(true);
    }
  });

  it("consumes Gate A artifacts and keeps finite layer-schema rejection active", () => {
    const parsedEstimateHugeJson = JSON.parse(
      '{"layers":[{"materialId":"gypsum_board","thicknessMm":1e309}],"targetOutputs":["Rw"]}'
    ) as unknown;
    const parsedImpactHugeJson = JSON.parse(
      '{"layers":[{"materialId":"concrete","thicknessMm":1e309}],"targetOutputs":["Ln,w"]}'
    ) as unknown;
    const estimateNonFinite = EstimateRequestSchema.safeParse(parsedEstimateHugeJson);
    const impactNonFinite = ImpactOnlyRequestSchema.safeParse(parsedImpactHugeJson);

    expect(CONSUMED_GATE_A_ARTIFACTS).toEqual({
      artifacts: [
        "source_promotion_surface_inventory",
        "hostile_api_import_fail_closed_surface_inventory",
        "estimate_json_1e309_rejected_by_finite_layer_schema",
        "server_import_snapshot_not_runtime_promotion_surface",
        "near_source_rows_context_only_until_owner_set_exists",
        "rockwool_gate_c_policy_freeze_carry_forward",
        "selected_source_promotion_hostile_closeout_with_target_file"
      ],
      hostileApiGapClosedByFiniteLayerSchema: true,
      importSnapshotPromotionPathOpen: false,
      nearSourcePromotionReadyNow: false,
      sourceRuntimePromotionReadyNow: false
    });

    expect(estimateNonFinite.success).toBe(false);
    if (!estimateNonFinite.success) {
      expect(issuePaths(estimateNonFinite)).toContain("layers.0.thicknessMm");
    }
    expect(impactNonFinite.success).toBe(false);
    if (!impactNonFinite.success) {
      expect(issuePaths(impactNonFinite)).toContain("layers.0.thicknessMm");
    }

    expect(readRepoFile("packages/shared/src/domain/layer.ts")).toContain(
      "thicknessMm: z.number().finite().positive()"
    );
    expect(readRepoFile("apps/web/lib/calculator-api-validation.test.ts")).toContain(
      "rejects non-finite JSON layer thickness"
    );
  });

  it("freezes Rockwool screening values and keeps Uris exact runtime blocked", () => {
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

    expect(ROCKWOOL_FREEZE_CARRY_FORWARD).toEqual({
      artifact: "rockwool_gate_c_policy_freeze_carry_forward",
      exactRuntimeFixedNow: false,
      fieldDnTwDb: 36,
      fieldRwPrimeDb: 34,
      flatListRwDb: 51,
      flatListStrategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
      groupedRwDb: 41,
      groupedStrategy: "multileaf_screening_blend",
      sourceLaneDisposition: "paused_waiting_rights_safe_source_packet"
    });

    expect(grouped).toMatchObject({
      confidence: "medium",
      family: "multileaf_multicavity",
      rw: 50,
      stc: 55,
      strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction",
      supported: ["Rw", "STC", "C", "Ctr"]
    });
    expect(grouped.warnings).toContain("family physics prediction");
    expect(grouped.warnings).toContain("Dynamic airborne confidence is medium");

    expect(flatSwap).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 51,
      stc: 51,
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
      supported: ["Rw", "STC", "C", "Ctr"]
    });
    expect(flatSwap.warnings).toContain("Flat-list adjacent-swap sensitivity guard");

    expect(field).toMatchObject({
      confidence: "medium",
      dnTw: 50,
      family: "multileaf_multicavity",
      rwPrime: 49,
      strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction",
      supported: ["R'w", "DnT,w"]
    });
  });

  it("selects final rehearsal before opening label, exact runtime, repeated acquisition, or polish", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        firstMissingRequirement: "final_opening_evidence_matrix_and_command_log_for_current_posture",
        id: "company_internal_high_accuracy_opening_rehearsal_v1",
        reason:
          "field_output_owner_policy_rockwool_screening_only_policy_and_source_hostile_input_inventory_are_closed_but_the_calculator_still_needs_a_fresh_no_runtime_opening_rehearsal_that_maps_supported_caveated_blocked_lanes_to_current_gate_and_broad_check_evidence_before_any_company_internal_high_accuracy_handoff_label_is_allowed",
        runtimeEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_SELECTED).toEqual({
      artifact: "company_internal_high_accuracy_opening_rehearsal_selected",
      firstGate: "gate_a_rehearse_company_internal_high_accuracy_opening_evidence_no_runtime",
      highAccuracyOpeningAllowedBySelectionAlone: false,
      requiredArtifacts: [
        "company_internal_opening_acceptance_matrix",
        "final_validation_evidence_map",
        "rockwool_screening_and_source_blocker_registry",
        "source_promotion_no_runtime_boundary_register",
        "hostile_api_import_fail_closed_evidence",
        "operator_caveat_and_usage_handoff_pack"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface:
        "docs/calculator/SLICE_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_V1_PLAN.md",
      targetFirstGateFile:
        "packages/engine/src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts"
    });
  });

  it("keeps docs and current-gate runner aligned with closeout and selected rehearsal", () => {
    const docs = REQUIRED_CLOSEOUT_SURFACES.filter((path) => path.endsWith(".md") || path === "AGENTS.md")
      .map((relativePath) => readRepoFile(relativePath))
      .join("\n\n");

    for (const token of REQUIRED_DOC_TOKENS) {
      expect(docs, token).toContain(token);
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts"
    );
  });
});
