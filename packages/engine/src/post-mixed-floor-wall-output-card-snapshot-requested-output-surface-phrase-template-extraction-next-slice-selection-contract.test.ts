import { describe, expect, it } from "vitest";

const POST_MIXED_FLOOR_WALL_OUTPUT_CARD_SNAPSHOT_REQUESTED_OUTPUT_SURFACE_PHRASE_TEMPLATE_EXTRACTION_NEXT_SLICE_SELECTION = {
  sliceId:
    "post_mixed_floor_wall_output_card_snapshot_requested_output_surface_phrase_template_extraction_next_slice_selection_v1",
  selectedImplementationSlice:
    "mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_v1",
  selectedOutputSurface: "mixed_floor_wall_deferred_runtime_candidate_rerank_matrix",
  selectedRouteFamily: "mixed_floor_wall_deferred_runtime_backlog",
  selectionStatus: "selected_runtime_source_candidate_re_rank_before_new_widening",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction: "mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_v1",
  followUpPlanningAction:
    "post_mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_next_slice_selection_v1",
} as const;

const MIXED_FLOOR_WALL_RUNTIME_CANDIDATE_RERANK_SCOPE = {
  currentRequestedOutputSurfacePhraseTemplateExtractionGreen: true,
  currentBroadRequestedOutputReplayGridGreen: true,
  currentBroadRequestedOutputRestoreGridGreen: true,
  currentBroadRequestedOutputEditHistoryRestoreGridGreen: true,
  currentBroadRequestedOutputPartialRestoreGridGreen: true,
  currentSelectedRequestedOutputGeneratedRestoreGridGreen: true,
  currentSelectedRequestedOutputEditHistoryRestoreGridGreen: true,
  currentSelectedRequestedOutputPartialRestoreGridGreen: true,
  currentRepresentativeRequestedOutputRestoreGridGreen: true,
  currentRepresentativeRequestedOutputEditHistoryRestoreGridGreen: true,
  currentRepresentativeRequestedOutputPartialRestoreGridGreen: true,
  keepRepresentativeDefaultRestoreGridGreen: true,
  requestedOutputHarnessHardStopReached: true,
  snapshotGridFile:
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts",
  snapshotGridLineCountAtSelection: 315,
  requestedOutputRunnerFile:
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-runners.ts",
  requestedOutputRunnerFileLineCountAtSelection: 53,
  requestedOutputSurfaceDescriptorFile:
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors.ts",
  requestedOutputSurfaceDescriptorFileLineCountAtSelection: 94,
  requestedOutputSurfaceMessageBundleFile:
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-message-bundles.ts",
  requestedOutputSurfaceMessageBundleFileLineCountAtSelection: 95,
  requestedOutputSurfacePhraseTemplateFile:
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-phrase-templates.ts",
  requestedOutputSurfacePhraseTemplateFileLineCountAtSelection: 359,
  requestedOutputSurfaceFamilyDescriptorBuilderFile:
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-family-descriptor-builders.ts",
  requestedOutputSurfaceFamilyDescriptorBuilderFileLineCountAtSelection: 192,
  requestedOutputSurfaceRunnerLoopFile:
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-runner-loop.ts",
  requestedOutputSurfaceRunnerLoopFileLineCountAtSelection: 325,
  requestedOutputVariantDriverFile:
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-variant-drivers.ts",
  requestedOutputVariantDriverFileLineCountAtSelection: 212,
  targetedEngineTest: "packages/engine/src/mixed-floor-wall-generated-matrix.test.ts",
  targetedWebTests: [
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts",
    "apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts",
    "apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts",
  ],
} as const;

const RUNTIME_SOURCE_CANDIDATE_MATRIX = [
  {
    id: "heavy_concrete_formula_family_widening",
    posture: "eligible_for_re_rank_after_formula_provenance_guards",
    runtimeWideningEligible: true,
  },
  {
    id: "dataholz_clt_calibration_tightening",
    posture: "eligible_for_re_rank_after_requested_output_harness_stop",
    runtimeWideningEligible: true,
  },
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    posture: "blocked_until_bare_carrier_source_evidence_exists",
    runtimeWideningEligible: false,
  },
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    posture: "blocked_until_composite_dry_screed_surface_is_modeled",
    runtimeWideningEligible: false,
  },
  {
    id: "tuas_c11c_exact_import",
    posture: "blocked_until_frequency_or_source_anomaly_is_explained",
    runtimeWideningEligible: false,
  },
  {
    id: "wall_selector_behavior_widening",
    posture: "blocked_until_a_fresh_classified_red_exists",
    runtimeWideningEligible: false,
  },
] as const;

describe("post mixed floor/wall output-card snapshot requested-output surface phrase template extraction next slice selection contract", () => {
  it("hard-stops harness-only cleanup and selects runtime/source candidate re-rank next", () => {
    expect(
      POST_MIXED_FLOOR_WALL_OUTPUT_CARD_SNAPSHOT_REQUESTED_OUTPUT_SURFACE_PHRASE_TEMPLATE_EXTRACTION_NEXT_SLICE_SELECTION,
    ).toEqual({
      sliceId:
        "post_mixed_floor_wall_output_card_snapshot_requested_output_surface_phrase_template_extraction_next_slice_selection_v1",
      selectedImplementationSlice:
        "mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_v1",
      selectedOutputSurface: "mixed_floor_wall_deferred_runtime_candidate_rerank_matrix",
      selectedRouteFamily: "mixed_floor_wall_deferred_runtime_backlog",
      selectionStatus: "selected_runtime_source_candidate_re_rank_before_new_widening",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction:
        "mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_v1",
      followUpPlanningAction:
        "post_mixed_floor_wall_runtime_candidate_re_rank_after_requested_output_harness_next_slice_selection_v1",
    });
  });

  it("keeps exactly two immediate rerank-eligible candidates after the requested-output harness stop", () => {
    expect(MIXED_FLOOR_WALL_RUNTIME_CANDIDATE_RERANK_SCOPE).toEqual({
      currentRequestedOutputSurfacePhraseTemplateExtractionGreen: true,
      currentBroadRequestedOutputReplayGridGreen: true,
      currentBroadRequestedOutputRestoreGridGreen: true,
      currentBroadRequestedOutputEditHistoryRestoreGridGreen: true,
      currentBroadRequestedOutputPartialRestoreGridGreen: true,
      currentSelectedRequestedOutputGeneratedRestoreGridGreen: true,
      currentSelectedRequestedOutputEditHistoryRestoreGridGreen: true,
      currentSelectedRequestedOutputPartialRestoreGridGreen: true,
      currentRepresentativeRequestedOutputRestoreGridGreen: true,
      currentRepresentativeRequestedOutputEditHistoryRestoreGridGreen: true,
      currentRepresentativeRequestedOutputPartialRestoreGridGreen: true,
      keepRepresentativeDefaultRestoreGridGreen: true,
      requestedOutputHarnessHardStopReached: true,
      snapshotGridFile:
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts",
      snapshotGridLineCountAtSelection: 315,
      requestedOutputRunnerFile:
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-runners.ts",
      requestedOutputRunnerFileLineCountAtSelection: 53,
      requestedOutputSurfaceDescriptorFile:
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors.ts",
      requestedOutputSurfaceDescriptorFileLineCountAtSelection: 94,
      requestedOutputSurfaceMessageBundleFile:
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-message-bundles.ts",
      requestedOutputSurfaceMessageBundleFileLineCountAtSelection: 95,
      requestedOutputSurfacePhraseTemplateFile:
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-phrase-templates.ts",
      requestedOutputSurfacePhraseTemplateFileLineCountAtSelection: 359,
      requestedOutputSurfaceFamilyDescriptorBuilderFile:
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-family-descriptor-builders.ts",
      requestedOutputSurfaceFamilyDescriptorBuilderFileLineCountAtSelection: 192,
      requestedOutputSurfaceRunnerLoopFile:
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-runner-loop.ts",
      requestedOutputSurfaceRunnerLoopFileLineCountAtSelection: 325,
      requestedOutputVariantDriverFile:
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-variant-drivers.ts",
      requestedOutputVariantDriverFileLineCountAtSelection: 212,
      targetedEngineTest: "packages/engine/src/mixed-floor-wall-generated-matrix.test.ts",
      targetedWebTests: [
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts",
        "apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts",
        "apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts",
      ],
    });

    expect(RUNTIME_SOURCE_CANDIDATE_MATRIX.filter((candidate) => candidate.runtimeWideningEligible)).toEqual([
      {
        id: "heavy_concrete_formula_family_widening",
        posture: "eligible_for_re_rank_after_formula_provenance_guards",
        runtimeWideningEligible: true,
      },
      {
        id: "dataholz_clt_calibration_tightening",
        posture: "eligible_for_re_rank_after_requested_output_harness_stop",
        runtimeWideningEligible: true,
      },
    ]);
  });
});
