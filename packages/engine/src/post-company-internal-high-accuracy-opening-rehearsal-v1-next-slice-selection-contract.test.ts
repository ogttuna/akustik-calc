import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EstimateRequestSchema, type AirborneContext, type LayerInput, type RequestedOutputId } from "@dynecho/shared";
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

const COMPANY_INTERNAL_OPENING_REHEARSAL_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "company_internal_high_accuracy_opening_rehearsal_v1",
  confidencePromotion: false,
  controlledUseHandoffSelected: true,
  evidencePromotion: false,
  gateCNumericRuntimeBehaviorChange: false,
  highAccuracyOpeningLabelAllowedByThisCloseout: false,
  latestLandedGate: "gate_a_rehearse_company_internal_high_accuracy_opening_evidence_no_runtime",
  latestLandedStatus:
    "gate_a_rehearsed_company_internal_high_accuracy_opening_no_runtime_selected_closeout",
  nextExecutionAction: "gate_a_prepare_company_internal_controlled_use_handoff_pack_no_runtime",
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportValueChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "company_internal_controlled_use_handoff_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_V1_PLAN.md",
  selectedRouteFamily: "controlled_use_handoff_after_high_accuracy_opening_rehearsal",
  selectionStatus:
    "closed_company_internal_high_accuracy_opening_rehearsal_no_runtime_and_selected_controlled_use_handoff",
  sliceId: "post_company_internal_high_accuracy_opening_rehearsal_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/company-internal-controlled-use-handoff-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const CONSUMED_OPENING_REHEARSAL_ARTIFACTS = {
  artifacts: [
    "company_internal_opening_acceptance_matrix",
    "final_validation_evidence_map",
    "rockwool_screening_and_source_blocker_registry",
    "source_promotion_no_runtime_boundary_register",
    "hostile_api_import_fail_closed_evidence",
    "operator_caveat_and_usage_handoff_pack",
    "selected_opening_handoff_or_backlog_followup"
  ],
  blockedSourceOrNeedsInputScenarioCount: 4,
  broadCheckGreen: true,
  caveatedScreeningOrContinuationScenarioCount: 6,
  currentGateGreen: true,
  highAccuracyOpeningAllowedByGateAAlone: false,
  highAccuracyOpeningLabelAllowedNow: false,
  hostileOrStabilityScenarioCount: 6,
  readySourceOrBenchmarkScenarioCount: 5,
  totalScenarioCount: 21
} as const;

const CONTROLLED_USE_HANDOFF_SELECTED = {
  artifact: "company_internal_controlled_use_handoff_selected",
  firstGate: "gate_a_prepare_company_internal_controlled_use_handoff_pack_no_runtime",
  highAccuracyLabelStillForbidden: true,
  requiredArtifacts: [
    "current_operator_workflow",
    "current_acceptance_bucket_table",
    "ready_values_snapshot",
    "caveated_blocked_stop_rules",
    "validation_command_log",
    "rockwool_screening_only_notice"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_V1_PLAN.md",
  targetFirstGateFile: "packages/engine/src/company-internal-controlled-use-handoff-gate-a-contract.test.ts"
} as const;

const ROCKWOOL_SCREENING_FREEZE = {
  artifact: "rockwool_screening_and_source_blocker_registry",
  exactRuntimeFixedNow: false,
  fieldDnTwDb: 36,
  fieldRwPrimeDb: 34,
  flatListRwDb: 51,
  flatListStrategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
  groupedRwDb: 41,
  groupedStrategy: "multileaf_screening_blend",
  sourceLaneDisposition: "paused_waiting_rights_safe_source_packet"
} as const;

const NEXT_SLICE_SELECTION_MATRIX: ReadonlyArray<NextSliceCandidate> = [
  {
    firstMissingRequirement: "current_controlled_use_handoff_pack_with_updated_values_and_stop_rules",
    id: "company_internal_controlled_use_handoff_v1",
    reason:
      "opening_rehearsal_and_broad_validation_are_green_for_controlled_personal_internal_use_but_the_existing_operator_handoff_needs_a_current_no_runtime_pack_with_2026_05_05_values_rockwool_screening_notice_and_stop_rules_before_any_use_label_is_refreshed",
    runtimeEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/company-internal-controlled-use-handoff-gate-a-contract.test.ts"
  },
  {
    firstMissingRequirement: "operator_handoff_pack_and_caveat_copy_must_land_first",
    id: "direct_company_internal_high_accuracy_opening_label",
    reason:
      "ready_source_benchmark_lanes_are_green_but_rockwool_generated_field_continuation_near_source_and_hostile_boundaries_still_require_visible_caveats_so_high_accuracy_copy_must_not_open_directly",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/CURRENT_STATE.md"
  },
  {
    firstMissingRequirement: "rights_safe_source_owned_curve_payload_with_topology_material_metric_and_tolerance_owner",
    id: "direct_rockwool_triple_leaf_exact_runtime_fix",
    reason:
      "rockwool_triple_leaf_remains_the_highest_visible_accuracy_defect_but_exact_runtime_promotion_is_still_blocked_until_a_rights_safe_uris_or_equivalent_curve_packet_exists",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
  },
  {
    firstMissingRequirement: "complete_source_promotion_owner_set_for_exact_or_near_source_runtime_import",
    id: "source_promotion_runtime_import",
    reason:
      "near_source_rows_remain_context_only_and_import_snapshots_cannot_seed_runtime_so promotion_requires_topology_material_metric_tolerance_negative_boundary_and_paired_visible_test_ownership",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
  },
  {
    firstMissingRequirement: "controlled_use_handoff_before_trust_increasing_polish",
    id: "productization_or_report_polish",
    reason:
      "productization_and_report_polish_remain_secondary_until_the_current_calculator_use_handoff_is_refreshed_from_the_latest_acceptance_matrix",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md"
  }
] as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts",
  "packages/engine/src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_V1_PLAN.md",
  "docs/calculator/SLICE_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_V1_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_DOC_TOKENS = [
  COMPANY_INTERNAL_OPENING_REHEARSAL_GATE_C_CLOSEOUT.selectionStatus,
  COMPANY_INTERNAL_OPENING_REHEARSAL_GATE_C_CLOSEOUT.selectedImplementationSlice,
  COMPANY_INTERNAL_OPENING_REHEARSAL_GATE_C_CLOSEOUT.targetFirstGateFile,
  COMPANY_INTERNAL_OPENING_REHEARSAL_GATE_C_CLOSEOUT.selectedPlanningSurface,
  "company_internal_opening_acceptance_matrix",
  "final_validation_evidence_map",
  "rockwool_screening_and_source_blocker_registry",
  "source_promotion_no_runtime_boundary_register",
  "hostile_api_import_fail_closed_evidence",
  "operator_caveat_and_usage_handoff_pack",
  "selected_opening_handoff_or_backlog_followup",
  "company_internal_controlled_use_handoff_selected"
] as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const READY_OUTPUTS = ["Rw", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

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
  contextMode: "field_between_rooms",
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
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
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

function issuePaths(parseResult: { success: false; error: { issues: Array<{ path: Array<number | string> }> } }) {
  return parseResult.error.issues.map((issue) => issue.path.map(String).join("."));
}

describe("post company-internal high-accuracy opening rehearsal Gate C next-slice selection contract", () => {
  it("closes the opening rehearsal no-runtime and selects controlled-use handoff", () => {
    expect(COMPANY_INTERNAL_OPENING_REHEARSAL_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "company_internal_high_accuracy_opening_rehearsal_v1",
      confidencePromotion: false,
      controlledUseHandoffSelected: true,
      evidencePromotion: false,
      gateCNumericRuntimeBehaviorChange: false,
      highAccuracyOpeningLabelAllowedByThisCloseout: false,
      latestLandedGate: "gate_a_rehearse_company_internal_high_accuracy_opening_evidence_no_runtime",
      latestLandedStatus:
        "gate_a_rehearsed_company_internal_high_accuracy_opening_no_runtime_selected_closeout",
      nextExecutionAction: "gate_a_prepare_company_internal_controlled_use_handoff_pack_no_runtime",
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportValueChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "company_internal_controlled_use_handoff_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_V1_PLAN.md",
      selectedRouteFamily: "controlled_use_handoff_after_high_accuracy_opening_rehearsal",
      selectionStatus:
        "closed_company_internal_high_accuracy_opening_rehearsal_no_runtime_and_selected_controlled_use_handoff",
      sliceId: "post_company_internal_high_accuracy_opening_rehearsal_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/company-internal-controlled-use-handoff-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const relativePath of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, relativePath)), relativePath).toBe(true);
    }
  });

  it("consumes Gate A evidence and keeps the high-accuracy label closed", () => {
    expect(CONSUMED_OPENING_REHEARSAL_ARTIFACTS).toEqual({
      artifacts: [
        "company_internal_opening_acceptance_matrix",
        "final_validation_evidence_map",
        "rockwool_screening_and_source_blocker_registry",
        "source_promotion_no_runtime_boundary_register",
        "hostile_api_import_fail_closed_evidence",
        "operator_caveat_and_usage_handoff_pack",
        "selected_opening_handoff_or_backlog_followup"
      ],
      blockedSourceOrNeedsInputScenarioCount: 4,
      broadCheckGreen: true,
      caveatedScreeningOrContinuationScenarioCount: 6,
      currentGateGreen: true,
      highAccuracyOpeningAllowedByGateAAlone: false,
      highAccuracyOpeningLabelAllowedNow: false,
      hostileOrStabilityScenarioCount: 6,
      readySourceOrBenchmarkScenarioCount: 5,
      totalScenarioCount: 21
    });

    expect(CONTROLLED_USE_HANDOFF_SELECTED).toEqual({
      artifact: "company_internal_controlled_use_handoff_selected",
      firstGate: "gate_a_prepare_company_internal_controlled_use_handoff_pack_no_runtime",
      highAccuracyLabelStillForbidden: true,
      requiredArtifacts: [
        "current_operator_workflow",
        "current_acceptance_bucket_table",
        "ready_values_snapshot",
        "caveated_blocked_stop_rules",
        "validation_command_log",
        "rockwool_screening_only_notice"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_V1_PLAN.md",
      targetFirstGateFile: "packages/engine/src/company-internal-controlled-use-handoff-gate-a-contract.test.ts"
    });

    const gateA = readRepoFile("packages/engine/src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts");
    for (const artifact of CONSUMED_OPENING_REHEARSAL_ARTIFACTS.artifacts) {
      expect(gateA).toContain(artifact);
    }
    expect(gateA).toContain("highAccuracyOpeningAllowedByGateAAlone: false");
    expect(gateA).toContain("highAccuracyOpeningCopyAllowedNow: false");
  });

  it("keeps ready corridor values, Rockwool screening, and hostile non-finite rejection frozen", () => {
    const readyLab = wallSnapshot({
      airborneContext: LSF_LAB_CONTEXT,
      layers: LSF_EXACT_SOURCE_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const readyField = wallSnapshot({
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
    const parsedEstimateHugeJson = JSON.parse(
      '{"layers":[{"materialId":"gypsum_board","thicknessMm":1e309}],"targetOutputs":["Rw"]}'
    ) as unknown;
    const estimateNonFinite = EstimateRequestSchema.safeParse(parsedEstimateHugeJson);

    expect(readyLab).toMatchObject({
      family: "stud_wall_system",
      rw: 55,
      stc: 55,
      supported: ["Rw"]
    });
    expect(readyLab.warnings).toMatch(/Curated exact airborne lab match active/i);

    expect(readyField).toMatchObject({
      dnTw: 50,
      family: "stud_wall_system",
      rw: 48,
      rwPrime: 48,
      supported: ["R'w", "DnT,w"]
    });
    expect(readyField.warnings).toMatch(/Curated airborne lab fallback active in field context/i);

    expect(ROCKWOOL_SCREENING_FREEZE).toEqual({
      artifact: "rockwool_screening_and_source_blocker_registry",
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
      rw: 53,
      stc: 64,
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor"
    });
    expect(flatSwap).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 51,
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY
    });
    expect(field).toMatchObject({
      confidence: "medium",
      dnTw: 53,
      family: "multileaf_multicavity",
      rwPrime: 51,
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor"
    });

    expect(estimateNonFinite.success).toBe(false);
    if (!estimateNonFinite.success) {
      expect(issuePaths(estimateNonFinite)).toContain("layers.0.thicknessMm");
    }
  });

  it("selects controlled-use handoff before high-accuracy copy, runtime import, or polish", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        firstMissingRequirement: "current_controlled_use_handoff_pack_with_updated_values_and_stop_rules",
        id: "company_internal_controlled_use_handoff_v1",
        reason:
          "opening_rehearsal_and_broad_validation_are_green_for_controlled_personal_internal_use_but_the_existing_operator_handoff_needs_a_current_no_runtime_pack_with_2026_05_05_values_rockwool_screening_notice_and_stop_rules_before_any_use_label_is_refreshed",
        runtimeEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/company-internal-controlled-use-handoff-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(
      NEXT_SLICE_SELECTION_MATRIX.find((candidate) => candidate.id === "direct_company_internal_high_accuracy_opening_label")
        ?.selectedNext
    ).toBe(false);
  });

  it("keeps docs and current-gate runner aligned with closeout and selected handoff", () => {
    const docs = REQUIRED_CLOSEOUT_SURFACES.filter((path) => path.endsWith(".md") || path === "AGENTS.md")
      .map((relativePath) => readRepoFile(relativePath))
      .join("\n\n");

    for (const token of REQUIRED_DOC_TOKENS) {
      expect(docs, token).toContain(token);
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts"
    );

    const selectedPlan = readRepoFile(CONTROLLED_USE_HANDOFF_SELECTED.selectedPlanningSurface);
    expect(selectedPlan).toContain(CONTROLLED_USE_HANDOFF_SELECTED.firstGate);
    expect(selectedPlan).toContain(CONTROLLED_USE_HANDOFF_SELECTED.targetFirstGateFile);
    expect(selectedPlan).toContain("high-accuracy label remains forbidden");
  });
});
