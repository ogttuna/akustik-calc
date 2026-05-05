import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EstimateRequestSchema, type AirborneContext, type ImpactFieldContext, type LayerInput, type RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { FLAT_LIST_MULTILEAF_GUARD_STRATEGY } from "./dynamic-airborne-flat-list-multileaf-guard";
import { resultSnapshot } from "./mixed-floor-wall-generated-test-helpers";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type NextSliceCandidate = {
  firstMissingRequirement: string;
  id: string;
  reason: string;
  runtimeEligibleNow: false;
  selectedNext: boolean;
  targetFile: string;
};

const COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "company_internal_controlled_use_handoff_v1",
  confidencePromotion: false,
  controlledUsePackKeptAsCurrentOperatorHandoff: true,
  evidencePromotion: false,
  gateCNumericRuntimeBehaviorChange: false,
  highAccuracyLabelAllowedByThisCloseout: false,
  latestLandedGate: "gate_a_prepare_company_internal_controlled_use_handoff_pack_no_runtime",
  latestLandedStatus: "gate_a_prepared_company_internal_controlled_use_handoff_no_runtime_selected_closeout",
  nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_controlled_use_handoff_closeout",
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportValueChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v24",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V24_PLAN.md",
  selectedRouteFamily: "source_gap_revalidation_after_controlled_use_handoff",
  selectionStatus:
    "closed_company_internal_controlled_use_handoff_no_runtime_and_selected_source_gap_revalidation_v24",
  sliceId: "post_company_internal_controlled_use_handoff_v1_next_slice_selection",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const CONSUMED_CONTROLLED_USE_HANDOFF_ARTIFACTS = {
  artifacts: [
    "current_operator_workflow",
    "current_acceptance_bucket_table",
    "ready_values_snapshot",
    "caveated_blocked_stop_rules",
    "validation_command_log",
    "rockwool_screening_only_notice",
    "selected_closeout_or_source_gap_followup"
  ],
  blockedSourceOrNeedsInputScenarioCount: 4,
  broadCheckRequiredForCloseout: true,
  caveatedScreeningOrContinuationScenarioCount: 6,
  currentGateRequiredForCloseout: true,
  highAccuracyLabelAllowedNow: false,
  hostileOrStabilityScenarioCount: 6,
  readySourceOrBenchmarkScenarioCount: 5,
  totalScenarioCount: 21
} as const;

const CONTROLLED_USE_HANDOFF_CLOSED = {
  artifact: "company_internal_controlled_use_handoff_closed",
  currentHandoffDocument: "docs/calculator/COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF.md",
  highAccuracyLabelStillForbidden: true,
  landedArtifact: "controlled_use_pack_is_current_operator_handoff",
  runtimeBehaviorChange: false,
  selectedNextArtifact: "calculator_source_gap_revalidation_v24_selected",
  selectedNextSlice: "calculator_source_gap_revalidation_v24"
} as const;

const ROCKWOOL_SCREENING_FREEZE = {
  exactRuntimeFixedNow: false,
  fieldDnTwDb: 36,
  fieldRwPrimeDb: 34,
  flatListRwDb: 51,
  flatListStrategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
  groupedRwDb: 41,
  groupedStrategy: "multileaf_screening_blend",
  sourceLaneDisposition: "paused_waiting_rights_safe_source_packet"
} as const;

const SOURCE_GAP_REVALIDATION_V24_SELECTED = {
  artifact: "calculator_source_gap_revalidation_v24_selected",
  firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_controlled_use_handoff_closeout",
  requiredCarryForward: [
    "controlled_use_pack_is_current_operator_handoff",
    "rockwool_screening_only_not_fixed",
    "field_outputs_non_design_grade",
    "source_promotion_owner_set_required",
    "hostile_api_import_fail_closed",
    "frequent_combination_snapshots_stay_green"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V24_PLAN.md",
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts"
} as const;

const NEXT_SLICE_SELECTION_MATRIX: ReadonlyArray<NextSliceCandidate> = [
  {
    firstMissingRequirement: "post_handoff_source_gap_order_must_be_revalidated_before_any_runtime_or_use_label_expansion",
    id: "calculator_source_gap_revalidation_v24",
    reason:
      "controlled_use_pack_is_current_but_accuracy_work_should_return_to_source_gap_ordering_so_the_next_runtime_or_no_runtime_slice_is_chosen_from_current_rockwool_field_output_source_promotion_hostile_input_and_frequent_combination_evidence",
    runtimeEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts"
  },
  {
    firstMissingRequirement: "controlled_use_is_not_broad_high_accuracy_or_external_certification",
    id: "direct_company_internal_high_accuracy_label",
    reason:
      "ready_corridors_are_usable_with_caveat_but_rockwool_source_gaps_source_promotion_owners_and_hostile_boundaries_still_prevent_a_broad_high_accuracy_label",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/CURRENT_STATE.md"
  },
  {
    firstMissingRequirement: "rights_safe_source_owned_curve_payload_absent",
    id: "direct_rockwool_triple_leaf_exact_runtime_fix",
    reason:
      "rockwool_triple_leaf_remains_the_most_visible_accuracy_defect_but_exact_runtime_promotion_is_blocked_until_a_uris_or_equivalent_rights_safe_source_packet_exists",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
  },
  {
    firstMissingRequirement: "complete_topology_material_metric_tolerance_negative_boundary_and_visible_test_owner_set",
    id: "source_promotion_runtime_import",
    reason:
      "near_source_rows_and_source_locator_metadata_remain_context_only_and_cannot_seed_runtime_without_a_complete_promotion_owner_set",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
  },
  {
    firstMissingRequirement: "correctness_source_gap_ordering_still_has_priority_over_polish",
    id: "productization_or_report_polish",
    reason:
      "operator_handoff_is_current_but_the_next_best_work_is_accuracy_backlog_revalidation_not_trust_increasing_polish",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md"
  }
] as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/company-internal-controlled-use-handoff-gate-a-contract.test.ts",
  "packages/engine/src/post-company-internal-controlled-use-handoff-v1-next-slice-selection-contract.test.ts",
  "docs/calculator/COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_V1_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V24_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_DOC_TOKENS = [
  COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_C_CLOSEOUT.selectionStatus,
  COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_C_CLOSEOUT.selectedImplementationSlice,
  COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_C_CLOSEOUT.targetFirstGateFile,
  COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_C_CLOSEOUT.selectedPlanningSurface,
  COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_C_CLOSEOUT.nextExecutionAction,
  CONTROLLED_USE_HANDOFF_CLOSED.artifact,
  CONTROLLED_USE_HANDOFF_CLOSED.landedArtifact,
  SOURCE_GAP_REVALIDATION_V24_SELECTED.artifact,
  "rockwool_screening_only_not_fixed",
  "field_outputs_non_design_grade",
  "hostile_api_import_fail_closed",
  "frequent_combination_snapshots_stay_green"
] as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const READY_OUTPUTS = ["Rw", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const FLOOR_IMPACT_OUTPUTS = [
  "Rw",
  "Ln,w",
  "Ln,w+CI",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const LSF_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const LSF_BUILDING_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "building_prediction",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55,
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

const FLOOR_IMPACT_FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
};

const LSF_EXACT_SOURCE_STACK: readonly LayerInput[] = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "glasswool", thicknessMm: 70 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
];

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

const PLITEQ_EXACT_SOURCE_STACK: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 120 },
  { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 2.5 },
  { floorRole: "resilient_layer", materialId: "geniemat_rst02", thicknessMm: 2 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 250 }
];

const UBIQ_FL32_BOUND_SOURCE_STACK: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 250 }
];

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
    result,
    rw: result.metrics.estimatedRwDb ?? null,
    rwPrime: result.metrics.estimatedRwPrimeDb ?? null,
    stc: result.metrics.estimatedStc ?? null,
    strategy: result.dynamicAirborneTrace?.strategy ?? null,
    supported: result.supportedTargetOutputs,
    warnings: result.warnings.join("\n")
  };
}

function calculateImpactSourceStack(rows: readonly LayerInput[]) {
  return calculateAssembly(rows, {
    impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
    targetOutputs: FLOOR_IMPACT_OUTPUTS
  });
}

function issuePaths(parseResult: { success: false; error: { issues: Array<{ path: Array<number | string> }> } }) {
  return parseResult.error.issues.map((issue) => issue.path.map(String).join("."));
}

describe("post company-internal controlled-use handoff Gate C next-slice selection contract", () => {
  it("closes the controlled-use handoff no-runtime and selects source-gap revalidation V24", () => {
    expect(COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "company_internal_controlled_use_handoff_v1",
      confidencePromotion: false,
      controlledUsePackKeptAsCurrentOperatorHandoff: true,
      evidencePromotion: false,
      gateCNumericRuntimeBehaviorChange: false,
      highAccuracyLabelAllowedByThisCloseout: false,
      latestLandedGate: "gate_a_prepare_company_internal_controlled_use_handoff_pack_no_runtime",
      latestLandedStatus: "gate_a_prepared_company_internal_controlled_use_handoff_no_runtime_selected_closeout",
      nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_controlled_use_handoff_closeout",
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportValueChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_source_gap_revalidation_v24",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V24_PLAN.md",
      selectedRouteFamily: "source_gap_revalidation_after_controlled_use_handoff",
      selectionStatus:
        "closed_company_internal_controlled_use_handoff_no_runtime_and_selected_source_gap_revalidation_v24",
      sliceId: "post_company_internal_controlled_use_handoff_v1_next_slice_selection",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const relativePath of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, relativePath)), relativePath).toBe(true);
    }
  });

  it("consumes Gate A artifacts and keeps the handoff as controlled-use, not high-accuracy", () => {
    expect(CONSUMED_CONTROLLED_USE_HANDOFF_ARTIFACTS).toEqual({
      artifacts: [
        "current_operator_workflow",
        "current_acceptance_bucket_table",
        "ready_values_snapshot",
        "caveated_blocked_stop_rules",
        "validation_command_log",
        "rockwool_screening_only_notice",
        "selected_closeout_or_source_gap_followup"
      ],
      blockedSourceOrNeedsInputScenarioCount: 4,
      broadCheckRequiredForCloseout: true,
      caveatedScreeningOrContinuationScenarioCount: 6,
      currentGateRequiredForCloseout: true,
      highAccuracyLabelAllowedNow: false,
      hostileOrStabilityScenarioCount: 6,
      readySourceOrBenchmarkScenarioCount: 5,
      totalScenarioCount: 21
    });
    expect(CONTROLLED_USE_HANDOFF_CLOSED).toEqual({
      artifact: "company_internal_controlled_use_handoff_closed",
      currentHandoffDocument: "docs/calculator/COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF.md",
      highAccuracyLabelStillForbidden: true,
      landedArtifact: "controlled_use_pack_is_current_operator_handoff",
      runtimeBehaviorChange: false,
      selectedNextArtifact: "calculator_source_gap_revalidation_v24_selected",
      selectedNextSlice: "calculator_source_gap_revalidation_v24"
    });

    const handoff = readRepoFile(CONTROLLED_USE_HANDOFF_CLOSED.currentHandoffDocument);
    const gateA = readRepoFile("packages/engine/src/company-internal-controlled-use-handoff-gate-a-contract.test.ts");

    for (const artifact of CONSUMED_CONTROLLED_USE_HANDOFF_ARTIFACTS.artifacts) {
      expect(gateA).toContain(artifact);
      expect(handoff).toContain(artifact);
    }
    expect(handoff).toContain("not regulatory certification");
    expect(handoff).toContain("not external/client certification");
    expect(handoff).toContain("not a broad high-accuracy opening");
    expect(handoff).toContain("controlled_use_pack_is_current_operator_handoff");
  });

  it("keeps ready values, Rockwool screening, and hostile non-finite rejection frozen", () => {
    const readyLab = wallSnapshot({
      airborneContext: LSF_LAB_CONTEXT,
      layers: LSF_EXACT_SOURCE_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const readyBuilding = wallSnapshot({
      airborneContext: LSF_BUILDING_CONTEXT,
      layers: LSF_EXACT_SOURCE_STACK,
      outputs: READY_OUTPUTS
    });
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
    const pliteq = calculateImpactSourceStack(PLITEQ_EXACT_SOURCE_STACK);
    const ubiq = calculateImpactSourceStack(UBIQ_FL32_BOUND_SOURCE_STACK);
    const parsedEstimateHugeJson = JSON.parse(
      '{"layers":[{"materialId":"gypsum_board","thicknessMm":1e309}],"targetOutputs":["Rw"]}'
    ) as unknown;
    const estimateNonFinite = EstimateRequestSchema.safeParse(parsedEstimateHugeJson);

    expect(readyLab).toMatchObject({
      family: "stud_wall_system",
      rw: 55,
      stc: 55,
      supported: ["Rw", "STC", "C", "Ctr"]
    });
    expect(readyBuilding).toMatchObject({
      dnTw: 50,
      family: "stud_wall_system",
      rw: 48,
      rwPrime: 48,
      supported: ["R'w", "DnT,w"]
    });
    expect(resultSnapshot(pliteq)).toMatchObject({
      lPrimeNTw: 58.2,
      lPrimeNW: 61,
      lnW: 58,
      rw: 60,
      unsupportedTargetOutputs: ["Ln,w+CI", "DeltaLw", "L'nT,50"]
    });
    expect(resultSnapshot(ubiq)).toMatchObject({
      lPrimeNTw: 52.2,
      lPrimeNW: 55,
      lnW: 52,
      rw: 62,
      unsupportedTargetOutputs: ["Ln,w+CI", "DeltaLw", "L'nT,50"]
    });

    expect(ROCKWOOL_SCREENING_FREEZE).toEqual({
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
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 41,
      stc: 41,
      strategy: "multileaf_screening_blend"
    });
    expect(flatSwap).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 51,
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY
    });
    expect(field).toMatchObject({
      confidence: "low",
      dnTw: 36,
      family: "multileaf_multicavity",
      rwPrime: 34,
      strategy: "multileaf_screening_blend"
    });

    expect(estimateNonFinite.success).toBe(false);
    if (!estimateNonFinite.success) {
      expect(issuePaths(estimateNonFinite)).toContain("layers.0.thicknessMm");
    }
  });

  it("selects V24 source-gap revalidation before runtime import, high-accuracy copy, or polish", () => {
    expect(SOURCE_GAP_REVALIDATION_V24_SELECTED).toEqual({
      artifact: "calculator_source_gap_revalidation_v24_selected",
      firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_controlled_use_handoff_closeout",
      requiredCarryForward: [
        "controlled_use_pack_is_current_operator_handoff",
        "rockwool_screening_only_not_fixed",
        "field_outputs_non_design_grade",
        "source_promotion_owner_set_required",
        "hostile_api_import_fail_closed",
        "frequent_combination_snapshots_stay_green"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V24_PLAN.md",
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts"
    });
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        firstMissingRequirement: "post_handoff_source_gap_order_must_be_revalidated_before_any_runtime_or_use_label_expansion",
        id: "calculator_source_gap_revalidation_v24",
        reason:
          "controlled_use_pack_is_current_but_accuracy_work_should_return_to_source_gap_ordering_so_the_next_runtime_or_no_runtime_slice_is_chosen_from_current_rockwool_field_output_source_promotion_hostile_input_and_frequent_combination_evidence",
        runtimeEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(
      NEXT_SLICE_SELECTION_MATRIX.find((candidate) => candidate.id === "direct_rockwool_triple_leaf_exact_runtime_fix")
        ?.selectedNext
    ).toBe(false);
  });

  it("keeps docs and current-gate runner aligned with closeout and selected V24", () => {
    const docs = REQUIRED_CLOSEOUT_SURFACES.filter((path) => path.endsWith(".md") || path === "AGENTS.md")
      .map((relativePath) => readRepoFile(relativePath))
      .join("\n\n");

    for (const token of REQUIRED_DOC_TOKENS) {
      expect(docs, token).toContain(token);
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-company-internal-controlled-use-handoff-v1-next-slice-selection-contract.test.ts"
    );

    const selectedPlan = readRepoFile(SOURCE_GAP_REVALIDATION_V24_SELECTED.selectedPlanningSurface);
    expect(selectedPlan).toContain(SOURCE_GAP_REVALIDATION_V24_SELECTED.firstGate);
    expect(selectedPlan).toContain(SOURCE_GAP_REVALIDATION_V24_SELECTED.targetFirstGateFile);
    expect(selectedPlan).toContain("rockwool_screening_only_not_fixed");
  });
});
