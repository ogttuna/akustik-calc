import { describe, expect, it } from "vitest";

const POST_MIXED_FLOOR_WALL_OUTPUT_CARD_SNAPSHOT_REQUESTED_OUTPUT_SURFACE_MESSAGE_BUNDLE_EXTRACTION_NEXT_SLICE_SELECTION = {
  sliceId:
    "post_mixed_floor_wall_output_card_snapshot_requested_output_surface_message_bundle_extraction_next_slice_selection_v1",
  selectedImplementationSlice:
    "mixed_floor_wall_output_card_snapshot_requested_output_surface_phrase_template_extraction_v1",
  selectedOutputSurface: "workbench_output_card_snapshot_requested_output_surface_phrase_template_harness",
  selectedRouteFamily: "mixed_floor_wall_route_matrix",
  selectionStatus: "selected_optional_final_no_runtime_harness_polish",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction:
    "mixed_floor_wall_output_card_snapshot_requested_output_surface_phrase_template_extraction_v1",
  followUpPlanningAction:
    "post_mixed_floor_wall_output_card_snapshot_requested_output_surface_phrase_template_extraction_next_slice_selection_v1",
} as const;

const OUTPUT_CARD_SNAPSHOT_REQUESTED_OUTPUT_SURFACE_PHRASE_TEMPLATE_SCOPE = {
  currentRequestedOutputSurfaceMessageBundleExtractionGreen: true,
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
  optionalFinalHarnessPolishOnly: true,
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
  requestedOutputSurfaceMessageBundleFileLineCountAtSelection: 310,
  requestedOutputSurfaceFamilyDescriptorBuilderFile:
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-family-descriptor-builders.ts",
  requestedOutputSurfaceFamilyDescriptorBuilderFileLineCountAtSelection: 192,
  requestedOutputSurfaceRunnerLoopFile:
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-runner-loop.ts",
  requestedOutputSurfaceRunnerLoopFileLineCountAtSelection: 325,
  requestedOutputVariantDriverFile:
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-variant-drivers.ts",
  requestedOutputVariantDriverFileLineCountAtSelection: 212,
  requestedOutputSurfacePhraseTemplateExtractionTargets: [
    "requested_output_surface_direct_phrase_templates",
    "requested_output_surface_replay_phrase_templates",
    "requested_output_surface_restore_phrase_templates",
    "requested_output_surface_family_wording_templates",
  ],
  targetedEngineTest: "packages/engine/src/mixed-floor-wall-generated-matrix.test.ts",
  targetedWebTests: [
    "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts",
    "apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts",
    "apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts",
  ],
} as const;

const DEFERRED_IMMEDIATE_RUNTIME_CANDIDATES = [
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    reason: "requested_output_surface_phrase_template_extraction_or_skip_decision_should_land_before_new_runtime_scope",
    runtimeWideningEligible: false,
  },
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    reason: "requested_output_surface_phrase_template_extraction_or_skip_decision_should_land_before_new_runtime_scope",
    runtimeWideningEligible: false,
  },
  {
    id: "tuas_c11c_exact_import",
    reason: "requested_output_surface_phrase_template_extraction_or_skip_decision_should_land_before_new_runtime_scope",
    runtimeWideningEligible: false,
  },
  {
    id: "broad_heavy_concrete_formula_family_widening",
    reason: "requested_output_surface_phrase_template_extraction_or_skip_decision_should_land_before_new_runtime_scope",
    runtimeWideningEligible: false,
  },
  {
    id: "wall_selector_behavior_widening",
    reason: "requested_output_surface_phrase_template_extraction_or_skip_decision_should_land_before_new_runtime_scope",
    runtimeWideningEligible: false,
  },
] as const;

describe("post mixed floor/wall output-card snapshot requested-output surface message bundle extraction next slice selection contract", () => {
  it("selects at most one final optional phrase-template polish before runtime widening", () => {
    expect(
      POST_MIXED_FLOOR_WALL_OUTPUT_CARD_SNAPSHOT_REQUESTED_OUTPUT_SURFACE_MESSAGE_BUNDLE_EXTRACTION_NEXT_SLICE_SELECTION,
    ).toEqual({
      sliceId:
        "post_mixed_floor_wall_output_card_snapshot_requested_output_surface_message_bundle_extraction_next_slice_selection_v1",
      selectedImplementationSlice:
        "mixed_floor_wall_output_card_snapshot_requested_output_surface_phrase_template_extraction_v1",
      selectedOutputSurface: "workbench_output_card_snapshot_requested_output_surface_phrase_template_harness",
      selectedRouteFamily: "mixed_floor_wall_route_matrix",
      selectionStatus: "selected_optional_final_no_runtime_harness_polish",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction:
        "mixed_floor_wall_output_card_snapshot_requested_output_surface_phrase_template_extraction_v1",
      followUpPlanningAction:
        "post_mixed_floor_wall_output_card_snapshot_requested_output_surface_phrase_template_extraction_next_slice_selection_v1",
    });
    expect(
      DEFERRED_IMMEDIATE_RUNTIME_CANDIDATES.filter((candidate) => candidate.runtimeWideningEligible),
    ).toEqual([]);
  });

  it("keeps the next scope on optional phrase-template cleanup over the shared message-bundle layer", () => {
    expect(OUTPUT_CARD_SNAPSHOT_REQUESTED_OUTPUT_SURFACE_PHRASE_TEMPLATE_SCOPE).toEqual({
      currentRequestedOutputSurfaceMessageBundleExtractionGreen: true,
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
      optionalFinalHarnessPolishOnly: true,
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
      requestedOutputSurfaceMessageBundleFileLineCountAtSelection: 310,
      requestedOutputSurfaceFamilyDescriptorBuilderFile:
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-family-descriptor-builders.ts",
      requestedOutputSurfaceFamilyDescriptorBuilderFileLineCountAtSelection: 192,
      requestedOutputSurfaceRunnerLoopFile:
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-runner-loop.ts",
      requestedOutputSurfaceRunnerLoopFileLineCountAtSelection: 325,
      requestedOutputVariantDriverFile:
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-variant-drivers.ts",
      requestedOutputVariantDriverFileLineCountAtSelection: 212,
      requestedOutputSurfacePhraseTemplateExtractionTargets: [
        "requested_output_surface_direct_phrase_templates",
        "requested_output_surface_replay_phrase_templates",
        "requested_output_surface_restore_phrase_templates",
        "requested_output_surface_family_wording_templates",
      ],
      targetedEngineTest: "packages/engine/src/mixed-floor-wall-generated-matrix.test.ts",
      targetedWebTests: [
        "apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts",
        "apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts",
        "apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts",
      ],
    });
  });
});
